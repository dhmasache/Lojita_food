// frontend/src/pages/cantonesPage.js
import api from '../services/api.js';
import { router } from '../router.js';
import '../styles/cantones.css'; // Will create this CSS file later

function CantonesPage() {
    const page = document.createElement('div');
    page.className = 'cantones-page-container';

    page.innerHTML = `
        <h1>Explorar Cantones de Loja</h1>
        <p>Selecciona un cantón para descubrir los restaurantes disponibles.</p>
        <div id="cantones-list-message" class="message" style="display: none;"></div>
        <div id="cantones-list" class="cantones-grid">
            <p>Cargando cantones...</p>
        </div>
    `;

    const cantonesListContainer = page.querySelector('#cantones-list');
    const cantonesListMessage = page.querySelector('#cantones-list-message');

    const displayMessage = (msg, type) => {
        cantonesListMessage.textContent = msg;
        cantonesListMessage.className = `message ${type}`;
        cantonesListMessage.style.display = 'block';
        setTimeout(() => {
            cantonesListMessage.style.display = 'none';
        }, 5000);
    };

    const fetchCantones = async () => {
        cantonesListContainer.innerHTML = '<p>Cargando cantones...</p>';
        try {
            const cantones = await api.getCantones();
            if (cantones.length === 0) {
                cantonesListContainer.innerHTML = '<p>No hay cantones disponibles para explorar.</p>';
                return;
            }

            cantonesListContainer.innerHTML = ''; // Limpiar mensaje de carga
            cantones.forEach(canton => {
                const cantonItem = document.createElement('div');
                cantonItem.className = 'canton-item';
                cantonItem.innerHTML = `
                    <h3>${canton.nombre}</h3>
                    <p>${canton.descripcion || 'Sin descripción.'}</p>
                    <button class="btn btn-primary view-canton-restaurants-btn" data-id="${canton.id}" data-nombre="${canton.nombre}">Ver Restaurantes</button>
                `;
                cantonesListContainer.appendChild(cantonItem);
            });

            cantonesListContainer.querySelectorAll('.view-canton-restaurants-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const nombre = e.target.dataset.nombre;
                    // Navigate to restaurants page, filtered by cantonId
                    window.history.pushState({}, '', `/restaurantes?cantonId=${id}&cantonNombre=${nombre}`);
                    router();
                });
            });

        } catch (error) {
            displayMessage(error.message || 'Error al cargar cantones.', 'error');
            cantonesListContainer.innerHTML = `<p class="error">Error al cargar cantones: ${error.message}</p>`;
            console.error('Error fetching cantones:', error);
        }
    };

    fetchCantones();

    return page;
}

export { CantonesPage };