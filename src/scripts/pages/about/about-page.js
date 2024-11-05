export default class AboutPage {
  async render() {
    return `
      <section>
        <div class="container">
          <h2 class="section-title">About Page</h2>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do nothing
  }
}
