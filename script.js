
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function updateClock() {
  const now = new Date();

  $("#clock").textContent = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  $("#today").textContent = now.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const hour = now.getHours();
  const name = localStorage.getItem("desktopName") || "Pedro";
  const greeting = hour < 12 ? "Buenos días" :
                   hour < 18 ? "Buenas tardes" : "Buenas noches";

  $("#greeting").textContent = `${greeting}, ${name}`;
}

function showView(viewId) {
  $$(".view").forEach(view => {
    view.classList.toggle("hidden", view.id !== viewId);
  });

  $$(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });
}

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});


function openTool(tool) {
  const services = {
    hola: {
      title: "Hola",
      url: null
    },
    app: {
      title: "App",
      url: "https://web.whatsapp.com/"
    }
  };

  const service = services[tool];

  if (!service) return;

  if (service.url) {
    window.open(service.url, "_blank", "noopener,noreferrer");
    return;
  }

  document.querySelector("#workspace-title").textContent =
    service.title;

  document.querySelector("#workspace-content").innerHTML = `
    <div class="workspace-symbol">✦</div>
    <h3>Hola</h3>
    <p>Espacio personal de acceso a herramientas autorizadas.</p>
  `;

  showView("inicio");
}


$$("[data-tool]").forEach(button => {
  button.addEventListener("click", () => openTool(button.dataset.tool));
});

$("#save-name").addEventListener("click", () => {
  const name = $("#user-name").value.trim();

  if (!name) {
    alert("Escribe un nombre antes de guardar.");
    return;
  }

  localStorage.setItem("desktopName", name);
  updateClock();
  alert("Nombre guardado en este navegador.");
});

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  $("#calendar-title").textContent =
    now.toLocaleDateString("es-CO", {
      month: "long",
      year: "numeric"
    });

  const calendar = $("#calendar");
  calendar.innerHTML = "";

  ["L", "M", "X", "J", "V", "S", "D"].forEach(day => {
    const el = document.createElement("div");
    el.className = "calendar-day weekday";
    el.textContent = day;
    calendar.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement("div");
    el.className = "calendar-day";
    el.textContent = day;

    if (day === now.getDate()) {
      el.classList.add("today");
    }

    calendar.appendChild(el);
  }
}

const savedName = localStorage.getItem("desktopName");
if (savedName) {
  $("#user-name").value = savedName;
}

updateClock();
renderCalendar();
setInterval(updateClock, 1000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.error("No se pudo registrar el service worker:", error);
    });
  });
}
