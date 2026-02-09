// frontend/src/pages/about.js
export function AboutPage() {
    const element = document.createElement('div');
    element.className = 'about-container';
    
    // The CSS content for this page, embedded directly
    const pageStyles = `
/* Estilos para la página "Acerca de Nosotros" */
.about-container {
  padding: 2.5rem; /* Padding general */
  max-width: 1200px; /* Ancho máximo consistente con otros contenedores */
  margin: 0 auto; /* Centrar */
  min-height: calc(100vh - 70px - 2rem); /* Ajuste para el header y padding inferior */
  display: flex; /* Usar flex para organizar secciones */
  flex-direction: column;
  gap: 3.5rem; /* Mayor espacio entre secciones */
  background-color: var(--background-main); /* Fondo principal de la página */
}

/* Estilos para el texto de introducción y títulos */
.about-main-title {
    font-family: var(--font-serif);
    font-size: 3.5rem; /* Título principal más grande */
    color: var(--accent-coffee); /* Color de acento */
    margin-bottom: 0.8rem;
    font-weight: 700;
    line-height: 1.1; /* Mejor interlineado */
}

.about-intro-text {
    font-size: 1.3rem; /* Texto introductorio más grande */
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 900px;
    margin: 0 auto;
}

/* Estilos de la Hero Section */
.about-hero-section {
    text-align: center;
    padding: 3.5rem 2rem; /* Más padding */
    background-color: var(--surface-color); /* Fondo de tarjeta */
    border-radius: 20px; /* Bordes más redondeados */
    box-shadow: var(--shadow-lg); /* Sombra más pronunciada */
    border: 1px solid var(--border-color);
}

/* Estilos de las secciones generales */
.about-section {
    text-align: center;
    padding: 1rem;
}

.about-section h2 {
    font-family: var(--font-serif);
    font-size: 2.8rem; /* Títulos de sección más grandes */
    color: var(--primary-dark);
    margin-bottom: 2.5rem; /* Más espacio debajo */
    font-weight: 700;
}

/* Estilo para iconos (emojis) */
.icon {
    font-size: 3rem; /* Iconos más grandes */
    margin-bottom: 1rem;
    display: block; /* Para centrar y dar margen */
    text-align: center;
    line-height: 1; /* Eliminar espacio extra */
}

/* Misión y Visión */
.mission-vision {
    display: flex;
    flex-wrap: wrap; /* Permitir que se envuelvan en pantallas pequeñas */
    justify-content: center;
    gap: 2.5rem; /* Más espacio entre tarjetas */
}

.mission-card, .vision-card {
    flex: 1; /* Permitir que las tarjetas crezcan y se encojan */
    min-width: 320px; /* Ancho mínimo para las tarjetas */
    background-color: var(--surface-color); /* Fondo de tarjeta */
    padding: 2.5rem; /* Más padding */
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-color);
    text-align: center; /* Centrar texto dentro de la tarjeta */
    transition: var(--transition-smooth);
    display: flex; /* Para alinear icon y título */
    flex-direction: column;
    align-items: center; /* Centrar contenido */
}

.mission-card:hover, .vision-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

.mission-card h2, .vision-card h2 {
    font-family: var(--font-serif);
    font-size: 1.6rem; /* Título de tarjeta más pequeño que el de sección */
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
}

.mission-card p, .vision-card p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
}

/* Grid de Valores */
.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Min-width ajustado para valores */
    gap: 1.5rem;
    margin-top: 2rem;
}

.value-item {
    background-color: var(--surface-color);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-color);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.value-item h3 {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    color: var(--accent-olive-green);
    margin-bottom: 0.8rem;
    font-weight: 600;
}

.value-item p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.5;
}

/* Contacto CTA */
.contact-cta {
    background: linear-gradient(45deg, var(--primary-color), var(--primary-dark)); /* Gradiente atractivo */
    color: white;
    padding: 4rem 2rem; /* Más padding */
    border-radius: 20px; /* Bordes más redondeados */
    box-shadow: var(--shadow-lg);
}

.contact-cta h2 {
    color: white;
    font-size: 3rem; /* Título más grande */
    margin-bottom: 1.5rem;
}

.contact-cta p {
    font-size: 1.2rem;
    margin-bottom: 2.5rem; /* Más espacio */
    color: rgba(255, 255, 255, 0.9);
}

.about-cta-btn {
    background-color: var(--surface-color); /* Botón con fondo blanco */
    color: var(--primary-color); /* Texto del color primario */
    padding: 1rem 2.5rem; /* Más padding */
    border-radius: 30px;
    font-weight: 700;
    text-decoration: none;
    transition: var(--transition-smooth);
    border: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2); /* Sombra para el botón */
}

.about-cta-btn:hover {
    background-color: var(--background-main); /* Cambiar a un gris muy claro al hover */
    color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3); /* Sombra más grande al hover */
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
    .about-main-title {
        font-size: 2.5rem;
    }
    .about-intro-text {
        font-size: 1.1rem;
    }
    .about-section h2 {
        font-size: 2.2rem;
    }
    .mission-vision {
        flex-direction: column;
        gap: 1.5rem;
    }
    .mission-card, .vision-card {
        padding: 2rem;
        min-width: unset;
    }
    .values-grid {
        grid-template-columns: 1fr; /* Una columna en pantallas pequeñas */
    }
    .contact-cta h2 {
        font-size: 2.2rem;
    }
    .contact-cta p {
        font-size: 1rem;
    }
    .about-cta-btn { /* Aquí se incluye el about-nav .btn-secondary que ya no existe */
        padding: 0.7rem 1.5rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .about-container {
        padding: 1.5rem;
    }
    .about-main-title {
        font-size: 2rem;
    }
    .about-intro-text {
        font-size: 0.95rem;
    }
    .about-section h2 {
        font-size: 1.8rem;
    }
    .icon {
        font-size: 2.5rem;
    }
    .mission-card h2, .vision-card h2 {
        font-size: 1.4rem;
    }
    .mission-card p, .vision-card p {
        font-size: 0.9rem;
    }
    .value-item h3 {
        font-size: 1.2rem;
    }
    .value-item p {
        font-size: 0.85rem;
    }
    .contact-cta h2 {
        font-size: 1.8rem;
    }
    .contact-cta p {
        font-size: 0.95rem;
    }
    .about-cta-btn { /* Aquí se incluye el about-nav .btn-secondary que ya no existe */
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
    }
}
`;

    element.innerHTML = `
        <div class="about-hero-section">
            <h1 class="about-main-title">Acerca de LojitaFood</h1>
            <p class="about-intro-text">Conectando los sabores auténticos de Loja contigo. ¡Una experiencia culinaria única al alcance de tu mano!</p>
        </div>

        <div class="about-section mission-vision">
            <div class="mission-card card"> <!-- Añadimos 'card' para estilos base -->
                <span class="icon">✨</span>
                <h2>Nuestra Misión</h2>
                <p>Ser el puente digital que conecta a los apasionados de la gastronomía lojana con los mejores restaurantes locales, ofreciendo una experiencia de búsqueda y pedido sin igual, siempre con la calidad y autenticidad que nos caracteriza.</p>
            </div>
            <div class="vision-card card"> <!-- Añadimos 'card' para estilos base -->
                <span class="icon">🚀</span>
                <h2>Nuestra Visión</h2>
                <p>Convertirnos en la plataforma líder de descubrimiento culinario en Loja y sus alrededores, reconocida por fomentar la cultura gastronómica local, apoyar a los negocios y por su innovación constante en el servicio al cliente. En un futuro, aspiramos a expandir nuestra plataforma más allá de Loja, integrando la gastronomía típica de diversas provincias del Ecuador, demostrando la escalabilidad y el impacto nacional de LojitaFood.</p>
            </div>
        </div>

        <div class="about-section team-values">
            <h2>Nuestros Valores</h2>
            <div class="values-grid">
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">💡</span>
                    <h3>Innovación</h3>
                    <p>Siempre buscando nuevas formas de mejorar la experiencia del usuario y del restaurante.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">🤝</span>
                    <h3>Comunidad</h3>
                    <p>Construimos lazos fuertes entre comensales y establecimientos locales, apoyando el crecimiento mutuo.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">❤️</span>
                    <h3>Pasión Culinaria</h3>
                    <p>Celebramos y promovemos la riqueza y diversidad de la cocina lojana con dedicación y amor por lo nuestro.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">🛡️</span>
                    <h3>Integridad</h3>
                    <p>Operamos con transparencia, honestidad y respeto en todas nuestras interacciones y procesos.</p>
                </div>
            </div>
        </div>

        `;

    const isLoggedIn = localStorage.getItem('jwt_token') !== null;

    let ctaTitle = "¿Listo para Explorar o Unirte?";
    let ctaDescription = "Descubre tu próximo plato favorito o impulsa tu negocio uniéndote a nuestra red de restaurantes. ¡La aventura culinaria te espera!";

    if (isLoggedIn) {
        ctaTitle = "¿Listo para Explorar?";
        ctaDescription = "Descubre tu próximo plato favorito o gestiona tu negocio en nuestra red de restaurantes. ¡La aventura culinaria te espera!";
    }

    let ctaSectionHtml = `
        <div class="about-section contact-cta">
            <h2>${ctaTitle}</h2>
            <p>${ctaDescription}</p>
            ${!isLoggedIn ? `<a href="/register" data-link class="btn btn-primary about-cta-btn">Únete Ahora</a>` : ''}
        </div>
    `;

    element.innerHTML = `
        <div class="about-hero-section">
            <h1 class="about-main-title">Acerca de LojitaFood</h1>
            <p class="about-intro-text">Conectando los sabores auténticos de Loja contigo. ¡Una experiencia culinaria única al alcance de tu mano!</p>
        </div>

        <div class="about-section mission-vision">
            <div class="mission-card card"> <!-- Añadimos 'card' para estilos base -->
                <span class="icon">✨</span>
                <h2>Nuestra Misión</h2>
                <p>Ser el puente digital que conecta a los apasionados de la gastronomía lojana con los mejores restaurantes locales, ofreciendo una experiencia de búsqueda y pedido sin igual, siempre con la calidad y autenticidad que nos caracteriza.</p>
            </div>
            <div class="vision-card card"> <!-- Añadimos 'card' para estilos base -->
                <span class="icon">🚀</span>
                <h2>Nuestra Visión</h2>
                <p>Convertirnos en la plataforma líder de descubrimiento culinario en Loja y sus alrededores, reconocida por fomentar la cultura gastronómica local, apoyar a los negocios y por su innovación constante en el servicio al cliente. En un futuro, aspiramos a expandir nuestra plataforma más allá de Loja, integrando la gastronomía típica de diversas provincias del Ecuador, demostrando la escalabilidad y el impacto nacional de LojitaFood.</p>
            </div>
        </div>

        <div class="about-section team-values">
            <h2>Nuestros Valores</h2>
            <div class="values-grid">
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">💡</span>
                    <h3>Innovación</h3>
                    <p>Siempre buscando nuevas formas de mejorar la experiencia del usuario y del restaurante.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">🤝</span>
                    <h3>Comunidad</h3>
                    <p>Construimos lazos fuertes entre comensales y establecimientos locales, apoyando el crecimiento mutuo.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">❤️</span>
                    <h3>Pasión Culinaria</h3>
                    <p>Celebramos y promovemos la riqueza y diversidad de la cocina lojana con dedicación y amor por lo nuestro.</p>
                </div>
                <div class="value-item card"> <!-- Añadimos 'card' para estilos base -->
                    <span class="icon">🛡️</span>
                    <h3>Integridad</h3>
                    <p>Operamos con transparencia, honestidad y respeto en todas nuestras interacciones y procesos.</p>
                </div>
            </div>
        </div>
        ${ctaSectionHtml}
    `;

    // Apply styles directly for encapsulation
    const style = document.createElement('style');
    style.textContent = pageStyles; // Use the const pageStyles defined above

    element.appendChild(style); // Add the <style> tag to the main element
    
    return element;
}