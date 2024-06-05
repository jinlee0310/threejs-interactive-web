import { $ } from "../../lib";
import { ADVANCED_MENU, BASIC_MENU, PRACTICE_MENU } from "../../constants";

export default function renderNav() {
    const createMenuTitle = (title, $parent) => {
        const $h2 = $("h2");
        $h2.innerText = title;

        $parent.appendChild($h2);
    };

    const createList = (list, $parent) => {
        list.forEach((menu) => {
            const $li = $("li");
            const $a = $("a");

            $a.setAttribute("href", `/${menu}`);
            $a.innerText = menu;

            $li.appendChild($a);
            $parent.appendChild($li);
        });
    };

    const render = () => {
        const $nav = $("nav");

        const $basicMenuWrapper = $("ul");
        const $advancedMenuWrapper = $("ul");
        const $practiceMenuWrapper = $("ul");

        $basicMenuWrapper.id = "basic";
        $advancedMenuWrapper.id = "advanced";
        $practiceMenuWrapper.id = "practice";

        createMenuTitle("Basic", $basicMenuWrapper);
        createMenuTitle("Advanved", $advancedMenuWrapper);
        createMenuTitle("Practice", $practiceMenuWrapper);

        createList(BASIC_MENU, $basicMenuWrapper);
        createList(ADVANCED_MENU, $advancedMenuWrapper);
        createList(PRACTICE_MENU, $practiceMenuWrapper);

        $nav.appendChild($basicMenuWrapper);
        $nav.appendChild($advancedMenuWrapper);
        $nav.appendChild($practiceMenuWrapper);
        document.body.appendChild($nav);
    };

    render();
}
