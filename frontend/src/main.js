import { Header } from './components/Header.js';
import { router } from './router.js';

const app = document.getElementById('app');

function renderLayout() {
    // Render Header
    const header = Header();
    app.before(header);

    // Initial route handling
    window.addEventListener('popstate', router);
    document.addEventListener('DOMContentLoaded', router);

    // Handle navigation for links
    document.body.addEventListener('click', e => {
        if (e.target.matches('[href]')) {
            e.preventDefault();
            history.pushState({}, '', e.target.href);
            router();
        }
    });
}

renderLayout();

