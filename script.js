// Simple JavaScript for enhanced user experience

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe module cards for scroll animations
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add click tracking for module links (for analytics if needed)
    const moduleLinks = document.querySelectorAll('.module-card .btn');
    moduleLinks.forEach(link => {
        link.addEventListener('click', function() {
            const moduleName = this.closest('.module-card').querySelector('h4').textContent;
            console.log(`Module accessed: ${moduleName}`);
            // You can add analytics tracking here if needed
        });
    });

    // Add search functionality
    function addSearchFeature() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="moduleSearch" placeholder="Search modules, topics, or concepts..." />
                <i class="fas fa-search"></i>
            </div>
        `;
        
        const modulesSection = document.querySelector('.modules .container');
        modulesSection.insertBefore(searchContainer, modulesSection.querySelector('.section-title').nextSibling);

        // Search functionality
        const searchInput = document.getElementById('moduleSearch');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const moduleCards = document.querySelectorAll('.module-card');
            
            moduleCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const content = card.querySelector('.module-content p').textContent.toLowerCase();
                const topics = Array.from(card.querySelectorAll('.module-topics li')).map(li => li.textContent.toLowerCase()).join(' ');
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || topics.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });

            // Show/hide category headers based on visible cards
            const categories = document.querySelectorAll('.module-category');
            categories.forEach(category => {
                const visibleCards = category.querySelectorAll('.module-card[style*="display: block"], .module-card:not([style*="display: none"])');
                category.style.display = visibleCards.length > 0 ? 'block' : 'none';
            });

            // Update results message
            const visibleCardCount = document.querySelectorAll('.module-card[style*="display: block"], .module-card:not([style*="display: none"])').length;
            updateSearchResults(searchTerm, visibleCardCount);
        });
    }

    function updateSearchResults(searchTerm, count) {
        let existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (searchTerm) {
            const message = document.createElement('div');
            message.className = 'search-results-message';
            message.style.cssText = `
                text-align: center;
                margin: 1rem 0;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                color: #666;
                font-size: 0.9rem;
            `;
            message.textContent = `Found ${count} module${count !== 1 ? 's' : ''} matching "${searchTerm}"`;
            
            const searchContainer = document.querySelector('.search-container');
            searchContainer.appendChild(message);
        }
    }

    // Initialize search feature
    addSearchFeature();

    // Add progress indicator
    function addProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-fill"></div>
        `;
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
            document.querySelector('.progress-fill').style.width = scrollPercent + '%';
        });
    }

    // Initialize progress indicator
    addProgressIndicator();

    // Add back to top button
    function addBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopButton.title = 'Back to top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopButton);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize back to top button
    addBackToTopButton();

    // Add module count animation
    function animateModuleCount() {
        const statNumbers = document.querySelectorAll('.stat .number');
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            if (!isNaN(target)) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 50);
            }
        });
    }

    // Initialize count animation when hero is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateModuleCount();
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Add keyboard navigation for module cards
    const moduleCardsArray = Array.from(document.querySelectorAll('.module-card'));
    moduleCardsArray.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.btn');
                if (link) {
                    link.click();
                }
            } else if (e.key === 'ArrowDown' && index < moduleCardsArray.length - 1) {
                moduleCardsArray[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                moduleCardsArray[index - 1].focus();
            }
        });
    });

    // Add loading states for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });

    // Add tooltip functionality for feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        const feature = icon.closest('.feature');
        const title = feature.querySelector('h3').textContent;
        icon.setAttribute('title', `Learn more about ${title}`);
    });

    console.log('🚀 Java Spring Fundamentals Guide - Website loaded successfully!');
    console.log('📚 12 comprehensive modules ready for learning');
    console.log('🔍 Search functionality enabled');
    console.log('📱 Responsive design activated');
});
