import * as THREE from "three";
import SPhysics from "../../core/Physics";
import { Floor } from "./models/Floor";
import { Light } from "./tools/Light";
import { Bird } from "./models/Bird";
import { Zone } from "./models/Zone";
import { SWorld } from "../../core/World";

export class Home {
    raf = 0;
    initialized = false;

    async init() {
        this.world = SWorld;
        if (!this.world.canvas) {
            this.world.generateCanvas();
            this.world.initialize();
        }
        this.scene = new THREE.Scene();
        this.world.currentScene = this.scene;

        this.physics = SPhysics;

        await this.addModels();

        this.initialized = true;
    }

    async addModels() {
        this.floor = new Floor(20, 1, 20, { x: 0, y: 0, z: 0 });
        this.light = new Light();
        this.zone = new Zone(2, 1, 2, { x: 7, y: 1, z: 7 });

        this.scene.add(this.light, this.floor, this.zone);
        await this.addGLTFModels();

        this.models = this.scene.children.filter((child) => child);
        this.physics.add(
            ...this.models.map((model) => model.body).filter((v) => !!v)
        );
    }

    async addGLTFModels() {
        this.bird = new Bird();
        await this.bird.init(4, { x: 0, y: 1, z: 0 });
        this.scene.add(this.bird.instance);
    }

    play() {
        if (!this.initialized) return;

        this.world.update(this.bird.instance, "far");
        this.physics.update(...this.models);

        this.raf = window.requestAnimationFrame(() => {
            this.play();
        });
    }

    dispose() {
        if (!this.initialized) return;

        const children = [...this.scene.children];
        children.forEach((obj) => {
            if (obj.isMesh) {
                obj.geometry.dispose();
                obj.material.dispose();
                if (obj.body) this.physics.removeBody(obj.body);
            }
            this.scene.remove(obj);
        });
        window.cancelAnimationFrame(this.raf);
        this.initialized = false;
    }
}
