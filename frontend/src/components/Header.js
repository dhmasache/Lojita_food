// src/components/Header.js
import { router } from '../router.js'; // Asegúrate de importar el router si no lo está

const getAuthStatus = () => {
    return localStorage.getItem('jwt_token') !== null;
};

const getUserInfo = () => {
    const user = localStorage.getItem('lojita_user');
    return user ? JSON.parse(user) : null;
};

const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('lojita_user');
    document.dispatchEvent(new CustomEvent('authChange'));
    window.history.pushState({}, '', '/'); // Redirigir a la página de inicio
    router();
};

const renderHeaderContent = (navLinksElement) => {
    const isLoggedIn = getAuthStatus();
    const userInfo = getUserInfo();

    navLinksElement.innerHTML = `
        <a href="/">Inicio</a>
        <a href="/restaurantes">Restaurantes</a> <!-- Nuevo enlace -->
        <a href="/about">Nosotros</a>
    `;

            if (isLoggedIn) {
                // Enlaces para usuarios logueados
                if (userInfo && userInfo.rol === 'admin') {
                    navLinksElement.innerHTML += `<a href="/admin" class="nav-button">Admin Dashboard</a>`;
                } else if (userInfo && userInfo.rol === 'propietario') {
                    navLinksElement.innerHTML += `<a href="/mi-restaurante" class="nav-button">Mi Restaurante</a>`;
                } else if (userInfo && userInfo.rol === 'cliente') { // Nuevo: Enlace para el dashboard del cliente
                    navLinksElement.innerHTML += `<a href="/client-dashboard" class="nav-button">Mi Dashboard</a>`;
                }
                        navLinksElement.innerHTML += `
            <span class="welcome-message">Bienvenido, ${userInfo ? userInfo.nombre : 'Usuario'}</span>
            <button id="logout-button" class="nav-button primary">Cerrar Sesión</button>
        `;
    } else {
        // Enlaces para usuarios no logueados
        navLinksElement.innerHTML += `
            <a href="/login" class="nav-button">Ingresar</a>
            <a href="/register" class="nav-button primary">Registrarse</a>
        `;
    }

    // Añadir listener para cerrar sesión si el botón existe
    if (isLoggedIn) {
        const logoutButton = navLinksElement.querySelector('#logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }
    }
};


export const Header = () => {
    const headerElement = document.createElement('header');
    headerElement.id = 'main-header';

    const navElement = document.createElement('nav');
    navElement.className = 'nav-container';

    // Logo
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.className = 'logo';
    logoLink.innerHTML = `<img src="/Logo_Lojitafood.png" alt="LojitaFood Logo"><span>LojitaFood</span>`;

    // Navigation Links container
    const navLinks = document.createElement('div');
    navLinks.className = 'nav-links';

    navElement.appendChild(logoLink);
    navElement.appendChild(navLinks);
    headerElement.appendChild(navElement);

    // Initial render of nav links
    renderHeaderContent(navLinks);

    // Listen for auth changes to re-render nav links
    document.addEventListener('authChange', () => {
        renderHeaderContent(navLinks);
    });

    // Apply styles directly for encapsulation
    const style = document.createElement('style');
    style.textContent = `
        #main-header {
            background-color: var(--surface-color); /* Usar surface-color para un fondo más sólido */
            backdrop-filter: blur(8px); /* Blur ligeramente reducido */
            -webkit-backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border-color);
            padding: 0.8rem 2rem; /* Padding vertical y horizontal ajustado */
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: var(--shadow-soft); /* Sombra más suave para un look flotante */
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }

        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            font-family: var(--font-serif);
            font-weight: 700; /* Más peso para el texto del logo */
            font-size: 1.6rem; /* Tamaño de fuente ligeramente más grande */
            color: var(--accent-coffee);
            transition: var(--transition-smooth);
        }

        .logo:hover {
            color: var(--primary-dark); /* Color al hover */
        }

        .logo img {
            height: 45px; /* Altura del logo ligeramente mayor */
            margin-right: 12px; /* Margen ligeramente mayor */
            transition: var(--transition-smooth);
        }
        
        .logo:hover img {
            transform: scale(1.05) rotate(-3deg); /* Efecto hover más dinámico */
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 1rem; /* Espaciado entre elementos de navegación */
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500; /* Peso de fuente ajustado para enlaces */
            transition: var(--transition-smooth);
            font-size: 1rem; /* Tamaño de fuente estándar */
            padding: 0.5rem 0.8rem; /* Padding para hacer la zona de click/hover más grande */
            border-radius: 8px; /* Ligeros bordes redondeados */
        }
        
        .nav-links a:hover {
            color: var(--primary-color); /* Color principal al hover */
            background-color: rgba(var(--primary-color-rgb), 0.1); /* Fondo sutil al hover */
        }
        
        /* Estilos generales para botones dentro del nav */
        .nav-button {
            padding: 0.6rem 1.2rem;
            border-radius: 25px; /* Más redondeado para un look moderno */
            font-weight: 600;
            transition: var(--transition-smooth);
            font-size: 0.95rem; /* Tamaño de fuente ligeramente menor */
            cursor: pointer;
            text-decoration: none; /* Para botones que actúan como enlaces */
            display: inline-flex; /* Asegurar padding y alineación */
            align-items: center;
            justify-content: center;
            border: 1px solid transparent; /* Borde transparente por defecto */
        }

        .nav-button.primary {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .nav-button.primary:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
            transform: translateY(-2px); /* Efecto de "levantar" */
            box-shadow: 0 4px 10px rgba(var(--primary-color-rgb), 0.2);
        }
        
        .nav-button.secondary { /* Nuevo estilo para botones secundarios */
            background-color: transparent;
            color: var(--text-primary);
            border-color: var(--border-color);
        }

        .nav-button.secondary:hover {
            background-color: var(--background-main); /* Fondo sutil al hover */
            color: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .welcome-message {
            margin-left: 1.5rem;
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.95rem;
            white-space: nowrap; /* Evitar que el mensaje se rompa */
        }
    `;
    headerElement.appendChild(style);

    return headerElement;
};