// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initAnimations();
    initScrollEffects();
    initScrollTopButton();
    initDocumentTracking();
    initStepProgress();
    
    console.log('🚔 Système de recrutement Police Nationale initialisé');
});

// Animations d'entrée pour les éléments
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation spéciale pour les cartes de documents
                if (entry.target.classList.contains('document-card')) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer tous les éléments avec la classe slide-up
    const animatedElements = document.querySelectorAll('.slide-up');
    animatedElements.forEach(el => observer.observe(el));
}

// Effets de scroll
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Effet parallaxe sur le header
        if (currentScroll < 500) {
            header.style.transform = `translateY(${currentScroll * 0.5}px)`;
            header.style.opacity = 1 - (currentScroll / 500);
        }
        
        lastScroll = currentScroll;
    });
}

// Bouton retour en haut
function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
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

// Système de suivi des documents
function initDocumentTracking() {
    const documentCards = document.querySelectorAll('.document-card');
    const documentsRead = JSON.parse(localStorage.getItem('documentsRead') || '{}');
    
    documentCards.forEach(card => {
        const btn = card.querySelector('.btn-view');
        if (btn && btn.onclick) {
            const docType = btn.onclick.toString().match(/'([^']+)'/)[1];
            
            if (documentsRead[docType]) {
                const badge = document.createElement('div');
                badge.className = 'read-badge';
                badge.innerHTML = '✓ Lu';
                badge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #4caf50;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: bold;
                `;
                card.style.position = 'relative';
                card.appendChild(badge);
            }
        }
    });
}

// Gestion de l'ouverture des documents
function openDocument(docType) {
    console.log(`📄 Ouverture du document: ${docType}`);
    
    // Sauvegarder que le document a été lu
    const documentsRead = JSON.parse(localStorage.getItem('documentsRead') || '{}');
    documentsRead[docType] = true;
    localStorage.setItem('documentsRead', JSON.stringify(documentsRead));
    
    // Afficher une notification
    showNotification(`Document "${getDocumentName(docType)}" ouvert`, 'success');
    
    // Animation du bouton
    const allButtons = document.querySelectorAll('.btn-view');
    allButtons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(docType)) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    });
    
    // Vérifier si tous les documents ont été lus
    checkAllDocumentsRead();
    
    // Ouvrir le document correspondant
    if (docType === 'code') {
        window.open('code-police-nationale.html', '_blank');
    } else if (docType === 'manuel') {
        showNotification('Le Manuel de la Police Nationale sera disponible prochainement', 'info');
    } else if (docType === 'reglement') {
        showNotification('Le Règlement Interne sera disponible prochainement', 'info');
    }
}

// Obtenir le nom complet du document
function getDocumentName(docType) {
    const names = {
        'code': 'Code de la Police Nationale',
        'manuel': 'Manuel de la Police Nationale',
        'reglement': 'Règlement Interne'
    };
    return names[docType] || docType;
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter les animations de notification au CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// Vérifier si tous les documents ont été lus
function checkAllDocumentsRead() {
    const documentsRead = JSON.parse(localStorage.getItem('documentsRead') || '{}');
    const requiredDocs = ['code', 'manuel', 'reglement'];
    const allRead = requiredDocs.every(doc => documentsRead[doc]);
    
    if (allRead && !localStorage.getItem('allDocsReadNotified')) {
        setTimeout(() => {
            showNotification('🎉 Félicitations ! Vous avez lu tous les documents obligatoires', 'success');
            localStorage.setItem('allDocsReadNotified', 'true');
            
            // Animer les étapes
            highlightNextStep();
        }, 500);
    }
}

// Mettre en évidence la prochaine étape
function highlightNextStep() {
    const stepsSection = document.querySelector('.steps-section');
    stepsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        const step2 = document.querySelector('[data-step="2"]');
        step2.style.animation = 'pulse 1s ease-in-out 3';
        step2.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            step2.style.transform = 'scale(1)';
        }, 3000);
    }, 500);
}

// Gestion de la progression des étapes
function initStepProgress() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const stepNumber = index + 1;
            handleStepClick(stepNumber);
        });
    });
}

function handleStepClick(stepNumber) {
    const messages = {
        1: 'Prenez le temps de lire attentivement chaque document. Ils sont essentiels pour votre formation.',
        2: 'La formation à l\'École de Police Nationale est intensive mais enrichissante. Préparez-vous bien !',
        3: 'Une fois intégré, vous ferez partie d\'une équipe dévouée au service de la nation.'
    };
    
    showNotification(messages[stepNumber], 'info');
}

// Effets interactifs sur les cartes
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Compteur de visiteurs (simulation)
function initVisitorCounter() {
    const visitors = localStorage.getItem('visitorCount') || 0;
    const newCount = parseInt(visitors) + 1;
    localStorage.setItem('visitorCount', newCount);
    
    console.log(`👥 Visiteur n°${newCount}`);
}

initVisitorCounter();

// Easter egg : Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('🎮 Code secret activé ! Bienvenue, officier d\'élite !', 'success');
    
    // Effet visuel spécial
    document.body.style.animation = 'pulse 0.5s ease-in-out 3';
    
    const logo = document.querySelector('.logo');
    logo.style.animation = 'rotate 2s linear infinite';
    
    setTimeout(() => {
        logo.style.animation = '';
    }, 5000);
}

// Système de thème (bonus)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Page chargée en ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Temps de chargement lent détecté');
    }
});

// Message de bienvenue dans la console
console.log('%c🚔 Police Nationale - Système de Recrutement', 'color: #1e3c72; font-size: 20px; font-weight: bold;');
console.log('%cBienvenue dans le système de recrutement. Bonne navigation !', 'color: #2a5298; font-size: 14px;');
console.log('%c⚠️ Attention: Ce système est destiné au recrutement officiel uniquement.', 'color: #ff9800; font-size: 12px;');
