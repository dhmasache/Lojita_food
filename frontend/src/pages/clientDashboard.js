// frontend/src/pages/clientDashboard.js
import { router } from '../router.js';
import api from '../services/api.js';

function ClientDashboardPage() {
    const page = document.createElement('div');
    page.className = 'client-dashboard-container dashboard-container'; // Reutilizar estilos de dashboard

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'cliente') {
        page.innerHTML = `
            <h1>Acceso Denegado</h1>
            <p>No tienes permiso para ver esta página. Debes ser un 'cliente' para acceder a tu panel.</p>
            <a href="/login" data-link>Iniciar Sesión</a>
        `;
        return page;
    }

    page.innerHTML = `
        <h1>Bienvenido, ${user.nombre}</h1>
        <p>Este es tu panel de cliente. Aquí puedes registrar tu restaurante y gestionar tus pedidos.</p>

        <div id="client-message" class="message" style="display: none;"></div>

        <div class="client-actions-section">
            <button id="register-restaurant-btn" class="btn btn-primary">Registrar mi Restaurante</button>
        </div>
    `;

    const clientMessage = page.querySelector('#client-message');

    const displayMessage = (msg, type) => {
        clientMessage.textContent = msg;
        clientMessage.className = `message ${type}`;
        clientMessage.style.display = 'block';
        setTimeout(() => {
            clientMessage.style.display = 'none';
        }, 5000);
    };


    // Event listener for "Registrar mi Restaurante" button
    const registerRestaurantBtn = page.querySelector('#register-restaurant-btn');
    registerRestaurantBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/solicitud');
        router();
    });

    return page;
}

export { ClientDashboardPage };