// frontend/src/pages/propietarioDashboard.js
import api from '../services/api.js';
import { router } from '../router.js';

function PropietarioDashboardPage() {
    const page = document.createElement('div');
    page.className = 'dashboard-container';

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (!user || user.rol !== 'propietario') {
        page.innerHTML = `
            <h1>Acceso Denegado</h1>
            <p>No tienes permiso para ver esta página. Debes ser un 'propietario' de restaurante.</p>
            <a href="/login" data-link>Iniciar Sesión</a>
        `;
        return page;
    }

    let currentRestaurant = null;
    let editingDishId = null; // Para saber qué plato estamos editando

    const renderDashboard = async () => {
        page.innerHTML = `
            <h1>Panel de Propietario</h1>
            <p>Bienvenido, ${user.nombre}. Gestiona tu restaurante y tus platos aquí.</p>

            <div id="propietario-message" class="message" style="display: none;"></div>
            
            <div id="restaurant-details-section" class="card">
                <h2>Mi Restaurante</h2>
                <div id="restaurant-info">Cargando información del restaurante...</div>
                <button id="edit-restaurant-btn" class="btn btn-primary" style="margin-top: 1rem;">Editar Restaurante</button>
            </div>

            <div id="restaurant-edit-form-section" class="card" style="display: none;">
                <h2>Editar Detalles del Restaurante</h2>
                <form id="edit-restaurant-form" class="form-grid" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="restaurant-nombre">Nombre</label>
                        <input type="text" id="restaurant-nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="restaurant-direccion">Dirección</label>
                        <input type="text" id="restaurant-direccion" name="direccion" required>
                    </div>
                    <div class="form-group">
                        <label for="restaurant-telefono">Teléfono</label>
                        <input type="tel" id="restaurant-telefono" name="telefono" required>
                    </div>
                    <div class="form-group">
                        <label for="restaurant-email">Email</label>
                        <input type="email" id="restaurant-email" name="email">
                    </div>
                    <div class="form-group">
                        <label for="restaurant-horarioApertura">Horario Apertura</label>
                        <input type="time" id="restaurant-horarioApertura" name="horarioApertura" required>
                    </div>
                    <div class="form-group">
                        <label for="restaurant-horarioCierre">Horario Cierre</label>
                        <input type="time" id="restaurant-horarioCierre" name="horarioCierre" required>
                    </div>
                    <div class="form-group">
                        <label for="restaurant-descripcion">Descripción</label>
                        <textarea id="restaurant-descripcion" name="descripcion" rows="4"></textarea>
                    </div>
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="restaurant-esTradicional" name="esTradicional">
                        <label for="restaurant-esTradicional">¿Es Tradicional?</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <button type="button" id="cancel-edit-restaurant-btn" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>

            <div id="restaurant-image-section" class="card">
                <h2>Imagen del Restaurante</h2>
                <div id="current-restaurant-image"></div>
                <form id="upload-restaurant-image-form" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="restaurantImage">Subir Nueva Imagen</label>
                        <input type="file" id="restaurantImage" name="restaurantImage" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Subir Imagen</button>
                </form>
            </div>

            <div id="dishes-section" class="card">
                <h2>Mis Platos</h2>
                <button id="add-dish-btn" class="btn btn-primary">Añadir Nuevo Plato</button>
                <div id="dishes-list">Cargando platos...</div>
            </div>

            <div id="add-dish-form-section" class="card" style="display: none;">
                <h2>Añadir Nuevo Plato</h2>
                <form id="add-dish-form" class="form-grid" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="dishName">Nombre del Plato</label>
                        <input type="text" id="dishName" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="dishDescription">Descripción</label>
                        <textarea id="dishDescription" name="descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="dishPrice">Precio</label>
                        <input type="number" id="dishPrice" name="precio" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="dishImage">Imagen del Plato</label>
                        <input type="file" id="dishImage" name="imagenPlato" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-primary">Crear Plato</button>
                    <button type="button" id="cancel-add-dish-btn" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>

            <div id="edit-dish-form-section" class="card" style="display: none;">
                <h2>Editar Plato</h2>
                <form id="edit-dish-form" class="form-grid" enctype="multipart/form-data">
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
                        <label for="editDishPrice">Precio</label>
                        <input type="number" id="editDishPrice" name="precio" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="editDishImage">Imagen del Plato (dejar vacío para no cambiar)</label>
                        <input type="file" id="editDishImage" name="imagenPlato" accept="image/*">
                    </div>
                    <div id="current-dish-image-preview" style="text-align: center; margin-bottom: 1rem;"></div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <button type="button" id="cancel-edit-dish-btn" class="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        `;

        const propietarioMessage = page.querySelector('#propietario-message');
        const restaurantInfoDiv = page.querySelector('#restaurant-info');
        const restaurantEditFormSection = page.querySelector('#restaurant-edit-form-section');
        const editRestaurantForm = page.querySelector('#edit-restaurant-form');
        const uploadRestaurantImageForm = page.querySelector('#upload-restaurant-image-form');
        const currentRestaurantImageDiv = page.querySelector('#current-restaurant-image');
        const dishesListDiv = page.querySelector('#dishes-list');
        const addDishFormSection = page.querySelector('#add-dish-form-section');
        const addDishForm = page.querySelector('#add-dish-form');
        const editDishFormSection = page.querySelector('#edit-dish-form-section'); // Nuevo
        const editDishForm = page.querySelector('#edit-dish-form'); // Nuevo
        const cancelAddDishBtn = page.querySelector('#cancel-add-dish-btn');
        const cancelEditDishBtn = page.querySelector('#cancel-edit-dish-btn'); // Nuevo
        const addDishBtn = page.querySelector('#add-dish-btn'); // Botón añadir plato
        const currentDishImagePreview = page.querySelector('#current-dish-image-preview');


        const displayMessage = (msg, type) => {
            propietarioMessage.textContent = msg;
            propietarioMessage.className = `message ${type}`;
            propietarioMessage.style.display = 'block';
            setTimeout(() => {
                propietarioMessage.style.display = 'none';
            }, 5000);
        };

        const fetchRestaurantAndDishes = async () => {
            try {
                // Fetch restaurants by owner (assuming one per owner for now)
                const allRestaurants = await api.getRestaurantes();
                currentRestaurant = allRestaurants.find(r => r.propietarioId === user.id);

                if (currentRestaurant) {
                    restaurantInfoDiv.innerHTML = `
                        <p><strong>Nombre:</strong> ${currentRestaurant.nombre}</p>
                        <p><strong>Dirección:</strong> ${currentRestaurant.direccion}</p>
                        <p><strong>Teléfono:</strong> ${currentRestaurant.telefono}</p>
                        <p><strong>Email:</strong> ${currentRestaurant.email || 'N/A'}</p>
                        <p><strong>Horario:</strong> ${currentRestaurant.horarioApertura} - ${currentRestaurant.horarioCierre}</p>
                        <p><strong>Descripción:</strong> ${currentRestaurant.descripcion || 'Sin descripción.'}</p>
                        <p><strong>Tradicional:</strong> ${currentRestaurant.esTradicional ? 'Sí' : 'No'}</p>
                    `;
                    if(currentRestaurant.imageUrl) {
                        currentRestaurantImageDiv.innerHTML = `<img src="http://localhost:3000${currentRestaurant.imageUrl}" alt="${currentRestaurant.nombre}" class="restaurant-image">`;
                    } else {
                        currentRestaurantImageDiv.innerHTML = `<p>No hay imagen principal para el restaurante.</p>`;
                    }
                    
                    // Populate edit form
                    editRestaurantForm.elements['restaurant-nombre'].value = currentRestaurant.nombre;
                    editRestaurantForm.elements['restaurant-direccion'].value = currentRestaurant.direccion;
                    editRestaurantForm.elements['restaurant-telefono'].value = currentRestaurant.telefono;
                    editRestaurantForm.elements['restaurant-email'].value = currentRestaurant.email;
                    editRestaurantForm.elements['restaurant-horarioApertura'].value = currentRestaurant.horarioApertura;
                    editRestaurantForm.elements['restaurant-horarioCierre'].value = currentRestaurant.horarioCierre;
                    editRestaurantForm.elements['restaurant-descripcion'].value = currentRestaurant.descripcion; // Nuevo
                    editRestaurantForm.elements['restaurant-esTradicional'].checked = currentRestaurant.esTradicional;

                    // Fetch dishes for this restaurant
                    const dishes = await api.getPlatos(currentRestaurant.id);
                    dishesListDiv.innerHTML = '';
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
                                editingDishId = dishId; // Establecer el ID del plato que se está editando
                                addDishFormSection.style.display = 'none'; // Ocultar form añadir
                                editDishFormSection.style.display = 'block'; // Mostrar form editar

                                try {
                                    const dishToEdit = await api.getPlatoById(dishId);
                                    editDishForm.elements.editDishName.value = dishToEdit.nombre;
                                    editDishForm.elements.editDishDescription.value = dishToEdit.descripcion;
                                    editDishForm.elements.editDishPrice.value = parseFloat(dishToEdit.precio).toFixed(2);
                                    // Previsualizar imagen actual si existe
                                    if (dishToEdit.imagenUrl) {
                                        currentDishImagePreview.innerHTML = `<img src="http://localhost:3000${dishToEdit.imagenUrl}" alt="${dishToEdit.nombre}" class="dish-image-preview">`;
                                    } else {
                                        currentDishImagePreview.innerHTML = '<p>No hay imagen actual.</p>';
                                    }
                                } catch (error) {
                                    displayMessage(error.message || 'Error al cargar los datos del plato para edición.', 'error');
                                    editDishFormSection.style.display = 'none'; // Ocultar formulario de edición si hay error
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
                    restaurantInfoDiv.innerHTML = '<p>Aún no tienes un restaurante registrado. Contacta al administrador si crees que es un error.</p>';
                }

            } catch (error) {
                displayMessage(error.message || 'Error al cargar los datos del propietario.', 'error');
                restaurantInfoDiv.innerHTML = '<p>Error al cargar el restaurante.</p>';
                dishesListDiv.innerHTML = '<p>Error al cargar los platos.</p>';
            }
        };

        // Event Listeners
        page.querySelector('#edit-restaurant-btn').addEventListener('click', () => {
            restaurantEditFormSection.style.display = 'block';
        });

        page.querySelector('#cancel-edit-restaurant-btn').addEventListener('click', () => {
            restaurantEditFormSection.style.display = 'none';
        });

        editRestaurantForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedData = {
                nombre: editRestaurantForm.elements['restaurant-nombre'].value,
                direccion: editRestaurantForm.elements['restaurant-direccion'].value,
                telefono: editRestaurantForm.elements['restaurant-telefono'].value,
                email: editRestaurantForm.elements['restaurant-email'].value,
                horarioApertura: editRestaurantForm.elements['restaurant-horarioApertura'].value,
                horarioCierre: editRestaurantForm.elements['restaurant-horarioCierre'].value,
                descripcion: editRestaurantForm.elements['restaurant-descripcion'].value, // Nuevo
                esTradicional: editRestaurantForm.elements['restaurant-esTradicional'].checked,
            };
            try {
                await api.updateRestaurante(currentRestaurant.id, updatedData);
                displayMessage('Restaurante actualizado con éxito.', 'success');
                restaurantEditFormSection.style.display = 'none';
                fetchRestaurantAndDishes(); // Recargar datos
            } catch (error) {
                displayMessage(error.message || 'Error al actualizar el restaurante.', 'error');
            }
        });

        uploadRestaurantImageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = uploadRestaurantImageForm.elements.restaurantImage;
            if (!fileInput.files.length) {
                displayMessage('Por favor, selecciona una imagen para subir.', 'error');
                return;
            }
            const formData = new FormData();
            formData.append('restaurantImage', fileInput.files[0]);

            try {
                await api.uploadRestauranteImage(currentRestaurant.id, formData);
                displayMessage('Imagen del restaurante subida con éxito.', 'success');
                uploadRestaurantImageForm.reset();
                fetchRestaurantAndDishes(); // Recargar datos para mostrar nueva imagen
            } catch (error) {
                displayMessage(error.message || 'Error al subir la imagen del restaurante.', 'error');
            }
        });

        page.querySelector('#add-dish-btn').addEventListener('click', () => {
            addDishFormSection.style.display = 'block';
            editDishFormSection.style.display = 'none'; // Asegurarse de que el form de edición esté oculto
        });

        cancelAddDishBtn.addEventListener('click', () => {
            addDishFormSection.style.display = 'none';
            addDishForm.reset();
        });

        cancelEditDishBtn.addEventListener('click', () => { // Nuevo
            editDishFormSection.style.display = 'none';
            editDishForm.reset();
            editingDishId = null;
            currentDishImagePreview.innerHTML = '';
        });


        addDishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentRestaurant) {
                displayMessage('No hay un restaurante asociado para añadir platos.', 'error');
                return;
            }

            const formData = new FormData(addDishForm);
            formData.append('restauranteId', currentRestaurant.id); // Asignar el ID del restaurante
            
            // Convertir precio a número si es necesario (el Multer/body-parser no lo hace automáticamente)
            // formData.set('precio', parseFloat(formData.get('precio'))); // No necesario, Multer lo maneja como string, el backend lo parseará

            try {
                await api.createPlato(formData); // Enviar FormData directamente
                displayMessage('Plato creado con éxito.', 'success');
                addDishFormSection.style.display = 'none';
                addDishForm.reset();
                fetchRestaurantAndDishes(); // Recargar lista
            } catch (error) {
                displayMessage(error.message || 'Error al crear el plato.', 'error');
            }
        });

        editDishForm.addEventListener('submit', async (e) => { // Nuevo
            e.preventDefault();
            if (!editingDishId) {
                displayMessage('No hay un plato seleccionado para editar.', 'error');
                return;
            }

            const formData = new FormData(editDishForm);
            formData.append('restauranteId', currentRestaurant.id); // Asegurar restauranteId

            // Multer no procesa PUT/PATCH con body. Se debe enviar _method=PUT para que lo detecte express-form-data
            // Como estamos usando un enfoque más simple, pasaremos los datos y la imagen por separado si es necesario
            // o simplemente manejaremos la imagen como un campo que se reemplaza si está presente.
            
            // La API de updatePlato en el backend puede manejar FormData ahora
            try {
                await api.updatePlato(editingDishId, formData);
                displayMessage('Plato actualizado con éxito.', 'success');
                editDishFormSection.style.display = 'none';
                editDishForm.reset();
                editingDishId = null;
                currentDishImagePreview.innerHTML = '';
                fetchRestaurantAndDishes(); // Recargar lista
            } catch (error) {
                displayMessage(error.message || 'Error al actualizar el plato.', 'error');
            }
        });


        // Initial fetch
        fetchRestaurantAndDishes();
    };

    renderDashboard(); // Initial render and data fetch

    return page;
}

export { PropietarioDashboardPage };