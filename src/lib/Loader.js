import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Loader {
    constructor() {
        this.gltfLoader = new GLTFLoader();
    }
}

export const SLoader = new Loader();
