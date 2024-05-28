import { $ } from "../../lib/index";

export default class Header {
    static render() {
        const $wrapper = $("div");
        $wrapper.className = "wrapper";

        const $header = $("header");

        const $h1 = $("h1");
        $h1.innerText = "Three.js Interactive Web";

        $header.appendChild($h1);
        $wrapper.appendChild($header);
        document.body.appendChild($wrapper);
    }
}
