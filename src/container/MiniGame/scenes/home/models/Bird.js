import * as THREE from "three";
import * as CANNON from "cannon-es";
import SPhysics from "../../../../../core/Physics";
import { SLoader } from "../../../../../lib/Loader";
import SEventEmitter from "../../../../../lib/EventEmitter";

export class Bird {
    name = "bird";
    _body = null;
    _instance = null;
    isReset = false;

    get body() {
        return this._body;
    }
    set body(body) {
        this._body = body;
    }

    get instance() {
        return this._instance;
    }

    set instance(instance) {
        this._instance = instance;
    }

    constructor() {
        this.loader = SLoader;
        // this.body = new PhysicsBird(radius, position);
        // this.castShadow = true;
        // this.receiveShadow = false;
    }

    async init(scale, position) {
        this.instance = await this.load();
        this.instance.scale.set(scale, scale, scale);
        this.instance.position.set(position.x, position.y, position.z);
        this.instance.castShadow = true;
        this.instance.receiveShadow = false;
        this.instance.traverse((child) =>
            child.isMesh ? (child.castShadow = true) : null
        );
        this.instance.body = new PhysicsBird(this.instance);
    }

    load() {
        return new Promise((resolve) => {
            this.loader.gltfLoader.load(
                "./assets/models/bird/scene.gltf",
                (gltf) => {
                    resolve(gltf.scene);
                }
            );
        });
    }
}

class PhysicsBird extends CANNON.Body {
    name = "bird";
    constructor(bird) {
        const shape = new CANNON.Sphere(0.4);
        const material = new CANNON.Material({
            friction: 0.1,
            restitution: 0.5,
        });

        super({
            shape,
            material,
            mass: 10,
            position: new CANNON.Vec3(
                bird.position.x,
                bird.position.y,
                bird.position.z
            ),
        });
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

        window.addEventListener("keydown", (e) => {
            if (e.code === "ArrowUp") isArrowUpPressed = true;
            if (e.code === "ArrowDown") isArrowDownPressed = true;
            if (e.code === "ArrowLeft") isArrowLeftPressed = true;
            if (e.code === "ArrowRight") isArrowRightPressed = true;
            if (e.code === "Space") isSpacePressed = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ArrowUp") isArrowUpPressed = false;
            if (e.code === "ArrowDown") isArrowDownPressed = false;
            if (e.code === "ArrowLeft") isArrowLeftPressed = false;
            if (e.code === "ArrowRight") isArrowRightPressed = false;
            if (e.code === "Space") isSpacePressed = false;
        });

        let ry = 0;
        const forceAmount = 10;
        let canJump = false;
        const contactNormal = new CANNON.Vec3(0, 0, 0);
        const upAxis = new CANNON.Vec3(0, 1, 0);

        this.addEventListener("collide", (e) => {
            const { contact } = e;
            canJump = false;

            if (contact.bi.id === this.id) {
                contact.ni.negate(contactNormal);
            }

            const dot = contactNormal.dot(upAxis);
            if (dot > 0.5) {
                canJump = true;
            }

            if (e.body.name === "zone" && dot > 0.5) {
                this.eventEmitter.enter();
            }
        });

        this.physics.addEventListener("postStep", () => {
            // step 업데이트 전 실행되는 이벤트
            if (this.isReset) return;

            const speed = 5;

            const x = isArrowLeftPressed ? -1 : isArrowRightPressed ? 1 : 0;
            const y = 10;
            const z = isArrowUpPressed ? -1 : isArrowDownPressed ? 1 : 0;

            if (isSpacePressed && canJump) {
                this.velocity.y = y;
                canJump = false;
            }
            if (x === 0 && z === 0) {
                this.velocity.x = 0;
                this.velocity.z = 0;
            } else {
                ry = Math.atan2(x, z);

                this.velocity.x = x * speed;
                this.velocity.z = z * speed;

                const force = new CANNON.Vec3(
                    forceAmount * Math.sin(ry),
                    forceAmount * Math.sin(ry),
                    forceAmount * Math.cos(ry)
                );
                this.applyForce(force, this.position);
            }

            this.quaternion.setFromEuler(0, ry, 0);
        });
    }

    reset() {
        this.position.copy(this.initPosition);
        this.isReset = true;
        this.velocity.set(0, 0, 0);
        this.mass = 0;
    }
}
