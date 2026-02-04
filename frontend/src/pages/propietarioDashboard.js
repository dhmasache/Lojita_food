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
                <form id="edit-restaurant-form" class="form-grid">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="direccion">Dirección</label>
                        <input type="text" id="direccion" name="direccion" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email">
                    </div>
                    <div class="form-group">
                        <label for="horarioApertura">Horario Apertura</label>
                        <input type="time" id="horarioApertura" name="horarioApertura" required>
                    </div>
                    <div class="form-group">
                        <label for="horarioCierre">Horario Cierre</label>
                        <input type="time" id="horarioCierre" name="horarioCierre" required>
                    </div>
                    <div class="form-group">
                        <label for="esTradicional">¿Es Tradicional?</label>
                        <input type="checkbox" id="esTradicional" name="esTradicional">
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
                        <textarea id="dishDescription" name="descripcion"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="dishPrice">Precio</label>
                        <input type="number" id="dishPrice" name="precio" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="dishImage">Imagen del Plato</label>
                        <input type="file" id="dishImage" name="dishImage" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-primary">Crear Plato</button>
                    <button type="button" id="cancel-add-dish-btn" class="btn btn-secondary">Cancelar</button>
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
                        <p><strong>Tradicional:</strong> ${currentRestaurant.esTradicional ? 'Sí' : 'No'}</p>
                        ${currentRestaurant.imageUrl ? `<img src="http://localhost:3000${currentRestaurant.imageUrl}" alt="${currentRestaurant.nombre}" style="max-width: 200px; max-height: 200px; object-fit: cover; margin-top: 1rem;">` : '<p>No hay imagen principal para el restaurante.</p>'}
                    `;
                    if(currentRestaurant.imageUrl) {
                        currentRestaurantImageDiv.innerHTML = `<img src="http://localhost:3000${currentRestaurant.imageUrl}" alt="${currentRestaurant.nombre}" style="max-width: 200px; max-height: 200px; object-fit: cover; margin-top: 1rem;">`;
                    } else {
                        currentRestaurantImageDiv.innerHTML = `<p>No hay imagen principal para el restaurante.</p>`;
                    }
                    
                    // Populate edit form
                    editRestaurantForm.elements.nombre.value = currentRestaurant.nombre;
                    editRestaurantForm.elements.direccion.value = currentRestaurant.direccion;
                    editRestaurantForm.elements.telefono.value = currentRestaurant.telefono;
                    editRestaurantForm.elements.email.value = currentRestaurant.email;
                    editRestaurantForm.elements.horarioApertura.value = currentRestaurant.horarioApertura;
                    editRestaurantForm.elements.horarioCierre.value = currentRestaurant.horarioCierre;
                    editRestaurantForm.elements.esTradicional.checked = currentRestaurant.esTradicional;

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
                                ${dish.imagenUrl ? `<img src="http://localhost:3000${dish.imagenUrl}" alt="${dish.nombre}" style="max-width: 150px; max-height: 150px; object-fit: cover; margin-bottom: 0.5rem;">` : '<p>No hay imagen para este plato.</p>'}
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
                            button.addEventListener('click', (e) => {
                                displayMessage('Funcionalidad de edición de plato aún no implementada.', 'info');
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
                nombre: editRestaurantForm.elements.nombre.value,
                direccion: editRestaurantForm.elements.direccion.value,
                telefono: editRestaurantForm.elements.telefono.value,
                email: editRestaurantForm.elements.email.value,
                horarioApertura: editRestaurantForm.elements.horarioApertura.value,
                horarioCierre: editRestaurantForm.elements.horarioCierre.value,
                esTradicional: editRestaurantForm.elements.esTradicional.checked,
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
        });

        page.querySelector('#cancel-add-dish-btn').addEventListener('click', () => {
            addDishFormSection.style.display = 'none';
            addDishForm.reset();
        });

        addDishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentRestaurant) {
                displayMessage('No hay un restaurante asociado para añadir platos.', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('nombre', addDishForm.elements.dishName.value);
            formData.append('descripcion', addDishForm.elements.dishDescription.value);
            formData.append('precio', addDishForm.elements.dishPrice.value);
            formData.append('restauranteId', currentRestaurant.id); // Asignar el ID del restaurante

            const dishImageFile = addDishForm.elements.dishImage.files[0];
            if (dishImageFile) {
                formData.append('dishImage', dishImageFile);
            }

            try {
                const newDish = await api.createPlato(Object.fromEntries(formData)); // createPlato espera JSON, no FormData
                // If an image was provided, upload it separately after dish creation
                if (dishImageFile && newDish && newDish.id) {
                    const imageFormData = new FormData();
                    imageFormData.append('dishImage', dishImageFile);
                    await api.uploadPlatoImage(newDish.id, imageFormData);
                }

                displayMessage('Plato creado con éxito.', 'success');
                addDishFormSection.style.display = 'none';
                addDishForm.reset();
                fetchRestaurantAndDishes(); // Recargar lista
            } catch (error) {
                displayMessage(error.message || 'Error al crear el plato.', 'error');
            }
        });

        // Initial fetch
        fetchRestaurantAndDishes();
    };

    renderDashboard(); // Initial render and data fetch

    return page;
}

export { PropietarioDashboardPage };
