import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera extends THREE.PerspectiveCamera {
    get sizer() {
        return this.world.sizer;
    }

    constructor(world) {
        super(75, world.sizer.width / world.sizer.height, 0.1, 100);
        this.world = world;
        this.domElement = this.world.domElement;
        this.position.set(0, 2, 5);

        this.addControls();
    }

    addControls() {
        this.controls = new OrbitControls(this, this.domElement);
        this.controls.enabled = true;
        this.controls.enableDamping = true;
    }

    resize() {
        this.aspect = this.sizer.width / this.sizer.height;
        this.updateProjectionMatrix();
    }

    update({ position }) {
        this.rotation.x = -0.6;
        this.position.set(position.x, position.y + 2, position.z + 2.3);
        // this.controls.update();
    }
}
