// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Floating Hearts Effect
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Create hearts periodically
setInterval(createHeart, 800);

// Form Submission Handling
const nokuForm = document.getElementById('nokuForm');
const thankYou = document.getElementById('thankYou');
const submitBtn = document.getElementById('submitBtn');

nokuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Capture data
    const formData = new FormData(nokuForm);
    const data = {
        timestamp: new Date().toLocaleString(),
        mood: document.getElementById('mood').value,
        wants: document.getElementById('wants').value,
        feelings: document.getElementById('feelings').value
    };

    // Save to localStorage for local view
    const existingResponses = JSON.parse(localStorage.getItem('noku_responses') || '[]');
    existingResponses.push(data);
    localStorage.setItem('noku_responses', JSON.stringify(existingResponses));

    // Send to Formspree
    try {
        const response = await fetch(nokuForm.action, {
            method: nokuForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // UI Feedback
            nokuForm.style.opacity = '0';
            setTimeout(() => {
                nokuForm.style.display = 'none';
                thankYou.style.display = 'block';
                thankYou.style.opacity = '1';
            }, 500);
            
            // Special effect on submit
            for(let i=0; i<30; i++) {
                setTimeout(createHeart, i * 100);
            }
        } else {
            alert("Oops! There was a problem sending your message. Please try again.");
            submitBtn.textContent = 'Send to My Heart';
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("Oops! There was a network error. Please try again.");
        submitBtn.textContent = 'Send to My Heart';
        submitBtn.disabled = false;
    }
});

// Admin view triggering
let heartClicks = 0;
const mainHeart = document.querySelector('.heart-bg');
const adminPanel = document.getElementById('adminPanel');
const responsesContainer = document.getElementById('responsesContainer');

mainHeart.addEventListener('click', () => {
    heartClicks++;
    if (heartClicks === 5) {
        showAdminPanel();
        heartClicks = 0;
    }
});

function showAdminPanel() {
    const responses = JSON.parse(localStorage.getItem('noku_responses') || '[]');
    adminPanel.style.display = 'block';
    
    if (responses.length === 0) {
        responsesContainer.innerHTML = '<p>No responses yet! ❤️</p>';
    } else {
        responsesContainer.innerHTML = responses.map((r, i) => `
            <div style="margin-bottom: 20px; padding: 15px; border-bottom: 1px solid var(--glass-border);">
                <p style="font-size: 0.8rem; color: var(--accent-pink);">#${i + 1} - ${r.timestamp}</p>
                <p><strong>How are you feeling:</strong> ${r.mood}</p>
                <p><strong>What you want:</strong> ${r.wants}</p>
                <p><strong>How you feel about us:</strong> ${r.feelings}</p>
            </div>
        `).join('');
    }
}

// Admin view for the USER to see responses (Press 'R' key)
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        showAdminPanel();
    }
});

console.log("%cNoku's Love Page Loaded", "color: #ff69b4; font-size: 20px; font-weight: bold;");
console.log("Tip: Press 'R' on this page to view her responses.");
