import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { $ } from "../../lib/index";
import Header from "./Header";
// import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

export default async function renderWave() {
    const $canvas = $("canvas");
    $canvas.id = "canvas";
    document.body.appendChild($canvas);

    Header.render();
    // const gui = new GUI();

    gsap.registerPlugin(ScrollTrigger);

    const params = {
        waveColor: "#00ffff",
        backgroundColor: "#ffffff",
        fogColor: "#f0f0f0",
    };

    const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: $canvas,
    });

    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Three.Scene();

    scene.fog = new Three.Fog(0xf0f0f0, 0.1, 500);
    // scene.fog = new Three.FogExp2(0xf0f0f0, 0.005);

    // gui.add(scene.fog, "near").min(0).max(100).step(0.1);

    // gui.add(scene.fog, "far").min(100).max(500).step(0.1);

    const camera = new Three.PerspectiveCamera(
        75, // 시야각
        window.innerWidth / window.innerHeight, // 종횡비
        1, // near
        500 // far
    );

    camera.position.set(0, 25, 150);

    const waveGeometry = new Three.PlaneGeometry(1500, 1500, 150, 150);
    const waveMaterial = new Three.MeshStandardMaterial({
        // wireframe: true,
        color: params.waveColor,
    });

    const WAVEHEIGHT = 2.8;
    const initialZPositions = [];
    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
        const z =
            waveGeometry.attributes.position.getZ(i) +
            (Math.random() - 0.5) * WAVEHEIGHT;
        waveGeometry.attributes.position.setZ(i, z);
        initialZPositions.push(z);
    }

    const wave = new Three.Mesh(waveGeometry, waveMaterial);

    wave.rotation.x = -Math.PI / 2;

    wave.receiveShadow = true;

    wave.update = function () {
        //주사율에 상관 없이 동일한 시간 사용
        const elapsedTime = clock.getElapsedTime();
        for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
            const z =
                initialZPositions[i] +
                Math.sin(elapsedTime * 3 + i ** 2) * WAVEHEIGHT;

            waveGeometry.attributes.position.setZ(i, z);
        }
        waveGeometry.attributes.position.needsUpdate = true;
    };

    scene.add(wave);

    const gltfLoader = new GLTFLoader();

    const gltf = await gltfLoader.loadAsync("./assets/models/ship/scene.gltf");

    const ship = gltf.scene;

    ship.castShadow = true;

    ship.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
        }
    });

    ship.update = function () {
        const elapsedTime = clock.getElapsedTime();

        ship.position.y = Math.sin(elapsedTime * 3);
        ship.position.x = Math.cos(elapsedTime * 2.5);
    };

    ship.rotation.y = Math.PI;

    ship.scale.set(40, 40, 40);

    scene.add(ship);

    const pointLight = new Three.PointLight(0xffffff, 1000);

    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.radius = 10;

    pointLight.position.set(15, 30, 15);

    scene.add(pointLight);

    const directionalLight = new Three.DirectionalLight(0xffffff, 0.8);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 10;

    directionalLight.position.set(-15, 15, 15);

    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const clock = new Three.Clock();

    render();

    function render() {
        wave.update();

        ship.update();

        camera.lookAt(ship.position);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () =>
        handleResize(renderer, camera, scene, controls)
    );

    // gsap.to(waveMaterial, {
    // color: "#4268ff", // hex code를 직접 넣을 수 없음
    // });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".wrapper",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        },
    });

    tl.to(params, {
        waveColor: "#4268ff",
        onUpdate: () => {
            waveMaterial.color = new Three.Color(params.waveColor);
        },
        duration: 1.5,
    })
        .to(
            params,
            {
                backgroundColor: "#2a2a2a",
                onUpdate: () => {
                    scene.background = new Three.Color(params.backgroundColor);
                },
                duration: 1.5,
            },
            "<"
        )
        .to(
            params,
            {
                fogColor: "#2f2f2f",
                onUpdate: () => {
                    scene.fog.color = new Three.Color(params.fogColor);
                },
                duration: 1.5,
            },
            "<"
        )
        .to(camera.position, {
            x: 100,
            z: -50,
            duration: 2.5,
        })
        .to(ship.position, {
            z: 150,
            duration: 2,
        })
        .to(camera.position, {
            x: -50,
            y: 25,
            z: 100,
            duration: 2,
        })
        .to(camera.position, {
            x: 0,
            y: 50,
            z: 300,
            duration: 2,
        });

    gsap.to("h1", {
        opacity: 0,
        scrollTrigger: {
            trigger: ".wrapper",
            scrub: true,
            pin: true,
            end: "+=1000",
        },
    });
}
