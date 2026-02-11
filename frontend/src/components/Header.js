// src/components/Header.js
import { router } from '../router.js';

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

const renderHeaderContent = (navLinksElement, navRightElement) => {
    const isLoggedIn = getAuthStatus();
    const userInfo = getUserInfo();

    // Clear previous content
    navLinksElement.innerHTML = '';
    navRightElement.innerHTML = '';

    // Center Links: Always show base links
    let centerLinksHtml = `
        <a href="/">Inicio</a>
        <!-- <a href="/restaurantes">Restaurantes</a> -->
        <a href="/cantones">Cantones</a>
        <a href="/about">Nosotros</a>
    `;

    // Add dynamic links based on role for logged-in users
    if (isLoggedIn && userInfo) {
        if (userInfo.rol === 'admin') {
            centerLinksHtml += `<a href="/admin">Admin Dashboard</a>`;
        }
        if (userInfo.rol === 'propietario') {
            centerLinksHtml += `<a href="/mi-restaurante">Mi Restaurante</a>`;
        }
        if (userInfo.rol === 'cliente') {
            centerLinksHtml += `<a href="/client-dashboard">Mi Dashboard</a>`;
        }
    }
    navLinksElement.innerHTML = centerLinksHtml;

    // Right Section: Welcome message + Logout button OR Login/Register buttons
    if (isLoggedIn && userInfo) {
        const defaultProfileImage = 'http://localhost:3000/uploads/default-profile.png'; // Asegúrate de tener una imagen por defecto
        const profileImageUrl = userInfo.imagenPerfil ? `http://localhost:3000${userInfo.imagenPerfil}` : defaultProfileImage;

        navRightElement.innerHTML = `
            <a href="/profile/edit" class="profile-image-link">
                <img src="${profileImageUrl}" alt="Profile Image" class="nav-profile-image">
            </a>
            <span class="welcome-message">Bienvenido, ${userInfo.nombre}</span>
            <button id="logout-button" class="btn btn-primary nav-logout-btn">Cerrar Sesión</button>
        `;
        
        const logoutButton = navRightElement.querySelector('#logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }

    } else {
        navRightElement.innerHTML = `
            <a href="/login" class="btn btn-secondary nav-login-btn">Ingresar</a>
            <a href="/register" class="btn btn-primary nav-register-btn">Registrarse</a>
        `;
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
    navLinks.className = 'nav-links-center'; // New class for center links

    // Right: User Info / Auth Buttons container
    const navRight = document.createElement('div');
    navRight.className = 'nav-right'; // New class for right section

    navElement.appendChild(logoLink);
    navElement.appendChild(navLinks);
    navElement.appendChild(navRight);
    headerElement.appendChild(navElement);

    // Initial render of nav links and right section
    renderHeaderContent(navLinks, navRight);

    // Listen for auth changes to re-render nav links
    document.addEventListener('authChange', () => {
        renderHeaderContent(navLinks, navRight);
    });

    // Apply styles directly for encapsulation
    const style = document.createElement('style');
    style.textContent = `
        #main-header {
            background-color: var(--surface-color);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border-color);
            padding: 0.8rem 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: var(--shadow-soft);
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
            font-weight: 700;
            font-size: 1.6rem;
            color: var(--accent-coffee);
            transition: var(--transition-smooth);
        }

        .logo:hover {
            color: var(--primary-dark);
        }

        .logo img {
            height: 45px;
            margin-right: 12px;
            transition: var(--transition-smooth);
        }
        
        .logo:hover img {
            transform: scale(1.05) rotate(-3deg);
        }

        .nav-links-center { /* Center links container */
            display: flex;
            align-items: center;
            gap: 1.5rem; /* Increased spacing */
            flex-grow: 1; /* Allow to take available space */
            justify-content: center; /* Center the links */
        }

        .nav-links-center a {
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
            transition: var(--transition-smooth);
            font-size: 1rem;
            padding: 0.5rem 0.8rem;
            border-radius: 8px;
        }
        
        .nav-links-center a:hover {
            color: var(--primary-color);
            background-color: rgba(var(--primary-color-rgb), 0.1);
        }
        
        .nav-right { /* Right section container */
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .welcome-message {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.95rem;
            white-space: nowrap;
        }

        .nav-profile-image {
            width: 38px; /* Tamaño de la imagen de perfil */
            height: 38px;
            border-radius: 50%; /* Hacerla circular */
            object-fit: cover;
            border: 2px solid var(--primary-color);
            box-shadow: var(--shadow-sm);
            transition: var(--transition-smooth);
        }
        .nav-profile-image:hover {
            transform: scale(1.1);
            border-color: var(--primary-dark);
        }
        .profile-image-link {
            display: flex; /* Asegurar que el enlace se alinee bien con flex */
            align-items: center;
            height: 38px; /* Para ayudar a la alineación */
        }


        /* Adjustments for general button styles used in nav */
        .btn.nav-logout-btn,
        .btn.nav-login-btn,
        .btn.nav-register-btn {
            padding: 0.6rem 1.2rem;
            border-radius: 25px; /* More rounded */
            font-weight: 600;
            font-size: 0.95rem;
            margin: 0;
            display: flex;
            align-items: center;
            height: auto;
        }
        
        .btn.nav-logout-btn.btn-primary,
        .btn.nav-register-btn.btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }

        .btn.nav-logout-btn.btn-primary:hover,
        .btn.nav-register-btn.btn-primary:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(var(--primary-color-rgb), 0.2);
        }
        
        .btn.nav-login-btn.btn-secondary {
            background-color: transparent;
            color: var(--text-primary);
            border-color: var(--border-color);
        }

        .btn.nav-login-btn.btn-secondary:hover {
            background-color: var(--background-main);
            color: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        /* Media Queries for responsiveness */
        @media (max-width: 768px) {
            #main-header {
                padding: 0.8rem 1rem;
            }
            .nav-container {
                flex-wrap: wrap;
                justify-content: center;
            }
            .logo {
                width: 100%;
                justify-content: center;
                margin-bottom: 0.5rem;
            }
            .nav-links-center, .nav-right {
                width: 100%;
                justify-content: center;
                margin-top: 0.5rem;
                gap: 0.8rem;
            }
            .welcome-message {
                margin-left: 0;
            }
            .nav-links-center a {
                padding: 0.3rem 0.6rem;
                font-size: 0.9rem;
            }
            .btn.nav-logout-btn, .btn.nav-login-btn, .btn.nav-register-btn {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                height: auto;
            }
            .nav-profile-image {
                width: 30px;
                height: 30px;
                border-width: 1px;
            }
            .profile-image-link {
                height: 30px;
            }
        }
    `;
    headerElement.appendChild(style);

    return headerElement;
};