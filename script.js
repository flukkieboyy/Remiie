// 1. System Config & Security
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
        return false;
    }
});

const clock = document.getElementById('clock');
const dateDisplay = document.getElementById('date');
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

const titleMain = document.getElementById('title-main');
const titleSub = document.getElementById('title-sub');
const textMain = "R E M I E レミー";
const phrases = ["My Name is Remie", "QT🍒", "Welcome to REMIE OS", "はじめまして!"];

let charIdx = 0, phraseIdx = 0, isDeleting = false, isTypingMain = true;

const audio = new (window.AudioContext || window.webkitAudioContext)();
function playClick() {
    if (audio.state === 'suspended') audio.resume();
    const osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(600, audio.currentTime);
    gain.gain.setValueAtTime(0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.1);
    osc.connect(gain); gain.connect(audio.destination);
    osc.start(); osc.stop(audio.currentTime + 0.1);
}

function runTyping() {
    if (isTypingMain) {
        if (charIdx < textMain.length) {
            titleMain.textContent += textMain.charAt(charIdx);
            playClick(); charIdx++; setTimeout(runTyping, 120);
        } else {
            isTypingMain = false; charIdx = 0; setTimeout(runTyping, 1000);
        }
    } else {
        const current = phrases[phraseIdx];
        titleSub.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
        charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
        
        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === current.length) {
            speed = 2000; isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 500;
        }
        setTimeout(runTyping, speed);
    }
}

document.addEventListener('click', (e) => {
    if (startMenu.contains(e.target) || startBtn.contains(e.target) || e.target.closest('a') || e.target.closest('button')) return;
    const h = document.createElement('div');
    h.className = 'heart-pop'; h.innerHTML = '💙';
    h.style.left = (e.pageX - 10) + 'px'; h.style.top = (e.pageY - 10) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 600);
});

// ==========================================
// 2. ระบบแบ่งหน้า (Pagination Settings)
// ==========================================
const ITEMS_PER_PAGE = 4; // กำหนดจำนวนรายการต่อ 1 หน้า
let currentGalPage = 1;
let currentSchedulePage = 1;

function setupPagination(id, parentElement, totalPages, currentPage, onPageChange) {
    let pageContainer = document.getElementById(id);
    if (!pageContainer) return;

    if (totalPages <= 1) {
        pageContainer.innerHTML = '';
        return;
    }

    pageContainer.innerHTML = `
        <button class="page-btn" id="${id}-prev" ${currentPage === 1 ? 'disabled' : ''}>&lt; PREV</button>
        <span class="page-text">${currentPage} / ${totalPages}</span>
        <button class="page-btn" id="${id}-next" ${currentPage === totalPages ? 'disabled' : ''}>NEXT &gt;</button>
    `;

    document.getElementById(`${id}-prev`)?.addEventListener('click', () => {
        playClick(); onPageChange(currentPage - 1);
    });
    document.getElementById(`${id}-next`)?.addEventListener('click', () => {
        playClick(); onPageChange(currentPage + 1);
    });
}

// ==========================================
// 4. SCHEDULE SYSTEM (ตารางงาน + Google Maps)
// ==========================================
const schedules = [
    { date: "02 MAY", title: "MULTI DIRECTION", location: "Central Chiangmai Airport, Chiangmai", mapUrl: "https://maps.google.com/?q=Central+Chiangmai+Airport", booth: "✅ (รอแจ้งเลขบูธ)", stage: "16:30", isSpecial: false },
    { date: "10 MAY", title: "KOKORO 11", location: "MCC Hall, The Mall Bangkapi", mapUrl: "https://maps.google.com/?q=MCC+Hall+The+Mall+Bangkapi", booth: "i41-46", stage: "✅ (รอแจ้งเวลา)", isSpecial: false },
    { date: "06 JUNE", title: "COSPLAY PLUS", location: "Mr.Fox Lifehouse", mapUrl: "https://maps.google.com/?q=Mr.Fox+Lifehouse", note: "❗❗ Order Drinks Only ❗❗", booth: "รอแจ้งอีกครั้ง", stage: "รอแจ้งอีกครั้ง", isSpecial: false },
    { date: "12 JUNE", title: "🎂 HAPPY BIRTHDAY TO ME", isSpecial: true },
    { date: "20 JUNE", title: "LILITH COSPLAY", location: "MCC Hall The Mall Bangkapi", mapUrl: "https://maps.google.com/?q=MCC+Hall+The+Mall+Bangkapi", booth: "✅ (รอแจ้งเลขบูธ)", stage: "✅ (รอแจ้งเวลา)", isSpecial: false },
    { date: "28 JUNE", title: "Verso Event", location: "MCC Hall, The Mall Bangkae", mapUrl: "https://maps.google.com/?q=MCC+Hall+The+Mall+Bangkae", booth: "รอแจ้งอีกครั้ง", stage: "รอแจ้งอีกครั้ง", isSpecial: false }
];

function renderSchedule() {
    const container = document.getElementById('schedule-list');
    const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE) || 1;
    const startIdx = (currentSchedulePage - 1) * ITEMS_PER_PAGE;
    const pageItems = schedules.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    container.innerHTML = pageItems.map(item => `
        <div class="schedule-item mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-blue text-white">${item.date}</span>
                <strong class="text-blue" style="font-size: 0.9rem;">${item.title}</strong>
            </div>
            ${!item.isSpecial ? `
                <div class="small text-dark mt-2">
                    <div class="mb-2">
                        <i class="fa-solid fa-location-dot text-danger"></i> 
                        <a href="${item.mapUrl}" target="_blank" class="text-decoration-none text-blue fw-bold hover-underline">${item.location}</a>
                    </div>
                    ${item.note ? `<div class="text-danger fw-bold mb-2" style="font-size: 0.8rem;">${item.note}</div>` : ''}
                    <div class="row g-1 mt-2" style="font-size: 0.75rem;">
                        <div class="col-12 col-sm-6"><strong>BOOTH:</strong> <span class="text-secondary">${item.booth}</span></div>
                        <div class="col-12 col-sm-6"><strong>STAGE:</strong> <span class="text-secondary">${item.stage}</span></div>
                    </div>
                </div>
            ` : `
                <div class="small text-secondary mt-2 text-center py-2 fw-bold">
                    <i class="fa-solid fa-cake-candles text-danger mb-1" style="font-size: 1.2rem;"></i><br>Special Day!
                </div>
            `}
        </div>
    `).join('');

    setupPagination('schedule-pagination-wrapper', container, totalPages, currentSchedulePage, (newPage) => {
        currentSchedulePage = newPage;
        renderSchedule();
    });
}

// ==========================================
// 5. 💥 MOVING POINTS BACKGROUND
// ==========================================
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 + 0.1;
        this.speedY = -(Math.random() * 0.5 + 0.1);
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--blue-primary').trim();
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 8000;
    for (let i = 0; i < numberOfParticles; i++) particles.push(new Particle());
}

function animateParticles() {
    if (!document.getElementById('intro-overlay').classList.contains('d-none')) {
        requestAnimationFrame(animateParticles); return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

// ==========================================
// 6. Window System & Draggable (แก้บัคลากหน้าต่าง)
// ==========================================
let zIndexCounter = 100;
const wins = document.querySelectorAll('.win:not(#win-viewer)');
const tIcons = document.querySelectorAll('.t-icon');

function makeDraggable(win) {
    const header = win.querySelector('.win-header');
    let isDragging = false, startX, startY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('close-win')) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialX = win.offsetLeft; initialY = win.offsetTop;
        
        win.style.zIndex = ++zIndexCounter; 
        document.body.style.userSelect = "none"; // ป้องกันคลุมดำข้อความ
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        let newX = initialX + (e.clientX - startX);
        let newY = initialY + (e.clientY - startY);
        
        // ล็อคไม่ให้ลากหลุดจอ
        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight - 55));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
    });
}

// เริ่มระบบ Draggable ให้ทุกหน้าต่าง
document.querySelectorAll('.win').forEach(w => makeDraggable(w));

function showWin(id) {
    if (!winViewer.classList.contains('d-none')) winViewer.classList.add('d-none');
    wins.forEach(w => w.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) {
        target.classList.remove('d-none');
        target.style.zIndex = ++zIndexCounter;
        target.querySelector('.win-body').scrollTop = 0;
    }
    tIcons.forEach(i => i.classList.toggle('active', i.dataset.id === id));
    startMenu.classList.add('d-none');
}

tIcons.forEach(icon => icon.addEventListener('click', () => showWin(icon.dataset.id)));
document.querySelectorAll('.start-item[data-id]').forEach(item => item.addEventListener('click', () => showWin(item.dataset.id)));

document.querySelectorAll('.close-win').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const win = btn.closest('.win');
        win.classList.add('d-none');
        document.querySelector(`.t-icon[data-id="${win.id}"]`)?.classList.remove('active');
    });
});

// ==========================================
// 7. Time System
// ==========================================
function updateSystemTime() {
    const d = new Date();
    clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    const day = String(d.getDate()).padStart(2,'0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    dateDisplay.textContent = `${day} ${month}`;
}

// ==========================================
// 8. Init Boot
// ==========================================
startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('d-none'); });
document.addEventListener('click', () => startMenu.classList.add('d-none'));

window.addEventListener('load', () => {
    renderGallery();
    renderSchedule();
    resizeCanvas();
    initParticles();
    animateParticles();
    
    const intro = document.getElementById('intro-overlay');
    const introText = intro.querySelector('p');
    const spinner = intro.querySelector('.spinner-border');

    spinner.classList.add('d-none');
    introText.innerHTML = '> CLICK TO BOOT SYSTEM <';
    introText.classList.add('blink-cursor');
    intro.style.cursor = 'pointer';

    intro.addEventListener('click', () => {
        if (audio.state === 'suspended') audio.resume();
        playClick();

        spinner.classList.remove('d-none');
        introText.classList.remove('blink-cursor');
        introText.innerHTML = 'SECURE BOOTING...';
        intro.style.cursor = 'default';

        setTimeout(() => {
            intro.style.opacity = '0';
            setTimeout(() => { 
                intro.style.display = 'none'; 
                intro.classList.add('d-none'); 
                runTyping(); 
            }, 500);
        }, 1200);
    }, { once: true });
});

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
setInterval(updateSystemTime, 1000); updateSystemTime();
