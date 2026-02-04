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
import { ClientDashboardPage } from './pages/clientDashboard.js'; // Nuevo: Importar ClientDashboardPage

const routes = {
    '/': HomePage,
    '/about': AboutPage,
    '/login': LoginPage,
    '/register': RegisterPage,
    '/verify-account': VerifyAccountPage,
    '/forgot-password': ForgotPasswordPage,
    '/reset-password/:token': ResetPasswordPage,
    '/admin': AdminDashboardPage,
    '/mi-restaurante': PropietarioDashboardPage,
    '/solicitud': SolicitudPage, // Modificado: Ruta a '/solicitud'
    '/client-dashboard': ClientDashboardPage, // Nuevo: Ruta para el dashboard del cliente
};

export function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');

    if (!app) {
        console.error("El elemento #app no se encuentra en el DOM.");
        return;
    }
    
    // Limpia el contenido anterior
    app.innerHTML = '';

    // Encuentra el componente para la ruta actual
    const PageComponent = routes[path];

    if (PageComponent) {
        app.appendChild(PageComponent());
    } else {
        // Página 404
        app.innerHTML = '<h1>404: Página No Encontrada</h1>';
    }
}

