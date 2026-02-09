const API_BASE_URL = 'http://localhost:3000/api'; // Base URL for the backend API

/**
 * Función genérica para realizar peticiones a la API.
 * Inyecta automáticamente el token JWT si está disponible en localStorage.
 * @param {string} endpoint - La ruta específica de la API (ej: '/usuarios', '/productos/1').
 * @param {object} options - Opciones de la petición fetch (method, headers, body, etc.).
 * @returns {Promise<object>} La respuesta de la API en formato JSON.
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    
    // Default headers, will be overridden if body is FormData
    const headers = {
        ...options.headers,
    };

    const config = {
        ...options,
    };

    // Si el cuerpo es FormData, no establecer Content-Type; el navegador lo hará automáticamente
    // y no stringify el body.
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }
    } else {
        // Si es FormData, el cuerpo ya está listo para ser enviado
        // y el Content-Type se gestiona automáticamente por el navegador
        config.body = options.body;
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers = headers;


    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorMessage = `Error en la petición: ${response.status}`;
            let errorBody = null; // Variable para almacenar el cuerpo del error como texto

            try {
                errorBody = await response.text(); // Leer el cuerpo de la respuesta una sola vez
                const errorData = JSON.parse(errorBody); // Intentar parsearlo como JSON
                errorMessage = errorData.error || errorData.message || errorMessage;

                // NEW: Specific handling for JWT expired error
                if (errorMessage.includes('jwt expired')) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('lojita_user');
                    window.location.href = '/login'; // Redirect to login page
                    return; // Stop further processing
                }

            } catch (e) {
                // If fails to parse JSON, or if the body was already consumed by another read,
                // just use the errorBody (plain text) if available.
                if (errorBody) {
                    errorMessage = errorBody;
                }
                // If no errorBody, errorMessage already has the default status.
            }
            throw new Error(errorMessage);
        }

        // If the response is 204 No Content, do not attempt to parse JSON
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error; // Re-throw the error so it is handled by the calling component
    }
}

// Funciones específicas para cada recurso (ejemplo)
// Estas son solo sugerencias, puedes ajustarlas según tus necesidades
const api = {
    // Auth
    login: (credentials) => request('/usuarios/login', {
        method: 'POST',
        body: credentials,
    }),
    register: (userData) => request('/usuarios', {
        method: 'POST',
        body: userData,
    }),
    verifyAccount: (verificationData) => request('/usuarios/verify-account', {
        method: 'POST',
        body: verificationData,
    }),
    forgotPassword: (emailData) => request('/usuarios/forgot-password', {
        method: 'POST',
        body: emailData,
    }),
    resetPassword: (token, passwordData) => request(`/usuarios/reset-password/${token}`, {
        method: 'PUT',
        body: passwordData,
    }),

    // Usuarios
    getUsuarios: () => request('/usuarios'),
    getUsuarioById: (id) => request(`/usuarios/${id}`),
    createUsuario: (userData) => request('/usuarios', {
        method: 'POST',
        body: userData,
    }),
    updateUsuario: (id, userData) => request(`/usuarios/${id}`, {
        method: 'PUT',
        body: userData,
    }),
    updateUserRole: (id, roleData) => request(`/usuarios/${id}/cambiar-rol`, {
        method: 'PUT',
        body: roleData,
    }),
    deleteUsuario: (id) => request(`/usuarios/${id}`, {
        method: 'DELETE',
    }),

    // Restaurantes
    getRestaurantes: (queryParamsOrEndpoint = '') => {
        let endpoint = '/restaurantes';
        if (queryParamsOrEndpoint.startsWith('/restaurantes?')) {
            endpoint = queryParamsOrEndpoint;
        } else if (queryParamsOrEndpoint) {
            // This path is for existing calls that only pass a search term
            endpoint += `?search=${encodeURIComponent(queryParamsOrEndpoint)}`;
        }
        return request(endpoint);
    },
    getRestauranteById: (id) => request(`/restaurantes/${id}`),
    createRestaurante: (restauranteData) => request('/restaurantes', {
        method: 'POST',
        body: restauranteData,
    }),
    updateRestaurante: (id, restauranteData) => request(`/restaurantes/${id}`, {
        method: 'PUT',
        body: restauranteData,
    }),
    deleteRestaurante: (id) => request(`/restaurantes/${id}`, {
        method: 'DELETE',
    }),
    uploadRestauranteImage: (id, imageData) => request(`/restaurantes/${id}/upload-image`, {
        method: 'POST',
        body: imageData, // imageData should be FormData
    }),
    // NEW: Get restaurants owned by a specific user
    getUserRestaurants: (userId) => request(`/restaurantes?propietarioId=${userId}`),


    // Platos
    getPlatos: (restauranteId = '') => request(`/platos${restauranteId ? `?restauranteId=${restauranteId}` : ''}`),
    getPlatoById: (id) => request(`/platos/${id}`),
    createPlato: (platoData) => request('/platos', {
        method: 'POST',
        body: platoData, // Aceptar FormData directamente
    }),
    updatePlato: (id, platoData) => request(`/platos/${id}`, {
        method: 'PUT',
        body: platoData, // Aceptar FormData directamente
    }),
    deletePlato: (id) => request(`/platos/${id}`, {
        method: 'DELETE',
    }),
    uploadPlatoImage: (id, imageData) => request(`/platos/${id}/upload-image`, {
        method: 'POST',
        body: imageData, // imageData should be FormData
    }),

    // Pedidos
    getPedidos: () => request('/pedidos'),
    getPedidoById: (id) => request(`/pedidos/${id}`),
    createPedido: (pedidoData) => request('/pedidos', {
        method: 'POST',
        body: pedidoData,
    }),
    updatePedido: (id, pedidoData) => request(`/pedidos/${id}`, {
        method: 'PUT',
        body: pedidoData,
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
        body: reseniaData,
    }),
    updateResenia: (id, reseniaData) => request(`/resenias/${id}`, {
        method: 'PUT',
        body: reseniaData,
    }),
    deleteResenia: (id) => request(`/resenias/${id}`, {
        method: 'DELETE',
    }),

    // Cantones
    getCantones: () => request('/cantones'),
    getCantonById: (id) => request(`/cantones/${id}`),
    createCanton: (cantonData) => request('/cantones', {
        method: 'POST',
        body: cantonData,
    }),
    updateCanton: (id, cantonData) => request(`/cantones/${id}`, {
        method: 'PUT',
        body: cantonData,
    }),
    deleteCanton: (id) => request(`/cantones/${id}`, {
        method: 'DELETE',
    }),

    // Alergias
    getAlergias: () => request('/alergias'),
    getAlergiaById: (id) => request(`/alergias/${id}`),
    createAlergia: (alergiaData) => request('/alergias', {
        method: 'POST',
        body: alergiaData,
    }),
    updateAlergia: (id, alergiaData) => request(`/alergias/${id}`, {
        method: 'PUT',
        body: alergiaData,
    }),
    deleteAlergia: (id) => request(`/alergias/${id}`, {
        method: 'DELETE',
    }),

    // Delivery Apps
    getDeliveryApps: () => request('/deliveries'),
    getDeliveryAppById: (id) => request(`/deliveries/${id}`),
    createDeliveryApp: (deliveryAppData) => request('/deliveries', {
        method: 'POST',
        body: deliveryAppData,
    }),
    updateDeliveryApp: (id, deliveryAppData) => request(`/deliveries/${id}`, {
        method: 'PUT',
        body: deliveryAppData,
    }),
    deleteDeliveryApp: (id) => request(`/deliveries/${id}`, {
        method: 'DELETE',
    }),

    // Solicitudes para ser Propietario
    createSolicitud: (solicitudData) => request('/solicitudes', {
        method: 'POST',
        body: solicitudData,
    }),
    getSolicitudes: () => request('/solicitudes'),
    approveSolicitud: (id) => request(`/solicitudes/${id}/aprobar`, {
        method: 'PUT',
    }),
    rejectSolicitud: (id) => request(`/solicitudes/${id}/rechazar`, {
        method: 'PUT',
    }),
    // NEW: Get solicitudes by a specific user
    getUserSolicitudes: (userId) => request(`/solicitudes?usuarioId=${userId}`),
};

export default api;