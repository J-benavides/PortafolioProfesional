document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // 1. Navbar cambia color al hacer scroll
    // ===============================================
    window.addEventListener("scroll", function() {
        const nav = document.querySelector(".blur-nav");
        if (nav) { // Asegurarse de que nav existe
            nav.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // ===============================================
    // 2. Animación Typed.js para el Hero Section (ELIMINADO)
    //    Este bloque está comentado o eliminado según tu último requisito.
    // ===============================================
    // Si en algún momento decides volver a usar Typed.js, descomenta y asegura el HTML
    /*
    const typedTextElement = document.querySelector(".typed-text");
    if (typedTextElement) {
        new Typed(typedTextElement, {
            strings: ["Desarrollador Full-Stack", "Apasionado por la tecnología", "Software que siempre escala"],
            typeSpeed: 60,
            backSpeed: 35,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }
    */

    // ===============================================
    // 3. Inicializa AOS (Animate On Scroll)
    // ===============================================
    AOS.init({
        duration: 1000,
        once: true,
    });

    // ===============================================
    // 4. Lógica para el cambio de tema (Modo Oscuro/Claro)
    // ===============================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const mainLogo = document.getElementById('main-logo'); // Asegúrate de que tu logo tiene id="main-logo"
    
    const applyTheme = (themeClass) => {
        if (themeClass === 'light-mode') {
            body.classList.add('light-mode');
            if (themeIcon) {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
                themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro'); 
            }
            if (mainLogo) {
                mainLogo.src = 'img/logo-light.svg'; // Ruta de tu logo para modo claro
            }
        } else {
            body.classList.remove('light-mode');
            if (themeIcon) {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
                themeToggle.setAttribute('aria-label', 'Cambiar a modo claro'); 
            }
            if (mainLogo) {
                mainLogo.src = 'img/logo-dark.svg'; // Ruta de tu logo para modo oscuro
            }
        }
    };

    // Aplica el tema guardado en localStorage o el predeterminado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme); 
    } else {
        // Establece un tema inicial si no hay ninguno guardado (ej. modo oscuro por defecto)
        applyTheme(''); 
    }

    // Listener para el botón de cambio de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault(); 
            const isLightMode = body.classList.contains('light-mode');
            const newThemeClass = isLightMode ? '' : 'light-mode'; // Si está en light, cambia a '', si no, a 'light-mode'
            applyTheme(newThemeClass);
            localStorage.setItem('theme', newThemeClass); // Guarda la preferencia del usuario
        });
    }


    // ===============================================
    // 5. Animación de Partículas Dinámicas para el Hero (con interacción del ratón)
    // ===============================================
    const heroSection = document.getElementById('hero');
    const particlesContainer = document.querySelector('.animated-background-particles');
    const root = document.documentElement; // Acceso al elemento HTML (root) para variables CSS

    if (heroSection && particlesContainer) { // Asegurarse de que los elementos existen
        const numParticles = 40; // Cantidad de partículas a generar
        const particles = []; // Array para almacenar las partículas creadas
        const interactionRadius = 150; // Radio de interacción con el ratón en píxeles

        // Creación de las partículas
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 20 + 10; // Tamaño aleatorio entre 10 y 30px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posición inicial aleatoria dentro del viewport
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${Math.random() * window.innerHeight}px`;
            
            // Retraso y duración de animación aleatorios para un efecto más natural
            particle.style.animationDelay = `${Math.random() * -15}s`; 
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            particlesContainer.appendChild(particle);
            particles.push(particle);
        }

        let mouseX = 0;
        let mouseY = 0;
        let heroRect; // Para almacenar las dimensiones del hero y calcular la posición relativa del ratón

        const updateMousePosition = (e) => {
            // Se obtiene getBoundingClientRect() solo una vez o al redimensionar para eficiencia
            if (!heroRect || window.innerWidth !== heroRect.width || window.innerHeight !== heroRect.height) {
                heroRect = heroSection.getBoundingClientRect();
            }
            
            // Calculamos la posición del ratón dentro del HERO como porcentaje
            // Esto es crucial para la variable CSS --mouse-x y --mouse-y
            const mouseXPercent = (e.clientX - heroRect.left) / heroRect.width * 100;
            const mouseYPercent = (e.clientY - heroRect.top) / heroRect.height * 100;

            // Establecemos las variables CSS en el elemento raíz (<html>)
            // para que el pseudo-elemento ::after pueda acceder a ellas para el brillo del ratón
            root.style.setProperty('--mouse-x', `${mouseXPercent}%`);
            root.style.setProperty('--mouse-y', `${mouseYPercent}%`);

            // Actualizamos las coordenadas absolutas del ratón para la interacción con las partículas
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Optimización: Usar requestAnimationFrame para las actualizaciones de estilo
            // Esto asegura que los cambios visuales se sincronicen con el ciclo de renderizado del navegador
            requestAnimationFrame(() => {
                particles.forEach(particle => {
                    const particleRect = particle.getBoundingClientRect();
                    const particleCenterX = particleRect.left + particleRect.width / 2;
                    const particleCenterY = particleRect.top + particleRect.height / 2;

                    // Calcula la distancia euclidiana entre el ratón y el centro de la partícula
                    const distance = Math.sqrt(
                        Math.pow(mouseX - particleCenterX, 2) + 
                        Math.pow(mouseY - particleCenterY, 2)
                    );

                    // Aplica o quita la clase 'active' basada en la distancia de interacción
                    if (distance < interactionRadius) {
                        particle.classList.add('active');
                    } else {
                        particle.classList.remove('active');
                    }
                });
            });
        };

        // Añade el listener de movimiento del ratón a la sección hero
        heroSection.addEventListener('mousemove', updateMousePosition);

        // Recalcular heroRect si la ventana cambia de tamaño
        window.addEventListener('resize', () => {
            heroRect = heroSection.getBoundingClientRect();
        });
    } // Fin del if(heroSection && particlesContainer)
}); // Fin de DOMContentLoaded