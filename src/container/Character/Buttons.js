import { $ } from "../../lib";

export default class Buttons {
    static render(buttonList) {
        const $ul = $("ul");
        $ul.className = "actions";

        buttonList.forEach((button) => {
            const $button = $("button");
            const $li = $("li");

            $button.innerText = button.name;

            $li.appendChild($button);
            $ul.appendChild($li);
        });

        document.body.appendChild($ul);
    }
}
