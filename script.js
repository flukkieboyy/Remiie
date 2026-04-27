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
const modeSwitch = document.getElementById('mode-switch');
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
    h.className = 'heart-pop'; h.innerHTML = '❤️';
    h.style.left = (e.pageX - 10) + 'px'; h.style.top = (e.pageY - 10) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 600);
});

// ==========================================
// 6. 🖼️ IG GALLERY DATA & PAGINATION
// ==========================================
const galleryData = [
    {
        id: "set_latest",
        images: [
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/658139856_18365630728207890_2288431323310666243_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg2NjQ0ODcyMTczMjAxMjI1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=RmjuKLPjZT4Q7kNvwGruGBg&_nc_oc=AdqfwllXgPcuXssTLjE04E9Iy0iJufyNK8W9mtGim4lvQegn9X-Gr5ovrWnwjfrOVJjsinxH6029AwKy6jVAKg7Q&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af3OIE8B2zUnPiCmRugOp8C0Jp8hJ78FX4XhsEmPB3-Ytw&oe=69F43FF0",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/657332650_18365630767207890_2366060363257620119_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzg2NjQ0ODcyMTc0MDM5ODY0OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxMS5zZHIuQzMifQ%3D%3D&_nc_ohc=NKkrLGyB7cgQ7kNvwEFvLWX&_nc_oc=AdqLQcMSjghJ6zLcMnzxRVJ6bjNsyTsAU33YIKHMoX4TINkxAb9-6ahK8tiR1qoWw8oTyuSA-fxmSopRWyexEnDP&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af37aKn_Gl1Woc_uO4v_enY9PWsJAlx7QcA0ecISafZGbA&oe=69F446A1",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/658187946_18365630779207890_5368661585661094235_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzg2NjQ0ODcyMTc4MjMwOTg5Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=5zHm3sdi2gwQ7kNvwGM7yom&_nc_oc=Adr17FtaIe67PY6XUMMRgRAVGenBPrMsq5fhD6-REunv9b17W2QZC5vuuvR90kByWTTSCCfJ8IrEe2t_GHA3bNUg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af3ASTxkRlanV6FwIp7QBPhiOXlAemQD7nXZDBUFz1jW5Q&oe=69F41F39",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/656368449_18365630788207890_7152316178315597852_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzg2NjQ0ODcyMTc1NzIwNzcwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=HrCYidz8C2cQ7kNvwGtUPmP&_nc_oc=AdrgekuB3AGDs311ijALnEJTXSAEECceFoX0tdBeg0wWyZzbLAHj-vyR021kaAWJ9ealKantNxnk84CDQW-RWNVQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af20o8nbrFfaK4FNY6HG__FkoIdHS_ez7z4KammSyUvscA&oe=69F417B7",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/657913029_18365630803207890_1677087986688947525_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzg2NjQ0ODcyMTc1NzE3MjQwNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=7ILpY32zPoMQ7kNvwGqcHZi&_nc_oc=AdoM30n8VVnafT4s5vmFq7XT6s_sRNlTuIzQ34n1-398oN-Ha3MUwEWJBbEJMwIBzQvnTzOzahB1p5UGTCxK-LA8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af2tmrx7P0braH--Qw2xHoNwjGStuWIfWDDNsKWxa_fr6A&oe=69F4477E",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/657240197_18365630974207890_7719671492846893344_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg2NjQ0ODcyMTc0MDM4MjI5NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=lQdGSDFXpuIQ7kNvwEIzotL&_nc_oc=AdqOAsmOv9drZDGkVrAq8uYmpxJ8BrZabOWS0hH3O_f1uZ1nrb78BziNJj17IoEsCXjSK-EDfSgkUVRiaaNo9Rng&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af3rUrRkaub9cX86KU5RIKkPT588RbTennjUmAUEpJxCOw&oe=69F44DAF",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/660286932_18365630989207890_1899805534889546205_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg2NjQ0ODcyMTc0ODc3NDU5NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=HOaw0hlAe1cQ7kNvwH2NZfa&_nc_oc=AdoupNqE3TDOkHB-6IpO6aWCwl-X8g2kCJx69MGDpX__H5fxlr4Aqn9PhWn2uPpZCRHZKJ5O1p1KapuulYLz0HGd&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af2QXd24CIT98gZXUzpEpdgqNG_XD4SGuS3UCV49sU_esQ&oe=69F44ACB"
        ]
    },
    {
        id: "set2",
        images: [
            "https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/649473108_18362230303207890_4643581290609604032_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=Mzg1MjAyMzkxOTc4NDE1MDMyNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxNy5zZHIuQzMifQ%3D%3D&_nc_ohc=7e8bAV34UmUQ7kNvwFY_ps4&_nc_oc=AdrlAaseSz_MlcwekU8bIQEezFajYHURlAVK1Agu9Ok6EXMThJaxCltOF5yvEW-dsVEaQARuQM5cxGLghbEDdhib&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=qkzpiibmxhOrA7vZ4005GQ&_nc_ss=7a22e&oh=00_Af2BGZD38OaG-LFHREVjM93vqaskJ2X630RzOa7IZIWqzQ&oe=69F40D7A",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/650721232_18362230321207890_5242038300137356766_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzg1MjAyMzkyNDI2MzYxODEzMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=2NVUdipPgf0Q7kNvwHusRJy&_nc_oc=Ado7FHvqpM70iEvEK0Aqo88SjpGrDi37PJ5YIuSfiBOH93xnwGVgYT-PD_g3r010IM41rweMdkEGdFP6d8T8eSB8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=qkzpiibmxhOrA7vZ4005GQ&_nc_ss=7a22e&oh=00_Af0tOrp9tiOI2G0Ox4sQv4kgj-1OE4lSseuG9Gkw02_v6w&oe=69F41C30",
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/651146595_18362230318207890_323929567978119784_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzg1MjAyMzkyODI2NTA0ODA1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=3gPXwiUPMX8Q7kNvwEsk4oV&_nc_oc=Adps6VqnHurelgiuREfS1ypUPCk8-Zqd8OiZbmPZBE-1FKG72RSnhXAQszS6axNuDd2y79wrQkk-mwt5We897JCm&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=qkzpiibmxhOrA7vZ4005GQ&_nc_ss=7a22e&oh=00_Af0FqCUA2At-oUH8BEUjb0UcyD28J6ZG040Djo2-pPeeSg&oe=69F408EA"
			
        ]
    },
    {
        id: "set3",
        images: [
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/649080583_18361496887207890_1118029884908727445_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzg0ODM1NzMyNzA5MjE0MDAwMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=MqIOnzJagNEQ7kNvwFf2trL&_nc_oc=Adps8KYrLTZIuN0HMRZxKdZ3jmnrIGZ6dgJ1vM4khK4H9NGFh5l2DIe6uZU5RFcqCSzA3nf1nbNnrp23_wcUXpSJ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af3-CB-gBgvVJl0CZDg0MnMwh0Cq59rvVor8qdQs8Y7iaQ&oe=69F44096",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/642598975_18361496920207890_2912273645753341348_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=Mzg0ODM1NzMyNzE1MDg5NTkyNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=bAu5qL9NxbEQ7kNvwEkh6So&_nc_oc=AdoKIPG6UU1tJJIVSl-2e-gyBmO5PubTZclONq58WMhIX71LbybnOahkll4TUo1QYUFmcztW91-KNYBnZpX5mYmb&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af1Hf5Y43Ni3_Skwtf--SiYIgfB6JRm_-dD0sO3nih2o6A&oe=69F41D79",
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/645554773_18361496935207890_8896677970766433131_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzg0ODM1NzMyNzEwMDU0MDEyMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=EAhhjfEc4jcQ7kNvwFgh6kM&_nc_oc=AdrihOuPUQvSZlzto946pS7H_Y5Yiub_nhBkUoWahn448KEEgzbQtWJc5ZrdyLbPWoJEMVUk-pS5RxVEBlVfevDa&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=Ty5MMg3X20j13JIh_u2Y0g&_nc_ss=7a22e&oh=00_Af2_B-cbUV6g8dVo4hcyCGf-92AA0B2MCsA0xBG0Rfb89g&oe=69F4252A"
		]
    }
];

let currentGalPage = 1;
const itemsPerPage = 4;
let currentSet = [];
let currentImgIdx = 0;

const winViewer = document.getElementById('win-viewer');
const viewerImg = document.getElementById('viewer-img');
const viewerCounter = document.getElementById('viewer-counter');

function renderGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';
    
    const totalPages = Math.ceil(galleryData.length / itemsPerPage) || 1;
    const startIdx = (currentGalPage - 1) * itemsPerPage;
    const pageItems = galleryData.slice(startIdx, startIdx + itemsPerPage);

    pageItems.forEach(item => {
        const coverImg = item.images[0];
        const col = document.createElement('div');
        col.className = 'col-6';
        col.innerHTML = `<img src="${coverImg}" class="img-fluid rounded border-pink gallery-thumb" data-id="${item.id}">`;
        container.appendChild(col);
    });

    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            // เช็คว่าถ้าเปิด Viewer อยู่ ห้ามคลิกซ้อน
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

    document.getElementById('gal-page-info').textContent = `${currentGalPage}/${totalPages}`;
    
    const btnPrev = document.getElementById('gal-prev');
    const btnNext = document.getElementById('gal-next');
    
    if (currentGalPage === 1) btnPrev.classList.add('disabled');
    else btnPrev.classList.remove('disabled');

    if (currentGalPage === totalPages) btnNext.classList.add('disabled');
    else btnNext.classList.remove('disabled');
}

// 💥 เงื่อนไขเช็คว่าถ้าเปิด VIEWER อยู่ ห้ามกดเลื่อนหน้าแกลลอรี่
document.getElementById('gal-prev').addEventListener('click', () => {
    if (!winViewer.classList.contains('d-none')) return; 
    if (currentGalPage > 1) { currentGalPage--; renderGallery(); playClick(); }
});

document.getElementById('gal-next').addEventListener('click', () => {
    if (!winViewer.classList.contains('d-none')) return; 
    const totalPages = Math.ceil(galleryData.length / itemsPerPage);
    if (currentGalPage < totalPages) { currentGalPage++; renderGallery(); playClick(); }
});

function updateViewer() {
    viewerImg.src = currentSet[currentImgIdx];
    viewerCounter.textContent = `${currentImgIdx + 1}/${currentSet.length}`;
    document.getElementById('btn-prev').style.display = currentSet.length > 1 ? 'flex' : 'none';
    document.getElementById('btn-next').style.display = currentSet.length > 1 ? 'flex' : 'none';
}

document.getElementById('btn-prev').addEventListener('click', () => {
    currentImgIdx = (currentImgIdx - 1 + currentSet.length) % currentSet.length;
    updateViewer();
    playClick();
});

document.getElementById('btn-next').addEventListener('click', () => {
    currentImgIdx = (currentImgIdx + 1) % currentSet.length;
    updateViewer();
    playClick();
});

document.querySelector('.close-viewer').addEventListener('click', (e) => {
    e.stopPropagation();
    winViewer.classList.add('d-none');
    playClick();
});

// ==========================================
// 💥 NEW: MOVING POINTS BACKGROUND
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
        this.size = Math.random() * 2 + 1; // 1-3px small dots
        this.speedX = Math.random() * 0.5 + 0.1; // slow drift right
        this.speedY = -(Math.random() * 0.5 + 0.1); // slow drift up
        // Use soft pink color from theme
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--pink');
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if off-screen (creates infinite loop)
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 8000; // Density
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    if (!document.getElementById('intro-overlay').classList.contains('d-none')) {
        // Don't animate while intro is showing to save resources
        requestAnimationFrame(animateParticles);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// 7. Window System
const wins = document.querySelectorAll('.win:not(#win-viewer)');
const tIcons = document.querySelectorAll('.t-icon');

function showWin(id) {
    // 💥 ปิด Viewer อัตโนมัติถ้าจะสลับไปหน้าต่างอื่น
    if (!winViewer.classList.contains('d-none')) {
        winViewer.classList.add('d-none');
    }

    wins.forEach(w => w.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) {
        target.classList.remove('d-none');
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

// 8. Time System
function updateSystemTime() {
    const d = new Date();
    clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    const day = String(d.getDate()).padStart(2,'0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    dateDisplay.textContent = `${day} ${month}`;
}

// 9. Init Init
startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('d-none'); });
document.addEventListener('click', () => startMenu.classList.add('d-none'));

window.addEventListener('load', () => {
    renderGallery(); // Render gallery on load
    resizeCanvas(); // Set initial canvas size
    initParticles(); // Set up particles
    animateParticles(); // Start animation loop
    
    const intro = document.getElementById('intro-overlay');
    const introText = intro.querySelector('p');
    const spinner = intro.querySelector('.spinner-border');

    // [แก้บั๊กเสียง] รอให้ผู้ใช้คลิกเพื่อปลดล็อก Audio (Autoplay Policy)
    spinner.classList.add('d-none');
    introText.innerHTML = '> CLICK TO BOOT SYSTEM <';
    introText.classList.add('blink-cursor');
    intro.style.cursor = 'pointer';

    intro.addEventListener('click', () => {
        // ปลดล็อกระบบเสียงทันทีที่คลิก
        if (audio.state === 'suspended') audio.resume();
        playClick(); // เสียงตื๊ด 1 ทีตอบรับการกด

        // เริ่มแสดง Loading
        spinner.classList.remove('d-none');
        introText.classList.remove('blink-cursor');
        introText.innerHTML = 'SECURE BOOTING...';
        intro.style.cursor = 'default';

        // เข้าสู่หน้าเว็บ
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

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

setInterval(updateSystemTime, 1000);
updateSystemTime();

modeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    modeSwitch.innerHTML = document.body.classList.contains('light-mode') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    initParticles(); // Re-init to update particle colors based on new theme
});