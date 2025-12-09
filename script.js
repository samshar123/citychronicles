// ==========================================
// 1. YOUR EXISTING UI CODE (Animations, Video, Menu)
// ==========================================

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

const elements = document.querySelectorAll('.fade-in, .reveal-up, .reveal-left, .reveal-right');
elements.forEach(el => observer.observe(el));

// Video Player Logic
const videoSection = document.getElementById('video');
const playBtn = document.getElementById('play-btn');
const playerContainer = document.getElementById('video-player');

// Safety check: Only run video logic if the button exists on this page
if (playBtn) {
    playBtn.addEventListener('click', () => {
        // 1. Get the video ID from the HTML
        const videoId = videoSection.getAttribute('data-video-id');
        
        // 2. Create the YouTube Iframe URL
        const iframeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&controls=1`;
        
        // 3. Inject the iframe
        playerContainer.innerHTML = `<iframe src="${iframeUrl}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        
        // 4. Hide the cover image and text
        videoSection.classList.add('playing');
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '70px';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = '#fff';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // 1. FETCH THE JSON FILE
    // This only works if you use "Live Server"
    fetch('packages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(packagesData => {
            // Data loaded successfully! Now let's use it.
            
            // --- A. HOME PAGE LOGIC (First 3 items) ---
            const homeContainer = document.getElementById('home-packages-container');
            if (homeContainer) {
                homeContainer.innerHTML = ''; 
                packagesData.slice(0, 3).forEach(pkg => {
                    homeContainer.innerHTML += createCardHTML(pkg);
                });
            }

            // --- B. ALL PACKAGES PAGE LOGIC (All items) ---
            const allPackagesContainer = document.getElementById('all-packages-container');
            if (allPackagesContainer) {
                allPackagesContainer.innerHTML = '';
                packagesData.forEach(pkg => {
                    allPackagesContainer.innerHTML += createCardHTML(pkg);
                });
            }

            // --- C. DETAILS PAGE LOGIC (Specific item) ---
            const detailTitle = document.getElementById('pkg-title');
            if (detailTitle) {
                const params = new URLSearchParams(window.location.search);
                const id = params.get('id');
                const pkg = packagesData.find(p => p.id === id);

                if (pkg) {
                    fillDetailsPage(pkg);
                } else {
                    document.querySelector('.detail-content').innerHTML = "<h2>Package not found.</h2>";
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Alert user if they aren't using a server
            const homeContainer = document.getElementById('home-packages-container');
            if(homeContainer) {
                homeContainer.innerHTML = `<p style="text-align:center; color:red;">
                    <b>Error:</b> Cannot read packages.json.<br>
                    Please use <b>"Open with Live Server"</b> in VS Code.
                </p>`;
            }
        });
});

// --- HELPER 1: Create Card HTML ---
function createCardHTML(pkg) {
    return `
        <article class="trip-card reveal-up" style="opacity: 1; transform: translateY(0);">
            <div class="card-media">
                <img src="${pkg.image}" alt="${pkg.title}">
                <div class="price-pill">${pkg.price}</div>
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span><i class="far fa-clock"></i> ${pkg.duration}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                </div>
                <h3>${pkg.title}</h3>
                <p>${pkg.overview.substring(0, 80)}...</p>
                <a href="package-details.html?id=${pkg.id}" class="card-link">
                    Explore More <i class="fas fa-long-arrow-alt-right"></i>
                </a>
            </div>
        </article>
    `;
}

// --- HELPER 2: Fill Details Page ---
function fillDetailsPage(pkg) {
    document.getElementById('pkg-bg-img').src = pkg.heroImage;
    document.getElementById('pkg-tag').textContent = pkg.tag;
    document.getElementById('pkg-title').textContent = pkg.title;
    document.getElementById('pkg-duration').innerHTML = `<i class="far fa-clock"></i> ${pkg.duration}`;
    document.getElementById('pkg-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${pkg.location}`;
    document.getElementById('pkg-overview').textContent = pkg.overview;
    document.getElementById('pkg-price').textContent = pkg.price;

    // Render Itinerary
    const timeline = document.getElementById('pkg-timeline');
    timeline.innerHTML = '';
    pkg.itinerary.forEach(day => {
        timeline.innerHTML += `
            <div class="day-item">
                <div class="day-number">${day.day}</div>
                <div class="day-info">
                    <h3>${day.title}</h3>
                    <p>${day.desc}</p>
                </div>
            </div>
        `;
    });

    // --- NEW: Render Gallery ---
    const galleryContainer = document.getElementById('pkg-gallery');
    if (galleryContainer && pkg.gallery) {
        galleryContainer.innerHTML = ''; // Clear previous
        pkg.gallery.forEach(imgUrl => {
            galleryContainer.innerHTML += `<img src="${imgUrl}" alt="Gallery Image">`;
        });
    }
}