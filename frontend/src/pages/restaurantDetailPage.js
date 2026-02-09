// frontend/src/pages/restaurantDetailPage.js
import api from '../services/api.js';
import '../styles/restaurantDetail.css'; // Importar el nuevo archivo CSS

function RestaurantDetailPage(params) {
    const restaurantId = params.id;
    const page = document.createElement('div');
    page.className = 'restaurant-detail-page';

    // Build the initial HTML structure, including placeholders for dynamic content
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

    // The fetchRestaurantDetails function will now be responsible for querying elements
    // from the live DOM and populating them.
    const fetchRestaurantDetails = async () => {
        // Query elements from the 'page' after it's in the DOM
        const restaurantDetailsDiv = page.querySelector('#restaurant-details');
        const loadingMessageDiv = page.querySelector('#loading-message');
        const errorMessageDiv = page.querySelector('#error-message');

        // Check if elements are found before proceeding
        if (!restaurantDetailsDiv || !loadingMessageDiv || !errorMessageDiv) {
            console.error('Error: Required DOM elements not found after page render.');
            // Fallback: Display error directly on the page if main elements are missing
            page.innerHTML = `<p class="error">Error interno: Elementos de página no encontrados.</p>`;
            return;
        }
        
        console.log('Fetching details for restaurantId:', restaurantId);
        loadingMessageDiv.style.display = 'block';
        errorMessageDiv.style.display = 'none';
        restaurantDetailsDiv.style.display = 'none'; // Ocultar detalles mientras carga

        const currentUser = JSON.parse(localStorage.getItem('lojita_user'));

        try {
            const restaurante = await api.getRestauranteById(restaurantId);
            loadingMessageDiv.style.display = 'none'; // Clear loading message

            const [dishes, loggedInUser] = await Promise.all([
                api.getPlatos(restaurantId),
                currentUser ? api.getUsuarioById(currentUser.id) : Promise.resolve(null)
            ]);

            const userAlergiaIds = loggedInUser && loggedInUser.Alergias ? loggedInUser.Alergias.map(a => a.id.toString()) : [];
            
            if (restaurante) {
                restaurantDetailsDiv.style.display = 'block'; // Mostrar detalles

                restaurantDetailsDiv.innerHTML = `
                    <img src="${restaurante.imageUrl ? `http://localhost:3000${restaurante.imageUrl}` : '/Logo_Lojitafood.png'}" alt="${restaurante.nombre}" class="restaurant-image-main">
                    
                    <h2 class="restaurant-title">${restaurante.nombre}</h2>
                    
                    <div class="detail-section">
                        <div class="detail-item"><strong>Dirección:</strong> <span>${restaurante.direccion}</span></div>
                        ${restaurante.Canton ? `<div class="detail-item"><strong>Cantón:</strong> <span>${restaurante.Canton.nombre}</span></div>` : ''}
                        <div class="detail-item"><strong>Teléfono:</strong> <span>${restaurante.telefono}</span></div>
                        <div class="detail-item"><strong>Email:</strong> <span>${restaurante.email || 'N/A'}</span></div>
                        ${restaurante.horarioLunesViernesApertura && restaurante.horarioLunesViernesCierre ? 
                            `<div class="detail-item"><strong>Horario L-V:</strong> <span>${restaurante.horarioLunesViernesApertura} - ${restaurante.horarioLunesViernesCierre}</span></div>` : ''}
                        ${restaurante.horarioSabadoDomingoApertura && restaurante.horarioSabadoDomingoCierre ? 
                            `<div class="detail-item"><strong>Horario S-D:</strong> <span>${restaurante.horarioSabadoDomingoApertura} - ${restaurante.horarioSabadoDomingoCierre}</span></div>` : ''}
                        <div class="detail-item"><strong>Tradicional:</strong> <span>${restaurante.esTradicional ? 'Sí' : 'No'}</span></div>
                    </div>

                    <div class="detail-section description-section">
                        <h3>Descripción</h3>
                        <p class="description">${restaurante.descripcion || 'Sin descripción detallada.'}</p>
                    </div>

                    <div class="detail-section delivery-apps-section">
                        <h3>Disponible en Apps de Delivery</h3>
                        <div class="delivery-apps-list">
                            ${restaurante.DeliveryApps && restaurante.DeliveryApps.length > 0 ? 
                                restaurante.DeliveryApps.map(app => `<span class="delivery-app-tag">${app.nombre}</span>`).join('') : 
                                '<p class="no-delivery-apps">No disponible en apps de delivery.</p>'}
                        </div>
                    </div>

                    <div class="detail-section rating-section">
                        <h3>Calificación Promedio</h3>
                        <p class="rating">${restaurante.calificacionPromedio ? `⭐ ${parseFloat(restaurante.calificacionPromedio).toFixed(1)}` : 'N/A'}</p>
                    </div>

                    <div class="detail-section dishes-section">
                        <h3>Nuestros Platos</h3>
                        <div id="restaurant-dishes-list" class="dishes-grid">
                            ${dishes.length === 0 ? '<p>No hay platos disponibles en este restaurante.</p>' : ''}
                        </div>
                    </div>
                `;
                
                const updatedRestaurantDishesList = restaurantDetailsDiv.querySelector('#restaurant-dishes-list');

                dishes.forEach(dish => {
                    const dishAlergiaIds = dish.Alergias ? dish.Alergias.map(a => a.id.toString()) : [];
                    const containsUserAllergy = userAlergiaIds.some(userAllergyId => dishAlergiaIds.includes(userAllergyId));
                    
                    const dishItem = document.createElement('div');
                    dishItem.className = 'dish-item card';
                    dishItem.innerHTML = `
                        <h4>${dish.nombre}</h4>
                        ${dish.imagenUrl ? `<img src="http://localhost:3000${dish.imagenUrl}" alt="${dish.nombre}" class="dish-image">` : '<p>No hay imagen.</p>'}
                        <p>${dish.descripcion || 'Sin descripción.'}</p>
                        <p><strong>Precio:</strong> $${parseFloat(dish.precio).toFixed(2)}</p>
                        ${dish.preparacion ? `<p><strong>Preparación:</strong> ${dish.preparacion}</p>` : ''}
                        ${dish.Alergias && dish.Alergias.length > 0 ? 
                            `<p><strong>Alérgenos:</strong> ${dish.Alergias.map(a => a.nombre).join(', ')}</p>` : ''}
                        ${containsUserAllergy ? `<p class="allergy-warning">⚠️ Contiene un ingrediente al que eres alérgico.</p>` : ''}
                    `;
                    updatedRestaurantDishesList.appendChild(dishItem);
                });
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

    // Defer the execution of fetchRestaurantDetails until the page is potentially in the DOM
    if (restaurantId) {
        setTimeout(fetchRestaurantDetails, 0); // Execute after current call stack
    } else {
        // These elements need to be queried after page.innerHTML is set
        const localErrorMessageDiv = page.querySelector('#error-message');
        if (localErrorMessageDiv) {
            localErrorMessageDiv.textContent = 'No se ha especificado un ID de restaurante.';
            localErrorMessageDiv.style.display = 'block';
        }
    }

    return page;
}

export { RestaurantDetailPage };
