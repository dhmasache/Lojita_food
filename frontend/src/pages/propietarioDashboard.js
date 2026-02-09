// frontend/src/pages/propietarioDashboard.js
import api from '../services/api.js';
import { router } from '../router.js';

function PropietarioDashboardPage() {
    const page = document.createElement('div');
    page.className = 'propietario-dashboard-container'; // Nueva clase para el contenedor principal

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'propietario') {
        page.innerHTML = `
            <div class="card access-denied">
                <h1>Acceso Denegado</h1>
                <p>No tienes permiso para ver esta página. Debes ser un 'propietario' de restaurante.</p>
                <a href="/login" data-link class="btn btn-primary">Iniciar Sesión</a>
            </div>
        `;
        return page;
    }

    let currentRestaurant = null;
    let editingDishId = null;

    const renderDashboard = async () => {
        page.innerHTML = `
            <div class="dashboard-header">
                <h1>Panel de Propietario</h1>
                <span class="header-welcome">Bienvenido, ${user.nombre}</span>
            </div>

            <div id="propietario-message" class="message" style="display: none;"></div>
            
            <div class="dashboard-content">
                <!-- Sección de Detalles del Restaurante -->
                <div id="restaurant-details-card" class="card">
                    <h2>Mi Restaurante</h2>
                    <div id="restaurant-info">Cargando información del restaurante...</div>
                    <div class="restaurant-actions">
                        <button id="edit-restaurant-btn" class="btn btn-primary">Editar Detalles</button>
                    </div>
                </div>

                <!-- Sección de Gestión de Platos -->
                <div id="dishes-management-card" class="card">
                    <h2>Gestión de Platos</h2>
                    <button id="add-dish-btn" class="btn btn-secondary">Añadir Nuevo Plato</button>
                    <div id="dishes-list" class="dishes-grid">Cargando platos...</div>
                </div>
            </div>

            <!-- Formularios de Platos (ocultos inicialmente) -->
            <div id="dish-forms-container">
                <!-- Formulario Añadir Plato -->
                <div id="add-dish-form-section" class="card" style="display: none;">
                    <h3>Añadir Nuevo Plato</h3>
                    <form id="add-dish-form" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="dishName">Nombre del Plato</label>
                            <input type="text" id="dishName" name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="dishDescription">Descripción</label>
                            <textarea id="dishDescription" name="descripcion" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="dishPreparacion">Preparación (Ingredientes)</label>
                            <textarea id="dishPreparacion" name="preparacion" rows="5"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Alérgenos en el Plato (Selecciona todas las que apliquen)</label>
                            <div id="add-dish-alergias-checkboxes" class="checkbox-group">
                                <!-- Allergy checkboxes will be loaded here -->
                                <p>Cargando alérgenos...</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="dishPrice">Precio</label>
                            <input type="number" id="dishPrice" name="precio" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Imagen del Plato</label>
                            <div class="custom-file-upload">
                                <input type="file" id="dishImage" name="imagenPlato" accept="image/*" class="hidden-file-input">
                                <label for="dishImage" class="custom-upload-button">Seleccionar Archivo</label>
                                <span id="dish-image-name-display" class="file-name-display">Ningún archivo seleccionado</span>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Crear Plato</button>
                            <button type="button" id="cancel-add-dish-btn" class="btn btn-secondary">Cancelar</button>
                        </div>
                    </form>
                </div>

                <!-- Formulario Editar Plato -->
                <div id="edit-dish-form-section" class="card" style="display: none;">
                    <h3>Editar Plato</h3>
                    <form id="edit-dish-form" enctype="multipart/form-data">
                        <input type="hidden" id="editDishId" name="id">
                        <div class="form-group">
                            <label for="editDishName">Nombre del Plato</label>
                            <input type="text" id="editDishName" name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="editDishDescription">Descripción</label>
                            <textarea id="editDishDescription" name="descripcion" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="editDishPreparacion">Preparación (Ingredientes)</label>
                            <textarea id="editDishPreparacion" name="preparacion" rows="5"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Alérgenos en el Plato (Selecciona todas las que apliquen)</label>
                            <div id="edit-dish-alergias-checkboxes" class="checkbox-group">
                                <!-- Allergy checkboxes will be loaded here -->
                                <p>Cargando alérgenos...</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="editDishPrice">Precio</label>
                            <input type="number" id="editDishPrice" name="precio" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Imagen del Plato (dejar vacío para no cambiar)</label>
                            <div class="current-dish-image-preview" id="current-dish-image-preview"></div>
                            <div class="custom-file-upload">
                                <input type="file" id="editDishImage" name="imagenPlato" accept="image/*" class="hidden-file-input">
                                <label for="editDishImage" class="custom-upload-button">Seleccionar Archivo</label>
                                <span id="edit-dish-image-name-display" class="file-name-display">Ningún archivo seleccionado</span>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                            <button type="button" id="cancel-edit-dish-btn" class="btn btn-secondary">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const propietarioMessage = page.querySelector('#propietario-message');
        const restaurantInfoDiv = page.querySelector('#restaurant-info');
        const editRestaurantBtn = page.querySelector('#edit-restaurant-btn');
        const dishesListDiv = page.querySelector('#dishes-list');
        const addDishFormSection = page.querySelector('#add-dish-form-section');
        const addDishForm = page.querySelector('#add-dish-form');
        const addDishBtn = page.querySelector('#add-dish-btn');
        const cancelAddDishBtn = page.querySelector('#cancel-add-dish-btn');
        const dishImageFileInput = page.querySelector('#dishImage');
        const dishImageNameDisplay = page.querySelector('#dish-image-name-display');
        const addDishPreparacionTextarea = page.querySelector('#dishPreparacion');
        const addDishAlergiasCheckboxesContainer = page.querySelector('#add-dish-alergias-checkboxes');

        const editDishFormSection = page.querySelector('#edit-dish-form-section');
        const editDishForm = page.querySelector('#edit-dish-form');
        const cancelEditDishBtn = page.querySelector('#cancel-edit-dish-btn');
        const editDishImageFileInput = page.querySelector('#editDishImage');
        const editDishImageNameDisplay = page.querySelector('#edit-dish-image-name-display');
        const currentDishImagePreview = page.querySelector('#current-dish-image-preview');
        const editDishPreparacionTextarea = page.querySelector('#editDishPreparacion');
        const editDishAlergiasCheckboxesContainer = page.querySelector('#edit-dish-alergias-checkboxes');


        const displayMessage = (msg, type) => {
            propietarioMessage.textContent = msg;
            propietarioMessage.className = `message ${type}`;
            propietarioMessage.style.display = 'block';
            setTimeout(() => {
                propietarioMessage.style.display = 'none';
            }, 5000);
        };

        // Event listener for custom file input (add dish)
        dishImageFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                dishImageNameDisplay.textContent = e.target.files[0].name;
            } else {
                dishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
            }
        });

        // Event listener for custom file input (edit dish)
        editDishImageFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                editDishImageNameDisplay.textContent = e.target.files[0].name;
            } else {
                editDishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
            }
        });


        const fetchRestaurantAndDishes = async () => {
            try {
                // Fetch restaurants by owner (assuming one per owner for now)
                const userRestaurants = await api.getUserRestaurants(user.id);
                currentRestaurant = userRestaurants.length > 0 ? userRestaurants[0] : null;

                if (currentRestaurant) {
                    restaurantInfoDiv.innerHTML = `
                        <p><strong>Nombre:</strong> ${currentRestaurant.nombre}</p>
                        <p><strong>Dirección:</strong> ${currentRestaurant.direccion}</p>
                        <p><strong>Teléfono:</strong> ${currentRestaurant.telefono}</p>
                        <p><strong>Email:</strong> ${currentRestaurant.email || 'N/A'}</p>
                        <p><strong>Horario L-V:</strong> ${currentRestaurant.horarioLunesViernesApertura || 'N/A'} - ${currentRestaurant.horarioLunesViernesCierre || 'N/A'}</p>
                        <p><strong>Horario S-D:</strong> ${currentRestaurant.horarioSabadoDomingoApertura || 'N/A'} - ${currentRestaurant.horarioSabadoDomingoCierre || 'N/A'}</p>
                        <p><strong>Descripción:</strong> ${currentRestaurant.descripcion || 'Sin descripción.'}</p>
                        <p><strong>Cantón:</strong> ${currentRestaurant.Canton ? currentRestaurant.Canton.nombre : 'N/A'}</p>
                        <p><strong>Tradicional:</strong> ${currentRestaurant.esTradicional ? 'Sí' : 'No'}</p>
                        ${currentRestaurant.imageUrl ? `<img src="http://localhost:3000${currentRestaurant.imageUrl}" alt="${currentRestaurant.nombre}" class="restaurant-image">` : '<p>No hay imagen principal para el restaurante.</p>'}
                    `;
                    
                    // Add event listener for edit restaurant button
                    editRestaurantBtn.addEventListener('click', () => {
                        window.history.pushState({}, '', `/admin/restaurantes/editar/${currentRestaurant.id}`); // Reusar el form de admin
                        router();
                    });

                    // Fetch dishes for this restaurant
                    const dishes = await api.getPlatos(`?restauranteId=${currentRestaurant.id}`);
                    dishesListDiv.innerHTML = ''; // Limpiar antes de renderizar
                    if (dishes.length === 0) {
                        dishesListDiv.innerHTML = '<p>Aún no tienes platos registrados.</p>';
                    } else {
                        dishes.forEach(dish => {
                            const dishItem = document.createElement('div');
                            dishItem.className = 'dish-item card';
                            dishItem.innerHTML = `
                                <h3>${dish.nombre}</h3>
                                ${dish.imagenUrl ? `<img src="http://localhost:3000${dish.imagenUrl}" alt="${dish.nombre}" class="dish-image">` : '<p>No hay imagen para este plato.</p>'}
                                <p>${dish.descripcion || 'Sin descripción.'}</p>
                                <p><strong>Precio:</strong> $${parseFloat(dish.precio).toFixed(2)}</p>
                                <p><strong>Preparación:</strong> ${dish.preparacion || 'N/A'}</p>
                                ${dish.Alergias && dish.Alergias.length > 0 ? 
                                    `<p><strong>Alérgenos:</strong> ${dish.Alergias.map(a => a.nombre).join(', ')}</p>` : ''}
                                <div class="dish-actions">
                                    <button class="btn btn-secondary edit-dish-btn" data-id="${dish.id}">Editar Plato</button>
                                    <button class="btn btn-danger delete-dish-btn" data-id="${dish.id}">Eliminar Plato</button>
                                </div>
                            `;
                            dishesListDiv.appendChild(dishItem);
                        });
                        // Add event listeners for dish actions (edit/delete)
                        dishesListDiv.querySelectorAll('.edit-dish-btn').forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const dishId = e.target.dataset.id;
                                editingDishId = dishId;
                                addDishFormSection.style.display = 'none';
                                editDishFormSection.style.display = 'block';
                                addDishForm.reset(); // Limpiar form añadir plato

                                try {
                                    const dishToEdit = await api.getPlatoById(dishId);
                                    editDishForm.elements.editDishName.value = dishToEdit.nombre;
                                    editDishForm.elements.editDishDescription.value = dishToEdit.descripcion;
                                    editDishForm.elements.editDishPrice.value = parseFloat(dishToEdit.precio).toFixed(2);
                                    editDishPreparacionTextarea.value = dishToEdit.preparacion || '';

                                    // Populate and pre-select allergies for edit form
                                    const dishAlergiaIds = dishToEdit.Alergias ? dishToEdit.Alergias.map(a => a.id) : [];
                                    await populateAlergiasCheckboxes(editDishAlergiasCheckboxesContainer, dishAlergiaIds);
                                    
                                    if (dishToEdit.imagenUrl) {
                                        currentDishImagePreview.innerHTML = `<img src="http://localhost:3000${dishToEdit.imagenUrl}" alt="${dishToEdit.nombre}" class="dish-image-preview">`;
                                        editDishImageNameDisplay.textContent = dishToEdit.imagenUrl.split('/').pop();
                                    } else {
                                        currentDishImagePreview.innerHTML = '<p>No hay imagen actual.</p>';
                                        editDishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
                                    }
                                } catch (error) {
                                    displayMessage(error.message || 'Error al cargar los datos del plato para edición.', 'error');
                                    editDishFormSection.style.display = 'none';
                                }
                            });
                        });
                        dishesListDiv.querySelectorAll('.delete-dish-btn').forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const dishId = e.target.dataset.id;
                                if (confirm('¿Estás seguro de que quieres eliminar este plato?')) {
                                    try {
                                        await api.deletePlato(dishId);
                                        displayMessage('Plato eliminado con éxito.', 'success');
                                        fetchRestaurantAndDishes(); // Recargar lista
                                    } catch (error) {
                                        displayMessage(error.message || 'Error al eliminar el plato.', 'error');
                                    }
                                }
                            });
                        });
                    }
                } else {
                    // Si el usuario propietario no tiene restaurante
                    restaurantInfoDiv.innerHTML = `
                        <p>No tienes un restaurante registrado. Por favor, crea uno para empezar a gestionar.</p>
                        <button id="create-restaurant-btn" class="btn btn-primary">Crear mi Restaurante</button>
                    `;
                    editRestaurantBtn.style.display = 'none'; // Ocultar botón de editar
                    page.querySelector('#dishes-management-card').style.display = 'none'; // Ocultar sección de platos
                    addDishFormSection.style.display = 'none';
                    editDishFormSection.style.display = 'none';

                    page.querySelector('#create-restaurant-btn').addEventListener('click', () => {
                        window.history.pushState({}, '', '/admin/restaurantes/nuevo'); // Usar el mismo form de admin para crear
                        router();
                    });
                }

            } catch (error) {
                displayMessage(error.message || 'Error al cargar los datos del propietario.', 'error');
                restaurantInfoDiv.innerHTML = '<p class="error">Error al cargar el restaurante.</p>';
                dishesListDiv.innerHTML = '<p class="error">Error al cargar los platos.</p>';
            }
        };

        // Function to fetch alergias and populate the checkboxes
        const populateAlergiasCheckboxes = async (container, selectedAlergiaIds = []) => {
            container.innerHTML = '<p>Cargando alérgenos...</p>';
            try {
                const alergias = await api.getAlergias();
                container.innerHTML = ''; // Clear loading message
                if (alergias.length === 0) {
                    container.innerHTML = '<p>No hay alérgenos disponibles.</p>';
                    return;
                }
                alergias.forEach(alergia => {
                    const checkboxDiv = document.createElement('div');
                    checkboxDiv.className = 'checkbox-item';
                    checkboxDiv.innerHTML = `
                        <input type="checkbox" id="alergia-${alergia.id}-${container.id}" name="selectedAlergiaIds" value="${alergia.id}" ${selectedAlergiaIds.includes(alergia.id) ? 'checked' : ''}>
                        <label for="alergia-${alergia.id}-${container.id}">${alergia.nombre}</label>
                    `;
                    container.appendChild(checkboxDiv);
                });
            } catch (error) {
                console.error('Error fetching alergias:', error);
                displayMessage('Error al cargar los alérgenos.', 'error');
            }
        };

        // Initial calls to populate checkboxes
        populateAlergiasCheckboxes(addDishAlergiasCheckboxesContainer);
        // For edit form, it will be populated when edit button is clicked (in fetchRestaurantAndDishes)
        
        addDishBtn.addEventListener('click', () => {
            addDishFormSection.style.display = 'block';
            editDishFormSection.style.display = 'none';
            addDishForm.reset();
            dishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
            populateAlergiasCheckboxes(addDishAlergiasCheckboxesContainer); // Re-populate for reset
        });

        cancelAddDishBtn.addEventListener('click', () => {
            addDishFormSection.style.display = 'none';
            addDishForm.reset();
            dishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
            addDishPreparacionTextarea.value = ''; // Clear preparacion
        });

        cancelEditDishBtn.addEventListener('click', () => {
            editDishFormSection.style.display = 'none';
            editDishForm.reset();
            editingDishId = null;
            currentDishImagePreview.innerHTML = '';
            editDishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
        });


        addDishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentRestaurant) {
                displayMessage('No hay un restaurante asociado para añadir platos.', 'error');
                return;
            }

            const formData = new FormData(addDishForm);
            formData.append('restauranteId', currentRestaurant.id);
            formData.append('preparacion', addDishPreparacionTextarea.value);

            const selectedAlergiaIds = Array.from(addDishAlergiasCheckboxesContainer.querySelectorAll('input[name="selectedAlergiaIds"]:checked'))
                                                .map(checkbox => checkbox.value);
            selectedAlergiaIds.forEach(id => {
                formData.append('selectedAlergiaIds[]', id);
            });
            
            try {
                await api.createPlato(formData);
                displayMessage('Plato creado con éxito.', 'success');
                addDishFormSection.style.display = 'none';
                addDishForm.reset();
                dishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
                addDishPreparacionTextarea.value = ''; // Clear preparacion
                populateAlergiasCheckboxes(addDishAlergiasCheckboxesContainer); // Reset checkboxes
                fetchRestaurantAndDishes();
            } catch (error) {
                displayMessage(error.message || 'Error al crear el plato.', 'error');
            }
        });

        editDishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentRestaurant) {
                displayMessage('No hay un restaurante asociado para editar platos.', 'error');
                return;
            }
            if (!editingDishId) {
                displayMessage('No hay un plato seleccionado para editar.', 'error');
                return;
            }

            const formData = new FormData(editDishForm);
            // Si el input de archivo está vacío, no queremos enviar un archivo vacío al backend
            if (editDishForm.elements.imagenPlato.files.length === 0) {
                formData.delete('imagenPlato'); // Eliminar el campo si no se seleccionó una nueva imagen
            }

            formData.append('preparacion', editDishPreparacionTextarea.value);

            const selectedAlergiaIds = Array.from(editDishAlergiasCheckboxesContainer.querySelectorAll('input[name="selectedAlergiaIds"]:checked'))
                                                .map(checkbox => checkbox.value);
            selectedAlergiaIds.forEach(id => {
                formData.append('selectedAlergiaIds[]', id);
            });
            
            try {
                await api.updatePlato(editingDishId, formData);
                displayMessage('Plato actualizado con éxito.', 'success');
                editDishFormSection.style.display = 'none';
                editDishForm.reset();
                editingDishId = null;
                currentDishImagePreview.innerHTML = '';
                editDishImageNameDisplay.textContent = 'Ningún archivo seleccionado';
                editDishPreparacionTextarea.value = ''; // Clear preparacion
                populateAlergiasCheckboxes(editDishAlergiasCheckboxesContainer); // Reset checkboxes
                fetchRestaurantAndDishes();
            } catch (error) {
                displayMessage(error.message || 'Error al actualizar el plato.', 'error');
            }
        });

        fetchRestaurantAndDishes(); // Initial fetch
    };

    renderDashboard();

    return page;
}

export { PropietarioDashboardPage };