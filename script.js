/**
 * AI | Futuristic Portfolio JS
 * Handles 3D Scenes, Animations, and Interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavbar();
    initThreeJS();
    initScrollAnimations();
    initTiltEffect();
    initStatsCounter();
    initContactForm();
});

// --- Loader ---
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 1000);
    });
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.getElementById('cursor');
    const blur = document.getElementById('cursor-blur');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
        gsap.to(blur, {
            x: e.clientX,
            y: e.clientY,
            duration: 1.5,
            ease: "power2.out"
        });
    });

    // Hover effects on interactive elements
    const interactive = document.querySelectorAll('a, button, .skill-card, .project-card, .service-card, .hamburger');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.background = 'rgba(0, 242, 255, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--accent-cyan)';
        });
    });
}

// --- Navbar ---
function initNavbar() {
    const nav = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// --- Three.js 3D Engine ---
let scene, camera, renderer, particles, heroObject;
let mouseX = 0, mouseY = 0;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 1. Background Particles (Stars/Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.5
    });
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 2. Hero 3D Object (Icosahedron with Wireframe)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0xbc13fe,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });
    heroObject = new THREE.Mesh(geometry, material);
    
    // Add a core inside the wireframe
    const coreGeo = new THREE.IcosahedronGeometry(1, 0);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x00f2ff,
        emissive: 0x00f2ff,
        emissiveIntensity: 0.5,
        flatShading: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    heroObject.add(core);

    scene.add(heroObject);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2ff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xbc13fe, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Movement Interaction
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Touch Movement Interaction
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / window.innerWidth) - 0.5;
            mouseY = (e.touches[0].clientY / window.innerHeight) - 0.5;
        }
    });

    // Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Orbit 3D Object
    heroObject.rotation.y += 0.005;
    heroObject.rotation.x += 0.003;

    // React to Mouse
    gsap.to(heroObject.rotation, {
        x: mouseY * 1,
        y: mouseX * 1,
        duration: 2,
        ease: "power2.out"
    });

    // Rotate Particles
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Parallax effect for background
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// --- Scroll Animations ---
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal blocks on scroll
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Section Title stagger
    gsap.from(".section-title", {
        x: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: ".section-title",
            start: "top 90%",
        }
    });
}

// --- 3D Card Tilt Effect ---
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// --- Stats Counter ---
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 1.0 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let count = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        count = Math.floor(easeProgress * target);
        element.innerText = count;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// --- Contact Form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Simulate submission
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = '#00ff88';
            btn.style.color = '#000';
            
            // Reset after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.pointerEvents = 'auto';
                form.reset();
            }, 3000);
        }, 1500);
    });
}
