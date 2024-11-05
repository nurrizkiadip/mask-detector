// CSS imports
import '../styles/styles.css';

import App from './pages/app';

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});

document.addEventListener('DOMContentLoaded', async () => {
  await app.renderPage();
});

window.addEventListener('hashchange', async () => {
  await app.renderPage();
});
