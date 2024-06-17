export class GuiControl {
    constructor() {
        this._guis = [];
    }

    addGui(gui) {
        this._guis.push(gui);
    }

    close() {
        this._guis.forEach((gui) => gui.close());
    }

    open() {
        this._guis.forEach((gui) => gui.open());
    }
}
