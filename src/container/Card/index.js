import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import Card from "./Card";
import Gui from "lil-gui";
import { gsap } from "gsap";

const COLORS = ["#ff6e6e", "#31e0c1", "#006fff", "#ffd732"];

export function renderCard() {
    const gui = new Gui();
    const renderer = new Three.WebGLRenderer({
        antialias: true,
        alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500
    );

    camera.position.z = 25;

    const card = new Card({
        width: 10,
        height: 15.8,
        radius: 0.5,
        color: COLORS[0],
    });

    scene.add(card.mesh);

    gsap.to(card.mesh.rotation, {
        y: -Math.PI * 4,
        duration: 2.5,
        ease: "back.out(2.5)",
    });

    const cardFolder = gui.addFolder("Card");

    cardFolder
        .add(card.mesh.material, "roughness")
        .min(0)
        .max(1)
        .step(0.01)
        .name("material.roughness");

    cardFolder
        .add(card.mesh.material, "metalness")
        .min(0)
        .max(1)
        .step(0.01)
        .name("material.metalness");

    const ambientLight = new Three.AmbientLight(0xffffff, 0.8);

    ambientLight.position.set(-5, -5, -5);

    scene.add(ambientLight);

    const directionalLight1 = new Three.DirectionalLight(0xffffff, 0.6);
    const directionalLight2 = directionalLight1.clone();

    directionalLight1.position.set(1, 1, 3);
    directionalLight2.position.set(-1, 1, -3);

    scene.add(directionalLight1, directionalLight2);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.5;
    controls.rotateSpeed = 0.75;
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;

    card.mesh.rotation.z = -Math.PI * 0.1;

    render();

    function render() {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () =>
        handleResize(renderer, camera, scene, controls)
    );

    renderButtons(card, gsap);
}

function renderButtons(card, gsap) {
    const $container = document.createElement("div");
    $container.className = "container";
    const $ul = document.createElement("ul");
    COLORS.forEach((color) => {
        const $li = document.createElement("li");
        const $button = document.createElement("button");
        $button.style.backgroundColor = color;
        $button.addEventListener("click", () => {
            card.mesh.material.color = new Three.Color(color);
            gsap.to(card.mesh.rotation, {
                y: card.mesh.rotation.y - Math.PI / 2,
                duration: 1,
                ease: "back.out(2.5)",
            });
        });
        $li.appendChild($button);
        $ul.appendChild($li);
    });
    $container.appendChild($ul);

    document.body.appendChild($container);
}
