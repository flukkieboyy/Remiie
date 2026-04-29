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
    if (startMenu.contains(e.target) || startBtn.contains(e.target) || e.target.closest('a') || e.target.closest('button') || e.target.closest('.start-profile-btn')) return;
    const h = document.createElement('div');
    h.className = 'heart-pop'; h.innerHTML = '💙';
    h.style.left = (e.pageX - 10) + 'px'; h.style.top = (e.pageY - 10) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 600);
});

// ==========================================
// 2. ระบบแบ่งหน้า (Pagination Settings)
// ==========================================
const ITEMS_PER_PAGE = 4;
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
        <button class="page-btn" id="${id}-prev" ${currentPage === 1 ? 'disabled' : ''}>< PREV</button>
        <span class="page-text">${currentPage} / ${totalPages}</span>
        <button class="page-btn" id="${id}-next" ${currentPage === totalPages ? 'disabled' : ''}>NEXT ></button>
    `;

    document.getElementById(`${id}-prev`)?.addEventListener('click', () => {
        playClick(); onPageChange(currentPage - 1);
    });
    document.getElementById(`${id}-next`)?.addEventListener('click', () => {
        playClick(); onPageChange(currentPage + 1);
    });
}

// ==========================================
// 3. IG GALLERY DATA
// ==========================================
const galleryData = [
    {
        id: "set_latest",
        images: [
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/658139856_18365630728207890_2288431323310666243_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg2NjQ0ODcyMTczMjAxMjI1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=RmjuKLPjZT4Q7kNvwGruGBg&_nc_oc=AdqfwllXgPcuXssTLjE04E9Iy0iJufyNK8W9mtGim4lvQegn9X-Gr5ovrWnwjfrOVJjsinxH6029AwKy6jVAKg7Q&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af3OIE8B2zUnPiCmRugOp8C0Jp8hJ78FX4XhsEmPB3-Ytw&oe=69F43FF0",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/657332650_18365630767207890_2366060363257620119_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzg2NjQ0ODcyMTc0MDM5ODY0OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxMS5zZHIuQzMifQ%3D%3D&_nc_ohc=NKkrLGyB7cgQ7kNvwEFvLWX&_nc_oc=AdqLQcMSjghJ6zLcMnzxRVJ6bjNsyTsAU33YIKHMoX4TINkxAb9-6ahK8tiR1qoWw8oTyuSA-fxmSopRWyexEnDP&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af37aKn_Gl1Woc_uO4v_enY9PWsJAlx7QcA0ecISafZGbA&oe=69F446A1"
        ]
    }
];

let currentSet = [];
let currentImgIdx = 0;
const winViewer = document.getElementById('win-viewer');
const viewerImg = document.getElementById('viewer-img');
const viewerCounter = document.getElementById('viewer-counter');

function renderGallery() {
    const container = document.getElementById('gallery-container');
    const totalPages = Math.ceil(galleryData.length / ITEMS_PER_PAGE) || 1;
    const startIdx = (currentGalPage - 1) * ITEMS_PER_PAGE;
    const pageItems = galleryData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    container.innerHTML = '';
    pageItems.forEach(item => {
        const coverImg = item.images[0];
        const col = document.createElement('div');
        col.className = 'col-6';
        col.innerHTML = `<img src="${coverImg}" class="img-fluid rounded border-blue gallery-thumb" data-id="${item.id}">`;
        container.appendChild(col);
    });

    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            if (!winViewer.classList.contains('d-none')) return; 
            const setId = thumb.dataset.id;
            const setObj = galleryData.find(s => s.id === setId);
            if(setObj) {
                currentSet = setObj.images;
                currentImgIdx = 0;
                updateViewer();
                winViewer.classList.remove('d-none');
                playClick();
            }
        });
    });

    setupPagination('gallery-pagination-wrapper', container, totalPages, currentGalPage, (newPage) => {
        currentGalPage = newPage;
        renderGallery();
    });
}

function updateViewer() {
    viewerImg.src = currentSet[currentImgIdx];
    viewerCounter.textContent = `${currentImgIdx + 1}/${currentSet.length}`;
    document.getElementById('btn-prev').style.display = currentSet.length > 1 ? 'flex' : 'none';
    document.getElementById('btn-next').style.display = currentSet.length > 1 ? 'flex' : 'none';
}

document.getElementById('btn-prev').addEventListener('click', () => {
    currentImgIdx = (currentImgIdx - 1 + currentSet.length) % currentSet.length;
    updateViewer(); playClick();
});

document.getElementById('btn-next').addEventListener('click', () => {
    currentImgIdx = (currentImgIdx + 1) % currentSet.length;
    updateViewer(); playClick();
});

document.querySelector('.close-viewer').addEventListener('click', (e) => {
    e.stopPropagation(); winViewer.classList.add('d-none'); playClick();
});

// ==========================================
// 4. 🔥 SCHEDULE SYSTEM (ดึงจาก Backend จริง)
// ==========================================
let schedules = []; // ตัวแปรว่าง รอรับข้อมูลจากฐานข้อมูล

async function fetchSchedules() {
    const container = document.getElementById('schedule-list');
    container.innerHTML = '<div class="text-center mt-4"><i class="fa-solid fa-spinner fa-spin text-blue fs-2"></i><p class="mt-2 text-dim small">LOADING SCHEDULE...</p></div>';
    
    try {
        const res = await fetch('/api/schedule');
        const data = await res.json();
        
        if (data && data.length > 0) {
            schedules = data;
        } else {
            // โค้ดสำรอง (ถ้าฐานข้อมูลว่างเปล่าเพิ่งเริ่มใช้)
            schedules = [
                { date: "02 MAY", title: "MULTI DIRECTION", location: "Central Chiangmai Airport", mapUrl: "#", booth: "รอแจ้งเลขบูธ", stage: "16:30" }
            ];
        }
        renderSchedule();
    } catch (error) {
        console.error("Database connection error");
        container.innerHTML = '<div class="text-center mt-4 text-danger small">⚠️ ERROR CONNECTING TO DATABASE</div>';
    }
}

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
// 6. Window System & Draggable
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
        document.body.style.userSelect = "none";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let newX = initialX + (e.clientX - startX);
        let newY = initialY + (e.clientY - startY);
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
// 8. 🔐 ระบบ LOGIN & ADMIN DASHBOARD
// ==========================================
let secretAdminToken = ""; // ตัวแปรเก็บรหัสผ่านไว้ใช้ตอนเซฟ

document.getElementById('btn-open-login').addEventListener('click', () => {
    startMenu.classList.add('d-none'); 
    showWin('win-admin-login'); 
});

document.getElementById('btn-login-submit').addEventListener('click', async () => {
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('btn-login-submit');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';
    
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "remieeimer", password: pass })
        });

        if (res.ok) {
            secretAdminToken = pass; // ถ้ารหัสผ่านถูก เก็บไว้ใช้ยืนยันตอนเซฟข้อมูล
            document.getElementById('win-admin-login').classList.add('d-none');
            showWin('win-admin-dash'); 
            document.getElementById('admin-pass').value = '';
            
            // เอางานปัจจุบันมาแสดงให้แก้ไข
            document.getElementById('admin-schedule-editor').value = JSON.stringify(schedules, null, 4);
        } else {
            alert("❌ ACCESS DENIED\nPassword ไม่ถูกต้อง!");
        }
    } catch (e) {
        alert("❌ ERROR CONNECTING TO SERVER");
    }
    
    btn.innerHTML = '<i class="fa-solid fa-unlock"></i> LOGIN'; 
});

// ปุ่มกดเซฟข้อมูลลงฐานข้อมูล
document.getElementById('btn-save-schedule').addEventListener('click', async () => {
    const btn = document.getElementById('btn-save-schedule');
    const rawData = document.getElementById('admin-schedule-editor').value;
    
    try {
        const parsedData = JSON.parse(rawData); // ตรวจว่า JSON เขียนถูกหลักไหม
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SAVING...';
        
        // ยิงไปที่ Backend เพื่อเซฟข้อมูล
        const res = await fetch('/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduleData: parsedData, token: secretAdminToken })
        });

        if(res.ok) {
            alert("✅ บันทึกตารางงานลง Database สำเร็จ!");
            schedules = parsedData; // อัปเดตตารางตัวแปร
            currentSchedulePage = 1; // กลับไปหน้าแรก
            renderSchedule(); // วาดตารางใหม่
        } else {
            alert("❌ สิทธิ์ถูกปฏิเสธ หรือมีข้อผิดพลาด");
        }
    } catch (e) {
        alert("❌ รูปแบบข้อมูล (JSON) ไม่ถูกต้อง กรุณาตรวจสอบลูกน้ำ (,) หรือวงเล็บ ({}) ให้ดี");
    }
    
    btn.innerHTML = 'SAVE CHANGES';
});

// ==========================================
// 9. Init Boot
// ==========================================
startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('d-none'); });
document.addEventListener('click', () => startMenu.classList.add('d-none'));

window.addEventListener('load', () => {
    renderGallery();
    fetchSchedules(); // โหลดข้อมูลตารางงานจาก Database ทันทีที่เปิดเว็บ!
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
