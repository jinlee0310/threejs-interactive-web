import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Light {
    _controls = [];
    _cameras = [];
    _canvasSize = {
        width: Math.floor(window.innerWidth / 3),
        height: Math.floor(window.innerHeight / 2),
    };

    get controls() {
        return this._controls;
    }

    get cameras() {
        return this._cameras;
    }

    get canvasSize() {
        return this._canvasSize;
    }

    constructor(scene) {
        this.scene = scene;
    }

    // synchronizeControls(controlsFrom, cameraTo, controlsTo) {
    //     cameraTo.position.copy(controlsFrom.object.position);
    //     cameraTo.quaternion.copy(controlsFrom.object.quaternion);
    //     controlsTo.update();
    // }

    addCamera(camera) {
        this._cameras.push(camera);
    }

    addControl(control) {
        this._controls.push(control);
    }

    synchronizeControls(i) {
        this.controls.forEach((control, idx) => {
            if (idx === i) return;
            this.cameras[idx].position.copy(this.controls[i].object.position);
            this.cameras[idx].quaternion.copy(
                this.controls[i].object.quaternion
            );
            control.update();
        });
    }

    create() {
        this.createMesh();
        this.createTorusKnot();
        this.createFloor();
        this.createSphere();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }

    createSphere() {
        const geometry = new THREE.SphereGeometry(3, 30, 30);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(8, 0, -7);

        this.scene.add(mesh);
    }

    createTorusKnot() {
        const geometry = new THREE.TorusKnotGeometry(2, 0.8, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x81d8cf,
            roughness: 0,
            metalness: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 10);
        mesh.rotation.set(10, 20, 0);

        this.scene.add(mesh);
    }

    createFloor() {
        const geometry = new THREE.BoxGeometry(30, 1, 30);
        const material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -5, 0);

        this.scene.add(mesh);
    }
}
