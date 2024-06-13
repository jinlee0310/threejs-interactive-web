import * as THREE from "three";
import renderHTML from "./renderHTML";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import gsap from "gsap";

export default async function renderGallery() {
    renderHTML();

    const $gallery = document.querySelector("#gallery");
    const $canvas = document.createElement("canvas");

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: $canvas,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    $gallery.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 50);
    camera.fov = Math.atan2(window.innerHeight / 2, 50) * (180 / Math.PI) * 2; // 카메라 position에 따른 화각 계산

    const textureLoader = new THREE.TextureLoader();

    const clock = new THREE.Clock();

    const scene = new THREE.Scene();

    const raycaster = new THREE.Raycaster();

    const imageRepository = [];

    const loadImages = async () => {
        const images = [
            ...document.querySelectorAll("#gallery main .content img"),
        ];
        const fetchImages = images.map(
            (image) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        image.onload = resolve(image);
                        image.onerror = reject;
                    }, 100);
                })
        );
        const loadedImages = await Promise.all(fetchImages);
        return loadedImages;
    };

    const createImages = (images) => {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: null },
                uTime: { value: 0 },
                uHover: { value: 0 },
                uHoverX: { value: 0.5 },
                uHoverY: { value: 0.5 },
            },
            vertexShader,
            fragmentShader,
        });

        const imageMeshes = images.map((image) => {
            const { width, height } = image.getBoundingClientRect();
            const clonedMaterial = material.clone();
            clonedMaterial.uniforms.uTexture.value = textureLoader.load(
                image.src
            );
            const geometry = new THREE.PlaneGeometry(width, height, 16, 16);

            const mesh = new THREE.Mesh(geometry, clonedMaterial);

            imageRepository.push({ image, mesh });

            return mesh;
        });
        return imageMeshes;
    };

    const create = async () => {
        const loadedImages = await loadImages();
        const images = createImages([...loadedImages]);
        scene.add(...images);
    };

    const draw = () => {
        renderer.render(scene, camera);
        retransform();

        imageRepository.forEach(({ image, mesh }) => {
            mesh.material.uniforms.uTime.value = clock.getElapsedTime();
        });

        requestAnimationFrame(draw);
    };

    const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.fov =
            Math.atan2(window.innerHeight / 2, 50) * (180 / Math.PI) * 2;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const retransform = () => {
        imageRepository.forEach(({ image, mesh }) => {
            const { width, height, top, left } = image.getBoundingClientRect();
            const { width: originWidth } = mesh.geometry.parameters;
            const scale = width / originWidth;
            mesh.scale.x = scale;
            mesh.scale.y = scale;

            mesh.position.y = window.innerHeight / 2 - height / 2 - top;
            mesh.position.x = -window.innerWidth / 2 + width / 2 + left;
        });
    };

    const addEvent = () => {
        window.addEventListener("mousemove", (e) => {
            const pointer = {
                x: (e.clientX / window.innerWidth) * 2 - 1, // -1 ~ 1
                y: -(e.clientY / window.innerHeight) * 2 + 1, // -1 ~ 1
            };
            raycaster.setFromCamera(pointer, camera);

            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                let mesh = intersects[0].object;
                mesh.material.uniforms.uHoverX.value = intersects[0].uv.x - 0.5;
                mesh.material.uniforms.uHoverY.value = intersects[0].uv.y - 0.5;
            }
        });

        window.addEventListener("resize", resize);

        imageRepository.forEach(({ image, mesh }) => {
            image.addEventListener("mouseenter", () => {
                gsap.to(mesh.material.uniforms.uHover, {
                    duration: 0.5,
                    value: 1,
                });
            });
            image.addEventListener("mouseout", () => {
                gsap.to(mesh.material.uniforms.uHover, {
                    duration: 0.5,
                    value: 0,
                });
            });
        });
    };

    const initialize = async () => {
        await create();
        draw();
        resize();
        addEvent();
    };

    await initialize();
}
