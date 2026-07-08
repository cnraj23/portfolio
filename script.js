// ========================================
// GENESIS PARTICLE SYSTEM
// ========================================

const canvas = document.getElementById('genesis-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouseX = 0, mouseY = 0;
let isMouseActive = false;
let time = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
});

document.addEventListener('mouseleave', () => {
    isMouseActive = false;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseRadius = this.radius;
        this.life = Math.random() * 150 + 100;
        this.maxLife = this.life;
        this.hue = Math.random() * 40 + 190;
        this.brightness = Math.random() * 20 + 50;
    }

    update() {
        // Mouse attraction — subtle, elegant
        if (isMouseActive) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 250) {
                const force = (250 - dist) / 250 * 0.008;
                this.vx += dx * force * 0.01;
                this.vy += dy * force * 0.01;
            }
        }

        // Natural movement
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Gentle organic drift
        this.vx += Math.sin(time * 0.0008 + this.y * 0.008) * 0.005;
        this.vy += Math.cos(time * 0.0008 + this.x * 0.008) * 0.005;

        // Damping
        this.vx *= 0.995;
        this.vy *= 0.995;

        // Respawn
        if (this.life <= 0 || this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
            this.reset();
        }
    }

    draw() {
        const alpha = (this.life / this.maxLife) * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, ${this.brightness}%, ${alpha})`;
        ctx.fill();
    }
}

function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles(120);

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const alpha = (1 - dist / 120) * 0.08;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(79, 140, 255, ${alpha})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    time++;

    // Clear with deep fade trail
    ctx.fillStyle = 'rgba(5, 5, 5, 0.12)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawConnections();

    requestAnimationFrame(animate);
}

animate();

// ========================================
// JOURNEY SCROLL-STORY
// ========================================

const storySteps = document.querySelectorAll('.story-step');
const chapters = document.querySelectorAll('.chapter');
const storyDots = document.querySelectorAll('.story-dot');
const pipelineEls = document.querySelectorAll('[data-sp]');
const storyHint = document.querySelector('.story-hint');
const chapterPanel = document.querySelector('.chapter-panel');

// Which pipeline elements light up for each chapter
const chapterHighlights = [
    ['people'],                       // SIU — understanding people & products
    ['tech'],                         // 8i — pure technology production
    ['people', 'sussex', 'tech'],     // Sussex — people x technology
    ['tech', 'gkn', 'business'],      // GKN — technology x business
    ['business', 'abans', 'people']   // Abans — business x people (the loop)
];

function setChapter(index) {
    chapters.forEach((c, i) => c.classList.toggle('active', i === index));
    storyDots.forEach((d, i) => d.classList.toggle('active', i === index));

    const active = chapterHighlights[index] || [];
    pipelineEls.forEach(el => {
        el.classList.toggle('active', active.includes(el.dataset.sp));
    });

    if (storyHint) storyHint.classList.toggle('hidden', index > 0);
}

if (storySteps.length && chapters.length) {
    if ('IntersectionObserver' in window) {
        setChapter(0);

        const storyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setChapter(parseInt(entry.target.dataset.chapter, 10));
                    }
                });
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
        );

        storySteps.forEach(step => storyObserver.observe(step));

        storyDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const step = storySteps[i];
                if (step) step.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    } else {
        // Old browser: show every chapter stacked, no pinning tricks
        if (chapterPanel) chapterPanel.classList.add('static');
        chapters.forEach(c => c.classList.add('active'));
        storyDots.forEach(d => d.style.display = 'none');
        if (storyHint) storyHint.style.display = 'none';
    }
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".section, .impact-card, .case-card, .recognition-row, .research-list a")
            .forEach(el => el.classList.add("visible"));
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
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".section, .impact-card, .case-card, .recognition-row, .research-list a")
        .forEach(el => observer.observe(el));
}

initScrollReveal();

// ========================================
// IMPACT NUMBER COUNTERS
// ========================================

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * target);
        el.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function initCounters() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".impact-number").forEach(el => {
            const target = el.dataset.target;
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            el.textContent = prefix + target + suffix;
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

    document.querySelectorAll(".impact-number").forEach(el => counterObserver.observe(el));
}

initCounters();

// ========================================
// NAVBAR SHADOW & ACTIVE LINK
// ========================================

const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(5,5,5,0.95)";
            navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
        } else {
            navbar.style.background = "rgba(5,5,5,0.75)";
            navbar.style.boxShadow = "none";
        }
    }

    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

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
    "%c Chinmay Rajguru %c\nTechnology & Innovation Leader\n\nTurning complexity into measurable outcomes.",
    "font-size: 20px; font-weight: bold; color: #4f8cff;",
    "font-size: 12px; color: #9ca3af;"
);