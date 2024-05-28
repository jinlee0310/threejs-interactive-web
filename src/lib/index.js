export const initThree = () => {};

export const handleResize = (renderer, camera, scene, controls) => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

    controls.update();
};

export const $ = (el) => document.createElement(el);
