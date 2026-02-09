// frontend/src/pages/solicitudPage.js
import api from '../services/api.js';
import { router } from '../router.js';
import { initializeLeafletMap, setLeafletMapLocation, searchAddressOnLeafletMap } from '../lib/leafletMapHandler.js'; // Import Leaflet map handler

function SolicitudPage() {
    const page = document.createElement('div');
    page.className = 'solicitud-page-container'; // Nueva clase para estilos específicos

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'cliente') {
        page.innerHTML = `
            <div class="solicitud-form-card access-denied">
                <h2>Acceso Denegado</h2>
                <p>Solo los usuarios 'cliente' pueden enviar una solicitud para ser propietario de restaurante.</p>
                <p>Si eres propietario, tu cuenta ya debería reflejarlo. Si crees que hay un error, contacta al administrador.</p>
                <a href="/" data-link class="btn btn-primary">Volver al Inicio</a>
            </div>
        `;
        return page;
    }

    page.innerHTML = `
        <div class="solicitud-form-card">
            <h2>Solicitud para Propietario de Restaurante</h2>
            <p>Completa este formulario para solicitar acceso como propietario de restaurante. Tu solicitud será revisada por un administrador.</p>
            <div id="solicitud-message" class="message" style="display: none;"></div>

            <form id="solicitud-form" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="nombreRestaurante">Nombre del Restaurante</label>
                    <input type="text" id="nombreRestaurante" name="nombreRestaurante" required>
                </div>
                <div class="form-group">
                    <label for="emailRestaurante">Email del Restaurante</label>
                    <input type="email" id="emailRestaurante" name="emailRestaurante">
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
                
                <!-- Map Integration (Leaflet) for Address -->
                <div class="form-group">
                    <label for="map-search-address-solicitud">Ubicación del Restaurante (Arrastra el marcador o busca)</label>
                    <input type="text" id="map-search-address-solicitud" placeholder="Buscar dirección..." class="form-control mb-2">
                    <div id="leaflet-map-solicitud" style="height: 300px; width: 100%; border-radius: var(--border-radius-md); margin-top: 10px;"></div>
                    <input type="hidden" name="direccionRestaurante" id="direccionRestaurante" required>
                    <input type="hidden" name="latitud" id="latitud-solicitud">
                    <input type="hidden" name="longitud" id="longitud-solicitud">
                    <p>Latitud: <span id="display-latitud-solicitud"></span>, Longitud: <span id="display-longitud-solicitud"></span></p>
                    <p>Dirección Seleccionada: <span id="display-address-solicitud"></span></p>
                </div>

                <div class="form-group">
                    <label for="telefonoRestaurante">Teléfono del Restaurante (Opcional)</label>
                    <input type="tel" id="telefonoRestaurante" name="telefonoRestaurante">
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción Adicional (Opcional)</label>
                    <textarea id="descripcion" name="descripcion" rows="5"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Imagen del Restaurante</label>
                    <div class="custom-file-upload">
                        <input type="file" name="restaurantImage" id="restaurantImageSolicitud" accept="image/*" class="hidden-file-input">
                        <label for="restaurantImageSolicitud" class="custom-upload-button">Seleccionar Imagen</label>
                        <span id="restaurant-image-name-display" class="file-name-display">Ningún archivo seleccionado</span>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
            </form>
        </div>
    `;

    const solicitudMessage = page.querySelector('#solicitud-message');

    // Form elements
    const form = page.querySelector('#solicitud-form');
    const emailRestauranteInput = page.querySelector('#emailRestaurante');
    const cantonSelect = page.querySelector('#cantonId');
    const horarioLunesViernesAperturaInput = page.querySelector('#horarioLunesViernesApertura');
    const horarioLunesViernesCierreInput = page.querySelector('#horarioLunesViernesCierre');
    const horarioSabadoDomingoAperturaInput = page.querySelector('#horarioSabadoDomingoApertura');
    const horarioSabadoDomingoCierreInput = page.querySelector('#horarioSabadoDomingoCierre');
    const restaurantImageFileInput = page.querySelector('#restaurantImageSolicitud');
    const restaurantImageNameDisplay = page.querySelector('#restaurant-image-name-display');


    // Map elements
    const leafletMapElement = page.querySelector('#leaflet-map-solicitud');
    const mapSearchAddressInput = page.querySelector('#map-search-address-solicitud');
    const latitudInput = page.querySelector('#latitud-solicitud');
    const longitudInput = page.querySelector('#longitud-solicitud');
    const direccionRestauranteInput = page.querySelector('#direccionRestaurante');
    const displayLatitud = page.querySelector('#display-latitud-solicitud');
    const displayLongitud = page.querySelector('#display-longitud-solicitud');
    const displayAddress = page.querySelector('#display-address-solicitud');

    let currentLeafletMapInstance = null;

    const displayMessage = (msg, type) => {
        solicitudMessage.textContent = msg;
        solicitudMessage.className = `message ${type}`;
        solicitudMessage.style.display = 'block';
        setTimeout(() => {
            solicitudMessage.style.display = 'none';
        }, 5000);
    };

    // Callback for map location changes
    const onLeafletLocationChangeCallback = (lat, lng, address) => {
        latitudInput.value = lat;
        longitudInput.value = lng;
        direccionRestauranteInput.value = address;
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
            displayMessage('Error al cargar los cantones.', 'error');
        }
    };

    // Initialize map immediately when the form is present
    const defaultLocation = { lat: -3.99268, lng: -79.20788 }; // Default to Loja, Ecuador
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
    
            populateCantonesSelect(); // Call to populate cantones
    
            // Event listener for map search input
    mapSearchAddressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAddressOnLeafletMap(mapSearchAddressInput.value, onLeafletLocationChangeCallback);
        }
    });

    // Event listener for file input change to display file name
    restaurantImageFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            restaurantImageNameDisplay.textContent = e.target.files[0].name;
        } else {
            restaurantImageNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });


    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        solicitudMessage.style.display = 'none';
        solicitudMessage.className = 'message';

        const formData = new FormData();
        formData.append('nombreRestaurante', form.elements.nombreRestaurante.value);
        formData.append('direccionRestaurante', direccionRestauranteInput.value);
        formData.append('telefonoRestaurante', form.elements.telefonoRestaurante.value);
        formData.append('descripcion', form.elements.descripcion.value);
        formData.append('latitud', latitudInput.value);
        formData.append('longitud', longitudInput.value);
        formData.append('email', emailRestauranteInput.value); // Añadir email
        formData.append('cantonId', cantonSelect.value);
        formData.append('horarioLunesViernesApertura', horarioLunesViernesAperturaInput.value);
        formData.append('horarioLunesViernesCierre', horarioLunesViernesCierreInput.value);
        formData.append('horarioSabadoDomingoApertura', horarioSabadoDomingoAperturaInput.value);
        formData.append('horarioSabadoDomingoCierre', horarioSabadoDomingoCierreInput.value);

        // Añadir imagen si se seleccionó una
        if (restaurantImageFileInput.files.length > 0) {
            formData.append('restaurantImage', restaurantImageFileInput.files[0]);
        }

        // Basic validation for map location
        if (!formData.get('latitud') || !formData.get('longitud') || !formData.get('direccionRestaurante')) {
            displayMessage('Por favor, selecciona la ubicación del restaurante en el mapa o busca una dirección.', 'error');
            return;
        }

        try {
            await api.createSolicitud(formData);
            displayMessage('¡Solicitud enviada con éxito! Será revisada pronto.', 'success');
            form.reset(); // Limpiar el formulario
            restaurantImageNameDisplay.textContent = 'Ningún archivo seleccionado'; // Reset file name display
            
            // Reset new hourly fields
            horarioLunesViernesAperturaInput.value = '';
            horarioLunesViernesCierreInput.value = '';
            horarioSabadoDomingoAperturaInput.value = '';
            horarioSabadoDomingoCierreInput.value = '';
            cantonSelect.value = ''; // Reset canton select

            // Reset map to default after submission
            setLeafletMapLocation(defaultLocation);
            onLeafletLocationChangeCallback(defaultLocation.lat, defaultLocation.lat, 'Ubicación predeterminada (Loja)');

            setTimeout(() => {
                window.history.pushState({}, '', '/client-dashboard'); // Redirigir al dashboard del cliente
                router();
            }, 3000);

        } catch (error) {
            console.error('Error creating solicitud:', error);
            displayMessage(error.message || 'Error al enviar la solicitud.', 'error');
        }
    });

    return page;
}

export { SolicitudPage };