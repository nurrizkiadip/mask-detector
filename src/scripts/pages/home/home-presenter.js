import {loadLayersModel} from '@tensorflow/tfjs';
import CONFIG from '../../config';

export default class HomePresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadModel() {
    try {
      const metadataResponse = await fetch(`${CONFIG.MODEL_BASE_URL}/mask-model/metadata.json`);
      const metadata = await metadataResponse.json();

      const model = await loadLayersModel(`${CONFIG.MODEL_BASE_URL}/mask-model/model.json`);
      model.classes = metadata.labels;

      this.#view.loadModelSuccessfully(model);
    } catch (error) {
      console.error('loadModel: error:', error);
      this.#view.loadModelFailed(error.message);
    }
  }
}
