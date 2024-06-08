import * as THREE from "three";
import { Game } from "./scenes/game/Game";

export default function renderMiniGame() {
    const game = new Game();

    const initialize = () => {
        game.play();
    };

    initialize();
}
