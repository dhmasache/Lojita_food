// frontend/src/pages/restaurantDetailPage.js
import api from '../services/api.js';
import '../styles/restaurantDetail.css'; // Importar el nuevo archivo CSS

function RestaurantDetailPage(params) {
    const restaurantId = params.id;
    const page = document.createElement('div');
    page.className = 'restaurant-detail-page';

    page.innerHTML = `
        <div class="restaurant-detail-content">
            <h1 class="page-title">Detalles del Restaurante</h1>
            <div id="loading-message" class="message">Cargando detalles del restaurante ${restaurantId}...</div>
            <div id="error-message" class="message error" style="display: none;"></div>
            
            <div id="restaurant-details" class="detail-container" style="display: none;">
                <!-- Detalles del restaurante se cargarán aquí -->
            </div>
        </div>
    `;

    const restaurantDetailsDiv = page.querySelector('#restaurant-details');
    const loadingMessageDiv = page.querySelector('#loading-message');
    const errorMessageDiv = page.querySelector('#error-message');

    const fetchRestaurantDetails = async () => {
        loadingMessageDiv.style.display = 'block';
        errorMessageDiv.style.display = 'none';
        restaurantDetailsDiv.style.display = 'none'; // Ocultar detalles mientras carga

        try {
            const restaurante = await api.getRestauranteById(restaurantId);
            loadingMessageDiv.style.display = 'none'; // Clear loading message

            if (restaurante) {
                restaurantDetailsDiv.style.display = 'block'; // Mostrar detalles
                restaurantDetailsDiv.innerHTML = `
                    <img src="${restaurante.imageUrl ? `http://localhost:3000${restaurante.imageUrl}` : '/Logo_Lojitafood.png'}" alt="${restaurante.nombre}" class="restaurant-image-main">
                    
                    <h2 class="restaurant-title">${restaurante.nombre}</h2>
                    
                    <div class="detail-section">
                        <div class="detail-item"><strong>Dirección:</strong> <span>${restaurante.direccion}</span></div>
                        <div class="detail-item"><strong>Teléfono:</strong> <span>${restaurante.telefono}</span></div>
                        <div class="detail-item"><strong>Email:</strong> <span>${restaurante.email || 'N/A'}</span></div>
                        <div class="detail-item"><strong>Horario:</strong> <span>${restaurante.horarioApertura} - ${restaurante.horarioCierre}</span></div>
                        <div class="detail-item"><strong>Tradicional:</strong> <span>${restaurante.esTradicional ? 'Sí' : 'No'}</span></div>
                    </div>

                    <div class="detail-section description-section">
                        <h3>Descripción</h3>
                        <p class="description">${restaurante.descripcion || 'Sin descripción detallada.'}</p>
                    </div>

                    <div class="detail-section rating-section">
                        <h3>Calificación Promedio</h3>
                        <p class="rating">${restaurante.calificacionPromedio ? `⭐ ${parseFloat(restaurante.calificacionPromedio).toFixed(1)}` : 'N/A'}</p>
                    </div>

                    <!-- TODO: Add dishes, reviews sections here -->
                `;
            } else {
                errorMessageDiv.textContent = 'Restaurante no encontrado.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            loadingMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = `Error al cargar los detalles del restaurante: ${error.message}`;
            errorMessageDiv.style.display = 'block';
            console.error('Error fetching restaurant details:', error);
        }
    };

    if (restaurantId) {
        fetchRestaurantDetails();
    } else {
        errorMessageDiv.textContent = 'No se ha especificado un ID de restaurante.';
        errorMessageDiv.style.display = 'block';
    }

    return page;
}

export { RestaurantDetailPage };
