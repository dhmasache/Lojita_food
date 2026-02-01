// frontend/src/pages/propietarioDashboard.js

// Placeholder page for Restaurant Owner Dashboard
function PropietarioDashboardPage() {
    const page = document.createElement('div');
    page.className = 'dashboard-container';

    // Check if the user is logged in and is a 'propietario'
    const user = JSON.parse(localStorage.getItem('lojita_user'));

    if (user && user.rol === 'propietario') {
        page.innerHTML = `
            <h1>Panel de Propietario</h1>
            <p>Bienvenido, ${user.nombre}.</p>
            <div class="dashboard-content">
                <p>Aquí podrás gestionar tu restaurante, editar tu perfil, añadir platos, ver promociones, etc.</p>
                <p>Esta funcionalidad se implementará en el futuro.</p>
                
                <div class="mock-actions">
                    <button disabled>Editar Perfil de Restaurante</button>
                    <button disabled>Ver mis Platos</button>
                    <button disabled>Crear Promoción</button>
                </div>
            </div>
        `;
    } else {
        // If the user is not a 'propietario' or not logged in, show an access denied message.
        page.innerHTML = `
            <h1>Acceso Denegado</h1>
            <p>No tienes permiso para ver esta página. Debes ser un 'propietario' de restaurante.</p>
            <a href="/login" data-link>Iniciar Sesión</a>
        `;
    }

    return page;
}

export { PropietarioDashboardPage };
