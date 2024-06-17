import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class RectAreaLight extends Light {
    _canvas = null;
    _camera = null;
    _renderer = null;
    _scene = null;
    constructor() {
        const scene = new THREE.Scene();

        const $canvas = document.createElement("canvas");
        $canvas.id = "rect-area-light";

        document.querySelector("#labs-lights").appendChild($canvas);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: $canvas,
        });

        renderer.setClearColor(0x333333);
        renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 3 / (window.innerHeight / 2),
            0.1,
            100
        );
        camera.position.set(15, 15, 15);

        super(scene);

        this._scene = scene;
        this._canvas = $canvas;
        this._renderer = renderer;
        this._camera = camera;

        this.controls = new OrbitControls(this._camera, this._canvas);
    }

    render() {
        this.create();
        this.createLight();
        this.resize();
        this.draw();
    }

    createLight() {
        const light1 = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
        const light2 = new THREE.RectAreaLight(0x00ff00, 1, 10, 10);
        light1.position.set(0, 0, 13);
        light2.position.set(8, -2, -8);
        light2.rotation.y = (Math.PI * 3) / 4;
        light2.rotation.x = -Math.PI / 4;
        const lightHelper1 = new RectAreaLightHelper(light1);
        this._scene.add(light1);
        this._scene.add(light2);
        this._scene.add(lightHelper1);
    }

    draw() {
        this._renderer.render(this._scene, this._camera);

        this.controls.update();

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this._camera.aspect = window.innerWidth / 3 / (window.innerHeight / 2);
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
