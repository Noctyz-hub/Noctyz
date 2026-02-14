// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initScrollEffects();
    initScrollTopButton();
    initSmoothScrolling();
    initReadingProgress();
    initArticleCounter();
    
    console.log('📜 Règlement Interne de la Police Nationale initialisé');
    console.log('%c🇫🇷 Police Nationale - République Française', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
    console.log('%c"Discipline • Respect • Excellence"', 'color: #FFD700; font-size: 16px; font-style: italic;');
});

// Gestion du scroll avec animations
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
    const elements = document.querySelectorAll('.regulation-card, .surveillance-item, .section-title');
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
                targetElement.style.background = 'rgba(255, 107, 107, 0.2)';
                
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
        background: linear-gradient(90deg, #ff6b6b 0%, #ab47bc 100%);
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

// Compteur d'articles
function initArticleCounter() {
    const sections = document.querySelectorAll('.content-section');
    let totalArticles = 0;
    
    sections.forEach(section => {
        const articles = section.querySelectorAll('.regulation-card');
        totalArticles += articles.length;
        
        // Ajouter un compteur à chaque section
        const sectionTitle = section.querySelector('.section-title');
        if (sectionTitle) {
            const counter = document.createElement('span');
            counter.style.cssText = `
                font-size: 0.8em;
                opacity: 0.7;
                margin-left: 10px;
            `;
            counter.textContent = `(${articles.length} articles)`;
            sectionTitle.appendChild(counter);
        }
    });
    
    console.log(`📊 Total: ${totalArticles} articles dans le règlement`);
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        info: '#42a5f5',
        success: '#66bb6a',
        warning: '#ffa726',
        error: '#ff6b6b'
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
    
    @keyframes highlight {
        0% {
            background: transparent;
        }
        50% {
            background: rgba(255, 107, 107, 0.3);
        }
        100% {
            background: transparent;
        }
    }
`;
document.head.appendChild(style);

// Recherche d'articles
function searchArticles(query) {
    const cards = document.querySelectorAll('.regulation-card');
    let found = 0;
    
    cards.forEach(card => {
        const title = card.querySelector('.regulation-title')?.textContent.toLowerCase() || '';
        const content = card.querySelector('.regulation-content')?.textContent.toLowerCase() || '';
        
        if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
            card.style.display = 'block';
            card.style.animation = 'highlight 1s ease';
            found++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showNotification(`${found} article(s) trouvé(s)`, found > 0 ? 'success' : 'warning');
}

// Impression optimisée
function printReglement() {
    window.print();
}

// Export en texte
function exportToText() {
    let text = '═══════════════════════════════════════\n';
    text += '   RÈGLEMENT INTERNE\n';
    text += '   POLICE NATIONALE\n';
    text += '   République Française\n';
    text += '═══════════════════════════════════════\n\n';
    
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        const title = section.querySelector('.section-title')?.textContent.trim() || '';
        text += `\n${title}\n`;
        text += '─'.repeat(50) + '\n\n';
        
        const articles = section.querySelectorAll('.regulation-card');
        articles.forEach(article => {
            const number = article.querySelector('.regulation-number')?.textContent || '';
            const articleTitle = article.querySelector('.regulation-title')?.textContent || '';
            const content = article.querySelector('.regulation-content')?.textContent || '';
            
            text += `${number} - ${articleTitle}\n`;
            text += `${content}\n\n`;
        });
    });
    
    text += '\n═══════════════════════════════════════\n';
    text += '© 2026 Police Nationale - Règlement Officiel\n';
    text += '═══════════════════════════════════════\n';
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reglement-Police-Nationale.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Règlement exporté avec succès !', 'success');
}

// Statistiques du règlement
function getStatistics() {
    const sections = document.querySelectorAll('.content-section');
    const stats = {
        totalSections: sections.length,
        totalArticles: document.querySelectorAll('.regulation-card').length,
        bySeverity: {
            red: document.querySelectorAll('.red-card, .red-card-large').length,
            orange: document.querySelectorAll('.orange-card').length,
            yellow: document.querySelectorAll('.yellow-card').length,
            green: document.querySelectorAll('.green-card').length,
            blue: document.querySelectorAll('.blue-card').length,
            purple: document.querySelectorAll('.purple-card').length,
            cyan: document.querySelectorAll('.cyan-card').length
        }
    };
    
    console.log('📊 Statistiques du Règlement:');
    console.log(`   Sections: ${stats.totalSections}`);
    console.log(`   Articles: ${stats.totalArticles}`);
    console.log('   Par catégorie:');
    console.log(`   🔴 Rouge (Critique): ${stats.bySeverity.red}`);
    console.log(`   🟠 Orange: ${stats.bySeverity.orange}`);
    console.log(`   🟡 Jaune: ${stats.bySeverity.yellow}`);
    console.log(`   🟢 Vert: ${stats.bySeverity.green}`);
    console.log(`   🔵 Bleu: ${stats.bySeverity.blue}`);
    console.log(`   🟣 Violet: ${stats.bySeverity.purple}`);
    console.log(`   🔷 Cyan: ${stats.bySeverity.cyan}`);
    
    return stats;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P pour imprimer
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printReglement();
    }
    
    // Ctrl/Cmd + E pour exporter
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportToText();
    }
    
    // Ctrl/Cmd + F pour recherche (custom)
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const query = prompt('Rechercher dans le règlement:');
        if (query) searchArticles(query);
    }
    
    // Échap pour retour en haut
    if (e.key === 'Escape') {
        scrollToTop();
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Règlement chargé en ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Temps de chargement lent détecté');
    }
    
    // Afficher les statistiques
    getStatistics();
});

// Message de bienvenue
console.log('%c═══════════════════════════════════════', 'color: #ff6b6b;');
console.log('%c   RÈGLEMENT INTERNE 2026              ', 'color: #FFD700; font-size: 14px; font-weight: bold;');
console.log('%c   Police Nationale                    ', 'color: #42a5f5; font-size: 12px;');
console.log('%c═══════════════════════════════════════', 'color: #ff6b6b;');
console.log('%c   "Discipline • Respect • Excellence" ', 'color: #ff6b6b; font-style: italic;');
console.log('%c═══════════════════════════════════════', 'color: #ff6b6b;');
console.log('');
console.log('📋 Commandes disponibles:');
console.log('  - scrollToTop() : Retour en haut de page');
console.log('  - printReglement() : Imprimer le règlement');
console.log('  - exportToText() : Exporter en fichier texte');
console.log('  - searchArticles("mot") : Rechercher un article');
console.log('  - getStatistics() : Afficher les statistiques');
console.log('');
console.log('⌨️ Raccourcis clavier:');
console.log('  - Ctrl/Cmd + P : Imprimer');
console.log('  - Ctrl/Cmd + E : Exporter');
console.log('  - Ctrl/Cmd + F : Rechercher');
console.log('  - Échap : Retour en haut');
console.log('');

// Exposer fonctions pour usage console
window.reglementPN = {
    scrollTop: scrollToTop,
    print: printReglement,
    export: exportToText,
    search: searchArticles,
    stats: getStatistics
};
