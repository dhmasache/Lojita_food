// frontend/src/pages/adminDashboard.js
import api from '../services/api.js';
import { router } from '../router.js'; // Necesario para posible redirección

function AdminDashboardPage() {
    const page = document.createElement('div');
    page.className = 'admin-dashboard-container';

    // Check if the user is logged in and is an 'admin'
    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'admin') {
        page.innerHTML = `
            <h1>Acceso Denegado</h1>
            <p>No tienes permiso para ver esta página. Debes ser un 'administrador'.</p>
            <a href="/login" data-link>Iniciar Sesión</a>
        `;
        return page;
    }

    page.innerHTML = `
        <h1>Panel de Administrador</h1>
        <p>Bienvenido, ${user.nombre}. Aquí puedes gestionar las solicitudes para ser propietario de restaurante y añadir nuevos restaurantes.</p>

        <div class="solicitudes-section">
            <h2>Solicitudes de Propietario Pendientes</h2>
            <div id="solicitudes-list">
                <p>Cargando solicitudes...</p>
            </div>
            <div id="admin-message" class="message" style="display: none;"></div>
        </div>

        <div class="restaurant-management-section">
            <h2>Gestionar Restaurantes</h2>
            <button id="add-restaurant-btn" class="btn btn-primary">Agregar Nuevo Restaurante</button>
            
            <div id="add-restaurant-form-container" style="display: none;" class="card form-card">
                <h3 id="form-title">Formulario para Agregar Restaurante</h3>
                <form id="add-restaurant-form" enctype="multipart/form-data">
                    <input type="hidden" id="restaurant-id" name="id">
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="nombre">Nombre del Restaurante</label>
                            <input type="text" id="nombre" name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" name="direccion" required>
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
                            <label for="horarioApertura">Horario de Apertura</label>
                            <input type="time" id="horarioApertura" name="horarioApertura" required>
                        </div>
                        <div class="form-group">
                            <label for="horarioCierre">Horario de Cierre</label>
                            <input type="time" id="horarioCierre" name="horarioCierre" required>
                        </div>
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea id="descripcion" name="descripcion" rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="imageUrl">Imagen del Restaurante</label>
                            <input type="file" id="imageUrl" name="imageUrl" accept="image/*">
                            <div id="current-image-preview" style="display: none;">
                                <img id="preview-image" src="" alt="Previsualización de imagen" class="restaurant-image" style="max-width: 100px; margin-top: 10px;">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="propietarioId">ID del Propietario (opcional para Admin)</label>
                            <input type="number" id="propietarioId" name="propietarioId">
                        </div>
                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="esTradicional" name="esTradicional">
                            <label for="esTradicional">Es Tradicional</label>
                        </div>
                    </div>
                    <button type="submit" id="submit-btn" class="btn btn-success">Guardar Restaurante</button>
                    <button type="button" id="cancel-add-restaurant-btn" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        </div>

        <div class="restaurants-list-section">
            <h2>Restaurantes Registrados</h2>
            <div id="registered-restaurants-list" class="restaurants-grid">
                <p>Cargando restaurantes...</p>
            </div>
            <div id="restaurant-list-message" class="message" style="display: none;"></div>
        </div>
    `;

    const solicitudesList = page.querySelector('#solicitudes-list');
    const adminMessage = page.querySelector('#admin-message'); // Mensaje para solicitudes
    const registeredRestaurantsList = page.querySelector('#registered-restaurants-list'); // Nuevo
    const restaurantListMessage = page.querySelector('#restaurant-list-message'); // Nuevo
    
    // Elementos para añadir/editar restaurante
    const formTitle = page.querySelector('#form-title');
    const restaurantIdInput = page.querySelector('#restaurant-id');
    const nombreInput = page.querySelector('#add-restaurant-form #nombre');
    const direccionInput = page.querySelector('#add-restaurant-form #direccion');
    const telefonoInput = page.querySelector('#add-restaurant-form #telefono');
    const emailInput = page.querySelector('#add-restaurant-form #email');
    const horarioAperturaInput = page.querySelector('#add-restaurant-form #horarioApertura');
    const horarioCierreInput = page.querySelector('#add-restaurant-form #horarioCierre');
    const descripcionInput = page.querySelector('#add-restaurant-form #descripcion');
    const imageUrlInput = page.querySelector('#add-restaurant-form #imageUrl');
    const propietarioIdInput = page.querySelector('#add-restaurant-form #propietarioId');
    const esTradicionalInput = page.querySelector('#add-restaurant-form #esTradicional');
    const submitBtn = page.querySelector('#submit-btn');
    const currentImagePreviewContainer = page.querySelector('#current-image-preview');
    const previewImage = page.querySelector('#preview-image');


    const addRestaurantBtn = page.querySelector('#add-restaurant-btn');
    const addRestaurantFormContainer = page.querySelector('#add-restaurant-form-container');
    const addRestaurantForm = page.querySelector('#add-restaurant-form');
    const cancelAddRestaurantBtn = page.querySelector('#cancel-add-restaurant-btn');
    const restaurantMessage = document.createElement('div'); // Mensaje específico para restaurantes
    restaurantMessage.className = 'message';
    restaurantMessage.style.display = 'none';
    addRestaurantFormContainer.prepend(restaurantMessage); // Insertar antes del formulario

    const displayMessage = (msg, type, targetElement = adminMessage) => {
        targetElement.textContent = msg;
        targetElement.className = `message ${type}`;
        targetElement.style.display = 'block';
        setTimeout(() => {
            targetElement.style.display = 'none';
        }, 5000);
    };

    // --- Lógica para Solicitudes ---
    const fetchSolicitudes = async () => {
        solicitudesList.innerHTML = '<p>Cargando solicitudes...</p>';
        try {
            const solicitudes = await api.getSolicitudes();
            if (solicitudes.length === 0) {
                solicitudesList.innerHTML = '<p>No hay solicitudes pendientes.</p>';
                return;
            }

            solicitudesList.innerHTML = ''; // Limpiar lista
            solicitudes.forEach(solicitud => {
                const solicitudItem = document.createElement('div');
                solicitudItem.className = `solicitud-item status-${solicitud.estado}`;
                solicitudItem.innerHTML = `
                    <div class="card-content">
                        <h3>Solicitud #${solicitud.id} - ${solicitud.nombreRestaurante}</h3>
                        <p><strong>Usuario:</strong> ${solicitud.Usuario ? solicitud.Usuario.nombre : 'N/A'} (${solicitud.Usuario ? solicitud.Usuario.email : 'N/A'})</p>
                        <p><strong>Dirección:</strong> ${solicitud.direccionRestaurante}</p>
                        <p><strong>Teléfono:</strong> ${solicitud.telefonoRestaurante || 'No especificado'}</p>
                        <p><strong>Descripción:</strong> ${solicitud.descripcion ? solicitud.descripcion.substring(0, 70) + '...' : 'Sin descripción adicional'}</p>
                        <p><strong>Estado:</strong> ${solicitud.estado}</p>
                        <p><strong>Fecha:</strong> ${new Date(solicitud.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="solicitud-actions">
                        ${solicitud.estado === 'pendiente' ? `
                            <button class="btn btn-success approve-btn" data-id="${solicitud.id}" data-propietario-id="${solicitud.usuarioId}">Aprobar</button>
                            <button class="btn btn-danger reject-btn" data-id="${solicitud.id}">Rechazar</button>
                        ` : ''}
                    </div>
                `;
                solicitudesList.appendChild(solicitudItem);
            });

            // Añadir event listeners a los botones de acción
            solicitudesList.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    const propietarioId = parseInt(e.target.dataset.propietarioId); // Obtener y parsear el ID del propietario
                    try {
                        await api.approveSolicitud(id);
                        // Después de aprobar la solicitud, cambiar el rol del usuario a propietario
                        await api.updateUserRole(propietarioId, { rol: 'propietario' });
                        displayMessage('Solicitud aprobada y usuario promovido a propietario con éxito.', 'success');
                        fetchSolicitudes(); // Recargar lista
                        fetchRestaurants(); // Recargar lista de restaurantes, porque podría haberse creado uno
                    } catch (error) {
                        displayMessage(error.message || 'Error al aprobar la solicitud o promover usuario.', 'error');
                    }
                });
            });

            solicitudesList.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        await api.rejectSolicitud(id);
                        displayMessage('Solicitud rechazada con éxito.', 'success');
                        fetchSolicitudes(); // Recargar lista
                    } catch (error) {
                        displayMessage(error.message || 'Error al rechazar la solicitud.', 'error');
                    }
                });
            });

        } catch (error) {
            solicitudesList.innerHTML = `<p class="error">Error al cargar solicitudes: ${error.message}</p>`;
            console.error('Error fetching solicitudes:', error);
        }
    };

    // --- Lógica para Añadir/Editar Restaurante ---
    const resetForm = () => {
        addRestaurantForm.reset();
        restaurantIdInput.value = '';
        formTitle.textContent = 'Formulario para Agregar Restaurante';
        submitBtn.textContent = 'Guardar Restaurante';
        currentImagePreviewContainer.style.display = 'none';
        previewImage.src = '';
        imageUrlInput.required = true; // Imagen requerida para añadir
    };

    addRestaurantBtn.addEventListener('click', () => {
        resetForm(); // Resetear el formulario para el modo "añadir"
        addRestaurantFormContainer.style.display = 'block';
        addRestaurantBtn.style.display = 'none'; // Ocultar botón al mostrar formulario
        restaurantMessage.style.display = 'none'; // Limpiar mensajes anteriores
    });

    cancelAddRestaurantBtn.addEventListener('click', () => {
        addRestaurantFormContainer.style.display = 'none';
        addRestaurantBtn.style.display = 'block'; // Mostrar botón de nuevo
        resetForm(); // Limpiar y resetear el formulario
    });

    addRestaurantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addRestaurantForm);
        const restauranteId = restaurantIdInput.value; // Obtener el ID del restaurante si estamos editando

        formData.set('esTradicional', esTradicionalInput.checked ? 'true' : 'false');
        
        if (propietarioIdInput.value) {
            formData.set('propietarioId', parseInt(propietarioIdInput.value));
        } else {
            formData.delete('propietarioId');
        }

        // Si no se selecciona una nueva imagen en el modo de edición, no enviar el campo 'imageUrl'
        if (restauranteId && !imageUrlInput.files.length) {
            formData.delete('imageUrl');
        }

        try {
            if (restauranteId) {
                // Modo edición
                await api.updateRestaurante(restauranteId, formData);
                displayMessage('Restaurante actualizado con éxito.', 'success', restaurantMessage);
            } else {
                // Modo añadir
                await api.createRestaurante(formData);
                displayMessage('Restaurante agregado con éxito.', 'success', restaurantMessage);
            }
            addRestaurantFormContainer.style.display = 'none';
            addRestaurantBtn.style.display = 'block';
            resetForm();
            fetchRestaurants(); // Recargar la lista de restaurantes
        } catch (error) {
            console.error('API Error:', error); // <-- Línea añadida para depuración
            displayMessage(error.message || `Error al ${restauranteId ? 'actualizar' : 'agregar'} restaurante.`, 'error', restaurantMessage);
        }
    });

    // --- Lógica para Listar Restaurantes ---
    const fetchRestaurants = async () => {
        registeredRestaurantsList.innerHTML = '<p>Cargando restaurantes...</p>';
        try {
            const restaurantes = await api.getRestaurantes();
            if (restaurantes.length === 0) {
                registeredRestaurantsList.innerHTML = '<p>No hay restaurantes registrados.</p>';
                return;
            }

            registeredRestaurantsList.innerHTML = ''; // Limpiar lista
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
                        <div class="restaurant-actions">
                            <button class="btn btn-primary edit-restaurant-admin-btn" data-id="${restaurante.id}">Editar</button>
                            <button class="btn btn-danger delete-restaurant-admin-btn" data-id="${restaurante.id}">Eliminar</button>
                        </div>
                    </div>
                `;
                registeredRestaurantsList.appendChild(restaurantItem);
            });

            // --- Event listeners para EDITAR ---
            registeredRestaurantsList.querySelectorAll('.edit-restaurant-admin-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        const restauranteToEdit = await api.getRestauranteById(id);
                        
                        // Cargar datos en el formulario
                        restaurantIdInput.value = restauranteToEdit.id;
                        nombreInput.value = restauranteToEdit.nombre;
                        direccionInput.value = restauranteToEdit.direccion;
                        telefonoInput.value = restauranteToEdit.telefono;
                        emailInput.value = restauranteToEdit.email;
                        horarioAperturaInput.value = restauranteToEdit.horarioApertura;
                        horarioCierreInput.value = restauranteToEdit.horarioCierre;
                        descripcionInput.value = restauranteToEdit.descripcion;
                        propietarioIdInput.value = restauranteToEdit.propietarioId;
                        esTradicionalInput.checked = restauranteToEdit.esTradicional;

                        // Manejar previsualización de imagen
                        if (restauranteToEdit.imageUrl) {
                            previewImage.src = `http://localhost:3000${restauranteToEdit.imageUrl}`;
                            currentImagePreviewContainer.style.display = 'block';
                            imageUrlInput.required = false; // Ya tiene imagen, no es requerida para añadir
                        } else {
                            currentImagePreviewContainer.style.display = 'none';
                            previewImage.src = '';
                            imageUrlInput.required = false; // No hay imagen previa, pero no se hace requerida para edición
                        }

                        // Cambiar texto del formulario y botón
                        formTitle.textContent = 'Formulario para Editar Restaurante';
                        submitBtn.textContent = 'Actualizar Restaurante';
                        
                        addRestaurantFormContainer.style.display = 'block';
                        addRestaurantBtn.style.display = 'none';
                        restaurantMessage.style.display = 'none'; // Limpiar mensajes
                    } catch (error) {
                        displayMessage(error.message || 'Error al cargar datos del restaurante para edición.', 'error', restaurantListMessage);
                    }
                });
            });

            // --- Event listeners para ELIMINAR ---
            registeredRestaurantsList.querySelectorAll('.delete-restaurant-admin-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('¿Estás seguro de que quieres eliminar este restaurante?')) {
                        try {
                            await api.deleteRestaurante(id);
                            displayMessage('Restaurante eliminado con éxito.', 'success', restaurantListMessage);
                            fetchRestaurants(); // Recargar lista
                        } catch (error) {
                            displayMessage(error.message || 'Error al eliminar el restaurante.', 'error', restaurantListMessage);
                        }
                    }
                });
            });


        } catch (error) {
            displayMessage(error.message || 'Error al cargar restaurantes.', 'error', restaurantListMessage);
            registeredRestaurantsList.innerHTML = `<p class="error">Error al cargar restaurantes: ${error.message}</p>`;
            console.error('Error fetching restaurants for admin:', error);
        }
    };


    // Cargar solicitudes al montar la página
    fetchSolicitudes();
    // Cargar restaurantes al montar la página
    fetchRestaurants();

    return page;
}

export { AdminDashboardPage };