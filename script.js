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
// JOURNEY DATA
// ========================================

const journeyData = {
    "8i Labs": {
        title: "Reality → Digital Experience",
        content: `Built volumetric capture pipelines and immersive experiences that translated physical reality into digital interaction.

Focus Areas:
• Immersive Media
• Digital Experiences
• Emerging Technology
• Rapid Prototyping

Key Lesson:
Technology becomes powerful when it makes reality more accessible.`
    },

    "Master's Research": {
        title: "Research → Manufacturable Products",
        content: `Explored how research can be transformed into practical products and experiences.

Focus Areas:
• Systems Thinking
• Human-Centered Design
• Product Innovation
• Research Translation

Key Lesson:
Innovation happens when ideas become usable products.`
    },

    "Sussex": {
        title: "Physics → Human Perception",
        content: `Conducted doctoral research in spatial audio, acoustic metamaterials, and human perception.

Focus Areas:
• Scientific Discovery
• Human Perception
• Research Leadership
• Spatial Computing

Key Lesson:
Technology must align with how people perceive and experience the world.`
    },

    "GKN": {
        title: "Knowledge → Enterprise Intelligence",
        content: `Helped lead enterprise AI transformation initiatives across multiple international locations.

Transformation Themes:
• Enterprise Transformation
• Technology Strategy
• Global Collaboration
• Digital Transformation
• Operational Excellence

Operating Across:
India • UK • Sweden • Netherlands

How I Operated:
• Technology Translator
• Consensus Builder
• Technical Leader
• Strategic Problem Solver

Key Lesson:
The hardest part of transformation is aligning people, priorities, and execution.`
    },

    "Abans": {
        title: "Market Complexity → Product Execution",
        content: `Leading AI-enabled product initiatives within capital markets and financial platforms.

Focus Areas:
• Product Leadership
• Workflow Design
• AI Enablement
• Stakeholder Alignment

Key Lesson:
Great products reduce friction in high-stakes decision-making.`
    }
};

// ========================================
// JOURNEY INTERACTION
// ========================================

const tabs = document.querySelectorAll(".journey-tab");
const detail = document.querySelector(".journey-detail");

function loadJourney(key) {
    const data = journeyData[key];
    if (!data || !detail) return;

    detail.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.content}</p>
    `;

    if (detail.animate) {
        detail.animate(
            [
                { opacity: 0, transform: "translateY(10px)" },
                { opacity: 1, transform: "translateY(0px)" }
            ],
            { duration: 300, easing: "ease-out" }
        );
    }
}

if (tabs.length && detail) {
    const firstKey = tabs[0].textContent.trim();
    loadJourney(firstKey);

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const key = tab.textContent.trim();
            loadJourney(key);
        });
    });
}

// ========================================
// TRANSLATION ENGINE V3 (NODES + BRIDGES)
// ========================================

// Data for the Bridges (The Companies)
const engineData = {
 "sussex": {
    title: "Sussex — Physics → Human Perception",
    tag: "PEOPLE × TECHNOLOGY",
    content: "PhD research in spatial audio and acoustic metamaterials. 210+ participants in psychoacoustic studies. 8 peer-reviewed papers in Nature, ACM SIGGRAPH, JASA. Translated hard physics into how humans actually experience sound."
 },
 "gkn": {
    title: "GKN — Knowledge → Enterprise Intelligence",
    tag: "TECHNOLOGY × BUSINESS",
    content: "Architected secure on-prem LLM and RAG solutions, reducing cloud dependency by 30%. Built data governance with MS Fabric and Purview. Delivered $30M+ in quantifiable business value across 3 international sites."
 },
 "abans": {
    title: "Abans — Market Complexity → Product Execution",
    tag: "BUSINESS × PEOPLE",
    content: "Conducted deep user research with financial dealers to identify friction in time-critical trading flows. Leading AI-augmented automation to convert requirements into regression tests. Reducing friction in high-stakes decision-making."
 }
};

// Data for the Nodes (The Domains)
const nodeData = {
    "people": {
        tag: "THE HUMAN ELEMENT",
        title: "People: Perception, Workflows & Alignment",
        content: "From 210+ psychoacoustic studies at Sussex to deep user research with financial dealers at Abans. I focus on how humans actually experience, interact with, and make decisions within complex systems."
    },
    "technology": {
        tag: "THE TECHNICAL CORE",
        title: "Technology: Deep-Tech, AI & Spatial Systems",
        content: "Architecting secure on-prem LLMs, RAG pipelines, and acoustic metamaterials. I build the foundational systems—bridging bare-metal engineering to enterprise-scale AI infrastructure."
    },
    "business": {
        tag: "THE COMMERCIAL REALITY",
        title: "Business: Scale, ROI & Enterprise Governance",
        content: "Translating experimental AI into $30M+ in quantifiable business value. Securing $10M+ in innovation funding and ensuring strict aerospace compliance and data governance at global scale."
    },
    "market": {
        tag: "THE MARKET REALITY",
        title: "Market: Capital Flows & Product Execution",
        content: "Operating in high-stakes capital markets. Grounding AI capabilities in commercial viability, ensuring product roadmaps directly support working-capital efficiency and trader productivity."
    }
};

// Default state when nothing is hovered
const defaultContent = {
    tag: "THE TRANSLATION ENGINE",
    title: "Architecting the Boundaries",
    content: "Hover over the nodes (People, Technology, Business, Market) or the bridges (Sussex, GKN, Abans) to explore how I translate complexity into measurable outcomes."
};

// Select Elements
const bridges = document.querySelectorAll('.engine-bridge');
const nodes = document.querySelectorAll('.engine-node');
const detailPanel = document.getElementById('engine-detail');
const detailTag = document.getElementById('detail-tag');
const detailTitle = document.getElementById('detail-title');
const detailContent = document.getElementById('detail-content');

// Helper function to update the panel with a smooth micro-animation
function updatePanel(data) {
    if (!data || !detailPanel) return;
    
    detailTag.textContent = data.tag;
    detailTitle.textContent = data.title;
    detailContent.textContent = data.content;

    detailPanel.style.transform = 'scale(0.98)';
    setTimeout(() => {
        detailPanel.style.transform = 'scale(1)';
    }, 150);
}

// 1. Bridge Interactions (The Companies)
bridges.forEach(bridge => {
    bridge.addEventListener('mouseenter', () => {
        const key = bridge.dataset.company;
        updatePanel(engineData[key]);
    });

    bridge.addEventListener('mouseleave', () => {
        updatePanel(defaultContent);
    });
});

// 2. Node Interactions (The Domains)
nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
        const key = node.dataset.node;
        updatePanel(nodeData[key]);
    });

    node.addEventListener('mouseleave', () => {
        updatePanel(defaultContent);
    });
});

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".section, .impact-card, .os-card, .testimonial-card, .transform-card, .research-list a")
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

    document.querySelectorAll(".section, .impact-card, .os-card, .testimonial-card, .transform-card, .research-list a")
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
    "%c Chinmay Rajguru %c\nArchitect of Translation Systems\n\nTurning complexity into measurable outcomes.",
    "font-size: 20px; font-weight: bold; color: #4f8cff;",
    "font-size: 12px; color: #9ca3af;"
);