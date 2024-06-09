import * as THREE from "three";
import { Game } from "./scenes/game/Game";
import { Home } from "./scenes/home/Home";
import SEventEmitter from "../../lib/EventEmitter";

export default async function renderMiniGame() {
    const game = new Game();
    const home = new Home();
    const eventEmitter = SEventEmitter;

    eventEmitter.onChangeScene(async (scene) => {
        switch (scene) {
            case "game":
                home.dispose();
                game.init();
                game.play();
                break;
            case "home":
            default:
                game.dispose();
                await home.init();
                home.play();
                break;
        }
    });

    const initialize = () => {
        eventEmitter.changeScene("home");
    };

    initialize();
}
