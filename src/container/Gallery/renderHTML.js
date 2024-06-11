import { GALLERY_NAVLIST } from "../../constants";

export default function renderHTML() {
    const createHeader = () => {
        const $header = document.createElement("header");
        const $nav = document.createElement("nav");
        const $ul = document.createElement("ul");

        GALLERY_NAVLIST.forEach((item) => {
            const $li = document.createElement("li");
            const $a = document.createElement("a");

            $a.innerText = item.name;
            $a.setAttribute("href", item.link);

            $li.appendChild($a);

            $ul.appendChild($li);
        });

        $nav.appendChild($ul);
        $header.appendChild($nav);

        return $header;
    };

    const createSection1 = () => {
        const $titleSection = document.createElement("section");
        $titleSection.classList.add("hero");

        const $h1 = document.createElement("h1");
        $h1.innerText = "Fancy Gallery";

        const $p = document.createElement("p");
        $p.innerText = "We create the interactive website";

        $titleSection.appendChild($h1);
        $titleSection.appendChild($p);

        return $titleSection;
    };

    const createSection2 = () => {
        const $contentSection = document.createElement("section");
        $contentSection.classList.add("content");

        const $imageWrapper = document.createElement("div");
        $imageWrapper.classList.add("img-wrapper");

        const $img = document.createElement("img");
        $img.setAttribute("src", "./assets/images/gallery1.jpeg");

        $imageWrapper.appendChild($img);

        $contentSection.appendChild($imageWrapper);

        const $description = document.createElement("div");
        $description.classList.add("description");

        const $category = document.createElement("p");
        $category.classList.add("category");
        $category.innerText = "Text Design";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Beautiful Text Design";

        const $mainText = document.createElement("p");
        $mainText.classList.add("main-text");
        $mainText.innerText =
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, inventore.";
        const $subText = document.createElement("p");
        $subText.classList.add("sub-text");
        $subText.innerText =
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam velit non dolorum unde iste rerum ducimus fuga incidunt sequi tempore.";
        $description.appendChild($category);
        $description.appendChild($h2);
        $description.appendChild($mainText);
        $description.appendChild($subText);

        $contentSection.appendChild($description);

        return $contentSection;
    };

    const createSection3 = () => {
        const $contentSection = document.createElement("section");
        $contentSection.classList.add("content");

        const $description = document.createElement("div");
        $description.classList.add("description");

        const $category = document.createElement("p");
        $category.classList.add("category");
        $category.innerText = "Beautiful camera photo";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Camera Photo";

        const $mainText = document.createElement("p");
        $mainText.classList.add("main-text");
        $mainText.innerText =
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, inventore.";
        const $subText = document.createElement("p");
        $subText.classList.add("sub-text");
        $subText.innerText =
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam velit non dolorum unde iste rerum ducimus fuga incidunt sequi tempore.";
        $description.appendChild($category);
        $description.appendChild($h2);
        $description.appendChild($mainText);
        $description.appendChild($subText);

        const $imageWrapper = document.createElement("div");
        $imageWrapper.classList.add("img-wrapper");

        const $img = document.createElement("img");
        $img.setAttribute("src", "./assets/images/gallery2.jpeg");

        $imageWrapper.appendChild($img);

        $contentSection.appendChild($description);

        $contentSection.appendChild($imageWrapper);

        return $contentSection;
    };

    const createSection4 = () => {
        const $contentSection = document.createElement("section");
        $contentSection.classList.add("content");

        const $description = document.createElement("div");
        $description.classList.add("description");

        const $category = document.createElement("p");
        $category.classList.add("category");
        $category.innerText = "Beautiful camera photo";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Hope";

        const $mainText = document.createElement("p");
        $mainText.classList.add("main-text");
        $mainText.innerText =
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, inventore.";
        const $subText = document.createElement("p");
        $subText.classList.add("sub-text");
        $subText.innerText =
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam velit non dolorum unde iste rerum ducimus fuga incidunt sequi tempore.";

        $description.appendChild($category);
        $description.appendChild($h2);
        $description.appendChild($mainText);
        $description.appendChild($subText);

        const $imageWrapper = document.createElement("div");
        $imageWrapper.classList.add("img-wrapper");

        const $img = document.createElement("img");
        $img.setAttribute("src", "./assets/images/gallery3.jpeg");

        $imageWrapper.appendChild($img);

        $contentSection.appendChild($imageWrapper);

        $contentSection.appendChild($description);

        return $contentSection;
    };

    const createMain = () => {
        const $main = document.createElement("main");

        const $section1 = createSection1();

        $main.appendChild($section1);

        const $section2 = createSection2();

        $main.appendChild($section2);

        const $section3 = createSection3();

        $main.appendChild($section3);

        const $section4 = createSection4();

        $main.appendChild($section4);

        return $main;
    };

    const createFooter = () => {
        const $footer = document.createElement("footer");
        $footer.innerText =
            "Fancy Gallery is creative and interactive Gallery. Copyright belongs to me.";
        return $footer;
    };

    const create = () => {
        const $div = document.createElement("div");
        $div.setAttribute("id", "gallery");
        const $header = createHeader();
        $div.appendChild($header);

        const $main = createMain();
        $div.appendChild($main);

        const $footer = createFooter();
        $div.appendChild($footer);

        document.body.appendChild($div);
    };

    create();
}
