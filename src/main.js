import * as Three from "three";

window.addEventListener("load", () => {
    init();
});

function init() {
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

    const geometry = new Three.BoxGeometry(2, 2, 2);
    const material = new Three.MeshBasicMaterial({ color: "0xcc99ff" });

    const cube = new Three.Mesh(geometry, material);

    scene.add(cube);

    camera.position.set(3, 4, 5);

    camera.lookAt(cube.position);

    renderer.render(scene, camera);
}
