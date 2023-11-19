import * as Three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

export async function renderText() {
    const gui = new GUI();

    const renderer = new Three.WebGLRenderer({
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

    camera.position.z = 5;

    /** Controls */
    const controls = new OrbitControls(camera, renderer.domElement);

    /** Font */
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync(
        "../assets/fonts/The Jamsil 3 Regular_Regular.json"
    );
    const textGeometry = new TextGeometry("안녕, 월드.", {
        font,
        size: 0.5,
        height: 0.1,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.02,
        bevelThickness: 0.02,
    });
    const textMaterial = new Three.MeshPhongMaterial();
    const text = new Three.Mesh(textGeometry, textMaterial);
    textGeometry.computeBoundingBox();
    textGeometry.center();

    /** Texture */
    const textureLoader = new Three.TextureLoader();
    const textTexture = textureLoader.load(
        "../assets/texture/holographic.jpeg"
    );
    textMaterial.map = textTexture;
    scene.add(text);

    /** AmbientLight */
    const ambientLight = new Three.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    /** PoinLight */
    const pointLight = new Three.PointLight(0xffffff, 0.5);
    pointLight.position.set(3, 0, 2);

    scene.add(pointLight);

    gui.add(pointLight.position, "x").min(-3).max(3).step(0.1);

    render();

    function render() {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);

        controls.update();
    }

    window.addEventListener("resize", handleResize);
}
