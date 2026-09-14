/* =========================================
   AAROHAN ORGANIZER DASHBOARD
========================================= */

// Credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// DOM Elements
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

/* =========================================
   AUTHENTICATION CHECK & LOGIN
========================================= */
if (sessionStorage.getItem("organizerLoggedIn") === "true") {
    showDashboard();
}

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        const username = usernameInput ? usernameInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem("organizerLoggedIn", "true");
            if (loginError) loginError.textContent = "";
            showDashboard();
        } else {
            if (loginError) loginError.textContent = "Invalid username or password.";
        }
    });
}

function showDashboard() {
    if (loginScreen) loginScreen.classList.add("hidden");
    if (dashboard) dashboard.classList.remove("hidden");
    initializeDashboard();
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("organizerLoggedIn");
        if (dashboard) dashboard.classList.add("hidden");
        if (loginScreen) loginScreen.classList.remove("hidden");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        if (usernameInput) usernameInput.value = "";
        if (passwordInput) passwordInput.value = "";
    });
}

/* =========================================
   DATA MANAGEMENT (3 MAIN EVENTS)
========================================= */
let events = [
    { id: "codequest", name: "Code Quest", description: "Competitive Programming", registrations: 0 },
    { id: "ctf", name: "CTF", description: "Capture the Flag", registrations: 0 },
    { id: "roborace", name: "RoboRace", description: "Robotics Competition", registrations: 0 }
];

function getStoredRegistrations() {
    const data = localStorage.getItem("registrations") || localStorage.getItem("aarohan_registrations");
    return data ? JSON.parse(data) : [];
}

/* =========================================
   INITIALIZE DASHBOARD
========================================= */
function initializeDashboard() {
    displayDate();
    calculateAndDisplayMetrics();
    displayParticipantRoster();
    renderTodos();
}

function displayDate() {
    const dateElement = document.getElementById("currentDate");
    if (!dateElement) return;
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/* =========================================
   METRICS & EVENT BREAKDOWN
========================================= */
function calculateAndDisplayMetrics() {
    const registrationsList = getStoredRegistrations();

    // Reset event tally counters
    events.forEach(evt => evt.registrations = 0);

    let totalEventEntries = 0;

    registrationsList.forEach(participant => {
        if (Array.isArray(participant.events)) {
            totalEventEntries += participant.events.length;

            participant.events.forEach(selectedEvt => {
                const normalized = selectedEvt.toLowerCase().replace(/\s+/g, '');
                if (normalized.includes('code') || normalized.includes('quest')) {
                    events[0].registrations++;
                } else if (normalized.includes('ctf')) {
                    events[1].registrations++;
                } else if (normalized.includes('robo') || normalized.includes('race')) {
                    events[2].registrations++;
                }
            });
        }
    });

    // Update Dashboard Metrics Cards
    const participantCountEl = document.getElementById("participantCount");
    const registrationCountEl = document.getElementById("registrationCount");
    const eventCountEl = document.getElementById("eventCount");

    if (participantCountEl) participantCountEl.textContent = registrationsList.length;
    if (registrationCountEl) registrationCountEl.textContent = totalEventEntries;
    if (eventCountEl) eventCountEl.textContent = events.length;

    // Render Event Tallies List
    const eventList = document.getElementById("eventList");
    if (!eventList) return;
    
    eventList.innerHTML = "";

    events.forEach((event, index) => {
        const eventRow = document.createElement("div");
        eventRow.className = "event-row";
        eventRow.innerHTML = `
            <div class="event-number">${index + 1}</div>
            <div class="event-info">
                <h4>${event.name}</h4>
                <p>${event.description}</p>
            </div>
            <div class="event-participants">
                <strong>${event.registrations}</strong>
                <span>registrations</span>
            </div>
        `;
        eventList.appendChild(eventRow);
    });
}

/* =========================================
   PARTICIPANT ROSTER TABLE
========================================= */
function displayParticipantRoster() {
    const registrationsList = getStoredRegistrations();
    const tbody = document.getElementById("participantTableBody");
    const badge = document.getElementById("rosterBadge");

    if (!tbody) return;

    tbody.innerHTML = "";
    if (badge) badge.textContent = `${registrationsList.length} Participants`;

    if (registrationsList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--muted); padding: 20px;">
                    No participants have registered yet.
                </td>
            </tr>
        `;
        return;
    }

    // Render reversed to show latest registration at top
    registrationsList.slice().reverse().forEach((p, idx) => {
        const row = document.createElement("tr");
        const selectedEvents = Array.isArray(p.events) ? p.events.join(", ") : "None";

        row.innerHTML = `
            <td>${registrationsList.length - idx}</td>
            <td><strong>${p.name || 'N/A'}</strong></td>
            <td>${p.department || 'N/A'}</td>
            <td>${p.mobile || 'N/A'}</td>
            <td>${p.email || 'N/A'}</td>
            <td><span class="table-event-tag">${selectedEvents}</span></td>
        `;
        tbody.appendChild(row);
    });
}

/* =========================================
   TODO LIST MANAGEMENT
========================================= */
let todos = JSON.parse(localStorage.getItem("aarohanTodos")) || [
    { text: "Confirm event judges", completed: true },
    { text: "Check venue arrangements", completed: false },
    { text: "Prepare participant certificates", completed: false }
];

const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");

function saveTodos() {
    localStorage.setItem("aarohanTodos", JSON.stringify(todos));
}

function renderTodos() {
    if (!todoList) return;
    todoList.innerHTML = "";
    let remainingTasks = 0;

    todos.forEach((todo, index) => {
        if (!todo.completed) remainingTasks++;

        const listItem = document.createElement("li");
        listItem.className = "todo-item";
        if (todo.completed) listItem.classList.add("completed");

        listItem.innerHTML = `
            <input type="checkbox" ${todo.completed ? "checked" : ""} data-index="${index}" class="todo-checkbox">
            <span class="todo-text">${todo.text}</span>
            <button class="delete-todo" data-index="${index}">×</button>
        `;
        todoList.appendChild(listItem);
    });

    if (todoCount) todoCount.textContent = remainingTasks;
    addTodoListeners();
}

function addTodoListeners() {
    document.querySelectorAll(".todo-checkbox").forEach(cb => {
        cb.addEventListener("change", function () {
            const index = Number(this.dataset.index);
            todos[index].completed = this.checked;
            saveTodos();
            renderTodos();
        });
    });

    document.querySelectorAll(".delete-todo").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = Number(this.dataset.index);
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
    });
}

function addTodo() {
    if (!todoInput) return;
    const text = todoInput.value.trim();
    if (text === "") return;
    todos.push({ text: text, completed: false });
    todoInput.value = "";
    saveTodos();
    renderTodos();
}

if (addTodoBtn) addTodoBtn.addEventListener("click", addTodo);
if (todoInput) todoInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addTodo(); });

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
    });
}

/* =========================================
   QUICK ACTIONS NAVIGATION
========================================= */
const viewEventsBtn = document.getElementById("viewEventsBtn");
if (viewEventsBtn) {
    viewEventsBtn.addEventListener("click", () => {
        const section = document.getElementById("eventsSection");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    });
}

const viewRosterBtn = document.getElementById("viewRosterBtn");
if (viewRosterBtn) {
    viewRosterBtn.addEventListener("click", () => {
        const section = document.getElementById("rosterSection");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    });
}

const addTaskBtn = document.getElementById("addTaskBtn");
if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
        if (todoInput) todoInput.focus();
    });
}

/* =========================================
   LIVE SYNC ACROSS TABS
========================================= */
window.addEventListener("storage", (event) => {
    if (event.key === "registrations" || event.key === "aarohan_registrations") {
        calculateAndDisplayMetrics();
        displayParticipantRoster();
    }
});