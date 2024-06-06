import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ProgressBar from "./ProgressBar";
import Buttons from "./Buttons";

export default async function renderCharacter() {
    ProgressBar.render();

    const renderer = new Three.WebGLRenderer({
        antialias: true,
        // alpha: true,
    });

    renderer.outputColorSpace = Three.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );

    camera.position.set(0, 5, 20);

    const loadingManager = new Three.LoadingManager();

    const gltfLoader = new GLTFLoader(loadingManager);

    const $progressBar = document.querySelector("#progress-bar");

    loadingManager.onProgress = (_, loaded, total) => {
        $progressBar.value = (loaded / total) * 100;
    };

    const $progressBarContainer = document.querySelector(
        "#progress-bar-container"
    );

    loadingManager.onLoad = () => {
        $progressBarContainer.style.display = "none";
    };

    const gltf = await gltfLoader.loadAsync(
        "./assets/models/character/character.gltf"
    );

    const model = gltf.scene;

    model.scale.set(0.1, 0.1, 0.1);

    model.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
        }
    });

    scene.add(model);

    camera.lookAt(model.position);

    const planeGeometry = new Three.PlaneGeometry(10000, 10000, 10000);
    const planeMaterial = new Three.MeshPhongMaterial({
        color: 0x000000,
    });

    const plane = new Three.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -7.5;
    plane.receiveShadow = true;

    scene.add(plane);

    const hemisphereLight = new Three.HemisphereLight(0xffffff, 0x333333);

    hemisphereLight.position.set(0, 20, 10);

    scene.add(hemisphereLight);

    const spotLight = new Three.SpotLight(
        0xffffff,
        30,
        30,
        Math.PI * 0.15,
        0.5,
        0.5
    );

    spotLight.position.set(0, 20, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 8;

    scene.add(spotLight);

    const mixer = new Three.AnimationMixer(model);

    const combatAnimation = gltf.animations.filter(
        (animation) =>
            animation.name === "Idle" ||
            animation.name === "Punch" ||
            animation.name === "Kick" ||
            animation.name === "Roll"
    );
    const dancingAnimations = gltf.animations.filter(
        (animation) =>
            animation.name === "Dancing" ||
            animation.name === "Freeze" ||
            animation.name === "Salsa"
    );

    Buttons.render(combatAnimation);

    let currentAction;

    document.querySelectorAll("button").forEach(($button, idx) => {
        $button.addEventListener("click", () => {
            const previousAction = currentAction;

            currentAction = mixer.clipAction(combatAnimation[idx]);

            if (previousAction !== currentAction) {
                previousAction.fadeOut(0.5);
                currentAction.reset().fadeIn(0.5).play();
            }
        });
    });

    const hasAnimation = gltf.animations.length !== 0;

    if (hasAnimation) {
        currentAction = mixer.clipAction(gltf.animations[4]);

        currentAction.play();
    }

    const raycaster = new Three.Raycaster();
    const pointer = new Three.Vector2();

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.minDistance = 15;
    controls.maxDistance = 25;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;

    const clock = new Three.Clock();

    render();

    function render() {
        renderer.render(scene, camera);

        controls.update();

        const delta = clock.getDelta();
        mixer.update(delta);

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () => handleResize(renderer, camera));

    function handlePointerDown(e) {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
        // pointer: 광선을 설정하기 위한 클릭한 지점의 좌표
        // camera: 카메라의 좌표
        raycaster.setFromCamera(pointer, camera);

        // pointer부터 나온 광선에 맞닿은 모든 객체를 반환
        const intersects = raycaster.intersectObjects(scene.children);

        const object = intersects[0]?.object;

        if (object?.name === "Ch03") {
            const previousAction = currentAction;

            const idx = Math.round(
                Math.random() * (dancingAnimations.length - 1)
            );

            currentAction = mixer.clipAction(dancingAnimations[idx]);

            currentAction.loop = Three.LoopOnce;
            currentAction.clampWhenFinished = true;

            if (previousAction !== currentAction) {
                previousAction.fadeOut(0.5);
                currentAction.reset().fadeIn(0.5).play();
            }

            mixer.addEventListener("finished", handleFinished);

            function handleFinished() {
                const previousAction = currentAction;
                currentAction = mixer.clipAction(
                    combatAnimation.find(
                        (animation) => animation.name === "Idle"
                    )
                );

                previousAction.fadeOut(0.5);
                currentAction.reset().fadeIn(0.5).play();
            }
        }
    }

    window.addEventListener("pointerdown", handlePointerDown);
}
