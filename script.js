// ========================================
// THEME TOGGLE (light / dark)
// ========================================

const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeMeta) {
        themeMeta.setAttribute("content", theme === "dark" ? "#121316" : "#F5F5F1");
    }

    if (themeToggle) {
        themeToggle.setAttribute("aria-label",
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }

    if (persist) {
        try { localStorage.setItem("theme", theme); } catch (e) { }
    }
}

applyTheme(document.documentElement.getAttribute("data-theme") || "light", false);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next, true);
    });
}

const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
if (systemDark.addEventListener) {
    systemDark.addEventListener("change", (e) => {
        let stored = null;
        try { stored = localStorage.getItem("theme"); } catch (err) { }
        if (!stored) applyTheme(e.matches ? "dark" : "light", false);
    });
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        targets.forEach(el => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(el => observer.observe(el));
}

initScrollReveal();

// ========================================
// IMPACT NUMBER COUNTERS
// ========================================

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
        el.textContent = prefix + target + suffix;
        return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = prefix + Math.floor(ease * target) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function initCounters() {
    const counters = document.querySelectorAll(".impact-number");

    if (!("IntersectionObserver" in window)) {
        counters.forEach(el => {
            el.textContent = (el.dataset.prefix || "") + el.dataset.target + (el.dataset.suffix || "");
        });
        return;
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
}

initCounters();

// ========================================
// JOURNEY PROGRESS (sticky bar, no pinning)
// ========================================

const chapterEls = document.querySelectorAll(".chapter");
const stops = document.querySelectorAll(".jstop");
const barFill = document.querySelector(".jbar-fill");

function setJourneyStep(index) {
    stops.forEach((stop, i) => {
        stop.classList.toggle("active", i === index);
        stop.classList.toggle("passed", i < index);
    });

    if (barFill && stops.length > 1) {
        const pct = (index / (stops.length - 1)) * 100;
        barFill.style.width = pct + "%";
    }
}

if (chapterEls.length && stops.length) {
    setJourneyStep(0);

    if ("IntersectionObserver" in window) {
        const journeyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setJourneyStep(parseInt(entry.target.dataset.chapter, 10));
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );

        chapterEls.forEach(ch => journeyObserver.observe(ch));
    }

    stops.forEach((stop, i) => {
        stop.addEventListener("click", () => {
            const chapter = chapterEls[i];
            if (chapter) chapter.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
}

// ========================================
// NAVBAR STATE & ACTIVE LINK
// ========================================

const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar ul a");
const sections = document.querySelectorAll("section[id], header[id]");

window.addEventListener("scroll", () => {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    }

    let current = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 220) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
}, { passive: true });

// ========================================
// MOBILE MENU TOGGLE
// ========================================

const mobileBtn = document.querySelector(".mobile-menu-btn");
const navUl = document.querySelector(".navbar ul");

if (mobileBtn && navUl) {
    mobileBtn.addEventListener("click", () => {
        mobileBtn.classList.toggle("active");
        navUl.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileBtn.classList.remove("active");
            navUl.classList.remove("active");
        });
    });
}

// ========================================
// CONSOLE SIGNATURE
// ========================================

console.log(
    "%c Chinmay Rajguru %c\nTechnology & Innovation Leader\n\nBringing people, technology and business into phase.",
    "font-size: 18px; font-weight: bold; color: #2742C9;",
    "font-size: 12px; color: #5D6067;"
);
