import * as THREE from "three";
import { handleResize } from "../../lib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

export default function renderPhysicsPractice() {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.setClearColor(0x333333);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(5, 7, 5);

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const world = new CANNON.World(); // 물리 세계 구축
    world.broadphase = new CANNON.SAPBroadphase(world); // 충돌 감지 알고리즘
    world.gravity.set(0, -9.82, 0);
    world.allowSleep = true; // 움직이지 않는 물체는 계산을 건너뜀(성능 최적화)

    const worldObjects = [];
    const floorMaterial = new CANNON.Material("floor");
    const sphereMaterial = new CANNON.Material("sphere");
    const contactMaterial = new CANNON.ContactMaterial( // 두가지 material을 인자로 받아 두 물체간 마찰, 탄성 계산
        floorMaterial,
        sphereMaterial,
        {
            friction: 0.1,
            restitution: 0.5,
        }
    );
    world.addContactMaterial(contactMaterial);

    const createLight = () => {
        const light = new THREE.DirectionalLight(0xffffff);
        light.castShadow = true;
        light.position.set(0, 10, 0);

        scene.add(light);
    };

    const createFloor = () => {
        const geometry = new THREE.BoxGeometry(6, 1, 6);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;

        scene.add(mesh);

        const shape = new CANNON.Box(new CANNON.Vec3(6 / 2, 1 / 2, 6 / 2)); // 중심으로부터의 좌표
        // const floorMaterial = new CANNON.Material({
        //     friction: 0.1,
        //     restitution: 0.5,
        // }); // 마찰력, 탄성 설정 가능
        const body = new CANNON.Body({
            shape,
            material: floorMaterial,
            mass: 0,
        });

        worldObjects.push({ mesh, body });
        world.addBody(body);
    };

    const createMesh = () => {
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const geometry = new THREE.PlaneGeometry(1, 1);
        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    };

    const createSphere = () => {
        const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
        const geometry = new THREE.SphereGeometry(0.3, 30, 30);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 5;
        mesh.castShadow = true;
        mesh.receiveShadow = false;

        scene.add(mesh);

        const shape = new CANNON.Sphere(0.3);
        const body = new CANNON.Body({
            shape,
            material: sphereMaterial,
            mass: 1,
        });
        body.position.y = 5;
        body.name = "sphere";

        world.addBody(body);
        worldObjects.push({ mesh, body });
    };

    const draw = () => {
        renderer.render(scene, camera);

        controls.update();

        world.step(1 / 60); // fps에 따라 월드의 모든 물체 상태 업데이트

        worldObjects.forEach((worldObject) => {
            if (worldObject.body.name === "sphere") {
                worldObject.body.applyImpulse(
                    new CANNON.Vec3(0, 0, 0.1),
                    worldObject.body.position
                );
            }

            worldObject.mesh.position.copy(worldObject.body.position);
            worldObject.mesh.quaternion.copy(worldObject.body.quaternion); // 축에 따라 회전을 계산할 때 발생하는 오차를 줄여줌
        });

        requestAnimationFrame(draw);
    };

    const resize = () => {
        handleResize(renderer, camera);
    };

    const addEvent = () => {
        window.addEventListener("resize", () => handleResize(renderer, camera));
    };

    const initialize = () => {
        createMesh();
        createLight();
        createFloor();
        createSphere();
        draw();
        resize();
        addEvent();
    };

    initialize();
}
