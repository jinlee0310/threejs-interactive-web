import * as THREE from "three";
import SWorld from "../../../../core/World";
import SPhysics from "../../../../core/Physics";
import { Floor } from "./models/Floor";
import { Light } from "./tools/Light";
import { Player } from "./models/Player";
import { Barricade } from "./models/Barricade";
import { Roller } from "./models/Roller";
import { Goal } from "./models/Goal";
import { Timer } from "./models/Timer";
import SEventEmitter from "../../../../lib/EventEmitter";

export class Game {
    constructor() {
        this.world = SWorld;
        this.scene = new THREE.Scene();
        this.world.currentScene = this.scene;

        this.physics = SPhysics;
        this.eventEmitter = SEventEmitter;

        this.timer = new Timer(10);

        this.addModels();
        this.eventEmitter.onLose(() => this.reset());
    }

    addModels() {
        this.player = new Player(0.3, { x: 0, y: 5, z: 0 });
        this.floor1 = new Floor(5, 1, 20, { x: 0, y: 0, z: 0 });
        this.floor2 = new Floor(5, 1, 15, { x: 0, y: 0, z: -20 });
        this.floor3 = new Floor(5, 1, 7, { x: 0, y: 0, z: -35 });
        this.light = new Light();
        this.barricade1 = new Barricade(1.5, 1.5, 0.5, {
            x: -1.5,
            y: 1.4,
            z: -3,
        });
        this.barricade2 = new Barricade(1.5, 1.5, 0.5, {
            x: 2,
            y: 1.4,
            z: -8,
        });
        this.roller = new Roller(0.3, 0.3, 4, { x: 0, y: 1, z: -17 });
        this.goal = new Goal(1, { x: 0, y: 1, z: -35 });

        this.scene.add(
            this.light,
            this.player,
            this.floor1,
            this.floor2,
            this.floor3,
            this.light.target,
            // new THREE.CameraHelper(this.light.shadow.camera)
            this.barricade1,
            this.barricade2,
            this.roller,
            this.goal
        );
        this.models = this.scene.children.filter((child) => child.isMesh);
        this.physics.add(
            ...this.models.map((model) => model.body).filter((v) => !!v)
        );
    }

    play() {
        this.world.update(this.player);
        this.light.update(this.world.camera);
        this.physics.update(...this.models);
        this.timer.update();

        window.requestAnimationFrame(() => {
            this.play();
        });
    }

    reset() {
        this.timer.stop();
        this.models.forEach((model) => model.body.reset?.());
    }
}
