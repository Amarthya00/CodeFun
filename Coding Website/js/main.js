// Main JavaScript file for CodeFun Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application when the DOM is fully loaded
    initApp();
});

function initApp() {
    // Add scroll event listener for header
    handleHeaderScroll();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScroll();
    
    // Add animation to challenge cards
    animateChallengeCards();
    
    // Initialize the demo code editor if it exists on the page
    initDemoCodeEditor();
    
    // Initialize theme toggle
    initThemeToggle();
}

// Handle header styling on scroll
function handleHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Initialize theme toggle functionality
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (!themeToggleBtn) return;
    
    console.log('Theme toggle button found:', themeToggleBtn);
    
    // Check if there's a saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Initialize the icon based on current theme
    updateThemeIcon();
    
    // Add click event listener to the theme toggle button
    themeToggleBtn.addEventListener('click', function() {
        console.log('Theme toggle button clicked');
        
        // Toggle the light-theme class on the body
        document.body.classList.toggle('light-theme');
        
        // Save the current theme preference to localStorage
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        // Update the icon
        updateThemeIcon();
        
        console.log('Theme changed to:', currentTheme);
    });
}

// Update the theme toggle icon based on current theme
function updateThemeIcon() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (themeToggleBtn) {
        // Clear existing icon
        while (themeToggleBtn.firstChild) {
            themeToggleBtn.removeChild(themeToggleBtn.firstChild);
        }
        
        // Add the appropriate icon based on the current theme
        const icon = document.createElement('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
        themeToggleBtn.appendChild(icon);
    }
}

// Initialize smooth scrolling for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a, .cta-buttons a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to links that start with #
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Skip if it's just #
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Smooth scroll to the element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY + 100; // Offset
        
        document.querySelectorAll('section').forEach(section => {
            if (section.offsetTop <= scrollPosition && 
                section.offsetTop + section.offsetHeight > scrollPosition) {
                
                const currentId = '#' + section.getAttribute('id');
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === currentId) {
                        navLink.classList.add('active');
                    }
                });
            }
        });
    });
}

// Add animation to challenge cards
function animateChallengeCards() {
    const cards = document.querySelectorAll('.challenge-card');
    
    cards.forEach((card, index) => {
        // Add a slight delay to each card for a staggered effect
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

// Initialize the demo code editor if it exists
function initDemoCodeEditor() {
    const demoEditor = document.getElementById('demo-code-editor');
    
    if (demoEditor) {
        // This is a simple demo editor. In a real application, you might use
        // a library like CodeMirror, Ace Editor, or Monaco Editor.
        
        const codeInput = demoEditor.querySelector('.code-input');
        const runButton = demoEditor.querySelector('.run-button');
        const outputDisplay = demoEditor.querySelector('.output-display');
        
        if (codeInput && runButton && outputDisplay) {
            runButton.addEventListener('click', function() {
                try {
                    // For demo purposes, we're using a very simple evaluation
                    // In a real application, you would use a sandboxed environment
                    // or send the code to a backend for execution
                    const code = codeInput.value;
                    
                    // Create a sandbox for safer evaluation
                    const sandbox = {
                        console: {
                            log: function(message) {
                                return message;
                            }
                        },
                        result: ''
                    };
                    
                    // Replace console.log with our custom function
                    const modifiedCode = code.replace(
                        /console\.log\(([^)]*)\)/g, 
                        'result += console.log($1) + "\\n"'
                    );
                    
                    // Execute the code in the context of the sandbox
                    Function('sandbox', `with(sandbox){${modifiedCode}}`)(sandbox);
                    
                    // Display the result
                    outputDisplay.innerHTML = sandbox.result || 'Code executed successfully!';
                    outputDisplay.classList.remove('error');
                } catch (error) {
                    // Display any errors
                    outputDisplay.innerHTML = `Error: ${error.message}`;
                    outputDisplay.classList.add('error');
                }
            });
        }
    }
}

// Function to handle the challenge difficulty filter
function filterChallenges(difficulty) {
    const allChallenges = document.querySelectorAll('.challenge-card');
    
    if (difficulty === 'all') {
        allChallenges.forEach(challenge => {
            challenge.style.display = 'block';
        });
    } else {
        allChallenges.forEach(challenge => {
            if (challenge.querySelector(`.${difficulty}`)) {
                challenge.style.display = 'block';
            } else {
                challenge.style.display = 'none';
            }
        });
    }
}

// Function to show a congratulations message when a challenge is completed
function showCongratulations(points) {
    const congratsModal = document.createElement('div');
    congratsModal.className = 'congrats-modal';
    
    congratsModal.innerHTML = `
        <div class="congrats-content">
            <h2>Congratulations! 🎉</h2>
            <p>You've successfully completed the challenge!</p>
            <p>You earned <span class="points">${points}</span> points!</p>
            <button class="btn btn-primary close-modal">Continue</button>
        </div>
    `;
    
    document.body.appendChild(congratsModal);
    
    // Add animation class after a small delay to trigger the animation
    setTimeout(() => {
        congratsModal.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    const closeButton = congratsModal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        congratsModal.classList.remove('show');
        
        // Remove the modal after the animation completes
        setTimeout(() => {
            document.body.removeChild(congratsModal);
        }, 300);
    });
}

// Function to track user progress (simplified version)
function trackProgress(challengeId, completed) {
    // In a real application, this would send data to a server
    // For now, we'll just store it in localStorage
    
    let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    
    if (!userProgress.challenges) {
        userProgress.challenges = {};
    }
    
    userProgress.challenges[challengeId] = {
        completed: completed,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    
    // Update UI to reflect progress
    updateProgressUI();
}

// Function to update the UI based on user progress
function updateProgressUI() {
    const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    challengeCards.forEach(card => {
        const challengeId = card.getAttribute('data-challenge-id');
        
        if (challengeId && userProgress.challenges && userProgress.challenges[challengeId] && 
            userProgress.challenges[challengeId].completed) {
            
            // Add a completed badge to the card
            if (!card.querySelector('.completed-badge')) {
                const badge = document.createElement('div');
                badge.className = 'completed-badge';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                card.appendChild(badge);
            }
        }
    });
}