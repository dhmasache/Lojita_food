// frontend/src/pages/solicitudPage.js
import api from '../services/api.js';
import { router } from '../router.js';

function SolicitudPage() {
    const page = document.createElement('div');
    page.className = 'auth-container'; // Usar la clase de contenedor común
    
    // Obtener información del usuario logueado
    const user = JSON.parse(localStorage.getItem('lojita_user'));

    let pageContent = '';

    if (!user || user.rol !== 'cliente') {
        pageContent = `
            <div class="auth-card">
                <h1>Acceso Denegado</h1>
                <p>Solo los usuarios 'cliente' pueden enviar una solicitud para ser propietario de restaurante.</p>
                <p>Si eres propietario, tu cuenta ya debería reflejarlo. Si crees que hay un error, contacta al administrador.</p>
                <a href="/" data-link class="btn btn-primary">Volver al Inicio</a>
            </div>
        `;
    } else {
        pageContent = `
            <form id="solicitud-form" class="auth-card"> <!-- Usar la clase de tarjeta común -->
                <h2>Solicitud para Propietario de Restaurante</h2>
                <p>Completa este formulario para solicitar acceso como propietario de restaurante. Tu solicitud será revisada por un administrador.</p>
                <div id="solicitud-message" class="message" style="display: none;"></div>

                <div class="form-group">
                    <label for="nombreRestaurante">Nombre del Restaurante</label>
                    <input type="text" id="nombreRestaurante" name="nombreRestaurante" required>
                </div>
                <div class="form-group">
                    <label for="direccionRestaurante">Dirección del Restaurante</label>
                    <input type="text" id="direccionRestaurante" name="direccionRestaurante" required>
                </div>
                <div class="form-group">
                    <label for="telefonoRestaurante">Teléfono del Restaurante (Opcional)</label>
                    <input type="tel" id="telefonoRestaurante" name="telefonoRestaurante">
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción Adicional (Opcional)</label>
                    <textarea id="descripcion" name="descripcion" rows="5"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
            </form>
        `;
    }

    page.innerHTML = pageContent;

    // Lógica para el formulario si el usuario es un cliente
    if (user && user.rol === 'cliente') {
        const form = page.querySelector('#solicitud-form');
        const solicitudMessage = page.querySelector('#solicitud-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            solicitudMessage.style.display = 'none';
            solicitudMessage.className = 'message'; // Reset class

            const formData = {
                nombreRestaurante: form.elements.nombreRestaurante.value,
                direccionRestaurante: form.elements.direccionRestaurante.value,
                telefonoRestaurante: form.elements.telefonoRestaurante.value,
                descripcion: form.elements.descripcion.value,
            };

            try {
                const response = await api.createSolicitud(formData);
                solicitudMessage.textContent = '¡Solicitud enviada con éxito! Será revisada pronto.';
                solicitudMessage.classList.add('success');
                solicitudMessage.style.display = 'block';
                form.reset(); // Limpiar el formulario

                // Opcional: Redirigir al usuario después de unos segundos
                setTimeout(() => {
                    window.history.pushState({}, '', '/');
                    router();
                }, 3000);

            } catch (error) {
                solicitudMessage.textContent = error.message || 'Error al enviar la solicitud.';
                solicitudMessage.classList.add('error');
                solicitudMessage.style.display = 'block';
            }
        });
    }

    return page;
}

export { SolicitudPage };
