import SEventEmitter from "./EventEmitter";

export class Sizer {
    _width = 0;
    _height = 0;

    constructor() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this.eventEmitter = SEventEmitter;

        window.addEventListener("resize", () => this.resize());
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this.eventEmitter.resize();
    }
}
