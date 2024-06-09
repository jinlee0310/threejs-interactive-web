import * as THREE from "three";
import * as CANNON from "cannon-es";
import SPhysics from "../../../../../core/Physics";
import SEventEmitter from "../../../../../lib/EventEmitter";

export class Player extends THREE.Mesh {
    name = "player";
    _body = null;
    isReset = false;

    get body() {
        return this._body;
    }
    set body(body) {
        this._body = body;
    }

    constructor(radius, position) {
        const geometry = new THREE.SphereGeometry(radius, 30, 30);
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        super(geometry, material);

        this.body = new PhysicsPlayer(radius, position);
        this.castShadow = true;
        this.receiveShadow = false;
    }
}

class PhysicsPlayer extends CANNON.Body {
    name = "player";
    constructor(radius, position) {
        const shape = new CANNON.Sphere(radius);
        const material = new CANNON.Material({
            friction: 0.1,
            restitution: 0.5,
        });

        super({ shape, material, mass: 10, position });
        this.physics = SPhysics;
        this.eventEmitter = SEventEmitter;

        this.addKeydownEvent();
    }

    addKeydownEvent() {
        let isArrowUpPressed = false;
        let isArrowDownPressed = false;
        let isArrowLeftPressed = false;
        let isArrowRightPressed = false;
        let isSpacePressed = false;
        let isLanded = false;

        window.addEventListener("keydown", (e) => {
            if (e.code === "ArrowUp") isArrowUpPressed = true;
            if (e.code === "ArrowDown") isArrowDownPressed = true;
            if (e.code === "ArrowLeft") isArrowLeftPressed = true;
            if (e.code === "ArrowRight") isArrowRightPressed = true;
            if (e.code === "Space" && isLanded) isSpacePressed = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ArrowUp") isArrowUpPressed = false;
            if (e.code === "ArrowDown") isArrowDownPressed = false;
            if (e.code === "ArrowLeft") isArrowLeftPressed = false;
            if (e.code === "ArrowRight") isArrowRightPressed = false;
            if (e.code === "Space") isSpacePressed = false;
        });

        this.physics.addEventListener("postStep", () => {
            if (this.isReset) return;
            // step 업데이트 전 실행되는 이벤트
            const x = isArrowLeftPressed ? -1 : isArrowRightPressed ? 1 : 0;
            const y = isSpacePressed && isLanded ? 50 : 0;
            const z = isArrowUpPressed ? -1 : isArrowDownPressed ? 1 : 0;

            if (isSpacePressed) isLanded = false;

            this.applyImpulse(new CANNON.Vec3(x, y, z));
        });

        this.addEventListener("collide", (e) => {
            if (e.body.name === "floor") {
                isLanded = true;
            }

            if (e.body.name === "goal") {
                this.eventEmitter.win();
            }
        });
    }

    reset() {
        this.position.copy(this.initPosition);
        this.isReset = true;
        this.velocity.set(0, 0, 0);
        this.mass = 0;
    }
}
