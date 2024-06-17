import Main from "./Main";

export default function Lights() {
    const $container = document.createElement("div");
    $container.id = "labs-lights";
    document.body.appendChild($container);

    const main = new Main();
    main.init();
    main.guiControl.close();

    const $checkbox = document.createElement("input");
    $checkbox.setAttribute("type", "checkbox");
    $checkbox.id = "show-gui";
    $checkbox.setAttribute("checked", true);
    $container.appendChild($checkbox);

    $checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            main.guiControl.close();
        } else {
            main.guiControl.open();
        }
    });
}
