const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Función genérica para realizar peticiones a la API.
 * Inyecta automáticamente el token JWT si está disponible en localStorage.
 * @param {string} endpoint - La ruta específica de la API (ej: '/usuarios', '/productos/1').
 * @param {object} options - Opciones de la petición fetch (method, headers, body, etc.).
 * @returns {Promise<object>} La respuesta de la API en formato JSON.
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json();
            // Puedes manejar diferentes códigos de estado aquí si es necesario
            throw new Error(errorData.message || `Error en la petición: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error; // Re-lanza el error para que sea manejado por el componente que llama
    }
}

// Funciones específicas para cada recurso (ejemplo)
// Estas son solo sugerencias, puedes ajustarlas según tus necesidades
const api = {
    // Auth
    login: (credentials) => request('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => request('/usuarios', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    // Usuarios
    getUsuarios: () => request('/usuarios'),
    getUsuarioById: (id) => request(`/usuarios/${id}`),
    createUsuario: (userData) => request('/usuarios', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    updateUsuario: (id, userData) => request(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    deleteUsuario: (id) => request(`/usuarios/${id}`, {
        method: 'DELETE',
    }),

    // Restaurantes
    getRestaurantes: () => request('/restaurantes'),
    getRestauranteById: (id) => request(`/restaurantes/${id}`),
    createRestaurante: (restauranteData) => request('/restaurantes', {
        method: 'POST',
        body: JSON.stringify(restauranteData),
    }),
    updateRestaurante: (id, restauranteData) => request(`/restaurantes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(restauranteData),
    }),
    deleteRestaurante: (id) => request(`/restaurantes/${id}`, {
        method: 'DELETE',
    }),

    // Platos
    getPlatos: (restauranteId = '') => request(`/platos${restauranteId ? `?restauranteId=${restauranteId}` : ''}`),
    getPlatoById: (id) => request(`/platos/${id}`),
    createPlato: (platoData) => request('/platos', {
        method: 'POST',
        body: JSON.stringify(platoData),
    }),
    updatePlato: (id, platoData) => request(`/platos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(platoData),
    }),
    deletePlato: (id) => request(`/platos/${id}`, {
        method: 'DELETE',
    }),

    // Pedidos
    getPedidos: () => request('/pedidos'),
    getPedidoById: (id) => request(`/pedidos/${id}`),
    createPedido: (pedidoData) => request('/pedidos', {
        method: 'POST',
        body: JSON.stringify(pedidoData),
    }),
    updatePedido: (id, pedidoData) => request(`/pedidos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pedidoData),
    }),
    deletePedido: (id) => request(`/pedidos/${id}`, {
        method: 'DELETE',
    }),

    // Reseñas
    getResenias: (restauranteId = '', usuarioId = '') => {
        let query = '';
        if (restauranteId) query += `restauranteId=${restauranteId}&`;
        if (usuarioId) query += `usuarioId=${usuarioId}&`;
        if (query) query = `?${query.slice(0, -1)}`; // Eliminar la última '&'
        return request(`/resenias${query}`);
    },
    getReseniaById: (id) => request(`/resenias/${id}`),
    createResenia: (reseniaData) => request('/resenias', {
        method: 'POST',
        body: JSON.stringify(reseniaData),
    }),
    updateResenia: (id, reseniaData) => request(`/resenias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reseniaData),
    }),
    deleteResenia: (id) => request(`/resenias/${id}`, {
        method: 'DELETE',
    }),

    // Cantones
    getCantones: () => request('/cantones'),
    getCantonById: (id) => request(`/cantones/${id}`),
    createCanton: (cantonData) => request('/cantones', {
        method: 'POST',
        body: JSON.stringify(cantonData),
    }),
    updateCanton: (id, cantonData) => request(`/cantones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cantonData),
    }),
    deleteCanton: (id) => request(`/cantones/${id}`, {
        method: 'DELETE',
    }),

    // Alergias
    getAlergias: () => request('/alergias'),
    getAlergiaById: (id) => request(`/alergias/${id}`),
    createAlergia: (alergiaData) => request('/alergias', {
        method: 'POST',
        body: JSON.stringify(alergiaData),
    }),
    updateAlergia: (id, alergiaData) => request(`/alergias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(alergiaData),
    }),
    deleteAlergia: (id) => request(`/alergias/${id}`, {
        method: 'DELETE',
    }),

    // Delivery Apps
    getDeliveryApps: () => request('/deliveries'),
    getDeliveryAppById: (id) => request(`/deliveries/${id}`),
    createDeliveryApp: (deliveryAppData) => request('/deliveries', {
        method: 'POST',
        body: JSON.stringify(deliveryAppData),
    }),
    updateDeliveryApp: (id, deliveryAppData) => request(`/deliveries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(deliveryAppData),
    }),
    deleteDeliveryApp: (id) => request(`/deliveries/${id}`, {
        method: 'DELETE',
    }),
};

export default api;
