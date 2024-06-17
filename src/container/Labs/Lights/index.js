import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import HemisphereLight from "./HemisphereLight";
import PointLight from "./PointLight";
import RectAreaLight from "./RectareaLight";
import SpotLight from "./SpotLight";

export default function Lights() {
    const $container = document.createElement("div");
    $container.id = "labs-lights";
    document.body.appendChild($container);

    const ambientLight = new AmbientLight();
    const directionalLight = new DirectionalLight();
    const hemisphereLight = new HemisphereLight();
    const pointLight = new PointLight();
    const rectAreaLight = new RectAreaLight();
    const spotLight = new SpotLight();

    ambientLight.init();
    directionalLight.init();
    hemisphereLight.init();
    pointLight.init();
    rectAreaLight.init();
    spotLight.init();
}
