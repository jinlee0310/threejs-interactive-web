import * as THREE from "three";
import * as CANNON from "cannon-es";
import SEventEmitter from "../../../../../lib/EventEmitter";

export class Goal extends THREE.Mesh {
    name = "goal";
    _body = null;

    get body() {
        return this._body;
    }

    set body(body) {
        this._body = body;
    }
    constructor(radius, position) {
        const geometry = new THREE.ConeGeometry(radius, radius, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x08f262 });

        super(geometry, material);
        this.body = new PhysicsGoal(radius, position);
    }
}

class PhysicsGoal extends CANNON.Body {
    name = "goal";
    constructor(radius, position) {
        const shape = new CANNON.Cylinder(0.1, radius, radius, 12);
        const material = new CANNON.Material();

        super({ shape, material, mass: 0, position });
        this.eventEmitter = SEventEmitter;
        this.eventEmitter.onWin(() => {
            this.eventEmitter.changeScene("home");
        });
    }
}
