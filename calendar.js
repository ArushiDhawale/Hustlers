import { auth, db, appId, initAuth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, doc, setDoc, deleteDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let currentUser = null;
let loggedDates = new Set();
let ovulationDates = new Set();
let currentCalDate = new Date();

// --- Auth ---
initAuth();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const status = document.getElementById('userStatus');
        if(status) {
            status.textContent = "Logged In";
            status.classList.remove('hidden');
        }
        await loadPeriodDates(user.uid);
        renderCalendar();
    } else {
        currentUser = null;
    }
});

// --- Data Logic ---
async function loadPeriodDates(userId) {
    showLoading(true);
    loggedDates.clear();
    const debugList = [];
    try {
        const q = query(collection(db, 'artifacts', appId, 'users', userId, 'period_dates'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            loggedDates.add(doc.id);
            debugList.push(doc.id);
        });
        
        const dbListEl = document.getElementById('dbDatesList');
        if(dbListEl) dbListEl.innerText = debugList.sort().join(', ') || "No dates saved yet.";

        calculateOvulation();
    } catch (error) {
        console.error("Error loading dates:", error);
        showStatus("Error loading calendar data", "text-red-500");
    } finally {
        showLoading(false);
        renderCalendar(); 
    }
}

function calculateOvulation() {
    ovulationDates.clear();
    const sortedDates = Array.from(loggedDates).sort();
    
    sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split('T')[0];

        if (!loggedDates.has(prevDateStr)) {
            const ovDate = new Date(date);
            ovDate.setDate(date.getDate() + 13);
            const ovStr = ovDate.toISOString().split('T')[0];
            ovulationDates.add(ovStr);
        }
    });
}

// --- Interactions ---
window.toggleDate = async function(year, month, day) {
    if (!currentUser) return alert("Please wait for login...");

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const docRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'period_dates', dateStr);

    const wasLogged = loggedDates.has(dateStr);
    if (wasLogged) {
        loggedDates.delete(dateStr);
    } else {
        loggedDates.add(dateStr);
    }
    
    calculateOvulation();
    renderCalendar();

    try {
        if (wasLogged) {
            await deleteDoc(docRef);
        } else {
            await setDoc(docRef, { 
                date: dateStr, 
                year: year, 
                month: month + 1, 
                day: day,
                timestamp: new Date()
            });
        }
        updateDebugView();
    } catch (error) {
        console.error("Error toggling date:", error);
        if (wasLogged) loggedDates.add(dateStr);
        else loggedDates.delete(dateStr);
        renderCalendar();
        showStatus("Failed to save.", "text-red-500");
    }
}

window.forceSync = async function() {
    if(!currentUser) return;
    showStatus("Syncing with cloud...", "text-blue-500");
    await loadPeriodDates(currentUser.uid);
    showStatus("All data synced successfully!", "text-green-600");
}

// --- Render Logic ---
function renderCalendar() {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('currentMonthYear').innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = "calendar-day bg-gray-50/50 rounded-lg";
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        let classes = "calendar-day border rounded-xl p-2 relative transition flex flex-col justify-between fade-in cursor-pointer select-none ";
        let content = `<span class="text-sm font-bold text-gray-600">${day}</span>`;
        
        const isLogged = loggedDates.has(dateStr);
        const isOvulation = ovulationDates.has(dateStr);
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        if (isLogged) {
            classes += "bg-purple-100 border-purple-200 hover:bg-purple-200 shadow-sm ";
            content = `<span class="text-sm font-bold text-purple-700">${day}</span>
                        <div class="flex justify-center mt-1"><i class="fas fa-tint text-purple-500 text-lg"></i></div>`;
        } 
        else if (isOvulation) {
            classes += "bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100 ";
            content = `<span class="text-sm font-bold text-fuchsia-700">${day}</span>
                        <div class="flex justify-center mt-1"><i class="fas fa-star text-fuchsia-400 text-sm animate-pulse"></i></div>
                        <span class="text-[10px] text-center text-fuchsia-500 font-bold">Ovulation</span>`;
        }
        else {
            classes += "bg-white border-purple-50 hover:shadow-md hover:border-purple-200 ";
        }

        if (isToday) {
            classes += "bg-purple-50 border-purple-300 ring-2 ring-purple-200 ";
        }

        dayCell.className = classes;
        dayCell.innerHTML = content;
        dayCell.onclick = () => window.toggleDate(year, month, day);

        grid.appendChild(dayCell);
    }
}

// --- Helpers ---
window.changeMonth = (step) => { 
    currentCalDate.setMonth(currentCalDate.getMonth() + step); 
    renderCalendar(); 
};
window.jumpToToday = () => { 
    currentCalDate = new Date(); 
    renderCalendar(); 
};
window.toggleDebug = () => {
    const el = document.getElementById('debugSection');
    el.classList.toggle('hidden');
}
function updateDebugView() {
    const list = Array.from(loggedDates).sort().join(', ') || "No dates saved yet.";
    const el = document.getElementById('dbDatesList');
    if(el) el.innerText = list;
}
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if(show) overlay.classList.remove('hidden');
    else overlay.classList.add('hidden');
}
function showStatus(msg, colorClass) {
    const el = document.getElementById('statusMsg');
    if(!el) return;
    el.innerText = msg;
    el.className = "text-center mt-4 text-sm font-bold h-6 " + colorClass;
    setTimeout(() => { el.innerText = ""; }, 3000);
}

renderCalendar();