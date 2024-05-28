import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";

export default function renderCharacter() {
    const renderer = new Three.WebGLRenderer({
        antialias: true,
        // alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );

    camera.position.z = 100;

    const controls = new OrbitControls(camera, renderer.domElement);

    render();

    function render() {
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () =>
        handleResize(renderer, camera, scene, controls)
    );
}
