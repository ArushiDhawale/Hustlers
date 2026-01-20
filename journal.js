import { auth, db, appId, initAuth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let currentUser = null;
const saveBtn = document.getElementById('saveBtn');

// --- Auth ---
initAuth().catch(err => {
    saveBtn.innerText = "AUTH ERROR";
    document.getElementById('statusMsg').innerText = "Auth Error: " + err.message;
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        const status = document.getElementById('userStatus');
        if(status) {
            status.textContent = "Logged In";
            status.classList.remove('hidden');
        }
        
        // Enable button
        saveBtn.disabled = false;
        saveBtn.innerText = "SAVE ENTRY";
        saveBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        saveBtn.classList.add('bg-purple-600', 'hover:bg-purple-700', 'hover:scale-105', 'active:scale-95');

        loadEntries(user.uid);
    } else {
        currentUser = null;
        saveBtn.disabled = true;
        saveBtn.innerText = "CONNECTING...";
    }
});

// --- Save Logic ---
async function saveAndAnalyze() {
    const statusMsg = document.getElementById('statusMsg');
    
    if (!currentUser) {
        statusMsg.innerText = "Error: Not logged in yet.";
        statusMsg.classList.remove('opacity-0');
        return;
    }

    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;

    if(!content.trim()) return alert("Write something first!");

    const loadingOverlay = document.getElementById('loadingOverlay');
    saveBtn.disabled = true;
    loadingOverlay.classList.remove('hidden');
    statusMsg.innerText = "Saving...";
    statusMsg.classList.remove('opacity-0', 'text-red-500', 'text-green-500');

    try {
        await addDoc(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'journal_entries'), {
            title: title || "Untitled Entry",
            content: content,
            timestamp: serverTimestamp(),
            wordCount: content.trim().split(/\s+/).length,
            moodAnalysis: analyzeMood(content) 
        });

        const indicator = document.getElementById('saveIndicator');
        indicator.classList.remove('hidden');
        setTimeout(() => indicator.classList.add('hidden'), 3000);
        
        statusMsg.innerText = "Entry saved successfully!";
        statusMsg.classList.add('text-green-500');

        document.getElementById('journalTitle').value = '';
        document.getElementById('journalContent').value = '';
        document.getElementById('wordCount').innerText = '0';

        checkComfortTriggers(content);

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMsg.innerText = "Error: " + error.message;
        statusMsg.classList.add('text-red-500');
    } finally {
        saveBtn.disabled = false;
        loadingOverlay.classList.add('hidden');
        
        if (!statusMsg.innerText.includes("Error")) {
            setTimeout(() => {
                    statusMsg.classList.add('opacity-0');
                    statusMsg.classList.remove('text-green-500');
            }, 3000);
        }
    }
}

// Attach listener
saveBtn.addEventListener('click', saveAndAnalyze);

// --- Load Logic ---
function loadEntries(userId) {
    const listContainer = document.getElementById('entriesList');
    
    const q = query(
        collection(db, 'artifacts', appId, 'users', userId, 'journal_entries'),
        orderBy('timestamp', 'desc')
    );

    onSnapshot(q, (snapshot) => {
        listContainer.innerHTML = '';

        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div class="text-center py-10 bg-white rounded-3xl border border-dashed border-purple-200 text-gray-400">
                    <i class="fas fa-feather-alt text-4xl mb-3 opacity-30"></i>
                    <p>No entries yet. Write your first thought above!</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const dateObj = data.timestamp ? data.timestamp.toDate() : new Date();
            
            const dateStr = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
            });
            const timeStr = dateObj.toLocaleTimeString('en-US', { 
                hour: '2-digit', minute: '2-digit' 
            });

            const isDiscomfort = data.moodAnalysis === "Discomfort";
            const moodBadge = isDiscomfort 
                ? `<span class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full"><i class="fas fa-heart-broken mr-1"></i> Discomfort</span>`
                : `<span class="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full"><i class="fas fa-smile mr-1"></i> Positive</span>`;

            const card = document.createElement('div');
            card.className = "bg-white p-6 rounded-2xl shadow-sm border border-purple-50 entry-card";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="text-xl font-bold text-purple-900">${escapeHtml(data.title)}</h4>
                        <p class="text-xs text-gray-400 mt-1"><i class="far fa-clock mr-1"></i> ${dateStr} at ${timeStr}</p>
                    </div>
                    ${moodBadge}
                </div>
                <div class="text-gray-600 leading-relaxed whitespace-pre-wrap">${escapeHtml(data.content)}</div>
            `;
            listContainer.appendChild(card);
        });
    }, (error) => {
        console.error("Error loading entries:", error);
        listContainer.innerHTML = `<p class="text-red-400 text-center">Error loading entries.</p>`;
    });
}

// --- Helpers ---
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function analyzeMood(text) {
    const triggers = ['pain', 'cramps', 'hurt', 'stress', 'sad', 'tired', 'heavy', 'bloated'];
    const lowerText = text.toLowerCase();
    return triggers.some(t => lowerText.includes(t)) ? "Discomfort" : "Neutral/Positive";
}

function checkComfortTriggers(content) {
    const triggers = ['pain', 'cramps', 'hurt', 'stress', 'sad', 'tired', 'heavy', 'bloated'];
    const lowerContent = content.toLowerCase();
    
    if(triggers.some(t => lowerContent.includes(t))) {
        setTimeout(() => { openComfortModal(); }, 800);
    }
}

document.getElementById('journalContent').addEventListener('input', function(e) {
    const count = e.target.value.trim().split(/\s+/).length;
    document.getElementById('wordCount').innerText = e.target.value.trim() === "" ? 0 : count;
});

// Modals
window.openComfortModal = function() {
    const modal = document.getElementById('comfortModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
window.closeComfortModal = function() {
    const modal = document.getElementById('comfortModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}