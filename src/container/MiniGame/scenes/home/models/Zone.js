import * as THREE from "three";
import * as CANNON from "cannon-es";
import SEventEmitter from "../../../../../lib/EventEmitter";
import gsap from "gsap";

export class Zone extends THREE.Mesh {
    name = "zone";
    _body = null;

    get body() {
        return this._body;
    }
    set body(body) {
        this._body = body;
    }

    constructor(width, height, depth, position) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: 0x08f262 });

        super(geometry, material);

        this.body = new PhysicsZone(width, height, depth, position);
        this.receiveShadow = true;
        this.eventEmitter = SEventEmitter;
        this.eventEmitter.onEnter(() => {
            gsap.to(this.scale, {
                duration: 1,
                x: 2,
                y: 2,
                z: 2,
                ease: "power1.inOut",
            });
        });
    }
}

class PhysicsZone extends CANNON.Body {
    name = "zone";

    constructor(width, height, depth, position) {
        const shape = new CANNON.Box(
            new CANNON.Vec3(width / 2, height / 2, depth / 2)
        );
        const material = new CANNON.Material({
            friction: 0.1,
            restitution: 0.5,
        });
        super({ shape, material, mass: 0, position });
        this.eventEmitter = SEventEmitter;
        this.eventEmitter.clear("enter");
        this.eventEmitter.onEnter(() => {
            this.removeShape(shape);
            const newShape = new CANNON.Box(
                new CANNON.Vec3(width, height, depth)
            );
            this.addShape(newShape);

            gsap.delayedCall(1, () => {
                this.eventEmitter.changeScene("game");
            });
        });
    }
}
