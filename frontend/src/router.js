import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';
import { AdminDashboardPage } from './pages/adminDashboard.js';
import { PropietarioDashboardPage } from './pages/propietarioDashboard.js';
import { SolicitudPage } from './pages/solicitudPage.js';
import { VerifyAccountPage } from './pages/verifyAccount.js';
import { ForgotPasswordPage } from './pages/forgotPassword.js';
import { ResetPasswordPage } from './pages/resetPassword.js';
import { ClientDashboardPage } from './pages/clientDashboard.js';
import { RestaurantsPage } from './pages/restaurantsPage.js';
import { RestaurantDetailPage } from './pages/restaurantDetailPage.js';
import { RestaurantFormPage } from './pages/restaurantFormPage.js';
import { EditProfilePage } from './pages/editProfilePage.js'; // Import the new component
import { CantonesPage } from './pages/cantonesPage.js'; // Import the new CantonesPage component

const routes = [
    { path: /^\/$/, component: HomePage },
    { path: /^\/about$/, component: AboutPage },
    { path: /^\/login$/, component: LoginPage },
    { path: /^\/register$/, component: RegisterPage },
    { path: /^\/verify-account$/, component: VerifyAccountPage },
    { path: /^\/forgot-password$/, component: ForgotPasswordPage },
    { path: /^\/reset-password\/(.+)$/, component: ResetPasswordPage, paramName: 'token' },
    { path: /^\/admin$/, component: AdminDashboardPage },
    { path: /^\/admin\/restaurantes\/nuevo$/, component: RestaurantFormPage },
    { path: /^\/admin\/restaurantes\/editar\/(.+)$/, component: RestaurantFormPage, paramName: 'id' },
    { path: /^\/mi-restaurante$/, component: PropietarioDashboardPage },
    { path: /^\/solicitud$/, component: SolicitudPage },
    { path: /^\/client-dashboard$/, component: ClientDashboardPage },
    { path: /^\/profile\/edit$/, component: EditProfilePage }, // New route for editing user profile
    { path: /^\/restaurantes$/, component: RestaurantsPage },
    { path: /^\/restaurante\/(.+)$/, component: RestaurantDetailPage, paramName: 'id' },
    { path: /^\/cantones$/, component: CantonesPage },
];

export function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');

    if (!app) {
        console.error("El elemento #app no se encuentra en el DOM.");
        return;
    }
    
    // Limpia el contenido anterior
    app.innerHTML = '';

    let PageComponent = null;
    let params = {};

    for (const route of routes) {
        const match = path.match(route.path);
        if (match) {
            PageComponent = route.component;
            if (route.paramName && match[1]) {
                params[route.paramName] = match[1];
            }
            break;
        }
    }

    if (PageComponent) {
        const user = JSON.parse(localStorage.getItem('lojita_user'));
        const isLoggedIn = !!user;
        const userRole = user ? user.rol : null;

        // Route Guard for /admin
        if (path === '/admin') {
            if (!isLoggedIn || userRole !== 'admin') {
                window.location.href = isLoggedIn ? '/' : '/login'; // Redirect to home if logged in but not admin, else to login
                return; // Stop rendering
            }
        }

        // Route Guard for /mi-restaurante
        if (path === '/mi-restaurante') {
            if (!isLoggedIn || userRole !== 'propietario') {
                window.location.href = isLoggedIn ? '/' : '/login';
                return;
            }
        }

        // Route Guard for /client-dashboard
        if (path === '/client-dashboard') {
            if (!isLoggedIn || userRole !== 'cliente') {
                window.location.href = isLoggedIn ? '/' : '/login';
                return;
            }
        }

        // Route Guard for /profile/edit
        if (path === '/profile/edit') {
            if (!isLoggedIn) {
                window.location.href = '/login'; // Must be logged in to edit profile
                return;
            }
        }

        app.appendChild(PageComponent(params));
    } else {
        // Página 404
        app.innerHTML = '<h1>404: Página No Encontrada</h1>';
    }
}