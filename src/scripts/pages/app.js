import routes from '../routes/routes';
import { parseAndCombineActiveUrl } from '../routes/url-parser';

class App {
  constructor({ navigationDrawer, drawerButton, content }) {
    this._content = content;
    this._drawerButton = drawerButton;
    this._navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this._drawerButton.addEventListener('click', () => {
      this._navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this._navigationDrawer.contains(event.target) && !this._drawerButton.contains(event.target)) {
        this._navigationDrawer.classList.remove('open');
      }

      this._navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this._navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async renderPage() {
    const url = parseAndCombineActiveUrl();
    const page = routes[url] ?? null;

    if (!page) {
      window.location.hash = '/not-found';
      return;
    }

    this._content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
