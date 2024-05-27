import * as Three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
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

    text.castShadow = true;

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
    plane.position.z = -3;
    plane.receiveShadow = true;

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
    spotLight.target.position.set(0, 0, -3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 10;

    scene.add(spotLight, spotLight.target);

    window.addEventListener("mousemove", (e) => {
        // three.js에서 인식하는 좌표계로 변환
        const x = (e.clientX / window.innerWidth - 0.5) * 5;
        const y = (e.clientY / window.innerHeight - 0.5) * 5 * -1;
        spotLight.target.position.set(x, y, -3);
    });

    const spotLightTexture = textureLoader.load(
        "../assets/texture/gradient.jpg"
    );
    spotLight.map = spotLightTexture;

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

    spotLightFolder
        .add(spotLight.shadow, "radius")
        .min(1)
        .max(20)
        .step(0.01)
        .name("shadow.radius");

    /** Effects */
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);

    composer.addPass(renderPass);

    const unrealBloomPass = new UnrealBloomPass(
        new Three.Vector2(window.innerWidth, window.innerHeight)
    );

    render();

    function render() {
        composer.render(scene, camera);

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        composer.setSize(window.innerWidth, window.innerHeight);

        composer.render(scene, camera);
    }

    window.addEventListener("resize", handleResize);
}
