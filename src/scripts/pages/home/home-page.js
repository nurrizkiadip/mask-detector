import HomePresenter from './home-presenter';
import Camera from '../../utils/camera';
import {generateMaskImageTemplate} from '../../utils/templates';
import {convertBlobToBase64} from '../../utils';

export default class HomePage {
  #presenter;
  #model = null;

  constructor() {
    this.#presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h2 class="section-title">Deteksi Masker</h2>

        <form id="detection-form" class="detection-form">
          <div class="mask-container">
            <div class="mask-title">Ambil Gambar</div>
          
            <div class="mask-input-container">
              <!-- Input Image Option -->
              <div class="mask-input-options__buttons">
                <label tabindex="0" for="mask-input" class="btn btn-outline">
                  Input File
                </label>
                <input
                  id="mask-input"
                  class="mask-input-options__buttons__input"
                  name="mask"
                  type="file"
                  accept="image/*"
                >
                <button type="button" id="mask-camera-toggle" class="btn btn-outline">
                  Buka Kamera
                </button>
              </div>
              
              <!-- Mask Camera -->
              <div id="camera-container" class="camera-container">
                <video id="camera-video" class="camera__video">Video stream not available.</video>
                <canvas id="camera-canvas" class="camera__canvas"></canvas>
                <div class="camera__tools">
                  <select id="camera-list-front-back">
                    <option value="front">Kamera Depan</option>
                    <option value="back">Kamera Belakang</option>
                  </select>
                  <button type="button" id="camera-take" class="btn">Ambil Gambar</button>
                </div>
              </div>

              <!-- Camera Output -->
              <div class="mask-input-container">
                <div>Output:</div>
                <div id="mask-input-outputs" class="mask-input__outputs">
                  <img class="mask-input__outputs__image" src="images/placeholder-image.jpg" alt="Placeholder">
                </div>
              </div>
            </div>
          </div>
  
          <div class="form-buttons">
            <button id="start-predict" class="btn">Prediksi</button>
            <button type="button" id="reset" class="btn btn-outline">Reset</button>
          </div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._form = document.querySelector('#detection-form');
    this._initialListener();

    await this.#presenter.loadModel();
  }

  _initialListener() {
    this._form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this._takenImageMask) {
        window.alert('Pilih gambar dahulu!');
        return;
      }

      const result = await this.getPrediction(this._takenImageMask);
      this._showPredictResult(result);
    });

    this._form.elements.namedItem('mask-input').addEventListener('change', async (event) => {
      const pickedImage = event.srcElement.files[0];

      await this._addTakenPicture(pickedImage);
    });

    const cameraToggle = document.querySelector('#mask-camera-toggle')
    cameraToggle.addEventListener('click', async (event) => {
      if (!Camera.isMediaDevicesAvailable()) {
        console.error('Media Stream API tidak didukung oleh browser ini.');
        window.alert('Media Stream API tidak didukung oleh browser ini.');

        return;
      }

      const cameraContainer = document.querySelector('#camera-container');
      cameraContainer.classList.toggle('open');
      this._isCameraOpen = cameraContainer.classList.contains('open');

      if (!this._isCameraOpen) {
        this._camera.stop();
        event.currentTarget.textContent = 'Buka Kamera';

        return;
      }

      this._setupCamera();
      event.currentTarget.textContent = 'Tutup Kamera';
    });

    document.querySelector('#reset').addEventListener('click', async () => {
      this._removePicture();
      await this._populateTakenPictures();
    });
  }

  async loadModelSuccessfully(model) {
    this.#model = model;
  }

  loadModelFailed(message) {
    window.alert(`Gagal memuat model: ${message}`);
  }

  async getPrediction(imageUrl) {
    if (!this.#model) {
      window.alert('Model belum dimuat.');
      return;
    }

    // Do the prediction here...

    return 'mask';
  }

  _setupCamera() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');

    this._camera = new Camera({
      video,
      canvas,
    });

    this._camera.launch();

    document.querySelector('#camera-list-front-back').addEventListener('change', async (event) => {
      const isFrontCamera = event.currentTarget.value === 'front';
      this._camera.launch(isFrontCamera);
    });

    this._camera.addCheeseButtonListener('#camera-take', async () => {
      const image = await this._camera.takePicture();

      await this._addTakenPicture(image);
    });
  }

  async _addTakenPicture(imageUrl) {
    let image = imageUrl;

    if (image instanceof Blob) {
      image = await convertBlobToBase64(image);
    }

    this._takenImageMask = image;

    await this._populateTakenPictures();
  }

  async _populateTakenPictures() {
    const outputContainer = document.querySelector('#mask-input-outputs');

    const html = generateMaskImageTemplate(this._takenImageMask);
    outputContainer.innerHTML = html;
  }

  _removePicture() {
    this._takenImageMask = null;

    return this._takenImageMask;
  }

  _showPredictResult(result) {
    // Do the result logic here...
  }
}
