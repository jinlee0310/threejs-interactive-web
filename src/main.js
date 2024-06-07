import { renderCard } from "./container/Card";
import renderCharacter from "./container/Character";
import { renderCube } from "./container/Cube";
import renderDesk from "./container/Desk";
import renderEarth from "./container/Earth";
import renderEarth2 from "./container/Earth2";
import shaderPractice from "./container/ShaderPractice";
import shaderPractice2 from "./container/ShaderPractice2";
import renderHome from "./container/Home";
import renderMain from "./container/Main";
import { renderText } from "./container/Text";
import renderVillage from "./container/Village";
import renderWave from "./container/Wave";
import renderStarlightEarth from "./container/StarlightEarth";
import renderPhysicsPractice from "./container/PhysicsPractice";

window.addEventListener("load", () => {
    init();
});

const init = () => {
    const { pathname } = window.location;

    switch (pathname) {
        case "/Cube":
            renderCube();
            break;
        case "/Text":
            renderText();
            break;
        case "/Card":
            renderCard();
            break;
        case "/Wave":
            renderWave();
            break;
        case "/Village":
            renderVillage();
            break;
        case "/Character":
            renderCharacter();
            break;
        case "/Earth":
            renderEarth();
            break;
        case "/Earth2":
            renderEarth2();
            break;
        case "/Shader":
            shaderPractice();
            break;
        case "/Shader2":
            shaderPractice2();
            break;
        case "/Physics":
            renderPhysicsPractice();
            break;
        case "/Desk":
            renderDesk();
            break;
        case "/Home":
            renderHome();
            break;
        case "/StarlightEarth":
            renderStarlightEarth();
            break;
        case "/":
        default:
            renderMain();
            break;
    }
};
