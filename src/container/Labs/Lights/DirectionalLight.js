import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";

export default class DirectionalLight extends Light {
    #canvas = null;
    constructor() {
        const scene = new THREE.Scene();
        super(scene);
        this.scene = scene;

        this.#canvas = document.createElement("canvas");
        this.#canvas.id = "directional-light";

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.#canvas,
        });
        this.renderer.setClearColor(0x333333);
        this.renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);

        document.querySelector("#labs-lights").appendChild(this.#canvas);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 3 / (window.innerHeight / 2),
            0.1,
            100
        );
        this.camera.position.set(15, 15, 15);

        this.controls = new OrbitControls(this.camera, this.#canvas);
    }

    render() {
        this.createLight();
        this.create();
        this.resize();
        this.draw();
    }

    createLight() {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(8, 10, 5);
        const lightHelper = new THREE.DirectionalLightHelper(light);
        this.scene.add(light);
        this.scene.add(lightHelper);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);

        this.controls.update();

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this.camera.aspect = window.innerWidth / 3 / (window.innerHeight / 2);
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
