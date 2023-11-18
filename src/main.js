import * as Three from "three";

window.addEventListener("load", () => {
    init();
});

function init() {
    const renderer = new Three.WebGLRenderer({
        // alpha: true,
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

    renderer.render(scene, camera);
}
