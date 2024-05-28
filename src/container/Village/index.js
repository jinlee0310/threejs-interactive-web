import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import GUI from "lil-gui";

export default function renderVillage() {
    const renderer = new Three.WebGLRenderer({
        antialias: true,
        // alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const gui = new GUI();

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );

    camera.position.z = 100;

    /** 큐브맵 텍스처를 이용한 3차원 공간 표현 1*/
    // const controls = new OrbitControls(camera, renderer.domElement);

    // controls.minDistance = 5;
    // controls.maxDistance = 100;

    // const textureLoader = new Three.TextureLoader().setPath(
    //     "./assets/texture/Yokohama/"
    // );

    // const images = [
    //     "posx.jpg",
    //     "negx.jpg",
    //     "posy.jpg",
    //     "negy.jpg",
    //     "posz.jpg",
    //     "negz.jpg",
    // ];

    // const geometry = new Three.BoxGeometry(5000, 5000, 5000);
    // const materials = images.map(
    //     (image) =>
    //         new Three.MeshBasicMaterial({
    //             map: textureLoader.load(image),
    //             side: Three.BackSide,
    //         })
    // );

    // const skybox = new Three.Mesh(geometry, materials);

    // scene.add(skybox);

    /** 큐브맵 텍스처를 이용한 3차원 공간 표현 2*/
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    const cubeTextureLoader = new Three.CubeTextureLoader().setPath(
        "./assets/texture/Yokohama/"
    );

    const images = [
        "posx.jpg",
        "negx.jpg",
        "posy.jpg",
        "negy.jpg",
        "posz.jpg",
        "negz.jpg",
    ];

    const cubeTexture = cubeTextureLoader.load(images);

    scene.background = cubeTexture;

    const sphereGeometry = new Three.SphereGeometry(30, 50, 50);
    const sphereMaterial = new Three.MeshBasicMaterial({
        envMap: cubeTexture,
    });

    const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

    scene.add(sphere);

    gui.add(sphereMaterial, "reflectivity").min(0).max(1).step(0.01);

    /** 360 파노라마 텍스처를 이용한 3차원 공간 표현 */

    // const textureLoader=new Three.TextureLoader()

    // const texture=textureLoader.load('')

    // texture.mapping=Three.EquirectangularReflectionMapping

    // scene.background=texture

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
