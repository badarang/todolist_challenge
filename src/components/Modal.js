export default class Modal {
    constructor({ $target }) {
        this.$target = $target;
        this.$modal = this.createModal();
    }

    createModal() {
        const $modal = document.createElement("div");
        $modal.className = "modal-container hidden";

        const $modalBackground = document.createElement("div");
        $modalBackground.className = "modal__background";
        $modalBackground.addEventListener("click", this.quitModal.bind(this));

        const $modalContent = document.createElement("div");
        $modalContent.className = "modal__content";
        $modalContent.innerHTML =
            ' \
        <header class="modal__title"> \
            <span class="modal-title__fake"></span> \
            <span class="modal-title__title"></span> \
            <span class="modal-title__close">X</span> \
        </header> \
        <main class="modal__subject"></main> \
        <main class="modal__description"></main> \
        <footer class="modal__importance"></footer> \
        <button class="modal__continue">Continue</button> \
    ';

        const $modalCloseButton = $modalContent.querySelector(".modal-title__close");
        $modalCloseButton.addEventListener("click", this.quitModal.bind(this));

        const $modalContinueButton = $modalContent.querySelector(".modal__continue");

        $modal.appendChild($modalBackground);
        $modal.appendChild($modalContent);
        this.$target.appendChild($modal);

        return $modal;
    }
    renderModal(renderData) {
        const { title, subject, description, importance, onContinue } = renderData;
        const { data1, type1 } = subject;
        const { data2, type2 } = description;
        const { data3, type3 } = importance;
        this.$modal.classList.remove("hidden");

        const $modalTitle = this.$modal.querySelector(".modal-title__title");
        $modalTitle.value = title;

        const $modalSubject = this.$modal.querySelector(".modal__subject");
        const $modalDescription = this.$modal.querySelector(".modal__description");
        const $modalImportance = this.$modal.querySelector(".modal__importance");
        if (type1 === "element") {
            $modalSubject.appendChild(data1);
        } else if (type1 === "string") {
            $modalSubject.innerHTML = data1;
        }

        if (type2 === "element") {
            $modalDescription.appendChild(data2);
        } else if (type2 === "string") {
            $modalDescription.innerHTML = data2;
        }

        if (type3 === "element") {
            $modalImportance.appendChild(data3);
        } else if (type3 === "string") {
            $modalImportance.innerHTML = data3;
        }

        const $modalContinueButton = this.$modal.querySelector(".modal__continue");
        $modalContinueButton.onclick = () => {
            this.closeModal();
            onContinue();
        };
    }
    closeModal() {
        console.log("close");
        const $content = this.$modal.querySelector(".modal__content");
        const $value1 = this.$modal.querySelector(".modal__subject");
        const $value2 = this.$modal.querySelector(".modal__description");
        const $value3 = this.$modal.querySelector(".modal__importance");
        let $chkSubject = this.$modal.querySelector(".modal-title__input");
        let $chkDescription = this.$modal.querySelector(".modal-description__input");
        if ($chkSubject.value == "") {
            $content.classList.add("shake");
            $chkSubject.style.border = "2px solid red";
        }
        if ($chkDescription.value == "") {
            $content.classList.add("shake");
            $chkDescription.style.border = "2px solid red";
        }
        if ($chkSubject.value != "" && $chkDescription.value != "") {
            this.$modal.classList.add("hidden");
            $content.classList.remove("shake");
            $value1.innerHTML = "";
            $value2.innerHTML = "";
            $value3.innerHTML = "";
        }
    }
    quitModal() {
        //X표시 눌렀을 때
        this.$modal.classList.add("hidden");
        const $content = this.$modal.querySelector(".modal__content");
        $content.classList.remove("shake");
        const $value1 = this.$modal.querySelector(".modal__subject");
        const $value2 = this.$modal.querySelector(".modal__description");
        const $value3 = this.$modal.querySelector(".modal__importance");
        $value1.innerHTML = "";
        $value2.innerHTML = "";
        $value3.innerHTML = "";
    }
}
