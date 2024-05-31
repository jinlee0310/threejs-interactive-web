import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { convertLatLngToPos } from "../../lib";
import { getGradientCanvas } from "../../lib";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import GUI from "lil-gui";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default function renderEarth2() {
    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const gui = new GUI();
    gui.hide();

    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });

    // anti aliasing
    const renderTarget = new THREE.WebGLRenderTarget(
        canvasSize.width,
        canvasSize.height,
        {
            samples: 2,
        }
    );

    const effectComposer = new EffectComposer(renderer, renderTarget);

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
        "./assets/texture/sky/"
    );
    const environmentMap = cubeTextureLoader.load([
        "px.png",
        "nx.png",
        "py.png",
        "ny.png",
        "pz.png",
        "nz.png",
    ]);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = environmentMap;

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const addLigth = () => {
        const light = new THREE.DirectionalLight(0xffffff, 3); // 방향이 있는 light
        light.position.set(2.65, 2.13, 1.02);

        scene.add(light);
    };

    const addPostEffects = (obj) => {
        const { earthGroup } = obj;
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass); // render 정보 등록

        const filmPass = new FilmPass(1, 0.3); // 자글자글한 효과
        effectComposer.addPass(filmPass);

        const unrealBloomPass = new UnrealBloomPass(
            new THREE.Vector2(canvasSize.width, canvasSize.height)
        );
        unrealBloomPass.strength = 0.4;
        unrealBloomPass.threshold = 0.2;
        unrealBloomPass.radius = 0.7;
        effectComposer.addPass(unrealBloomPass);

        const shaderPass = new ShaderPass(GammaCorrectionShader); // 렌더러를 중간에 탈취해서 포스트 프로세싱 과정을 거쳤기 때문에 outputColorSpace가 잘 동작하지 않아서 추가해줌
        effectComposer.addPass(shaderPass);

        const customShaderPass = new ShaderPass({
            uniforms: {
                uBrightness: { value: 0.3 },
                uPosition: { value: new THREE.Vector2(0, 0) },
                uColor: { value: new THREE.Vector3(0, 0, 0.15) },
                uAlpha: { value: 0.5 },
                tDiffuse: { value: null },
            },
            vertexShader,
            fragmentShader,
        });
        effectComposer.addPass(customShaderPass);

        const smaaPass = new SMAAPass(); // SMAA anti aliasing
        effectComposer.addPass(smaaPass);

        // gui.add(customShaderPass.uniforms.uColor.value, "x", -1, 1, 0.01);
        // gui.add(customShaderPass.uniforms.uColor.value, "y", -1, 1, 0.01);
        // gui.add(customShaderPass.uniforms.uColor.value, "z", -1, 1, 0.01);
    };

    const createStar = (count = 500) => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i] = (Math.random() - 0.5) * 5;
            positions[i + 1] = (Math.random() - 0.5) * 5;
            positions[i + 2] = (Math.random() - 0.5) * 5;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.01,
            transparent: true,
            depthWrite: false,
            map: textureLoader.load("./assets/images/particle.png"),
            alphaMap: textureLoader.load("./assets/images/particle.png"),
        });

        const star = new THREE.Points(particleGeometry, particleMaterial);

        return star;
    };

    const createPoints = () => {
        const points = [
            {
                lat: 37.56668,
                lng: 126.97841,
            },
            {
                lat: 5.55363,
                lng: -0.196481,
            },
        ];

        return points
            .map(({ lat, lng }) => ({
                lat: lat * (Math.PI / 180),
                lng: lng * (Math.PI / 180),
            }))
            .map((point) => convertLatLngToPos(point, 1.3))
            .map(({ x, y, z }) => {
                const mesh = new THREE.Mesh(
                    new THREE.TorusGeometry(0.02, 0.002, 20, 20),
                    new THREE.MeshBasicMaterial({
                        color: 0x263d64,
                        transparent: true,
                    })
                );
                mesh.position.set(x, y, z);
                return mesh;
            });
    };

    const createCurve = (positions) => {
        const points = [];
        for (let i = 0; i < 100; i++) {
            const pos = new THREE.Vector3().lerpVectors(
                positions[0],
                positions[1],
                i / 100
            );
            pos.normalize();
            const wave = Math.sin((Math.PI * i) / 100);
            pos.multiplyScalar(1.3 + 0.4 * wave);

            points.push(pos);
        }
        const curvePath = new THREE.CatmullRomCurve3(points); // 3d spline curve
        const curveGeometry = new THREE.TubeGeometry(curvePath, 20, 0.003);

        const gradientCanvas = getGradientCanvas("#757f94", "#263d74");
        const texture = new THREE.CanvasTexture(gradientCanvas);

        const curveMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const curve = new THREE.Mesh(curveGeometry, curveMaterial);

        return curve;
    };

    const createEarth = () => {
        const earthMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load("./assets/texture/earth-night-map.jpg"),
            side: THREE.FrontSide,
            opacity: 0.9,
            transparent: true,
        });
        const earthGeometry = new THREE.SphereGeometry(1.3, 100, 100);
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);

        earth.rotation.y = -Math.PI / 2;

        return earth;
    };

    const createCover = () => {
        const coverMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load("./assets/texture/earth-night-map.jpg"),
            opacity: 0.9,
            transparent: true,
            side: THREE.BackSide,
        });
        const coverGeometry = new THREE.SphereGeometry(1.5, 100, 100);
        const cover = new THREE.Mesh(coverGeometry, coverMaterial);

        cover.rotation.y = -Math.PI / 2;

        return cover;
    };

    const create = () => {
        const earthGroup = new THREE.Group();

        const earth = createEarth();
        const cover = createCover();
        const star = createStar();
        const points = createPoints();
        const curve = createCurve(points.map((point) => point.position));

        scene.add(earthGroup, star);

        earthGroup.add(earth, cover, ...points, curve);

        return { earthGroup, curve, star, points };
    };

    const resize = () => {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasSize.width, canvasSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        effectComposer.setSize(canvasSize.width, canvasSize.height);
    };

    const addEvent = () => {
        window.addEventListener("resize", resize);
    };

    const draw = (obj) => {
        const { earthGroup, star, curve, points } = obj;

        earthGroup.rotation.x += 0.0005;
        earthGroup.rotation.y += 0.0005;

        star.rotation.x += 0.0003;
        star.rotation.y += 0.0001;

        // renderer.render(scene, camera); // effectComposer 위임
        effectComposer.render();

        const timeElapsed = clock.getElapsedTime();

        let drawRangeCount = curve.geometry.drawRange.count;
        const progress = timeElapsed / 2.5;
        const speed = 3;

        drawRangeCount = progress * speed * 960;

        curve.geometry.setDrawRange(0, drawRangeCount);

        if (timeElapsed > 4) {
            points.forEach(
                (point) => (point.material.opacity = 5 - timeElapsed)
            );
            curve.material.opacity = 5 - timeElapsed;
        }

        requestAnimationFrame(() => {
            draw(obj);
        });
    };

    const initialize = () => {
        const obj = create();

        addLigth();
        addPostEffects(obj);
        addEvent();
        resize();
        draw(obj);
    };

    initialize();
}
