/* OLD VANILLA JAVASCRIPT VERSIONS (ASSIGNMENT ARCHIVE)
   Бұл файл ешбір HTML-ге қосылмаған. Тек
   jQuery нұсқасымен салыстыру үшін арнайы сақталған.
   */

// --- FEATURE 1: Form Validation & WhatsApp URL Generator (Vanilla JS) ---
const oldBookingForm = document.getElementById("booking-form");
if (oldBookingForm) {
    oldBookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const doctor = document.getElementById("doctor").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;

        if (!fullname || !phone || !doctor || !date || !time) {
            alert("Барлық өрістерді толтырыңыз!");
            return;
        }
        const msg = "Name: " + fullname + ", Phone: " + phone;
        window.open("https://wa.me/77763362830?text=" + encodeURIComponent(msg), "_blank");
    });
}

// --- FEATURE 2: Doctor Schedule Toggle & Option Insertion (Vanilla JS) ---
const oldDoctorSelect = document.getElementById("doctor");
const oldAvailPanel = document.getElementById("availability-panel");
const oldTimeSelect = document.getElementById("appointment-time");

if (oldDoctorSelect && oldAvailPanel && oldTimeSelect) {
    oldDoctorSelect.addEventListener("change", function () {
        if (!this.value) {
            oldAvailPanel.hidden = true;
            oldTimeSelect.disabled = true;
            oldTimeSelect.replaceChildren();
        } else {
            oldAvailPanel.hidden = false;
            oldTimeSelect.disabled = false;
            oldTimeSelect.replaceChildren();
            const opt = document.createElement("option");
            opt.value = "10:00";
            opt.textContent = "10:00";
            oldTimeSelect.appendChild(opt);
        }
    });
}

// --- FEATURE 3: Dynamic Reviews Card Rendering & Details Toggle (Vanilla JS) ---
const oldReviewsContainer = document.getElementById("reviews-list");
const oldSampleReviews = [
    { name: "Айдар", text: "Өте жақсы клиника!", fullDetails: "Тісімді ауыртпай емдеп берді." }
];

if (oldReviewsContainer) {
    oldSampleReviews.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "card p-3 mb-2";

        const title = document.createElement("h4");
        title.textContent = item.name;

        const body = document.createElement("p");
        body.textContent = item.text;

        const extra = document.createElement("p");
        extra.className = "details d-none";
        extra.textContent = item.fullDetails;

        const btn = document.createElement("button");
        btn.textContent = "Толығырақ";
        btn.onclick = function () {
            extra.classList.toggle("d-none");
        };

        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(extra);
        card.appendChild(btn);
        oldReviewsContainer.appendChild(card);
    });
}