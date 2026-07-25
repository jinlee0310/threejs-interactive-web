import { $ } from "../../lib";
import { ADVANCED_MENU, BASIC_MENU, PRACTICE_MENU } from "../../constants";

const SECTIONS = [
    { title: "Basic", items: BASIC_MENU },
    { title: "Advanced", items: ADVANCED_MENU },
    { title: "Practice", items: PRACTICE_MENU },
];

export default function renderNav() {
    const createSection = ({ title, items }) => {
        const $section = $("section");
        $section.className = "nav-section";

        const $h2 = $("h2");
        $h2.innerText = title;
        $section.appendChild($h2);

        const $ul = $("ul");
        items.forEach((menu) => {
            const $li = $("li");
            const $a = $("a");
            $a.setAttribute("href", `/${menu}`);
            $a.innerText = menu;
            $li.appendChild($a);
            $ul.appendChild($li);
        });
        $section.appendChild($ul);

        return $section;
    };

    const render = () => {
        const $nav = $("nav");
        $nav.setAttribute("id", "main-navigator");

        const $header = $("header");
        $header.className = "nav-header";

        const $title = $("h1");
        $title.innerText = "Three.js Playground";

        const $subtitle = $("p");
        $subtitle.innerText = "Interactive WebGL experiments & demos";

        $header.appendChild($title);
        $header.appendChild($subtitle);
        $nav.appendChild($header);

        const $grid = $("div");
        $grid.className = "nav-grid";
        SECTIONS.forEach((section) => {
            $grid.appendChild(createSection(section));
        });
        $nav.appendChild($grid);

        document.body.appendChild($nav);
    };

    render();
}
