export default class Camera {
  #width = 320;
  #height = 0;

  #videoElement = null;
  #canvasElement = null;

  #cheeseButtonElement = null;
  #cheeseButtonHandler = null;

  #currentStream = null;
  #streaming = false;

  static isMediaDevicesAvailable() {
    return (
      'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices
    );
  }

  static addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [stream];

      return;
    }

    window.currentStreams = [...window.currentStreams, stream];
  }

  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];

      return;
    }

    const activeStreams = window.currentStreams.filter((stream) => stream.active);
    activeStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
  }

  constructor({video, canvas, options = {} }) {
    this.#videoElement = video;
    this.#canvasElement = canvas;

    if (Object.hasOwn(options, 'width')) {
      this.#width = options.width;
    }
    if (Object.hasOwn(options, 'height')) {
      this.#height = options.height;
    }

    this._initialListener();
  }

  _initialListener() {
    this.#videoElement.addEventListener('canplay', () => {
      if (this.#streaming) {
        return;
      }

      this.#height = this.#videoElement.videoHeight / (this.#videoElement.videoWidth / this.#width);

      // Set photo width and height
      this.#canvasElement.setAttribute('width', this.#width);
      this.#canvasElement.setAttribute('height', this.#height);

      this.#streaming = true;
    });
  }

  async launch(frontCamera = true) {
    if (frontCamera) {
      this.#currentStream = await this._getFrontCameraStream();
    } else {
      this.#currentStream = await this._getCameraStream();
    }

    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.play();

    Camera.addNewStream(this.#currentStream);

    this._clearCanvas();
  }

  stop() {
    if (this.#videoElement) {
      this.#videoElement.pause();
      this.#videoElement.removeAttribute('src');
      this.#videoElement.load();

      this.#streaming = false;
    }

    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    Camera.stopAllStreams();

    this.#cheeseButtonElement.removeEventListener('click', this.#cheeseButtonHandler);
  }

  async _getFrontCameraStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'user' },
        },
      });
    } catch (error) {
      if (error.name === 'OverconstrainedError') {
        try {
          return await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        } catch (fallbackError) {
          console.error('_getStream: fallbackError:', fallbackError);
          return null;
        }
      } else {
        console.error('_getStream: error:', error);
        return null;
      }
    }
  }

  async _getCameraStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
        },
      });
    } catch (error) {
      if (error.name === 'OverconstrainedError') {
        try {
          return await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        } catch (fallbackError) {
          console.error('_getStream: fallbackError:', fallbackError);
          return null;
        }
      } else {
        console.error('_getStream: error:', error);
        return null;
      }
    }
  }

  _clearCanvas() {
    const context = this.#canvasElement.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);
  }

  async takePicture() {
    if (!(this.#width && this.#height)) {
      return null;
    }

    const context = this.#canvasElement.getContext('2d');

    this.#canvasElement.width = this.#width;
    this.#canvasElement.height = this.#height;
    context.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);

    return this.#canvasElement.toDataURL('image/png');
  }

  addCheeseButtonListener(selector, callback) {
    this.#cheeseButtonElement = document.querySelector(selector);
    this.#cheeseButtonHandler = callback;

    this.#cheeseButtonElement.addEventListener('click', this.#cheeseButtonHandler);
  }
}
