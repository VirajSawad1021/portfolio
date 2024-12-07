// main.js
// Initialize AOS
AOS.init({
    duration: 100,
    once: true,
    offset: 100
});

// Show more functionality
document.getElementById("show-more").addEventListener("click", function() {
    const content = document.getElementById("about-content");
    const button = document.getElementById("show-more");
    
    content.classList.toggle("expanded");
    button.textContent = content.classList.contains("expanded") ? "Show Less" : "Show More";
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// particles-config.js
particlesJS("particles-js", {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.5
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            push: {
                particles_nb: 4
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});