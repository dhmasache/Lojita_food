// frontend/src/pages/restaurantsPage.js
import api from '../services/api.js';
import { router } from '../router.js'; // Necesario para redirección si se hace click en Ver Detalles
import '../styles/restaurants.css'; // Importar el nuevo archivo CSS

function RestaurantsPage() {
    const page = document.createElement('div');
    page.className = 'restaurants-page-container'; // Usar solo la clase específica de la página

    // Extract search term and canton info from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const cantonId = urlParams.get('cantonId');
    const cantonNombre = urlParams.get('cantonNombre');

    page.innerHTML = `
        <h1>Explorar Restaurantes ${cantonNombre ? `en ${cantonNombre}` : ''}</h1>
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

    const fetchAllRestaurants = async (searchParam = '', cantonFilterId = null) => { // Accept optional searchParam and cantonFilterId
        restaurantsListContainer.innerHTML = '<p>Cargando restaurantes...</p>';
        try {
            let endpoint = '/restaurantes';
            const params = new URLSearchParams();
            if (searchParam) {
                params.append('search', searchParam);
            }
            if (cantonFilterId) {
                params.append('cantonId', cantonFilterId);
            }
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const restaurantes = await api.getRestaurantes(endpoint); // Pass modified endpoint to API
            if (restaurantes.length === 0) {
                restaurantsListContainer.innerHTML = `<p>No hay restaurantes disponibles ${searchParam ? `para "${searchParam}"` : ''} ${cantonNombre ? `en ${cantonNombre}` : ''} para explorar.</p>`;
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
                        <div class="delivery-apps-list">
                            ${restaurante.DeliveryApps && restaurante.DeliveryApps.length > 0 ? 
                                restaurante.DeliveryApps.map(app => `<span class="delivery-app-tag">${app.nombre}</span>`).join('') : 
                                '<span class="no-delivery-apps">No disponible en apps de delivery</span>'}
                        </div>
                        <div class="restaurant-item-footer">
                            <span>⭐ ${restaurante.calificacionPromedio || 'N/A'}</span>
                            ${restaurante.Canton ? `<span>📍 ${restaurante.Canton.nombre}</span>` : ''}
                            ${restaurante.horarioLunesViernesApertura && restaurante.horarioLunesViernesCierre ? 
                                `<span>L-V: ${restaurante.horarioLunesViernesApertura} - ${restaurante.horarioLunesViernesCierre}</span>` : ''}
                            ${restaurante.horarioSabadoDomingoApertura && restaurante.horarioSabadoDomingoCierre ? 
                                `<span>S-D: ${restaurante.horarioSabadoDomingoApertura} - ${restaurante.horarioSabadoDomingoCierre}</span>` : ''}
                        </div>
                        <button class="btn btn-primary view-restaurant-btn" data-id="${restaurante.id}">Ver Detalles</button>
                    </div>
                `;
                restaurantsListContainer.appendChild(restaurantItem);
            });

            restaurantsListContainer.querySelectorAll('.view-restaurant-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    window.history.pushState({}, '', `/restaurante/${id}`);
                    router();
                });
            });

        } catch (error) {
            displayMessage(error.message || 'Error al cargar restaurantes.', 'error');
            restaurantsListContainer.innerHTML = `<p class="error">Error al cargar restaurantes: ${error.message}</p>`;
            console.error('Error fetching all restaurants:', error);
        }
    };

    fetchAllRestaurants(searchTerm, cantonId); // Pass the search term and cantonId on initial load

    return page;
}

export { RestaurantsPage };
