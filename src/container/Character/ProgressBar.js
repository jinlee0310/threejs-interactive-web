import { $ } from "../../lib/index.js";

export default class ProgressBar {
    static render() {
        const $progressBar = $("progress");
        $progressBar.id = "progress-bar";
        $progressBar.setAttribute("min", 0);
        $progressBar.setAttribute("max", 100);
        $progressBar.setAttribute("value", 0);

        const $label = $("label");
        $label.setAttribute("for", "progress-bar");
        $label.innerText = "Loading...";

        const $prograssBarContainer = $("div");
        $prograssBarContainer.setAttribute("id", "progress-bar-container");

        $prograssBarContainer.appendChild($label);
        $prograssBarContainer.appendChild($progressBar);

        document.body.appendChild($prograssBarContainer);
    }
}
