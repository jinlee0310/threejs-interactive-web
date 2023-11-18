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

    const cubeGeometry = new Three.IcosahedronGeometry(1);
    const cubeMaterial = new Three.MeshLambertMaterial({
        color: 0x00ffff,
        emissive: 0x111111,
    });
    const cube = new Three.Mesh(cubeGeometry, cubeMaterial);

    const skeletonGeometry = new Three.IcosahedronGeometry(2);
    const skeletonMaterial = new Three.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        color: 0xaaaaaa,
    });
    const skeleton = new Three.Mesh(skeletonGeometry, skeletonMaterial);

    scene.add(cube, skeleton);

    camera.position.z = 5;

    const directionalLight = new Three.DirectionalLight(0xffffff, 1);

    scene.add(directionalLight);

    const clock = new Three.Clock();

    render();

    function render() {
        const elapsedTime = clock.getElapsedTime();

        cube.rotation.x = elapsedTime;
        cube.rotation.y = elapsedTime;

        skeleton.rotation.x = elapsedTime * 1.5;
        skeleton.rotation.y = elapsedTime * 1.5;

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
