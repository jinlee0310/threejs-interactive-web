import EventEmitter3 from "eventemitter3";

class EventEmitter {
    eventEmitter = new EventEmitter3();

    resize() {
        this.eventEmitter.emit("resize");
    }

    onResize(callbackFn) {
        this.eventEmitter.on("resize", callbackFn);
    }

    lose() {
        this.eventEmitter.emit("lose");
    }

    onLose(callbackFn) {
        this.eventEmitter.on("lose", callbackFn);
    }
}

const SEventEmitter = new EventEmitter();
export default SEventEmitter;
