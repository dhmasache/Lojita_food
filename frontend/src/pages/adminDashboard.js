

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
                <h3>Formulario para Agregar Restaurante</h3>
                <form id="add-restaurant-form" enctype="multipart/form-data">
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
                    <button type="submit" class="btn btn-success">Guardar Restaurante</button>
                    <button type="button" id="cancel-add-restaurant-btn" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        </div>
    `;

    const solicitudesList = page.querySelector('#solicitudes-list');
    const adminMessage = page.querySelector('#admin-message'); // Mensaje para solicitudes
    
    // Elementos para añadir restaurante
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
                    <h3>Solicitud #${solicitud.id} - ${solicitud.nombreRestaurante}</h3>
                    <p><strong>Usuario:</strong> ${solicitud.Usuario ? solicitud.Usuario.nombre : 'N/A'} (${solicitud.Usuario ? solicitud.Usuario.email : 'N/A'})</p>
                    <p><strong>Dirección:</strong> ${solicitud.direccionRestaurante}</p>
                    <p><strong>Teléfono:</strong> ${solicitud.telefonoRestaurante || 'No especificado'}</p>
                    <p><strong>Descripción:</strong> ${solicitud.descripcion || 'Sin descripción adicional'}</p>
                    <p><strong>Estado:</strong> ${solicitud.estado}</p>
                    <p><strong>Fecha:</strong> ${new Date(solicitud.createdAt).toLocaleDateString()}</p>
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
                    const propietarioId = e.target.dataset.propietarioId; // Obtener el ID del propietario asociado
                    try {
                        await api.approveSolicitud(id);
                        // Después de aprobar la solicitud, cambiar el rol del usuario a propietario
                        await api.updateUserRole(propietarioId, { rol: 'propietario' });
                        displayMessage('Solicitud aprobada y usuario promovido a propietario con éxito.', 'success');
                        fetchSolicitudes(); // Recargar lista
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

    // Cargar solicitudes al montar la página
    fetchSolicitudes();

    // --- Lógica para Añadir Restaurante ---
    addRestaurantBtn.addEventListener('click', () => {
        addRestaurantFormContainer.style.display = 'block';
        addRestaurantBtn.style.display = 'none'; // Ocultar botón al mostrar formulario
        restaurantMessage.style.display = 'none'; // Limpiar mensajes anteriores
    });

    cancelAddRestaurantBtn.addEventListener('click', () => {
        addRestaurantFormContainer.style.display = 'none';
        addRestaurantBtn.style.display = 'block'; // Mostrar botón de nuevo
        addRestaurantForm.reset(); // Limpiar formulario
    });

    addRestaurantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Crear FormData para enviar archivos
        const formData = new FormData(addRestaurantForm);

        // Convertir el checkbox "esTradicional" a booleano
        formData.set('esTradicional', formData.get('esTradicional') === 'on' ? 'true' : 'false');
        
        // Convertir propietarioId a número si existe
        if (formData.get('propietarioId')) {
            formData.set('propietarioId', parseInt(formData.get('propietarioId')));
        } else {
            formData.delete('propietarioId'); // Eliminar si está vacío para evitar enviar null o NaN
        }

        try {
            await api.createRestaurante(formData); // Enviar FormData directamente
            displayMessage('Restaurante agregado con éxito.', 'success', restaurantMessage);
            addRestaurantForm.reset();
            addRestaurantFormContainer.style.display = 'none';
            addRestaurantBtn.style.display = 'block';
            // Opcional: recargar solicitudes o una lista de restaurantes si se muestra
        } catch (error) {
            displayMessage(error.message || 'Error al agregar restaurante.', 'error', restaurantMessage);
        }
    });


    return page;
}

export { AdminDashboardPage };
