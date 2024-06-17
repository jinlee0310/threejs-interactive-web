import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import { GuiControl } from "./GuiControl";
import HemisphereLight from "./HemisphereLight";
import PointLight from "./PointLight";
import RectAreaLight from "./RectareaLight";
import SpotLight from "./SpotLight";

export default class Main {
    constructor() {
        this.ambientLight = new AmbientLight();
        this.directionalLight = new DirectionalLight();
        this.hemisphereLight = new HemisphereLight();
        this.pointLight = new PointLight();
        this.rectAreaLight = new RectAreaLight();
        this.spotLight = new SpotLight();

        this.guiControl = new GuiControl();
    }

    init() {
        this.render();
        this.addGui();
    }

    addGui() {
        this.guiControl.addGui(this.ambientLight.gui);
        this.guiControl.addGui(this.directionalLight.gui);
        this.guiControl.addGui(this.hemisphereLight.gui);
        this.guiControl.addGui(this.pointLight.gui);
        this.guiControl.addGui(this.rectAreaLight.gui);
        this.guiControl.addGui(this.spotLight.gui);
    }

    render() {
        this.ambientLight.render();
        this.directionalLight.render();
        this.hemisphereLight.render();
        this.pointLight.render();
        this.rectAreaLight.render();
        this.spotLight.render();
    }
}
