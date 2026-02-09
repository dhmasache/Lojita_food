// frontend/src/pages/editProfilePage.js
import api from '../services/api.js';
import { router } from '../router.js';

function EditProfilePage() {
    const page = document.createElement('div');
    page.className = 'edit-profile-page-container';

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user) {
        page.innerHTML = `
            <div class="edit-profile-card access-denied">
                <h2>Acceso Denegado</h2>
                <p>Debes iniciar sesión para editar tu perfil.</p>
                <a href="/login" data-link class="btn btn-primary">Iniciar Sesión</a>
            </div>
        `;
        return page;
    }

    page.innerHTML = `
        <div class="edit-profile-card">
            <h2>Editar Mi Perfil</h2>
            <div id="profile-message" class="message" style="display: none;"></div>

            <form id="edit-profile-form" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" value="${user.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${user.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value="${user.telefono || ''}">
                </div>
                <div class="form-group">
                    <label for="password">Nueva Contraseña (dejar vacío para no cambiar)</label>
                    <input type="password" id="password" name="password">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirm-password" name="confirm-password">
                </div>
                <div class="form-group">
                    <label>Mis Alergias (Selecciona todas las que apliquen)</label>
                    <div id="alergias-checkboxes" class="checkbox-group">
                        <!-- Allergy checkboxes will be loaded here -->
                        <p>Cargando alergias...</p>
                    </div>
                </div>

                <div class="form-group">
                    <label>Imagen de Perfil Actual</label>
                    <div class="current-profile-image-preview">
                        ${user.imagenPerfil ? `<img src="http://localhost:3000${user.imagenPerfil}" alt="Imagen de Perfil" class="profile-image-preview">` : '<p>No hay imagen de perfil actual.</p>'}
                    </div>
                    <div class="custom-file-upload">
                        <input type="file" name="imagenPerfil" id="imagenPerfil" accept="image/*" class="hidden-file-input">
                        <label for="imagenPerfil" class="custom-upload-button">Seleccionar Imagen</label>
                        <span id="profile-image-name-display" class="file-name-display">Ningún archivo seleccionado</span>
                        ${user.imagenPerfil ? `<button type="button" id="remove-profile-image-btn" class="btn btn-danger btn-small">Eliminar Imagen Actual</button>` : ''}
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <button type="button" id="cancel-edit-profile-btn" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    const profileMessage = page.querySelector('#profile-message');
    const editProfileForm = page.querySelector('#edit-profile-form');
    const alergiasCheckboxesContainer = page.querySelector('#alergias-checkboxes');
    const imagenPerfilInput = page.querySelector('#imagenPerfil');
    const profileImageNameDisplay = page.querySelector('#profile-image-name-display');
    const removeProfileImageBtn = page.querySelector('#remove-profile-image-btn');
    const cancelEditProfileBtn = page.querySelector('#cancel-edit-profile-btn');

    const displayMessage = (msg, type) => {
        profileMessage.textContent = msg;
        profileMessage.className = `message ${type}`;
        profileMessage.style.display = 'block';
        setTimeout(() => {
            profileMessage.style.display = 'none';
        }, 5000);
    };

    // Function to fetch alergias and populate the checkboxes
    const populateAlergiasCheckboxes = async (selectedAlergiaIds = []) => {
        alergiasCheckboxesContainer.innerHTML = '<p>Cargando alergias...</p>';
        try {
            const alergias = await api.getAlergias();
            alergiasCheckboxesContainer.innerHTML = ''; // Clear loading message
            if (alergias.length === 0) {
                alergiasCheckboxesContainer.innerHTML = '<p>No hay alergias disponibles.</p>';
                return;
            }
            alergias.forEach(alergia => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox-item';
                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="alergia-${alergia.id}" name="selectedAlergiaIds" value="${alergia.id}" ${selectedAlergiaIds.includes(alergia.id.toString()) ? 'checked' : ''}>
                    <label for="alergia-${alergia.id}">${alergia.nombre}</label>
                `;
                alergiasCheckboxesContainer.appendChild(checkboxDiv);
            });
        } catch (error) {
            console.error('Error fetching alergias:', error);
            displayMessage('Error al cargar las alergias.', 'error');
        }
    };

    // Function to load full user data and populate form
    const loadUserData = async () => {
        try {
            const fullUser = await api.getUsuarioById(user.id);
            if (fullUser) {
                editProfileForm.elements.nombre.value = fullUser.nombre;
                editProfileForm.elements.email.value = fullUser.email;
                editProfileForm.elements.telefono.value = fullUser.telefono || '';

                // Pre-select user's allergies
                const userAlergiaIds = fullUser.Alergias ? fullUser.Alergias.map(a => a.id) : [];
                await populateAlergiasCheckboxes(userAlergiaIds);
                
                // Update local storage with full user data including allergies
                localStorage.setItem('lojita_user', JSON.stringify(fullUser));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            displayMessage('Error al cargar los datos del perfil.', 'error');
        }
    };

    // Call to populate alergias and load user data on page load
    loadUserData();
    imagenPerfilInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            profileImageNameDisplay.textContent = e.target.files[0].name;
        } else {
            profileImageNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });

    // Event listener for remove profile image button
    if (removeProfileImageBtn) {
        removeProfileImageBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que quieres eliminar tu imagen de perfil?')) {
                try {
                    const formData = new FormData();
                    formData.append('imagenPerfil', 'null'); // Señal al backend para eliminar
                    const updatedUser = await api.updateUsuario(user.id, formData);
                    // Actualizar localStorage y recargar para reflejar cambios
                    localStorage.setItem('lojita_user', JSON.stringify(updatedUser));
                    displayMessage('Imagen de perfil eliminada con éxito.', 'success');
                    router('/profile/edit'); // Recargar la página para reflejar el cambio
                } catch (error) {
                    displayMessage(error.message || 'Error al eliminar la imagen de perfil.', 'error');
                }
            }
        });
    }

    // Form submission handler
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        profileMessage.style.display = 'none';
        profileMessage.className = 'message';

        const password = editProfileForm.elements.password.value;
        const confirmPassword = editProfileForm.elements['confirm-password'].value;

        if (password && password !== confirmPassword) {
            displayMessage('Las contraseñas no coinciden.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', editProfileForm.elements.nombre.value);
        formData.append('email', editProfileForm.elements.email.value);
        formData.append('telefono', editProfileForm.elements.telefono.value);
        if (password) {
            formData.append('password', password);
        }

        // Añadir imagen de perfil si se seleccionó una
        if (imagenPerfilInput.files.length > 0) {
            formData.append('imagenPerfil', imagenPerfilInput.files[0]);
        }
        
        // Collect selected allergy IDs
        const selectedAlergiaIds = Array.from(alergiasCheckboxesContainer.querySelectorAll('input[name="selectedAlergiaIds"]:checked'))
                                            .map(checkbox => checkbox.value);
        selectedAlergiaIds.forEach(id => {
            formData.append('selectedAlergiaIds[]', id);
        });

        try {
            const updatedUser = await api.updateUsuario(user.id, formData);
            localStorage.setItem('lojita_user', JSON.stringify(updatedUser)); // Actualizar info en localStorage
            displayMessage('Perfil actualizado con éxito.', 'success');
            
            // Redirigir según el rol del usuario
            let redirectPath = '/client-dashboard';
            if (user.rol === 'admin') {
                redirectPath = '/admin';
            }
            setTimeout(() => {
                window.history.pushState({}, '', redirectPath);
                router();
            }, 1500);

        } catch (error) {
            console.error('Error updating profile:', error);
            displayMessage(error.message || 'Error al actualizar el perfil.', 'error');
        }
    });

    cancelEditProfileBtn.addEventListener('click', () => {
        // Redirigir según el rol del usuario
        let redirectPath = '/client-dashboard';
        if (user.rol === 'admin') {
            redirectPath = '/admin';
        }
        window.history.pushState({}, '', redirectPath);
        router();
    });


    return page;
}

export { EditProfilePage };
