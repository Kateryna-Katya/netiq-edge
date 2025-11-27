document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Base Logic (Header, Cookie Popup, AOS Init)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookiesButton = document.getElementById('acceptCookies');
  const cookieAccepted = localStorage.getItem('netiqedge_cookies_accepted');
  const contactForm = document.getElementById('contactForm');
  const captchaDisplay = document.getElementById('captchaDisplay');
  const captchaInput = document.getElementById('captchaInput');
  const submissionMessage = document.getElementById('submissionMessage');
  const policyAccept = document.getElementById('policyAccept');
  let correctAnswer = 0;


  // Header Toggle Logic
  const toggleMenu = () => {
      headerNav.classList.toggle('is-open');
      const iconElement = menuToggle.querySelector('svg');
      if (headerNav.classList.contains('is-open')) {
          iconElement.setAttribute('data-lucide', 'x');
      } else {
          iconElement.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
  };
  menuToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 992) { setTimeout(toggleMenu, 200); }
      });
  });

  // Cookie Popup Logic
  const showCookiePopup = () => { if (!cookieAccepted) { cookiePopup.classList.remove('is-hidden'); } }
  const hideCookiePopup = () => { cookiePopup.classList.add('is-hidden'); localStorage.setItem('netiqedge_cookies_accepted', 'true'); }
  showCookiePopup();
  acceptCookiesButton.addEventListener('click', hideCookiePopup);

  // AOS Initialization (Required for entrance animations)
  AOS.init({
      duration: 800,
      once: true,
  });

  // ==========================================================================
  // 2. JS Анимация Hero-секции (Data Edge / Connection Flow)
  // ==========================================================================
  const canvas = document.getElementById('dataEdgeCanvas');

  if (canvas) {
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = document.querySelector('.hero').offsetHeight;
      const nodes = [];
      const numNodes = 70;
      const linkDistance = 150;
      const particleColor = '#1976D2';
      const trailColor = 'rgba(255, 255, 255, 0.5)';

      class Node {
          constructor() {
              this.x = Math.random() * width; this.y = Math.random() * height;
              this.radius = 1.5 + Math.random() * 0.5;
              this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
          }
          update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; this.draw(); }
          draw() { ctx.fillStyle = particleColor; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
      }

      const initNodes = () => { width = canvas.width = window.innerWidth; height = canvas.height = document.querySelector('.hero').offsetHeight; nodes.length = 0; for (let i = 0; i < numNodes; i++) { nodes.push(new Node()); } };

      const connectNodes = () => {
          ctx.lineWidth = 0.5;
          for (let i = 0; i < nodes.length; i++) {
              for (let j = i; j < nodes.length; j++) {
                  const distance = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
                  if (distance < linkDistance) {
                      ctx.strokeStyle = `rgba(255, 87, 34, ${1 - distance / linkDistance})`;
                      ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                  }
              }
          }
      };

      const animateNetwork = () => {
          requestAnimationFrame(animateNetwork);
          ctx.fillStyle = trailColor;
          ctx.fillRect(0, 0, width, height);
          connectNodes();
          nodes.forEach(node => node.update());
      };

      window.addEventListener('resize', initNodes);
      initNodes();
      animateNetwork();
  }


  // ==========================================================================
  // 3. JS Логика Формы Контактов и CAPTCHA
  // ==========================================================================
  function generateCaptcha() {
      const captchaInput = document.getElementById('captchaInput');
      const captchaMessage = document.getElementById('captchaMessage');
      const operator = Math.random() < 0.5 ? '+' : '-';
      let num1 = Math.floor(Math.random() * 15) + 5;
      let num2 = Math.floor(Math.random() * 10) + 1;
      if (operator === '-' && num1 < num2) { [num1, num2] = [num2, num1]; }
      correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
      captchaDisplay.textContent = `${num1} ${operator} ${num2} = ?`;
      captchaInput.value = '';
      captchaMessage.textContent = ''; // Очищаем сообщение
  }

  function validateCaptcha() {
      const captchaInput = document.getElementById('captchaInput');
      const captchaMessage = document.getElementById('captchaMessage');
      if (!captchaInput.value.trim()) { return false; }
      const userAnswer = parseInt(captchaInput.value.trim());
      if (userAnswer === correctAnswer) { return true; }
      else {
          captchaMessage.textContent = 'Неверный ответ. Попробуйте еще раз.';
          captchaMessage.style.color = '#FF4545';
          generateCaptcha();
          return false;
      }
  }

  generateCaptcha();

  contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      submissionMessage.style.display = 'none';

      if (validateCaptcha() && policyAccept.checked) {
          submissionMessage.style.display = 'block';
          contactForm.reset();
          generateCaptcha();
          setTimeout(() => { submissionMessage.style.display = 'none'; }, 5000);
      } else if (!policyAccept.checked) {
          alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
          policyAccept.focus();
      }
  });
});