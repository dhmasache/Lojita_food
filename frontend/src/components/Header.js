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
            background: var(--background-card);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
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
            font-weight: 600;
            font-size: 1.5rem;
            color: var(--accent-coffee);
        }

        .logo img {
            height: 40px;
            margin-right: 10px;
            transition: var(--transition-smooth);
        }
        
        .logo:hover img {
            transform: rotate(-10deg);
        }

        .nav-links {
            display: flex;
            align-items: center;
        }

        .nav-links a, .nav-links button {
            margin-left: 1.5rem;
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 600;
            transition: var(--transition-smooth);
            font-size: 0.95rem;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0; /* Reset padding for button to match link spacing */
        }
        
        .nav-links a:hover, .nav-links button:hover {
            color: var(--accent-terracotta);
        }
        
        .nav-button {
            padding: 0.6rem 1.2rem;
            border-radius: 20px;
            border: 1px solid var(--accent-terracotta);
            color: var(--accent-terracotta);
            background: transparent;
        }

        .nav-button:hover {
            background: var(--accent-terracotta);
            color: white;
        }

        .nav-button.primary {
            background: var(--accent-terracotta);
            color: white;
            border-color: var(--accent-terracotta);
        }

        .nav-button.primary:hover {
            background: #c96850; /* A slightly darker shade */
        }

        .welcome-message {
            margin-left: 1.5rem;
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.95rem;
        }
    `;
    headerElement.appendChild(style);

    return headerElement;
};