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
        <p>Bienvenido, ${user.nombre}. Aquí puedes gestionar las solicitudes para ser propietario de restaurante.</p>

        <div class="solicitudes-section">
            <h2>Solicitudes de Propietario Pendientes</h2>
            <div id="solicitudes-list">
                <p>Cargando solicitudes...</p>
            </div>
            <div id="admin-message" class="message" style="display: none;"></div>
        </div>
    `;

    const solicitudesList = page.querySelector('#solicitudes-list');
    const adminMessage = page.querySelector('#admin-message');

    const displayMessage = (msg, type) => {
        adminMessage.textContent = msg;
        adminMessage.className = `message ${type}`;
        adminMessage.style.display = 'block';
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 5000);
    };

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
                            <button class="approve-btn" data-id="${solicitud.id}">Aprobar</button>
                            <button class="reject-btn" data-id="${solicitud.id}">Rechazar</button>
                        ` : ''}
                    </div>
                `;
                solicitudesList.appendChild(solicitudItem);
            });

            // Añadir event listeners a los botones de acción
            solicitudesList.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        await api.approveSolicitud(id);
                        displayMessage('Solicitud aprobada con éxito.', 'success');
                        fetchSolicitudes(); // Recargar lista
                    } catch (error) {
                        displayMessage(error.message || 'Error al aprobar la solicitud.', 'error');
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

    return page;
}

export { AdminDashboardPage };
