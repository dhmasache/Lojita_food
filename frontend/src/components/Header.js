import { router } from '../router.js'; // Importar el router

// frontend/src/components/Header.js

function renderHeader(container) {
    const user = JSON.parse(localStorage.getItem('lojita_user'));
    const token = localStorage.getItem('jwt_token');
    
    let navLinks = '';

    if (token && user) {
        // Usuario ha iniciado sesión
        navLinks = `
            <li class="nav-item welcome-user">Hola, ${user.nombre} (${user.rol})</li>
            <li class="nav-item"><a href="/" data-link>Inicio</a></li>
            <li class="nav-item"><a href="/about" data-link>Acerca de</a></li>
        `;

        // Añadir enlaces específicos por rol
        if (user.rol === 'cliente') {
            navLinks += `<li class="nav-item"><a href="/solicitar-propietario" data-link class="nav-link-special">Registrar mi Restaurante</a></li>`;
        }
        if (user.rol === 'propietario') {
            navLinks += `<li class="nav-item"><a href="/mi-restaurante" data-link class="nav-link-special">Gestionar Restaurante</a></li>`;
        }
        if (user.rol === 'admin') {
            navLinks += `<li class="nav-item"><a href="/admin" data-link class="nav-link-special">Panel Admin</a></li>`;
        }

        navLinks += `<li class="nav-item"><button id="logout-button">Cerrar Sesión</button></li>`;

    } else {
        // Usuario no ha iniciado sesión
        navLinks = `
            <li class="nav-item"><a href="/" data-link>Inicio</a></li>
            <li class="nav-item"><a href="/about" data-link>Acerca de</a></li>
            <li class="nav-item"><a href="/login" data-link>Iniciar Sesión</a></li>
            <li class="nav-item"><a href="/register" data-link>Registrarse</a></li>
        `;
    }

    container.innerHTML = `
        <header class="main-header">
            <div class="logo">
                <a href="/" data-link>
                    <img src="/Logo_Lojitafood.png" alt="LojitaFood Logo" class="header-logo">
                </a>
            </div>
            <button class="menu-toggle" aria-label="Toggle navigation">
                <span class="hamburger"></span>
                <span class="hamburger"></span>
                <span class="hamburger"></span>
            </button>
            <nav class="main-nav">
                <ul class="nav-list">
                    ${navLinks}
                </ul>
            </nav>
        </header>
    `;

    const logoutButton = container.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('lojita_user');
            
            document.dispatchEvent(new CustomEvent('authChange'));

            // Redirigir a la home usando el router para una navegación suave
            window.history.pushState({}, '', '/');
            router(); // Usar la función router importada
        });
    }

    const menuToggle = container.querySelector('.menu-toggle');
    const mainNav = container.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('main-nav--open');
            menuToggle.classList.toggle('is-active'); // Para animar el icono de hamburguesa
        });
    }
}

// Función de inicialización que se llamará una sola vez
function initHeader() {
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    document.body.prepend(headerContainer); // Añadir el contenedor al inicio del body

    // Renderizar el header por primera vez
    renderHeader(headerContainer);

    // Escuchar el evento de cambio de autenticación para re-renderizar
    document.addEventListener('authChange', () => {
        renderHeader(headerContainer);
    });
}

export { initHeader };
