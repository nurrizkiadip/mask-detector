export default class NotFoundPage {
  async render() {
    return `
      <section>
        <div class="container">
          <h2 class="section-title">Page Not Found (404)</h2>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do nothing
  }
}
