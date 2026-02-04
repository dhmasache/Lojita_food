// frontend/src/pages/clientDashboard.js
import { router } from '../router.js';
import api from '../services/api.js';

function ClientDashboardPage() {
    const page = document.createElement('div');
    page.className = 'client-dashboard-container';

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
        <p>Este es tu panel de cliente. Aquí puedes registrar tu restaurante, explorar otros establecimientos y gestionar tus pedidos.</p>

        <div class="client-actions-section">
            <button id="register-restaurant-btn" class="btn btn-primary">Registrar mi Restaurante</button>
        </div>

        <div class="restaurants-exploration-section">
            <h2>Explorar Restaurantes</h2>
            <div id="restaurants-list" class="restaurants-grid">
                <p>Cargando restaurantes...</p>
            </div>
        </div>
    `;

    // Event listener for "Registrar mi Restaurante" button
    const registerRestaurantBtn = page.querySelector('#register-restaurant-btn');
    registerRestaurantBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/solicitud');
        router();
    });

    const restaurantsListContainer = page.querySelector('#restaurants-list');

    const fetchRestaurants = async () => {
        restaurantsListContainer.innerHTML = '<p>Cargando restaurantes...</p>';
        try {
            const restaurantes = await api.getRestaurantes(); // Assuming an API call to get all restaurants
            if (restaurantes.length === 0) {
                restaurantsListContainer.innerHTML = '<p>No hay restaurantes disponibles para explorar.</p>';
                return;
            }

            restaurantsListContainer.innerHTML = ''; // Clear loading message
            restaurantes.forEach(restaurante => {
                const restaurantItem = document.createElement('div');
                restaurantItem.className = 'restaurant-item card';
                restaurantItem.innerHTML = `
                    <h3>${restaurante.nombre}</h3>
                    <p><strong>Dirección:</strong> ${restaurante.direccion}</p>
                    <p><strong>Teléfono:</strong> ${restaurante.telefono || 'N/A'}</p>
                    <p><strong>Email:</strong> ${restaurante.email || 'N/A'}</p>
                    <p><strong>Horario:</strong> ${restaurante.horarioApertura} - ${restaurante.horarioCierre}</p>
                    <p><strong>Calificación:</strong> ${restaurante.calificacionPromedio}/5</p>
                    ${restaurante.imageUrl ? `<img src="${restaurante.imageUrl}" alt="${restaurante.nombre}" class="restaurant-image">` : ''}
                    <button class="btn btn-secondary view-restaurant-btn" data-id="${restaurante.id}">Ver Detalles</button>
                `;
                restaurantsListContainer.appendChild(restaurantItem);
            });

            // Add event listeners for "Ver Detalles" buttons
            restaurantsListContainer.querySelectorAll('.view-restaurant-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    // TODO: Implement navigation to a specific restaurant detail page if available
                    console.log(`Ver detalles del restaurante con ID: ${id}`);
                    // Example: window.history.pushState({}, '', `/restaurante/${id}`); router();
                });
            });

        } catch (error) {
            restaurantsListContainer.innerHTML = `<p class="error">Error al cargar restaurantes: ${error.message}</p>`;
            console.error('Error fetching restaurants:', error);
        }
    };

    fetchRestaurants();

    return page;
}

export { ClientDashboardPage };
