// frontend/src/pages/restaurantsPage.js
import api from '../services/api.js';
import { router } from '../router.js'; // Necesario para redirección si se hace click en Ver Detalles
import '../styles/restaurants.css'; // Importar el nuevo archivo CSS

function RestaurantsPage() {
    const page = document.createElement('div');
    page.className = 'restaurants-page-container'; // Usar solo la clase específica de la página

    // Extract search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    page.innerHTML = `
        <h1>Explorar Restaurantes</h1>
        <p>Descubre los mejores sabores de Loja. Aquí tienes una guía completa de todos nuestros restaurantes.</p>
        ${searchTerm ? `<p class="search-status">Resultados de búsqueda para: <strong>"${searchTerm}"</strong></p>` : ''}

        <div id="restaurants-list-message" class="message" style="display: none;"></div>
        
        <div id="restaurants-list" class="restaurants-grid">
            <p>Cargando restaurantes...</p>
        </div>
    `;

    const restaurantsListContainer = page.querySelector('#restaurants-list');
    const restaurantsListMessage = page.querySelector('#restaurants-list-message');

    const displayMessage = (msg, type) => {
        restaurantsListMessage.textContent = msg;
        restaurantsListMessage.className = `message ${type}`;
        restaurantsListMessage.style.display = 'block';
        setTimeout(() => {
            restaurantsListMessage.style.display = 'none';
        }, 5000);
    };

    const fetchAllRestaurants = async (searchParam = '') => { // Accept optional searchParam
        restaurantsListContainer.innerHTML = '<p>Cargando restaurantes...</p>';
        try {
            const restaurantes = await api.getRestaurantes(searchParam); // Pass searchParam to API
            if (restaurantes.length === 0) {
                restaurantsListContainer.innerHTML = `<p>No hay restaurantes disponibles ${searchParam ? `para "${searchParam}"` : 'para explorar'}.</p>`;
                return;
            }

            restaurantsListContainer.innerHTML = ''; // Limpiar mensaje de carga
            restaurantes.forEach(restaurante => {
                const restaurantItem = document.createElement('div');
                restaurantItem.className = 'restaurant-item';
                restaurantItem.innerHTML = `
                    ${restaurante.imageUrl ? `<img src="http://localhost:3000${restaurante.imageUrl}" alt="${restaurante.nombre}" class="restaurant-image">` : ''}
                    <div class="card-content">
                        <h3>${restaurante.nombre}</h3>
                        <p>${restaurante.descripcion ? restaurante.descripcion.substring(0, 70) + '...' : 'Sin descripción.'}</p>
                        <div class="restaurant-item-footer">
                            <span>⭐ ${restaurante.calificacionPromedio || 'N/A'}</span>
                            <span>🕒 ${restaurante.horarioApertura} - ${restaurante.horarioCierre}</span>
                        </div>
                        <button class="btn btn-primary view-restaurant-btn" data-id="${restaurante.id}">Ver Detalles</button>
                    </div>
                `;
                restaurantsListContainer.appendChild(restaurantItem);
            });

            restaurantsListContainer.querySelectorAll('.view-restaurant-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    // TODO: Implement navigation to a specific restaurant detail page if available
                    console.log(`Ver detalles del restaurante con ID: ${id}`);
                    // Example: window.history.pushState({}, '', `/restaurante/${id}`); router();
                });
            });

        } catch (error) {
            displayMessage(error.message || 'Error al cargar restaurantes.', 'error');
            restaurantsListContainer.innerHTML = `<p class="error">Error al cargar restaurantes: ${error.message}</p>`;
            console.error('Error fetching all restaurants:', error);
        }
    };

    fetchAllRestaurants(searchTerm); // Pass the search term on initial load

    return page;
}

export { RestaurantsPage };
