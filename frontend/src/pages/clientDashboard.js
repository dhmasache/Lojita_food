// frontend/src/pages/clientDashboard.js
import { router } from '../router.js';
import api from '../services/api.js';

function ClientDashboardPage() {
    const page = document.createElement('div');
    page.className = 'client-dashboard-container'; // Contenedor principal para el diseño

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'cliente') {
        page.innerHTML = `
            <div class="card access-denied">
                <h1>Acceso Denegado</h1>
                <p>No tienes permiso para ver esta página. Debes ser un 'cliente' para acceder a tu panel.</p>
                <a href="/login" data-link class="btn btn-primary">Iniciar Sesión</a>
            </div>
        `;
        return page;
    }

    // Inicializa la estructura HTML básica. El contenido dinámico se cargará después.
    page.innerHTML = `
        <div class="dashboard-header">
            <h1>Bienvenido, ${user.nombre}</h1>
            <span class="user-role">(${user.rol})</span>
        </div>

        <div id="client-message" class="message" style="display: none;"></div>

        <div class="dashboard-content">
            <!-- Sección de Información del Perfil mejorada -->
            <div class="profile-section card profile-section-modern">
                <h2>Mi Perfil</h2>
                <div class="profile-info-grid">
                    <div class="profile-info-item"><span class="profile-icon">👤</span><span><strong>Nombre:</strong> ${user.nombre}</span></div>
                    <div class="profile-info-item"><span class="profile-icon">✉️</span><span><strong>Email:</strong> ${user.email}</span></div>
                    <div class="profile-info-item"><span class="profile-icon">📞</span><span><strong>Teléfono:</strong> ${user.telefono || 'No especificado'}</span></div>
                </div>
                <div class="profile-btn-row">
                    <button id="edit-profile-btn" class="btn btn-secondary">Editar Perfil</button>
                </div>
            </div>

            <!-- Sección de Acciones (solo registro restaurante) -->
            <div class="actions-section card">
                <h2>Mis Acciones</h2>
                <div id="restaurant-registration-status">
                    <!-- El estado de registro del restaurante se cargará aquí -->
                    <p>Cargando estado de registro de restaurante...</p>
                </div>
            </div>
        </div>
    `;

    const clientMessage = page.querySelector('#client-message');
    const restaurantRegistrationStatus = page.querySelector('#restaurant-registration-status');
    // const viewOrdersBtn = page.querySelector('#view-orders-btn'); // Eliminado
    const editProfileBtn = page.querySelector('#edit-profile-btn');

    const displayMessage = (msg, type) => {
        clientMessage.textContent = msg;
        clientMessage.className = `message ${type}`;
        clientMessage.style.display = 'block';
        setTimeout(() => {
            clientMessage.style.display = 'none';
        }, 5000);
    };

    // --- Lógica para el estado de registro del restaurante ---
    const checkRestaurantStatus = async () => {
        console.log("Comprobando estado del restaurante para usuario:", user.id);
        try {
            // 1. Verificar si el usuario ya es propietario de un restaurante
            const userRestaurants = await api.getUserRestaurants(user.id);
            console.log("Respuesta getUserRestaurants:", userRestaurants);
            if (userRestaurants && userRestaurants.length > 0) {
                const ownedRestaurant = userRestaurants[0];
                restaurantRegistrationStatus.innerHTML = `
                    <p>Ya eres propietario del restaurante: <strong>${ownedRestaurant.nombre}</strong>.</p>
                    <p>Gestiona tu restaurante desde el <a href="/mi-restaurante" data-link class="btn btn-tertiary">Panel de Propietario</a>.</p>
                `;
                return; // Ya es propietario, no necesita botón de registro
            }

            // 2. Verificar si el usuario tiene una solicitud pendiente
            const userSolicitudes = await api.getUserSolicitudes(user.id);
            console.log("Respuesta getUserSolicitudes:", userSolicitudes);
            if (userSolicitudes && userSolicitudes.some(s => s.estado === 'pendiente')) {
                restaurantRegistrationStatus.innerHTML = `
                    <p>Ya tienes una solicitud de restaurante <strong>pendiente</strong> de aprobación.</p>
                    <p>Te notificaremos cuando sea revisada.</p>
                `;
                return; // Tiene solicitud pendiente, no necesita botón de registro
            }

            // 3. Si no es propietario y no tiene solicitud pendiente, mostrar botón de registro
            console.log("Usuario no tiene restaurante ni solicitudes pendientes. Mostrando botón de registro.");
            restaurantRegistrationStatus.innerHTML = `
                <p>¿Quieres registrar tu restaurante?</p>
                <button id="register-restaurant-btn" class="btn btn-primary">Registrar mi Restaurante</button>
            `;
            const registerRestaurantBtn = page.querySelector('#register-restaurant-btn');
            if (registerRestaurantBtn) {
                registerRestaurantBtn.addEventListener('click', () => {
                    window.history.pushState({}, '', '/solicitud');
                    router();
                });
            }

        } catch (error) {
            console.error('Error checking restaurant status:', error);
            restaurantRegistrationStatus.innerHTML = `<p class="error">Error al cargar el estado del restaurante. Por favor, intenta de nuevo más tarde.</p>`;
            displayMessage('Error al cargar el estado del restaurante.', 'error');
        }
    };

    // Ejecutar la lógica de estado del restaurante después de que el DOM de la página esté disponible
    // Se usa setTimeout 0 para asegurar que los elementos del page.innerHTML ya estén en el DOM.
    setTimeout(() => {
        checkRestaurantStatus();
    }, 0);


    // --- Event Listeners ---
    editProfileBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/profile/edit');
        router();
    });




    return page;
}

export { ClientDashboardPage };