// ==========================================================================
// ГЛОБАЛЬНА ІНІЦІАЛІЗАЦІЯ
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Виклики основних функцій сайту
    handleCookiePopup();
    handleBurgerMenu();
    setupHeroAnimation(); 
    setupFaqAccordion(); 
    setupScrollAnimation(); 
    handleContactForm(); 
});


// ==========================================================================
// 1. Логіка Cookie Pop-up (Етап 5.1)
// ==========================================================================
function handleCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const cookieName = 'netiq_cookie_accepted';

    if (!popup) return;

    // Перевіряємо, чи є запис в localStorage
    if (!localStorage.getItem(cookieName)) {
        popup.classList.remove('hidden');
    } else {
        popup.classList.add('hidden');
    }

    // Обробник кліку на кнопку "Принять"
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(cookieName, 'true');
        popup.classList.add('hidden');

        setTimeout(() => {
            popup.style.display = 'none';
        }, 500); // Час має відповідати CSS transition-speed
    });
}

// ==========================================================================
// 2. Логіка мобільного меню (Burger Menu)
// ==========================================================================
function handleBurgerMenu() {
    const burger = document.getElementById('burger-menu');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.nav__link'); 

    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav--active'); 
        
        const iconName = nav.classList.contains('nav--active') ? 'x' : 'menu';
        burger.querySelector('svg').setAttribute('data-lucide', iconName);
        lucide.createIcons();
    });

    // При кліку на якірне посилання, закриваємо меню
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav--active')) {
                nav.classList.remove('nav--active');
                burger.querySelector('svg').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });
}

// ==========================================================================
// 3. Логіка Hero Section Анімація (Net-IQ Mesh)
// ==========================================================================
function setupHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return; 

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const maxParticles = 50;

    function resizeCanvas() {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2 + 1;
            this.velocity = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            };
            this.color = `rgba(0, 188, 212, ${Math.random() * 0.4 + 0.1})`;
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.x < 0 || this.x > width) this.velocity.x *= -1;
            if (this.y < 0 || this.y > height) this.velocity.y *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        let maxDistance = 120; 

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 188, 212, ${1 - dist / maxDistance * 0.7})`; 
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height); 

        connectParticles();

        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
}

// ==========================================================================
// 4. Логіка Акордеону FAQ (Етап 3.6)
// ==========================================================================
function setupFaqAccordion() {
    const questions = document.querySelectorAll('.faq__question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Закриваємо всі відповіді, крім поточної
            questions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('open');
                }
            });

            // Перемикаємо активний стан для поточної відповіді
            question.classList.toggle('active');
            answer.classList.toggle('open');
        });
    });
}


// ==========================================================================
// 5. Логіка Анімації При Скролінгу (Універсальне Рішення)
// ==========================================================================
function setupScrollAnimation() {
    // Список всех элементов, которые мы хотим анимировать при скролле
    const animatedElements = [
        ...document.querySelectorAll('.methodology__card'),
        ...document.querySelectorAll('.case-card'),
        ...document.querySelectorAll('.blog-card'),
        ...document.querySelectorAll('.pricing__card'),
        ...document.querySelectorAll('.faq__item') 
    ];

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); 
                }, delay);
            }
        });
    }, {
        rootMargin: '0px', 
        threshold: 0.1 
    });

    animatedElements.forEach((element, index) => {
        // Забезпечення каскадної затримки, якщо data-delay не встановлено в HTML
        if (!element.dataset.delay) {
            let delayTime = 0;
            if (element.classList.contains('methodology__card')) {
                delayTime = (index % 4) * 150; 
            } else {
                 // Для Case, Blog, Pricing, FAQ
                delayTime = (index % 3) * 200; 
            }
            element.dataset.delay = delayTime;
        }
        observer.observe(element);
    });
}


// ==========================================================================
// 6. Логіка Секції Контактів та CAPTCHA (Етап 4)
// ==========================================================================
let captchaResult = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaResult = num1 + num2;
    
    const captchaLabel = document.getElementById('captcha-label');
    if (captchaLabel) {
        captchaLabel.textContent = `Решите пример: ${num1} + ${num2} = ?`;
    }
}

function handleContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const captchaInput = document.getElementById('captcha');

    if (!form) return;
    
    generateCaptcha(); // Генерація CAPTCHA при завантаженні форми

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Валідація CAPTCHA
        const userAnswer = parseInt(captchaInput.value.trim(), 10);

        if (userAnswer !== captchaResult) {
            displayStatus('Неверный ответ CAPTCHA. Попробуйте еще раз.', 'error');
            generateCaptcha(); 
            captchaInput.value = '';
            return;
        }

        // 2. Імітація відправки (затримка 1.5 сек)
        displayStatus('Отправка данных...', 'pending');
        
        const submitBtn = form.querySelector('.contact__submit-btn');
        submitBtn.disabled = true;

        setTimeout(() => {
            // Імітуємо успішну відправку
            const isSuccess = true; 

            if (isSuccess) {
                displayStatus('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset(); 
                generateCaptcha(); 
            } else {
                 displayStatus('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
            }
            
            submitBtn.disabled = false; 
        }, 1500); 
    });

    function displayStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'contact__message-status';
        
        if (type === 'success') {
            statusDiv.classList.add('success');
        } else if (type === 'error') {
            statusDiv.classList.add('error');
        }
        
        statusDiv.style.display = 'block';
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}