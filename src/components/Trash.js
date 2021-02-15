export default class Trash {
    constructor({ $target }) {
        this.$target = $target;
        this.$trash = this.createTrash();
    }
    createTrash() {
        const $trash = document.createElement("div");
        $trash.className = "trash-container";
        const $trashContent = document.createElement("div");

        $trash.innerHTML = '<i class="fas fa-trash-alt hide"></i>';
        $trashContent.className = "trash__content";
        $trash.appendChild($trashContent);
        this.$target.appendChild($trash);
        return $trash;
    }
}
