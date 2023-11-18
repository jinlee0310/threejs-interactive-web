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
    // MeshBasicMaterial: 조명과 상관 없이 화면에 표현됨
    // const material = new Three.MeshBasicMaterial({ color: "0xcc99ff" });
    const material = new Three.MeshStandardMaterial({ color: 0xcc99ff });

    const cube = new Three.Mesh(geometry, material);

    scene.add(cube);

    camera.position.set(3, 4, 5);

    camera.lookAt(cube.position);

    const directionalLight = new Three.DirectionalLight(0xf0f0f0, 1);

    directionalLight.position.set(-1, 2, 3);

    scene.add(directionalLight);

    const ambientLight = new Three.AmbientLight(0xffffff, 0.1);

    ambientLight.position.set(3, 2, 1);

    scene.add(ambientLight);

    const clock = new Three.Clock();

    render();

    function render() {
        // cube.rotation.x = Three.MathUtils.degToRad(45);
        cube.rotation.x += clock.getDelta();
        // cube.position.y = Math.sin(cube.rotation.x);
        // cube.scale.x = Math.cos(cube.rotation.x);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);
    }

    window.addEventListener("resize", handleResize);
}
