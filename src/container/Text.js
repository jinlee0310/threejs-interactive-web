import * as Three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

export async function renderText() {
    const gui = new GUI();

    const renderer = new Three.WebGLRenderer({
        antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75, // 시야각
        window.innerWidth / window.innerHeight, // 종횡비
        1, // near
        500 // far
    );

    camera.position.set(0, 1, 5);

    /** Controls */
    const controls = new OrbitControls(camera, renderer.domElement);

    /** Font */
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync(
        "../assets/fonts/The Jamsil 3 Regular_Regular.json"
    );
    const textGeometry = new TextGeometry("Three.js Interactive Web", {
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

    /** Plane */
    const planeGeometry = new Three.PlaneGeometry(2000, 2000);
    const planeMeterial = new Three.MeshPhongMaterial({ color: "white" });

    const plane = new Three.Mesh(planeGeometry, planeMeterial);
    plane.position.z = -10;

    scene.add(plane);

    /** AmbientLight */
    const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    /** SpotLight */
    const spotLight = new Three.SpotLight(
        0xffffff,
        2.5,
        30,
        Math.PI * 0.15,
        0.2,
        0.5
    );
    spotLight.position.set(0, 0, 3);
    spotLight.target.position.set(0, 0 - 3);
    scene.add(spotLight, spotLight.target);

    const spotLightHelper = new Three.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const spotLightFolder = gui.addFolder("SpotLight");
    spotLightFolder
        .add(spotLight, "angle")
        .min(0)
        .max(Math.PI / 2)
        .step(0.01);

    spotLightFolder
        .add(spotLight.position, "z")
        .min(1)
        .max(10)
        .step(0.01)
        .name("position.z");

    spotLightFolder.add(spotLight, "distance").min(1).max(30).step(0.01);

    spotLightFolder.add(spotLight, "decay").min(0).max(10).step(0.1);

    spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);

    render();

    function render() {
        renderer.render(scene, camera);

        spotLightHelper.update();

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);

        spotLightHelper.update();
    }

    window.addEventListener("resize", handleResize);
}
