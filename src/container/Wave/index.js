import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function renderWave() {
    const renderer = new Three.WebGLRenderer({
        // alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75, // 시야각
        window.innerWidth / window.innerHeight, // 종횡비
        1, // near
        500 // far
    );

    const controls = new OrbitControls(camera, renderer.domElement);

    render();

    function render() {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () =>
        handleResize(renderer, camera, scene, controls)
    );
}
