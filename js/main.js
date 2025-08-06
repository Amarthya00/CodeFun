@@ .. @@
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
+    
+    // Initialize gaming effects
+    initGamingEffects();
+    
+    // Show welcome achievement
+    setTimeout(() => {
+        showAchievement('Welcome to CodeFun!', 'Ready to start your coding adventure?', 'trophy');
+    }, 2000);
+}
+
+// Initialize gaming effects
+function initGamingEffects() {
+    // Add click effects to buttons
+    document.querySelectorAll('.btn').forEach(btn => {
+        btn.addEventListener('click', function(e) {
+            createClickEffect(e.clientX, e.clientY);
+        });
+    });
+    
+    // Add hover sound effects (visual feedback)
+    document.querySelectorAll('.section-button, .challenge-card').forEach(card => {
+        card.addEventListener('mouseenter', function() {
+            this.style.transform = 'translateY(-10px) scale(1.02)';
+            createHoverParticles(this);
+        });
+        
+        card.addEventListener('mouseleave', function() {
+            this.style.transform = '';
+        });
+    });
+    
+    // Animate level progress on scroll
+    animateLevelProgress();
+}
+
+// Create click effect
+function createClickEffect(x, y) {
+    const effect = document.createElement('div');
+    effect.style.cssText = `
+        position: fixed;
+        top: ${y}px;
+        left: ${x}px;
+        width: 20px;
+        height: 20px;
+        background: radial-gradient(circle, #ff0080, transparent);
+        border-radius: 50%;
+        pointer-events: none;
+        z-index: 9999;
+        animation: clickRipple 0.6s ease-out forwards;
+    `;
+    
+    document.body.appendChild(effect);
+    
+    setTimeout(() => {
+        document.body.removeChild(effect);
+    }, 600);
+}
+
+// Add click ripple animation
+const style = document.createElement('style');
+style.textContent = `
+    @keyframes clickRipple {
+        0% {
+            transform: translate(-50%, -50%) scale(0);
+            opacity: 1;
+        }
+        100% {
+            transform: translate(-50%, -50%) scale(4);
+            opacity: 0;
+        }
+    }
+`;
+document.head.appendChild(style);
+
+// Create hover particles
+function createHoverParticles(element) {
+    const rect = element.getBoundingClientRect();
+    
+    for (let i = 0; i < 5; i++) {
+        const particle = document.createElement('div');
+        particle.style.cssText = `
+            position: absolute;
+            top: ${rect.top + Math.random() * rect.height}px;
+            left: ${rect.left + Math.random() * rect.width}px;
+            width: 4px;
+            height: 4px;
+            background: linear-gradient(45deg, #ff0080, #00ff80);
+            border-radius: 50%;
+            pointer-events: none;
+            z-index: 1000;
+            animation: particleFloat 1s ease-out forwards;
+        `;
+        
+        document.body.appendChild(particle);
+        
+        setTimeout(() => {
+            if (document.body.contains(particle)) {
+                document.body.removeChild(particle);
+            }
+        }, 1000);
+    }
+}
+
+// Add particle float animation
+const particleStyle = document.createElement('style');
+particleStyle.textContent = `
+    @keyframes particleFloat {
+        0% {
+            transform: translateY(0) scale(1);
+            opacity: 1;
+        }
+        100% {
+            transform: translateY(-50px) scale(0);
+            opacity: 0;
+        }
+    }
+`;
+document.head.appendChild(particleStyle);
+
+// Animate level progress
+function animateLevelProgress() {
+    const progressBar = document.querySelector('.level-progress-bar');
+    if (progressBar) {
+        let progress = 0;
+        const targetProgress = 65;
+        
+        const animateProgress = () => {
+            if (progress < targetProgress) {
+                progress += 1;
+                progressBar.style.width = progress + '%';
+                requestAnimationFrame(animateProgress);
+            }
+        };
+        
+        setTimeout(animateProgress, 1000);
+    }
+}
+
+// Show achievement notification
+function showAchievement(title, description, icon) {
+    const achievement = document.createElement('div');
+    achievement.className = 'achievement show';
+    achievement.innerHTML = `
+        <div class="achievement-icon">
+            <i class="fas fa-${icon}"></i>
+        </div>
+        <div class="achievement-content">
+            <div class="achievement-title">${title}</div>
+            <div class="achievement-description">${description}</div>
+        </div>
+    `;
+    
+    document.body.appendChild(achievement);
+    
+    // Position it properly
+    achievement.style.cssText += `
+        position: fixed;
+        bottom: 20px;
+        right: 20px;
+        z-index: 1000;
+    `;
+    
+    // Remove after 4 seconds
+    setTimeout(() => {
+        achievement.classList.remove('show');
+        setTimeout(() => {
+            if (document.body.contains(achievement)) {
+                document.body.removeChild(achievement);
+            }
+        }, 500);
+    }, 4000);
 }