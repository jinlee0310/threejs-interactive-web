import { $ } from "../../../../../lib";
import * as THREE from "three";
import SEventEmitter from "../../../../../lib/EventEmitter";

export class Timer extends THREE.Clock {
    isEnded = false;
    #time = null;

    constructor(startAt) {
        super();
        if (!document.querySelector(".time")) {
            const $timeDiv = $("div");
            $timeDiv.classList.add("time");

            this.$timer = $("h1");
            this.$timer.innerText = "10";

            $timeDiv.appendChild(this.$timer);

            document.body.appendChild($timeDiv);
        } else {
            this.$timer = document.querySelector(".time h1");
        }

        this.startAt = startAt;
        this.eventEmitter = SEventEmitter;
        this.eventEmitter.onWin(() => {
            this.isEnded = true;
            this.$timer.innerText = "";
        });
    }

    update() {
        if (this.isEnded) return;
        this.currentTime = Math.max(
            this.startAt - Math.floor(this.getElapsedTime()),
            0
        );
        this.$timer.innerText = this.currentTime;

        if (this.currentTime === 0) {
            this.isEnded = true;
            this.eventEmitter.lose();
            this.eventEmitter.changeScene("home");
            this.$timer.innerText = "";
        }
    }
}
