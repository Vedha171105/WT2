/* ==========================================================================
   AAROHAN 2026 - UNIFIED APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  updateActiveNavLink();
  initRegistrationForm();
  initEventCarousel();
  initUserGreeting();
  initOrganizerDashboard();
});

/* ==========================================================================
   1. NAVBAR HIGHLIGHTING
   ========================================================================== */
function updateActiveNavLink() {
  let currentPath = window.location.pathname.split("?")[0].split("#")[0].replace(/\/$/, "");
  let currentPage = currentPath.split("/").pop().replace(".html", "");

  if (currentPage === "" || currentPage === "index") {
    currentPage = "index";
  }

  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(function (link) {
    let linkHref = link.getAttribute("href") || "";
    let linkPage = linkHref.split("?")[0].split("#")[0].split("/").pop().replace(".html", "");

    if (linkPage === "" || linkPage === "index") {
      linkPage = "index";
    }

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ==========================================================================
   2. REGISTRATION FORM VALIDATION & STORAGE
   ========================================================================== */
function initRegistrationForm() {
  const registrationForm = document.querySelector(".registration-form") || document.getElementById("registration-form");
  if (!registrationForm) return;

  const nameBox = document.getElementById("name") || document.getElementById("reg-name");
  const emailBox = document.getElementById("email") || document.getElementById("reg-email");
  const mobileBox = document.getElementById("mobile") || document.getElementById("reg-mobile");
  const dobBox = document.getElementById("dob") || document.getElementById("reg-dob");
  const departmentBox = document.getElementById("dept") || document.getElementById("reg-dept");

  const maleRadio = document.getElementById("male");
  const femaleRadio = document.getElementById("female");

  function showError(input, message) {
    if (!input) return;
    clearMessage(input);
    const error = document.createElement("span");
    error.classList.add("error-message");
    error.textContent = message;
    input.parentElement.appendChild(error);
    input.classList.add("input-error");
    input.classList.remove("input-success");
  }

  function showSuccess(input, message) {
    if (!input) return;
    clearMessage(input);
    const success = document.createElement("span");
    success.classList.add("success-message");
    success.textContent = message;
    input.parentElement.appendChild(success);
    input.classList.add("input-success");
    input.classList.remove("input-error");
  }

  function clearMessage(input) {
    if (!input) return;
    const oldError = input.parentElement.querySelector(".error-message");
    const oldSuccess = input.parentElement.querySelector(".success-message");
    if (oldError) oldError.remove();
    if (oldSuccess) oldSuccess.remove();
  }

  function validateName() {
    const name = nameBox ? nameBox.value.trim() : "";
    if (name === "") {
      showError(nameBox, "Name is required.");
      return false;
    }
    const namePattern = /^[A-Za-z ]{3,}$/;
    if (!namePattern.test(name)) {
      showError(nameBox, "Enter a valid name.");
      return false;
    }
    showSuccess(nameBox, "Name is valid!");
    return true;
  }

  function validateEmail() {
    const email = emailBox ? emailBox.value.trim() : "";
    if (email === "") {
      showError(emailBox, "Email is required.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError(emailBox, "Enter a valid email address.");
      return false;
    }
    showSuccess(emailBox, "Email is valid!");
    return true;
  }

  function validateMobile() {
    const mobile = mobileBox ? mobileBox.value.trim() : "";
    if (mobile === "") {
      showError(mobileBox, "Mobile number is required.");
      return false;
    }
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      showError(mobileBox, "Enter a valid 10-digit mobile number.");
      return false;
    }
    showSuccess(mobileBox, "Mobile number is valid!");
    return true;
  }

  function validateDOB() {
    if (!dobBox) return true;
    const dob = dobBox.value;
    if (dob === "") {
      clearMessage(dobBox);
      dobBox.classList.remove("input-error", "input-success");
      return true;
    }
    showSuccess(dobBox, "Date of birth selected.");
    return true;
  }

  function validateDepartment() {
    if (!departmentBox) return true;
    if (departmentBox.value === "") {
      showError(departmentBox, "Please select your department.");
      return false;
    }
    showSuccess(departmentBox, "Department selected!");
    return true;
  }

  function validateGender() {
    const genderGroup = document.querySelector(".radio-group");
    if (!genderGroup) return true;
    const parent = genderGroup.parentElement;
    let oldMessage = parent.querySelector(".error-message");
    
    const isGenderSelected = document.querySelector('input[name="gender"]:checked') || (maleRadio?.checked || femaleRadio?.checked);

    if (!isGenderSelected) {
      if (!oldMessage) {
        const error = document.createElement("span");
        error.classList.add("error-message");
        error.textContent = "Please select your gender.";
        parent.appendChild(error);
      }
      return false;
    }
    if (oldMessage) oldMessage.remove();
    return true;
  }

  function validateEvents() {
    const eventGroup = document.querySelector(".checkbox-group") || registrationForm;
    const parent = eventGroup.querySelector(".checkbox-group") ? eventGroup.querySelector(".checkbox-group").parentElement : eventGroup;
    let oldMessage = parent.querySelector(".error-message");

    const checkedEvents = registrationForm.querySelectorAll('input[type="checkbox"]:checked');

    if (checkedEvents.length === 0) {
      if (!oldMessage) {
        const error = document.createElement("span");
        error.classList.add("error-message");
        error.textContent = "Please select at least one event.";
        parent.appendChild(error);
      }
      return false;
    }
    if (oldMessage) oldMessage.remove();
    return true;
  }

  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const mobileValid = validateMobile();
    const dobValid = validateDOB();
    const departmentValid = validateDepartment();
    const genderValid = validateGender();
    const eventsValid = validateEvents();

    if (nameValid && emailValid && mobileValid && dobValid && departmentValid && genderValid && eventsValid) {
      
      const selectedEvents = Array.from(
        registrationForm.querySelectorAll('input[type="checkbox"]:checked')
      ).map(cb => cb.parentElement ? cb.parentElement.textContent.trim() : cb.value);

      const genderSelected = document.querySelector('input[name="gender"]:checked')?.value || 
                             (maleRadio?.checked ? "Male" : femaleRadio?.checked ? "Female" : "");

      const registrationData = {
        id: 'REG-' + Date.now(),
        name: nameBox ? nameBox.value.trim() : '',
        email: emailBox ? emailBox.value.trim() : '',
        mobile: mobileBox ? mobileBox.value.trim() : '',
        department: departmentBox ? departmentBox.value : '',
        gender: genderSelected,
        events: selectedEvents,
        timestamp: new Date().toLocaleString()
      };

      const existing = JSON.parse(localStorage.getItem('registrations')) || [];
      existing.push(registrationData);
      localStorage.setItem('registrations', JSON.stringify(existing));

      alert("Registration successful!");
      registrationForm.reset();

      [nameBox, emailBox, mobileBox, dobBox, departmentBox].forEach(el => clearMessage(el));
    }
  });
}

/* ==========================================================================
   3. EVENT CAROUSEL
   ========================================================================== */
function initEventCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  const cards = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");

  let currentIndex = 0;
  let autoSlideInterval = null;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("carousel-dot");
      if (i === currentIndex) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
        restartAutoSlide();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    if (!cards.length) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    const moveAmount = (cardWidth + gap) * currentIndex;

    track.style.transform = `translateX(-${moveAmount}px)`;

    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      restartAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      restartAutoSlide();
    });
  }

  track.parentElement.addEventListener("mouseenter", stopAutoSlide);
  track.parentElement.addEventListener("mouseleave", startAutoSlide);

  window.addEventListener("resize", updateCarousel);

  renderDots();
  updateCarousel();
  startAutoSlide();
}

/* ==========================================================================
   4. USER GREETING
   ========================================================================== */
function initUserGreeting() {
  const greetingTag = document.getElementById("user-greeting-tag");
  if (!greetingTag) return;

  function askForName() {
    const enteredName = prompt("Welcome to AAROHAN 2026 ✨\nWhat should we call you?");
    if (enteredName && enteredName.trim() !== "") {
      const cleanName = enteredName.trim();
      localStorage.setItem("aarohan_user_name", cleanName);
      displayGreeting(cleanName);
    }
  }

  function displayGreeting(name) {
    greetingTag.textContent = `Hello, ${name}! 👋`;
    greetingTag.classList.remove("hidden");
  }

  const savedName = localStorage.getItem("aarohan_user_name");

  if (!savedName) {
    setTimeout(askForName, 300);
  } else {
    displayGreeting(savedName);
  }

  greetingTag.addEventListener("click", askForName);
}

/* ==========================================================================
   5. ORGANIZER DASHBOARD & LOGIN
   ========================================================================== */
function initOrganizerDashboard() {
  const loginScreen = document.getElementById("loginScreen");
  const dashboard = document.getElementById("dashboard");
  const loginForm = document.getElementById("loginForm");

  if (!loginScreen && !dashboard && !loginForm) return;

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";
  const loginError = document.getElementById("loginError");

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
    initializeDashboardData();
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

  let events = [
    { id: "codequest", name: "Code Quest", description: "Competitive Programming", registrations: 0 },
    { id: "roborace", name: "RoboRace", description: "Robotics Competition", registrations: 0 },
    { id: "ctf", name: "CTF", description: "Capture the Flag", registrations: 0 }
  ];

  // Hardcoded default data populated if storage is empty
  const DEFAULT_REGISTRATIONS = [
    {
      id: "REG-101",
      name: "Arjun Kumar",
      email: "arjun@gmail.com",
      mobile: "9876543210",
      department: "ECE",
      gender: "Male",
      events: ["Code Quest"],
      timestamp: "05/09/2026, 09:30:00 AM"
    },
    {
      id: "REG-102",
      name: "Vedha",
      email: "vedha@gmail.com",
      mobile: "9656258090",
      department: "CSE",
      gender: "Female",
      events: ["Capture the Flag (CTF)"],
      timestamp: "06/09/2026, 11:15:00 AM"
    },
    {
      id: "REG-103",
      name: "Rahul Nair",
      email: "rahul.nair@gmail.com",
      mobile: "9447123456",
      department: "ME",
      gender: "Male",
      events: ["RoboRace", "Code Quest"],
      timestamp: "07/09/2026, 10:00:00 AM"
    }
  ];

  function getStoredRegistrations() {
    let data = localStorage.getItem("registrations") || localStorage.getItem("aarohan_registrations");
    if (!data || JSON.parse(data).length === 0) {
      localStorage.setItem("registrations", JSON.stringify(DEFAULT_REGISTRATIONS));
      return DEFAULT_REGISTRATIONS;
    }
    return JSON.parse(data);
  }

  function initializeDashboardData() {
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

  function calculateAndDisplayMetrics() {
    const registrationsList = getStoredRegistrations();
    events.forEach(evt => evt.registrations = 0);

    let totalEventEntries = 0;

    registrationsList.forEach(participant => {
      if (Array.isArray(participant.events)) {
        totalEventEntries += participant.events.length;

        participant.events.forEach(selectedEvt => {
          const normalized = selectedEvt.toLowerCase().replace(/\s+/g, '');
          if (normalized.includes('code') || normalized.includes('quest')) {
            events[0].registrations++;
          } else if (normalized.includes('robo') || normalized.includes('race')) {
            events[1].registrations++;
          } else if (normalized.includes('ctf') || normalized.includes('flag')) {
            events[2].registrations++;
          }
        });
      }
    });

    const participantCountEl = document.getElementById("participantCount");
    const registrationCountEl = document.getElementById("registrationCount");
    const eventCountEl = document.getElementById("eventCount");

    if (participantCountEl) participantCountEl.textContent = registrationsList.length;
    if (registrationCountEl) registrationCountEl.textContent = totalEventEntries;
    if (eventCountEl) eventCountEl.textContent = events.length;

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

  // TODO Management
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

  // Auto-Sync across browser tabs / refocus
  window.addEventListener("storage", (event) => {
    if (event.key === "registrations" || event.key === "aarohan_registrations") {
      calculateAndDisplayMetrics();
      displayParticipantRoster();
    }
  });

  window.addEventListener("focus", () => {
    calculateAndDisplayMetrics();
    displayParticipantRoster();
  });
}
