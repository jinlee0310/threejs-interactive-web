import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";

export default class DirectionalLight extends Light {
    _canvas = null;
    _camera = null;
    _renderer = null;
    _scene = null;
    _controls = null;
    constructor() {
        const $wrapper = document.createElement("div");
        $wrapper.id = "directional-light";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Directional Light";

        $wrapper.appendChild($h2);

        const $canvas = document.createElement("canvas");

        $wrapper.appendChild($canvas);

        document.querySelector("#labs-lights").appendChild($wrapper);

        const _renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: $canvas,
        });
        _renderer.setClearColor(0x333333);
        _renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);

        document.querySelector("#labs-lights").appendChild($wrapper);

        const _scene = new THREE.Scene();

        const _camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 3 / (window.innerHeight / 2),
            0.1,
            100
        );
        _camera.position.set(15, 15, 15);

        const _controls = new OrbitControls(_camera, $canvas);

        super(_scene);

        this._canvas = $canvas;
        this._renderer = _renderer;
        this._scene = _scene;
        this._camera = _camera;
        this._controls = _controls;
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
        this._scene.add(light);
        this._scene.add(lightHelper);
    }

    draw() {
        this._renderer.render(this._scene, this._camera);

        this._controls.update();

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this._camera.aspect = window.innerWidth / 3 / (window.innerHeight / 2);
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
