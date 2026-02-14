// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initScrollEffects();
    initScrollTopButton();
    initArticleAnimations();
    initSmoothScrolling();
    initReadingProgress();
    initArticleTracking();
    
    console.log('🚔 Code du L.S.P.D initialisé');
    console.log('%c⚖️ LSPD - Los Santos Police Department', 'color: #5ba3f5; font-size: 20px; font-weight: bold;');
    console.log('%c"Protéger et servir"', 'color: #FFD700; font-size: 16px; font-style: italic;');
});

// Gestion du scroll et animations
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer tous les articles
    const articles = document.querySelectorAll('.article');
    articles.forEach(article => {
        article.style.opacity = '0';
        article.style.transform = 'translateX(-30px)';
        article.style.transition = 'all 0.6s ease-out';
        observer.observe(article);
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

// Animations des articles au scroll
function initArticleAnimations() {
    const articles = document.querySelectorAll('.article');
    
    articles.forEach((article, index) => {
        article.style.animationDelay = `${index * 0.05}s`;
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
                const offset = 80; // Décalage pour le header
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Animation flash sur la section
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
    // Créer la barre de progression
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
    
    // Mettre à jour la progression au scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// Système de suivi des articles lus
function initArticleTracking() {
    const articles = document.querySelectorAll('.article');
    const articlesRead = new Set(JSON.parse(localStorage.getItem('lspd_articles_read') || '[]'));
    
    // Marquer les articles déjà lus
    articlesRead.forEach(articleId => {
        const article = document.querySelector(`[data-article-id="${articleId}"]`);
        if (article) {
            markAsRead(article);
        }
    });
    
    // Observer quand un article est lu (visible pendant 3 secondes)
    const readObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const articleId = entry.target.dataset.articleId || generateArticleId(entry.target);
                entry.target.dataset.articleId = articleId;
                
                setTimeout(() => {
                    if (entry.target.getBoundingClientRect().top < window.innerHeight) {
                        articlesRead.add(articleId);
                        localStorage.setItem('lspd_articles_read', JSON.stringify([...articlesRead]));
                        markAsRead(entry.target);
                    }
                }, 3000);
            }
        });
    }, {
        threshold: 0.8
    });
    
    articles.forEach(article => readObserver.observe(article));
}

function generateArticleId(article) {
    const title = article.querySelector('.article-title');
    return title ? title.textContent.trim().substring(0, 20) : Math.random().toString(36).substr(2, 9);
}

function markAsRead(article) {
    if (!article.querySelector('.read-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'read-indicator';
        indicator.innerHTML = '✓ Lu';
        indicator.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #4caf50;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
        `;
        article.style.position = 'relative';
        article.appendChild(indicator);
    }
}

// Recherche dans la page
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher dans le code...';
    searchInput.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border: 2px solid #5ba3f5;
        border-radius: 25px;
        background: rgba(26, 35, 50, 0.9);
        color: white;
        font-size: 1rem;
        outline: none;
        z-index: 1000;
        width: 250px;
    `;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const articles = document.querySelectorAll('.article');
        
        articles.forEach(article => {
            const text = article.textContent.toLowerCase();
            if (text.includes(searchTerm) || searchTerm === '') {
                article.style.display = 'block';
                
                // Highlight le terme recherché
                if (searchTerm !== '') {
                    highlightText(article, searchTerm);
                }
            } else {
                article.style.display = 'none';
            }
        });
    });
    
    document.body.appendChild(searchInput);
}

function highlightText(element, term) {
    // Simple highlight - dans une vraie application, utilisez une bibliothèque
    const content = element.querySelector('.article-content');
    if (content) {
        const originalText = content.dataset.originalText || content.textContent;
        content.dataset.originalText = originalText;
        
        if (term) {
            const regex = new RegExp(`(${term})`, 'gi');
            content.innerHTML = originalText.replace(regex, '<mark style="background: #FFD700; color: #1a2332; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        } else {
            content.textContent = originalText;
        }
    }
}

// Partage d'article
function shareArticle(articleElement) {
    const title = articleElement.querySelector('.article-title').textContent;
    const articleNumber = articleElement.querySelector('.article-number').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: `Code LSPD - Article ${articleNumber}`,
            text: title,
            url: window.location.href
        }).catch(err => console.log('Erreur de partage:', err));
    } else {
        // Fallback: copier le lien
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié dans le presse-papier!');
        });
    }
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
function printCode() {
    window.print();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P pour imprimer
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printCode();
    }
    
    // Ctrl/Cmd + F pour rechercher
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Activer la recherche personnalisée si elle existe
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Échap pour retour en haut
    if (e.key === 'Escape') {
        scrollToTop();
    }
});

// Statistiques de lecture
function getReadingStats() {
    const totalArticles = document.querySelectorAll('.article').length;
    const readArticles = JSON.parse(localStorage.getItem('lspd_articles_read') || '[]').length;
    const percentage = Math.round((readArticles / totalArticles) * 100);
    
    console.log('📊 Statistiques de lecture:');
    console.log(`   Articles lus: ${readArticles}/${totalArticles}`);
    console.log(`   Progression: ${percentage}%`);
    
    return { totalArticles, readArticles, percentage };
}

// Export en PDF (simplifié)
function exportToPDF() {
    window.print();
    showNotification('Utilisez Ctrl+P ou Cmd+P pour sauvegarder en PDF', 'info');
}

// Mode sombre/clair (bonus)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('lspd_theme', isLight ? 'light' : 'dark');
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('lspd_theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

// Analytics (tracking des sections visitées)
function trackSectionView(sectionId) {
    const viewHistory = JSON.parse(localStorage.getItem('lspd_section_views') || '{}');
    viewHistory[sectionId] = (viewHistory[sectionId] || 0) + 1;
    localStorage.setItem('lspd_section_views', JSON.stringify(viewHistory));
    
    console.log(`📍 Section visitée: ${sectionId}`);
}

// Observer les sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
                trackSectionView(sectionId);
            }
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.annexe-section').forEach(section => {
    sectionObserver.observe(section);
});

// Accessibilité: Navigation au clavier
document.querySelectorAll('.toc-item').forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Page chargée en ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Temps de chargement lent détecté');
    }
});

// Message de bienvenue
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('%c   CODE DU L.S.P.D - VERSION 2026     ', 'color: #FFD700; font-size: 14px; font-weight: bold;');
console.log('%c   Los Santos Police Department       ', 'color: #5ba3f5; font-size: 12px;');
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('%c   "Protéger et servir"                ', 'color: #FFD700; font-style: italic;');
console.log('%c═══════════════════════════════════════', 'color: #5ba3f5;');
console.log('');
console.log('📋 Commandes disponibles:');
console.log('  - getReadingStats() : Voir vos statistiques de lecture');
console.log('  - scrollToTop() : Retour en haut de page');
console.log('  - toggleDarkMode() : Changer le thème');
console.log('');

// Fonction utilitaire pour réinitialiser la progression
window.resetProgress = function() {
    localStorage.removeItem('lspd_articles_read');
    localStorage.removeItem('lspd_section_views');
    location.reload();
};

// Exposer certaines fonctions pour usage console
window.lspd = {
    stats: getReadingStats,
    scrollTop: scrollToTop,
    darkMode: toggleDarkMode,
    resetProgress: window.resetProgress,
    exportPDF: exportToPDF
};
