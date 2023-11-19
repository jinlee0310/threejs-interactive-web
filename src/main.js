import { renderCube } from "./container/Cube";
import { renderText } from "./container/Text";

window.addEventListener("load", () => {
    init();
});

const init = () => {
    const { pathname } = window.location;

    switch (pathname) {
        case "/cube":
            renderCube();
            break;
        case "/text":
            renderText();
            break;
        case "/":
        default:
            renderNav();
            break;
    }
};

const renderNav = () => {
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    const menuList = ["cube", "text"];

    menuList.forEach((menu) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", `/${menu}`);
        a.innerText = menu;
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
    document.body.appendChild(nav);
};
