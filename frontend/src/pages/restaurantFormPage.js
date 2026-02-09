// frontend/src/pages/restaurantFormPage.js
import api from '../services/api.js';
import { router } from '../router.js';
import { initializeLeafletMap, setLeafletMapLocation, searchAddressOnLeafletMap } from '../lib/leafletMapHandler.js';

function RestaurantFormPage(params) {
    const page = document.createElement('div');
    page.className = 'restaurant-form-page-container'; // Nueva clase para estilos específicos

    const isEditMode = params.id ? true : false;
    const restaurantId = params.id;
    let currentRestaurant = null;
    let currentLeafletMapInstance = null; // To hold the Leaflet map instance

    // HTML del formulario (movido desde adminDashboard.js)
    page.innerHTML = `
        <div class="restaurant-form-card">
            <h2 id="form-title">${isEditMode ? 'Editar Restaurante' : 'Agregar Nuevo Restaurante'}</h2>
            <form id="restaurant-form" enctype="multipart/form-data">
                <input type="hidden" name="id" id="restaurant-id-input" value="${restaurantId || ''}">
                
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="cantonId">Cantón</label>
                    <select id="cantonId" name="cantonId" required>
                        <option value="">Selecciona un Cantón</option>
                        <!-- Options will be loaded dynamically -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="horarioLunesViernesApertura">Horario L-V Apertura</label>
                    <input type="time" id="horarioLunesViernesApertura" name="horarioLunesViernesApertura" required>
                </div>
                <div class="form-group">
                    <label for="horarioLunesViernesCierre">Horario L-V Cierre</label>
                    <input type="time" id="horarioLunesViernesCierre" name="horarioLunesViernesCierre" required>
                </div>
                <div class="form-group">
                    <label for="horarioSabadoDomingoApertura">Horario S-D Apertura</label>
                    <input type="time" id="horarioSabadoDomingoApertura" name="horarioSabadoDomingoApertura" required>
                </div>
                <div class="form-group">
                    <label for="horarioSabadoDomingoCierre">Horario S-D Cierre</label>
                    <input type="time" id="horarioSabadoDomingoCierre" name="horarioSabadoDomingoCierre" required>
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion"></textarea>
                </div>
                <div class="form-group">
                    <label>Aplicaciones de Delivery (Selecciona todas las que apliquen)</label>
                    <div id="delivery-apps-checkboxes" class="checkbox-group">
                        <!-- Delivery App checkboxes will be loaded here -->
                        <p>Cargando aplicaciones de delivery...</p>
                    </div>
                </div>
                <div class="form-group">
                    <label for="esTradicional-checkbox">Es Tradicional</label>
                    <input type="checkbox" id="esTradicional-checkbox" name="esTradicional">
                </div>
                <div class="form-group">
                    <label>Imagen Actual</label>
                    <img id="current-image-preview" src="" alt="Imagen del restaurante" style="max-width: 100px; display: ${isEditMode && currentRestaurant && currentRestaurant.imageUrl ? 'block' : 'none'};">
                    <div class="custom-file-upload">
                        <input type="file" name="imageUrlFile" id="imageUrlFile" accept="image/*" class="hidden-file-input">
                        <label for="imageUrlFile" class="custom-upload-button">Seleccionar Archivo</label>
                        <span id="file-name-display" class="file-name-display">Ningún archivo seleccionado</span>
                    </div>
                </div>

                <!-- Map Integration (Leaflet) -->
                <div class="form-group">
                    <label>Ubicación (Arrastra el marcador o busca)</label>
                    <input type="text" id="map-search-address" placeholder="Buscar dirección..." class="form-control mb-2">
                    <div id="leaflet-map" style="height: 300px; width: 100%; border-radius: var(--border-radius-md); margin-top: 10px;"></div>
                    <input type="hidden" name="direccion" id="restaurant-address-input">
                    <input type="hidden" name="latitud" id="restaurant-latitud-input">
                    <input type="hidden" name="longitud" id="restaurant-longitud-input">
                    <p>Latitud: <span id="display-latitud"></span>, Longitud: <span id="display-longitud"></span></p>
                    <p>Dirección Seleccionada: <span id="display-address"></span></p>
                </div>

                <div id="form-message" class="message" style="display: none;"></div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Guardar Restaurante</button>
                    <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    // References to form elements
    const formTitle = page.querySelector('#form-title');
    const restaurantForm = page.querySelector('#restaurant-form');
    const restaurantIdInput = page.querySelector('#restaurant-id-input');
    const nombreInput = page.querySelector('#nombre');
    const telefonoInput = page.querySelector('#telefono');
    const emailInput = page.querySelector('#email');
    const cantonSelect = page.querySelector('#cantonId');
    const horarioLunesViernesAperturaInput = page.querySelector('#horarioLunesViernesApertura');
    const horarioLunesViernesCierreInput = page.querySelector('#horarioLunesViernesCierre');
    const horarioSabadoDomingoAperturaInput = page.querySelector('#horarioSabadoDomingoApertura');
    const horarioSabadoDomingoCierreInput = page.querySelector('#horarioSabadoDomingoCierre');
    const descripcionTextarea = page.querySelector('#descripcion');
    const deliveryAppsCheckboxesContainer = page.querySelector('#delivery-apps-checkboxes');
    const esTradicionalCheckbox = page.querySelector('#esTradicional-checkbox');
    const currentImagePreview = page.querySelector('#current-image-preview');
    const imageUrlFileInput = page.querySelector('#imageUrlFile'); // Changed ID
    const fileNameDisplay = page.querySelector('#file-name-display'); // New element for file name display
    const formMessage = page.querySelector('#form-message');
    const cancelBtn = page.querySelector('#cancel-btn');

    // Map elements
    const leafletMapElement = page.querySelector('#leaflet-map');
    const mapSearchAddressInput = page.querySelector('#map-search-address');
    const restaurantLatitudInput = page.querySelector('#restaurant-latitud-input');
    const restaurantLongitudInput = page.querySelector('#restaurant-longitud-input');
    const restaurantAddressInput = page.querySelector('#restaurant-address-input');
    const displayLatitud = page.querySelector('#display-latitud');
    const displayLongitud = page.querySelector('#display-longitud');
    const displayAddress = page.querySelector('#display-address');

    // Callback for map location changes
    const onLeafletLocationChangeCallback = (lat, lng, address) => {
        restaurantLatitudInput.value = lat;
        restaurantLongitudInput.value = lng;
        restaurantAddressInput.value = address;
        displayLatitud.textContent = lat.toFixed(6);
        displayLongitud.textContent = lng.toFixed(6);
        displayAddress.textContent = address;
    };

    // Function to fetch cantones and populate the select dropdown
    const populateCantonesSelect = async () => {
        try {
            const cantones = await api.getCantones();
            cantones.forEach(canton => {
                const option = document.createElement('option');
                option.value = canton.id;
                option.textContent = canton.nombre;
                cantonSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching cantones:', error);
            formMessage.textContent = 'Error al cargar los cantones.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        }
    };

    const populateDeliveryAppsCheckboxes = async () => {
        deliveryAppsCheckboxesContainer.innerHTML = '<p>Cargando aplicaciones de delivery...</p>';
        try {
            const deliveryApps = await api.getDeliveryApps();
            deliveryAppsCheckboxesContainer.innerHTML = ''; // Clear loading message
            if (deliveryApps.length === 0) {
                deliveryAppsCheckboxesContainer.innerHTML = '<p>No hay aplicaciones de delivery disponibles.</p>';
                return;
            }
            deliveryApps.forEach(app => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox-item';
                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="deliveryApp-${app.idApp}" name="deliveryAppIds" value="${app.idApp}">
                    <label for="deliveryApp-${app.idApp}">${app.nombre}</label>
                `;
                deliveryAppsCheckboxesContainer.appendChild(checkboxDiv);
            });
        } catch (error) {
            console.error('Error fetching delivery apps:', error);
            formMessage.textContent = 'Error al cargar las aplicaciones de delivery.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        }
    };

    // Load restaurant data if in edit mode
    const loadRestaurantData = async () => {
        try {
            currentRestaurant = await api.getRestauranteById(restaurantId);
            if (currentRestaurant) {
                nombreInput.value = currentRestaurant.nombre;
                telefonoInput.value = currentRestaurant.telefono;
                emailInput.value = currentRestaurant.email;
                cantonSelect.value = currentRestaurant.cantonId;
                horarioLunesViernesAperturaInput.value = currentRestaurant.horarioLunesViernesApertura;
                horarioLunesViernesCierreInput.value = currentRestaurant.horarioLunesViernesCierre;
                horarioSabadoDomingoAperturaInput.value = currentRestaurant.horarioSabadoDomingoApertura;
                horarioSabadoDomingoCierreInput.value = currentRestaurant.horarioSabadoDomingoCierre;
                descripcionTextarea.value = currentRestaurant.descripcion;
                esTradicionalCheckbox.checked = currentRestaurant.esTradicional;

                // Pre-select delivery apps
                if (currentRestaurant.DeliveryApps && currentRestaurant.DeliveryApps.length > 0) {
                    currentRestaurant.DeliveryApps.forEach(app => {
                        const checkbox = page.querySelector(`#deliveryApp-${app.idApp}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                }

                if (currentRestaurant.imageUrl) {
                    currentImagePreview.src = currentRestaurant.imageUrl;
                    currentImagePreview.style.display = 'block';
                    // No hay nombre de archivo para mostrar en modo edición, a menos que se seleccione uno nuevo
                    fileNameDisplay.textContent = currentRestaurant.imageUrl.split('/').pop();
                }

                // Set map to restaurant's location
                const initialLocation = (currentRestaurant.latitud && currentRestaurant.longitud) ?
                                { lat: parseFloat(currentRestaurant.latitud), lng: parseFloat(currentRestaurant.longitud) } :
                                defaultLocation; // Fallback to default if no coords

                setLeafletMapLocation(initialLocation);
                onLeafletLocationChangeCallback(initialLocation.lat, initialLocation.lng, currentRestaurant.direccion || 'Dirección no disponible');
            }
        } catch (error) {
            console.error('Error loading restaurant for edit:', error);
            formMessage.textContent = 'Error al cargar los datos del restaurante.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        }
    };

    // Initialize map
    const defaultLocation = { lat: -3.99268, lng: -79.20788 }; // Default to Loja
    currentLeafletMapInstance = initializeLeafletMap(
        leafletMapElement,
        defaultLocation,
        15,
        true,
        onLeafletLocationChangeCallback
    );
    // Force Leaflet to recalculate its size
    if (currentLeafletMapInstance) {
        setTimeout(() => {
            currentLeafletMapInstance.invalidateSize();
        }, 0); 
    }


    // Event listener for map search input
    mapSearchAddressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAddressOnLeafletMap(mapSearchAddressInput.value, onLeafletLocationChangeCallback);
        }
    });

    // Event listener for file input change to display file name
    imageUrlFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });


    // Form submission handler
    restaurantForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.style.display = 'none';
        formMessage.className = 'message';

        const formData = new FormData(restaurantForm);
        // Ensure lat, lng, direccion are included from map inputs
        formData.set('latitud', restaurantLatitudInput.value);
        formData.set('longitud', restaurantLongitudInput.value);
        formData.set('direccion', restaurantAddressInput.value);
        formData.set('esTradicional', esTradicionalCheckbox.checked ? 'true' : 'false');

        // Collect selected delivery app IDs
        const selectedDeliveryAppIds = Array.from(deliveryAppsCheckboxesContainer.querySelectorAll('input[name="deliveryAppIds"]:checked'))
                                            .map(checkbox => checkbox.value);
        selectedDeliveryAppIds.forEach(id => {
            formData.append('deliveryAppIds[]', id);
        });

        // Basic validation for map location
        if (!formData.get('latitud') || !formData.get('longitud') || !formData.get('direccion')) {
            formMessage.textContent = 'Por favor, selecciona la ubicación del restaurante en el mapa o busca una dirección.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
            return;
        }

        try {
            if (isEditMode) {
                await api.updateRestaurante(restaurantId, formData);
                formMessage.textContent = 'Restaurante actualizado con éxito!';
            } else {
                await api.createRestaurante(formData);
                formMessage.textContent = 'Restaurante creado con éxito!';
            }
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            
            // Redirect back to admin dashboard after successful submission
            setTimeout(() => {
                window.history.pushState({}, '', '/admin');
                router();
            }, 1500);

        } catch (error) {
            console.error('Error saving restaurant:', error);
            formMessage.textContent = error.message || 'Error al guardar restaurante.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/admin');
        router();
    });

    // Load data if in edit mode
    if (isEditMode) {
        loadRestaurantData();
    } else {
        // For new restaurant, set initial map location and callback
        // This is important because loadRestaurantData() sets it for edit mode
        // but for new mode, we need to manually call the callback once map is initialized
        onLeafletLocationChangeCallback(defaultLocation.lat, defaultLocation.lng, 'Ubicación predeterminada (Loja)');
    }

    populateCantonesSelect(); // Call to populate cantones
    populateDeliveryAppsCheckboxes(); // Call to populate delivery apps

    return page;
}

export { RestaurantFormPage };