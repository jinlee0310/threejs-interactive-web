import { $ } from "../../lib";

export default class Header {
    constructor() {
        this.$header = $("header");
        this.$h1 = $("h1");
    }

    render() {
        this.$h1.innerText = "Three.JS Interactive Web";

        this.$header.id = "card-header";

        this.$header.appendChild(this.$h1);

        document.body.appendChild(this.$header);
    }
}
