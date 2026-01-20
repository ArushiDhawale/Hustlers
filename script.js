// Data: Recommendations per phase
const phaseData = {
    menstrual: {
        diet: "Iron-rich foods (spinach, red meat), warm tea, dark chocolate.",
        routine: "Rest, light stretching, or walking. Avoid HIIT."
    },
    follicular: {
        diet: "Fermented foods, lean protein, salads, seeds.",
        routine: "High energy! Cardio, running, and creative tasks."
    },
    ovulation: {
        diet: "Antioxidant-rich fruits (berries), fiber, salmon.",
        routine: "High intensity workouts, strength training, socializing."
    },
    luteal: {
        diet: "Complex carbs (sweet potatoes), magnesium-rich foods.",
        routine: "Pilates, yoga, prioritize sleep. Lower intensity."
    }
};

function calculateCycle() {
    const input = document.getElementById('startDate').value;
    if (!input) return alert("Please select a date!");

    const lastStart = new Date(input);
    const today = new Date();
    
    // 1. Predict Next Period (Standard 28-day cycle)
    const nextPeriod = new Date(lastStart);
    nextPeriod.setDate(lastStart.getDate() + 28);
    
    // 2. Determine Current Phase
    const diffTime = Math.abs(today - lastStart);
    const dayOfCycle = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) % 28; // Modulo 28 for recurring cycles

    let phase = "";
    if (dayOfCycle >= 1 && dayOfCycle <= 5) phase = "menstrual";
    else if (dayOfCycle >= 6 && dayOfCycle <= 13) phase = "follicular";
    else if (dayOfCycle === 14) phase = "ovulation";
    else phase = "luteal";

    // 3. Update UI
    document.getElementById('nextDate').innerText = nextPeriod.toDateString();
    document.getElementById('phaseName').innerText = phase.charAt(0).toUpperCase() + phase.slice(1);
    document.getElementById('dietText').innerText = phaseData[phase].diet;
    document.getElementById('routineText').innerText = phaseData[phase].routine;
    
    document.getElementById('dashboard').classList.remove('hidden');
}
