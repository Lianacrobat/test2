// Variables Globales
const DEFAULT_LANG = localStorage.getItem("lang") || "es";
const DEFAULT_THEME = localStorage.getItem("theme") || "light";
const VALID_THEMES = ["light", "dark"];
let currentLang = DEFAULT_LANG;
let currentTheme = DEFAULT_THEME;
const lastActiveTool = JSON.parse(localStorage.getItem("lastActiveTool")) || {};
let toolsBySection = getDynamicTools(currentLang);

// Función principal: Traducir toolsBySection dinámicamente
function getDynamicTools(lang) {
  const translations = getTranslations(lang);
  return {
    A: [
      { icon: "😎", label: translations.section_tool1, section: "A-1" },
      { icon: "📄", label: translations.section_tool2, section: "A-2" },
      { icon: "📊", label: translations.section_tool3, section: "A-3" },
    ],
    B: [
      { icon: "⭐", label: translations.section_tool1, section: "B-1" },
      { icon: "⚡", label: translations.section_tool2, section: "B-2" },
      { icon: "📐", label: translations.section_tool3, section: "B-3" },
    ],
    C: [
      { icon: "📈", label: translations.section_tool1, section: "C-1" },
      { icon: "📉", label: translations.section_tool2, section: "C-2" },
      { icon: "📊", label: translations.section_tool3, section: "C-3" },
    ],
    D: [
      { icon: "🏋️‍♂️", label: translations.section_tool1, section: "D-1" },
      { icon: "🏋️‍♂️", label: translations.section_tool2, section: "D-2" },
      { icon: "🧘‍♂️", label: translations.section_tool3, section: "D-3" },
    ],
    E: [
      { icon: "🏋️‍♂️", label: translations.section_tool1, section: "E-1" },
      { icon: "🏋️‍♂️", label: translations.section_tool2, section: "E-2" },
      { icon: "🧘‍♂️", label: translations.section_tool3, section: "E-3" },
    ],
  };
}

// Configuración inicial al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
  document.getElementById("language-select").value = currentLang;

  document.body.classList.add(currentTheme);
  updateThemeButton(currentTheme);
});

// Cargar y aplicar el idioma
function loadLanguage(lang) {
  const translations = getTranslations(lang);
  applyTranslations(translations);
  localStorage.setItem("lang", lang);
  refreshAside(lang);
}

// Actualizar herramientas dinámicamente en el aside
function refreshAside(lang) {
  toolsBySection = getDynamicTools(lang);
  const lastSection = localStorage.getItem("lastActiveSection") || "A";
  showSection(lastSection);
}

// Aplicar traducciones al DOM
function applyTranslations(translations) {
  document.querySelector("h1").textContent = translations.app_title;

  const footerItems = document.querySelectorAll(".footer-item span:nth-child(2)");
  const keys = ["footer_home", "footer_docs", "footer_reports", "footer_exercises", "footer_store"];
  footerItems.forEach((item, index) => {
    item.textContent = translations[keys[index]];
  });

  updateThemeButton(currentTheme);
}

// Cambiar tema
function toggleMode() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
}

// Aplicar tema específico
function applyTheme(theme) {
  if (!VALID_THEMES.includes(theme)) theme = "light";

  document.body.classList.remove(...VALID_THEMES);
  document.body.classList.add(theme);

  localStorage.setItem("theme", theme);
  updateThemeButton(theme);
}

// Actualizar texto del botón de tema
function updateThemeButton(theme) {
  const translations = getTranslations(currentLang);
  const button = document.querySelector(".toggle-mode");
  button.textContent = theme === "light" ? translations.toggle_mode_light : translations.toggle_mode_dark;
}

// Mostrar una sección específica en el aside
function showSection(section) {
  const aside = document.querySelector(".aside");
  aside.innerHTML = "";

  updateFooterActive(section);

  const tools = toolsBySection[section] || [];
  tools.forEach(tool => {
    const toolDiv = document.createElement("div");
    toolDiv.classList.add("tool");
    toolDiv.setAttribute("data-section", tool.section);
    toolDiv.onclick = () => selectAsideTool(section, tool.section);

    const icon = document.createElement("span");
    icon.textContent = tool.icon;

    const label = document.createElement("span");
    label.textContent = tool.label;

    toolDiv.appendChild(icon);
    toolDiv.appendChild(label);
    aside.appendChild(toolDiv);
  });

  const activeTool = lastActiveTool[section] || tools[0]?.section;
  if (activeTool) selectAsideTool(section, activeTool);

  localStorage.setItem("lastActiveSection", section);
}

// Actualizar el estado activo del footer
function updateFooterActive(section) {
  const footerItems = document.querySelectorAll(".footer .footer-item");
  footerItems.forEach(item => {
    item.classList.toggle("active", item.onclick.toString().includes(section));
  });
}

// Seleccionar una herramienta específica del aside
function selectAsideTool(section, toolSectionId) {
  document.querySelectorAll(".aside .tool").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-section") === toolSectionId);
  });

  document.querySelectorAll(".contenido section").forEach(sectionElement => {
    sectionElement.classList.toggle("active", sectionElement.id === toolSectionId);
  });

  lastActiveTool[section] = toolSectionId;
  localStorage.setItem("lastActiveTool", JSON.stringify(lastActiveTool));
}

// Cambiar idioma
function changeLanguage(lang) {
  currentLang = lang;
  loadLanguage(lang);
}

// Obtener traducciones
function getTranslations(lang) {
  const translations = {
    es: {
      app_title: "Aplicación",
      toggle_mode_light: "🌑",
      toggle_mode_dark: "💡",
      footer_home: "Inicio",
      footer_docs: "Documentos",
      footer_reports: "Reportes",
      footer_exercises: "Ejercicios",
      footer_store: "Tienda",
      section_tool1: "Mis Datos",
      section_tool2: "Herramienta 2",
      section_tool3: "Herramienta 3",
    },
    en: {
      app_title: "Application",
      toggle_mode_light: "🌑",
      toggle_mode_dark: "💡",
      footer_home: "Home",
      footer_docs: "Documents",
      footer_reports: "Reports",
      footer_exercises: "Exercises",
      footer_store: "Store",
      section_tool1: "My Data",
      section_tool2: "Tool 2",
      section_tool3: "Tool 3",
    },
    uk: {
      app_title: "Додаток",
      toggle_mode_light: "🌑",
      toggle_mode_dark: "💡",
      footer_home: "Головна",
      footer_docs: "Документи",
      footer_reports: "Звіти",
      footer_exercises: "Вправи",
      footer_store: "Магазин",
      section_tool1: "Мої Дані",
      section_tool2: "Інструмент 2",
      section_tool3: "Інструмент 3",
    },
    cn: {
      app_title: "应用程序",
      toggle_mode_light: "🌑",
      toggle_mode_dark: "💡",
      footer_home: "首页",
      footer_docs: "文档",
      footer_reports: "报告",
      footer_exercises: "练习",
      footer_store: "商店",
      section_tool1: "我的数据",
      section_tool2: "工具 2",
      section_tool3: "工具 3",
    },
  };
  return translations[lang];
}
