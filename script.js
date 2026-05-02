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
    },
    {
        id: "set4",
        images: [
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/639824877_18360360574207890_5005730290783639630_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzg0MTcxOTQxMTIwNTA2MjA2NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=yLy9SdysVh4Q7kNvwFV_M-m&_nc_oc=AdqlrlypOyuKmSofZfndIvBp3JXWupTCT_5GnA2laZe9b9NkaMeMqbr-hVRSu9rTPx95mzPFGJl5xqqSKz4mK2kK&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af3fW4Qro4SNBag4k1PJ26z92J2KzWgViGRCtwn_JxwVmQ&oe=69F576EF",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/641754838_18360360598207890_1083698472760922000_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=Mzg0MTcxOTQxMTIwNTAzNjIxNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxMS5zZHIuQzMifQ%3D%3D&_nc_ohc=eGJkTMcNVMgQ7kNvwG2i0PE&_nc_oc=Adon4-jw4QLdjxKKeZ69OzbDS2l8hjS_xKqaPnbqvGOl1Q8mg2U6wd4GH4UEQaDZSiA9ZBCYz-7Zna1q0n5mnFh3&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2ML6pVJ8ULC3kMsUPJYg5VQx6m2OKMcJUpRcTK_xkxsg&oe=69F55DC5",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/641040961_18360360601207890_8678781541451035095_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg0MTcxOTQxMTI0NzAwMjM3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=k-jnEME1ZREQ7kNvwG3suvf&_nc_oc=Adpa3bijzA1ttClkI33yapZCVDxKpZk43m6zr4X7zwAUz2mHtNe7iy7UmTONeq9NrWSLe9YcJgjPRLY7uliRHYKs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af3Z7TKBVt-ASPIgHv06t0MI9xfijUnO9gbZXrw4pG885A&oe=69F575A7",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/641255221_18360360595207890_2394427404271492752_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg0MTcxOTQxMTIwNTAyNTg0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=fYweQrw2XaAQ7kNvwFOoSaf&_nc_oc=Adq-a7i7qKwfEo0NxXGepjAtyuvOC15mKEZQZN0t5i9yagVQ1-WcX2jy2oyrNlwxB7D8StCnlSBLMl4Zp1oxsE-2&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af1EEERmwJiB6eNiziUst6Fn3oCVj_RXGF7WHBf2ycIdJg&oe=69F588CE"
            
		]
    },
    {
        id: "set6",
        images: [
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/641302357_18360011830207890_2993776893251213137_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzgzOTUwNDU0NzE4NjM0OTg0OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxNy5zZHIuQzMifQ%3D%3D&_nc_ohc=Ej4yqjDBywEQ7kNvwEow1aa&_nc_oc=AdpFvzRKBsqb4lB0VwGP5GSikMlgTWd1LISlC1W7O2ehGR_873-_t82BsI6VgNCD-IaRL_NhXlamSCtDxcvxQqwm&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2EXESUrctP05dOajpcqeYEcjphUt1GvO2q_iQaZoGOOg&oe=69F58609",
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/640003928_18360011821207890_6685970201584221730_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgzOTUwNDU0NTY2ODA2NjU1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxNy5zZHIuQzMifQ%3D%3D&_nc_ohc=J2n4lq2Qyu4Q7kNvwH31mwT&_nc_oc=AdpxlaTb1rygRWDeO9BxJC4G8yZP74xDaGdIy-YqnNTYFH6jIuSbxgTpjh9VEPjZzRaZwjOGsNMBIHslggOrXBp_&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af1ayBCt0sVtynqWm5xKO63VBzxT_-8tBf6nZ6sMV1Nxig&oe=69F58118",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/627216044_18360011818207890_4957694016758346599_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=MzgzOTUwNDU0NjY5OTgzNTIxNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxNy5zZHIuQzMifQ%3D%3D&_nc_ohc=iIghJCsaZtsQ7kNvwG3WVcf&_nc_oc=AdqpOGSU2ePveQsyryVDSMARE0QaupPy2KDl4qHZSfqKpZSCY2bO8ml6-gJf1cSPi8Qp5sQQkQtLz9cecsjkCA1o&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af0aDk1DRq5QdI8gxUzDx_gE3W1Qv7D-6etWeyO2GinyhA&oe=69F58CCD",
		]
    },
    {
        id: "set7",
        images: [
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/635531335_18359051551207890_7808179015630235137_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzgzMzEzMjQ3ODYwOTY0NDA4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY4Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=1szevt2dapkQ7kNvwF_sQ8C&_nc_oc=Ado3R527FSAMgbgGI2J9_IBUxdcS87OcXEBZKFzeh_cSo3UwksOUud-xALH1PdUlJBgEblgMbOJqL-it2IeRtQ04&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af1msazoL_yu-1Bw0rOzMklxrH1Hv54OjstF5oj-XuXonQ&oe=69F559D8",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/641754838_18360360598207890_1083698472760922000_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=Mzg0MTcxOTQxMTIwNTAzNjIxNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxMS5zZHIuQzMifQ%3D%3D&_nc_ohc=eGJkTMcNVMgQ7kNvwG2i0PE&_nc_oc=Adon4-jw4QLdjxKKeZ69OzbDS2l8hjS_xKqaPnbqvGOl1Q8mg2U6wd4GH4UEQaDZSiA9ZBCYz-7Zna1q0n5mnFh3&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2ML6pVJ8ULC3kMsUPJYg5VQx6m2OKMcJUpRcTK_xkxsg&oe=69F55DC5",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/641040961_18360360601207890_8678781541451035095_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg0MTcxOTQxMTI0NzAwMjM3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=k-jnEME1ZREQ7kNvwG3suvf&_nc_oc=Adpa3bijzA1ttClkI33yapZCVDxKpZk43m6zr4X7zwAUz2mHtNe7iy7UmTONeq9NrWSLe9YcJgjPRLY7uliRHYKs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af3Z7TKBVt-ASPIgHv06t0MI9xfijUnO9gbZXrw4pG885A&oe=69F575A7"
		]
    },
    {
        id: "set8",
        images: [
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/625050529_18357919249207890_4090277945274016051_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=MzgyNTkxOTU5NzgzMzAxNjU2Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY3Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=eJ3jPieokHgQ7kNvwEtUEl9&_nc_oc=AdoMTj2PK07WlyjUAnG9iglCUeeXCsLr-KvGALISoflQ_JRscuRnxUtRZZq4XbzsWr4nTPNtuibZLP5U4bzTfKS2&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2PxE2lrcasG6_PZTkz7tqinLTTcyhEGhTxO5JvsPz5hQ&oe=69F563CC",
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/625053201_18357919252207890_1176597593241333119_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=MzgyNTkxOTU5NjgwMTE2NTA0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY3Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=Ww93dYBz-4EQ7kNvwFHHHEQ&_nc_oc=AdrLntdOUbeeYMTl4tsBga3CGtNSXbBwH_ZPAmNMJjBN0HTvj1DTpD_CuQtry80kHswY5KAWt7oRZDPmghVVCxRQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af3AEIllnZbx3Hb0sV1nOSBeknlR2_fXA03a5OgCHyzM_A&oe=69F58841",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/625879163_18357919255207890_878282742027510484_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzgyNTkxOTYwMDUzNDE0MzM0Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY3Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=V2rykMbPcYgQ7kNvwHPSLFi&_nc_oc=Ado47UPhYsIGks5_QGTHdoGkKoX6DYplbWFi8ESpHYSyq-AqOtMJICEcIfpTcMtO5zHEs4K-5cHzef-JAds-WwDi&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2s8PqMQsaS42N1fsliOJL3ZCWpBL1fff9Bar7MOLi2iQ&oe=69F5896B"   
		]
    },
    {
        id: "set9",
        images: [
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/624649587_18356816008207890_1566822956881773046_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzgyMjI3NDk0MTMyNTM5MzE0NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=izQE6fkA6csQ7kNvwE1L6JX&_nc_oc=AdriJQ4qAIxz4FLY5o_Z4uO9gf-3ann_tQ_9IkDQsP-d0nOitPaoSSWBGtuvYaPqfRQDod1synBM1rHg3rDYVboZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af1Laku9-P3ZBncrqnrVe6MSuWjoIdug0I06luia8aoNaw&oe=69F57965",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/625195703_18356816017207890_8420037430378308882_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzgyMjI3NDk0MjE4MTAzMDIxMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=uoKrwx1fg58Q7kNvwFWeu4w&_nc_oc=AdrWQ2MvCHjAL4UPqWnkl1ZNoKS4gdkXt4loDjMoN2oEQURH_t7-XVuYceGPKhBZFdaRvbjFLYALoGuEGJtCPMQZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af3Yz-Qle7_Z9l6q5xVM918kTimHjCFJ1Cbk2vX71UqS0A&oe=69F575CC",
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/625044736_18356816026207890_4958255970612462610_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzgyMjI3NDk0MzY0MDY0ODg4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxMS5zZHIuQzMifQ%3D%3D&_nc_ohc=Tx__KymGeIQQ7kNvwFc_CVV&_nc_oc=AdrIgVmlu6hcdQpa7_I9zIcYqQU6u2BjX30af195n5Fn8yWsFh-3nkPgqj0N2G-L4a1OAJ3V-czOYNPJFFAXy6Dz&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af0jLRi3XrbYjbYIjo4E8f_MxF8YEApxhrGtAAVnT4AkNQ&oe=69F56591",
            "https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/625042856_18356816035207890_2988607316681389715_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzgyMjI3NDk0NTI1MTIxODM4OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=BHhNpHQoqYwQ7kNvwH85Xco&_nc_oc=AdpTlayXhYz4f7wExOqpXR8vkpw5BcfMztbBg740kb-X4QxNwhuxjGJZQHECPhBT_49Xb4s-i3r9y8CDXxTT8XXZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2UsENuwqZe0zDL5VEwvsRGwK4xIcoW-WCQSUM0BDCJXg&oe=69F58C26",
            "https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/624069828_18356816044207890_7831185438396018966_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=MzgyMjI3NDk0ODE1MzcyMzUwMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=pP74u7KP8eEQ7kNvwHVlgjF&_nc_oc=AdpCFpybR9p_zq98L8BCfTtgv7rT-zrbyVg4hmnlCeh5ixJOA1deh6gCfFX2Q7eErjjAbIFN56M4YtMGS_xlMqiX&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af28kyC-uv4qjHcTKh3nSG1eOJVNDC-qo1e_Q9MHKDKEow&oe=69F57333"
		]
    },
    {
        id: "set10",
        images: [
			"https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/609967767_18353084848207890_1755866331073324346_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=MzgwMTMwMjI0NDUxMjcxOTE3Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=N_lY3IEiWS4Q7kNvwEqjbkl&_nc_oc=Adp0AH6V_3kTZmeExTsLU-ua0h0HlHhGSbHtiNrFBV6s0SQy-7lEqpJfXDGOoWF25BaL9GI4-FV4Jv61hjOqpGcZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2BTbjdcI-_G_edejPNbXgdw9K49BiCW7MVs6ov2yalSA&oe=69F5621E",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/610588853_18353084863207890_7451636144275205164_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzgwMTMwMjI0NDUyMTEyOTQ0Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=xKSyyI6IX0oQ7kNvwGGIJPK&_nc_oc=AdqMaB-T8AtfuqyTf6nKYXZgVhqrVfY_A2iZWGmwlrJhoFAspy-j_GYMqTMdTCMS5ws59AoYicXt4unggwgEV4GC&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af2-KrIrHzDbPOfGj7UZCnu6I8sWkzKe4UTmuifTz_Co4Q&oe=69F56914",
			"https://instagram.futp1-2.fna.fbcdn.net/v/t51.82787-15/610597421_18353084866207890_5799733595334124664_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MzgwMTMwMjI0NDQ2MjM5Njg1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=n4NDEyyqtRMQ7kNvwFaVwLx&_nc_oc=Ado29GfxqERUq9s4zZgIs6wYdv0s110e8VkrtnClgr3TyFrbGi6kfIcpjwEW3h8hK7ucGxN9Drp4z0iHXns1ZvWV&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-2.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af32HDshyphh0JDgvKbqkdb0mdc0t9hOa7LwYAuL7cFCtw&oe=69F58146",
            "https://instagram.futp1-1.fna.fbcdn.net/v/t51.82787-15/610639641_18353084875207890_854758422203814012_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzgwMTMwMjI0NDQwMzY4MDgyNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=CTGHwxEg5VIQ7kNvwF-si3t&_nc_oc=AdrH6Bkz5O7ryicoRdF0-5alkcej1mz1h_YDTfTmLreh2piCma7CqeDHwfSvq03t7BVIKUE1D2m9dEKq7eg7NrCd&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.futp1-1.fna&_nc_gid=ipyPH5KNaRVlOQGW4B2CXQ&_nc_ss=7a22e&oh=00_Af0Wed-4oHj8VEI-x-Um4nnj36tTrVhm4g9PcF5TmW5BSg&oe=69F58493"
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
