// frontend/src/pages/adminDashboard.js
import api from '../services/api.js';
import { router } from '../router.js'; // Import router for navigation

function AdminDashboardPage() {
    const page = document.createElement('div');
    const user = JSON.parse(localStorage.getItem('lojita_user'));

    page.innerHTML = `
        <div class="admin-dashboard-wrapper">
            <!-- Main Content Container (holds header and main content) -->
            <div class="admin-main-content-wrapper full-width">
                <!-- Main Header (Top Bar) -->
                <header class="admin-header">
                    <h1 class="admin-header-title">Panel de Administración <span class="header-welcome">Bienvenido, ${user.nombre}</span></h1>
                    <div class="header-actions">
                        <button id="edit-profile-btn" class="btn btn-secondary admin-profile-btn">Mi Perfil</button>
                        <button id="add-restaurant-btn" class="btn btn-primary admin-add-button">+ Agregar Restaurante</button>
                    </div>
                </header>

                <!-- Main Content Area -->
                <main class="admin-content">
                    <!-- Statistics Cards -->
                    <div class="stats-cards-row">
                        <div class="stat-card">
                            <i class="icon-bell stat-icon"></i>
                            <span class="stat-text">Solicitudes: <span id="solicitudes-count">0</span></span>
                        </div>
                        <div class="stat-card">
                            <i class="icon-building stat-icon"></i>
                            <span class="stat-text">Restaurantes Activos: <span id="active-restaurants-count">0</span></span>
                        </div>
                        <div class="stat-card">
                            <i class="icon-users stat-icon"></i>
                            <span class="stat-text">Usuarios Totales: <span id="total-users-count">0</span></span>
                        </div>
                    </div>

                    <!-- Registered Restaurants Table -->
                    <div class="table-container card">
                        <h2>Restaurantes Registrados</h2>
                        <div class="table-responsive-wrapper">
                            <table class="registered-restaurants-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="restaurants-table-body">
                                    <tr><td colspan="4">Cargando restaurantes...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Registered Users Table -->
                    <div class="table-container card">
                        <h2>Usuarios Registrados</h2>
                        <div class="table-responsive-wrapper">
                            <table class="registered-users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="users-table-body">
                                    <tr><td colspan="5">Cargando usuarios...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Solicitudes Pendientes Table -->
                    <div class="table-container card">
                        <h2>Solicitudes Pendientes</h2>
                        <div class="table-responsive-wrapper">
                            <table class="solicitudes-table">
                                <thead>
                                    <tr>
                                        <th>ID Solicitud</th>
                                        <th>Usuario</th>
                                        <th>Email Usuario</th>
                                        <th>Restaurante</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="solicitudes-table-body">
                                    <tr><td colspan="6">Cargando solicitudes...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Solicitud Detail Modal -->
            <div id="solicitud-detail-modal" class="modal" style="display:none;">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>Detalles de la Solicitud <span id="modal-solicitud-id"></span></h2>
                    <p><strong>Estado:</strong> <span id="modal-solicitud-estado"></span></p>
                    <p><strong>Usuario Solicitante:</strong> <span id="modal-usuario-nombre"></span> (<span id="modal-usuario-email"></span>)</p>
                    <p><strong>Nombre Restaurante:</strong> <span id="modal-restaurante-nombre"></span></p>
                    <p><strong>Dirección Restaurante:</strong> <span id="modal-restaurante-direccion"></span></p>
                    <p><strong>Teléfono Restaurante:</strong> <span id="modal-restaurante-telefono"></span></p>
                    <p><strong>Descripción:</strong> <span id="modal-restaurante-descripcion"></span></p>
                    <div class="modal-actions">
                        <button id="modal-approve-btn" class="btn btn-success">Aprobar</button>
                        <button id="modal-reject-btn" class="btn btn-danger">Rechazar</button>
                    </div>
                    </div>
                </div>

        </div>
    `;

    // JavaScript Logic
    const solicitudesCountSpan = page.querySelector('#solicitudes-count');
    const activeRestaurantsCountSpan = page.querySelector('#active-restaurants-count');
    const totalUsersCountSpan = page.querySelector('#total-users-count');
    const restaurantsTableBody = page.querySelector('#restaurants-table-body');
    const usersTableBody = page.querySelector('#users-table-body');
    const solicitudesTableBody = page.querySelector('#solicitudes-table-body');
    const addRestaurantBtn = page.querySelector('#add-restaurant-btn');
    const editProfileBtn = page.querySelector('#edit-profile-btn');


    // Solicitud Modal Elements
    const solicitudDetailModal = page.querySelector('#solicitud-detail-modal');
    const modalCloseButton = page.querySelector('#solicitud-detail-modal .close-button');
    const modalSolicitudId = page.querySelector('#modal-solicitud-id');
    const modalSolicitudEstado = page.querySelector('#modal-solicitud-estado');
    const modalUsuarioNombre = page.querySelector('#modal-usuario-nombre');
    const modalUsuarioEmail = page.querySelector('#modal-usuario-email');
    const modalRestauranteNombre = page.querySelector('#modal-restaurante-nombre');
    const modalRestauranteDireccion = page.querySelector('#modal-restaurante-direccion');
    const modalRestauranteTelefono = page.querySelector('#modal-restaurante-telefono');
    const modalRestauranteDescripcion = page.querySelector('#modal-restaurante-descripcion');
    const modalApproveBtn = page.querySelector('#modal-approve-btn');
    const modalRejectBtn = page.querySelector('#modal-reject-btn');


    const updateStats = async () => {
        try {
            const solicitudes = await api.getSolicitudes();
            solicitudesCountSpan.textContent = solicitudes.filter(s => s.estado === 'pendiente').length;

            const restaurants = await api.getRestaurantes();
            activeRestaurantsCountSpan.textContent = restaurants.length;

            const users = await api.getUsuarios();
            totalUsersCountSpan.textContent = users.length;
        } catch (error) {
            console.error('Error fetching stats:', error);
            solicitudesCountSpan.textContent = 'N/A';
            activeRestaurantsCountSpan.textContent = 'N/A';
            totalUsersCountSpan.textContent = 'N/A';
        }
    };

    const fetchRestaurantsTable = async () => {
        restaurantsTableBody.innerHTML = '<tr><td colspan="4">Cargando restaurantes...</td></tr>';
        try {
            const restaurantes = await api.getRestaurantes();
            restaurantsTableBody.innerHTML = '';
            if (restaurantes.length === 0) {
                restaurantsTableBody.innerHTML = '<tr><td colspan="4">No hay restaurantes registrados.</td></tr>';
                return;
            }

            restaurantes.forEach(restaurante => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${restaurante.nombre}</td>
                    <td>${restaurante.direccion}</td>
                    <td>
                        <span class="status-badge ${restaurante.estadoAprobacion === 'aprobado' ? 'status-active' : 'status-inactive'}">
                            ${restaurante.estadoAprobacion}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-edit-small" data-id="${restaurante.id}">Editar</button>
                        <button class="btn btn-primary btn-manage-dishes" data-id="${restaurante.id}">Gestionar Platos</button>
                    </td>
                `;
                restaurantsTableBody.appendChild(row);
            });

            restaurantsTableBody.querySelectorAll('.btn-edit-small').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    window.history.pushState({}, '', `/admin/restaurantes/editar/${id}`);
                    router();
                });
            });
            // Evento para gestionar platos
            restaurantsTableBody.querySelectorAll('.btn-manage-dishes').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    window.history.pushState({}, '', `/admin/restaurantes/${id}/platos`);
                    router();
                });
            });

        } catch (error) {
            restaurantsTableBody.innerHTML = '<tr><td colspan="4">Error al cargar restaurantes.</td></tr>';
            console.error('Error fetching restaurants for table:', error);
        }
    };

    // Function to fetch and render users table
    const fetchUsersTable = async () => {
        usersTableBody.innerHTML = '<tr><td colspan="5">Cargando usuarios...</td></tr>';
        try {
            const users = await api.getUsuarios();
            usersTableBody.innerHTML = '';
            if (users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="5">No hay usuarios registrados.</td></tr>';
                return;
            }

            users.forEach(userItem => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${userItem.id}</td>
                    <td>${userItem.nombre}</td>
                    <td>${userItem.email}</td>
                    <td>
                        <select class="role-select" data-id="${userItem.id}">
                            <option value="cliente" ${userItem.rol === 'cliente' ? 'selected' : ''}>Cliente</option>
                            <option value="propietario" ${userItem.rol === 'propietario' ? 'selected' : ''}>Propietario</option>
                            <option value="admin" ${userItem.rol === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger delete-user-btn" data-id="${userItem.id}">Eliminar</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });

            // Add event listeners for role changes
            usersTableBody.querySelectorAll('.role-select').forEach(select => {
                select.addEventListener('change', async (e) => {
                    const userId = e.target.dataset.id;
                    const newRole = e.target.value;
                    if (confirm(`¿Está seguro de cambiar el rol del usuario ${userId} a ${newRole}?`)) {
                        try {
                            await api.updateUserRole(userId, { rol: newRole });
                            alert('Rol de usuario actualizado con éxito.');
                            fetchUsersTable(); // Refresh table
                        } catch (error) {
                            alert('Error al actualizar el rol: ' + error.message);
                            console.error('Error updating user role:', error);
                        }
                    } else {
                        // A simpler revert:
                        fetchUsersTable(); // Re-fetch to ensure original state if not changed
                    }
                });
            });

            // Add event listeners for user deletion
            usersTableBody.querySelectorAll('.delete-user-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const userId = e.target.dataset.id;
                    if (confirm(`¿Está seguro de eliminar al usuario ${userId}? Esta acción es irreversible.`)) {
                        try {
                            await api.deleteUsuario(userId);
                            alert('Usuario eliminado con éxito.');
                            fetchUsersTable(); // Refresh table
                            updateStats(); // Refresh stats in case total users changed
                        } catch (error) {
                            alert('Error al eliminar usuario: ' + error.message);
                            console.error('Error deleting user:', error);
                        }
                    }
                });
            });

        } catch (error) {
            usersTableBody.innerHTML = '<tr><td colspan="5">Error al cargar usuarios.</td></tr>';
            console.error('Error fetching users for table:', error);
        }
    };

    // Function to fetch and render solicitudes table
    const fetchSolicitudesTable = async () => {
        solicitudesTableBody.innerHTML = '<tr><td colspan="6">Cargando solicitudes...</td></tr>';
        try {
            const solicitudes = await api.getSolicitudes();
            solicitudesTableBody.innerHTML = '';
            if (solicitudes.length === 0) {
                solicitudesTableBody.innerHTML = '<tr><td colspan="6">No hay solicitudes pendientes.</td></tr>';
                return;
            }

            solicitudes.forEach(solicitud => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${solicitud.id}</td>
                    <td>${solicitud.Usuario ? solicitud.Usuario.nombre : 'N/A'}</td>
                    <td>${solicitud.Usuario ? solicitud.Usuario.email : 'N/A'}</td>
                    <td>${solicitud.nombreRestaurante}</td>
                    <td><span class="status-badge ${solicitud.estado === 'pendiente' ? 'status-inactive' : 'status-active'}">${solicitud.estado}</span></td>
                    <td>
                        <button class="btn btn-info view-solicitud-btn" data-id="${solicitud.id}">Ver Detalles</button>
                    </td>
                `;
                solicitudesTableBody.appendChild(row);
            });

            // Add event listeners for view details buttons
            solicitudesTableBody.querySelectorAll('.view-solicitud-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const solicitudId = e.target.dataset.id;
                    const selectedSolicitud = solicitudes.find(s => s.id == solicitudId);
                    if (selectedSolicitud) {
                        openSolicitudModal(selectedSolicitud);
                    }
                });
            });

        } catch (error) {
            solicitudesTableBody.innerHTML = '<tr><td colspan="6">Error al cargar solicitudes.</td></tr>';
            console.error('Error fetching solicitudes for table:', error);
        }
    };

    // Function to open and populate the solicitud modal
    const openSolicitudModal = (solicitud) => {
        modalSolicitudId.textContent = solicitud.id;
        modalSolicitudEstado.textContent = solicitud.estado;
        modalUsuarioNombre.textContent = solicitud.Usuario ? solicitud.Usuario.nombre : 'N/A';
        modalUsuarioEmail.textContent = solicitud.Usuario ? solicitud.Usuario.email : 'N/A';
        modalRestauranteNombre.textContent = solicitud.nombreRestaurante;
        modalRestauranteDireccion.textContent = solicitud.direccionRestaurante;
        modalRestauranteTelefono.textContent = solicitud.telefonoRestaurante;
        modalRestauranteDescripcion.textContent = solicitud.descripcion;

        // Set data-id for approve/reject buttons
        modalApproveBtn.dataset.id = solicitud.id;
        modalRejectBtn.dataset.id = solicitud.id;

        // Hide/show buttons based on solicitud status
        if (solicitud.estado === 'pendiente') {
            modalApproveBtn.style.display = 'inline-block';
            modalRejectBtn.style.display = 'inline-block';
        } else {
            modalApproveBtn.style.display = 'none';
            modalRejectBtn.style.display = 'none';
        }

        solicitudDetailModal.style.display = 'block'; // Show the modal
    };

    // Function to close the solicitud modal
    const closeSolicitudModal = () => {
        solicitudDetailModal.style.display = 'none';
    };

    // Event listeners for modal close and overlay
    modalCloseButton.addEventListener('click', closeSolicitudModal);
    solicitudDetailModal.addEventListener('click', (e) => {
        if (e.target === solicitudDetailModal) {
            closeSolicitudModal();
        }
    });

    // Event listeners for modal action buttons
    modalApproveBtn.addEventListener('click', async (e) => {
        const solicitudId = e.target.dataset.id;
        if (confirm(`¿Está seguro de APROBAR la solicitud ${solicitudId}?`)) {
            try {
                await api.approveSolicitud(solicitudId);
                alert('Solicitud aprobada con éxito. El restaurante ha sido creado y el usuario actualizado.');
                closeSolicitudModal();
                fetchSolicitudesTable(); // Refresh table
                updateStats(); // Refresh stats
                fetchRestaurantsTable(); // Refresh restaurants table as a new one might be added
            } catch (error) {
                alert('Error al aprobar solicitud: ' + error.message);
                console.error('Error approving solicitud:', error);
            }
        }
    });

    modalRejectBtn.addEventListener('click', async (e) => {
        const solicitudId = e.target.dataset.id;
        if (confirm(`¿Está seguro de RECHAZAR la solicitud ${solicitudId}?`)) {
            try {
                await api.rejectSolicitud(solicitudId);
                alert('Solicitud rechazada con éxito.');
                closeSolicitudModal();
                fetchSolicitudesTable(); // Refresh table
                updateStats(); // Refresh stats
            } catch (error) {
                alert('Error al rechazar solicitud: ' + error.message);
                console.error('Error rejecting solicitud:', error);
            }
        }
    });


    // Event listener for "Add Restaurant" button
    addRestaurantBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/admin/restaurantes/nuevo');
        router();
    });

    // Event listener for "Mi Perfil" button
    editProfileBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/profile/edit');
        router();
    });

    // Initial data loads
    updateStats();
    fetchRestaurantsTable();
    fetchUsersTable();
    fetchSolicitudesTable();

    return page;
}

export { AdminDashboardPage };