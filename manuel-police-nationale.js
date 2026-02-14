cat > /mnt/user-data/outputs/manuel-police-nationale.js << 'JSEOF'
// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initScrollEffects();
    initScrollTopButton();
    initSmoothScrolling();
    initReadingProgress();
    
    console.log('📖 Manuel de la Police Nationale initialisé');
    console.log('%c🇫🇷 Police Nationale - République Française', 'color: #5ba3f5; font-size: 20px; font-weight: bold;');
    console.log('%c"Protéger et servir"', 'color: #FFD700; font-size: 16px; font-style: italic;');
});

// Gestion du scroll
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer tous les éléments
    const elements = document.querySelectorAll('.content-section, .pilier-card, .protocol-card');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Bouton retour en haut
function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scrolling pour les liens d'ancre
function initSmoothScrolling() {
    const tocLinks = document.querySelectorAll('.toc-item');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Animation flash
                targetElement.style.transition = 'background 0.5s ease';
                const originalBg = targetElement.style.background;
                targetElement.style.background = 'rgba(91, 163, 245, 0.2)';
                
                setTimeout(() => {
                    targetElement.style.background = originalBg;
                }, 1000);
            }
        });
    });
}

// Barre de progression de lecture
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'readingProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #5ba3f5 0%, #9c27b0 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        info: '#5ba3f5',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Impression optimisée
function printManuel() {
    window.print();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P pour imprimer
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printManuel();
    }
    
    // Échap pour retour en haut
    if (e.key === 'Escape') {
        scrollToTop();
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Manuel chargé en ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Temps de chargement lent détecté');
    }
});

// Message de bienvenue
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('%c   MANUEL DE LA POLICE NATIONALE 2026 ', 'color: #FFD700; font-size: 14px; font-weight: bold;');
console.log('%c   République Française                ', 'color: #5ba3f5; font-size: 12px;');
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('%c   "Protéger et servir"                ', 'color: #FFD700; font-style: italic;');
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('');
console.log('📋 Commandes disponibles:');
console.log('  - scrollToTop() : Retour en haut de page');
console.log('  - printManuel() : Imprimer le manuel');
console.log('');

// Exposer fonctions pour usage console
window.manuelPN = {
    scrollTop: scrollToTop,
    print: printManuel
};
JSEOF
echo "✅ JavaScript créé avec succès !"
