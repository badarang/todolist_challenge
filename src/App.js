import Notebox from "./components/Notebox.js";
import Modal from "./components/Modal.js";
import Trash from "./components/Trash.js";
export default class App {
    constructor({ $target }) {
        this.$target = $target;

        this.modal = new Modal({ $target });

        this.notebox = new Notebox({ $target, modal: this.modal });
        this.trash = new Trash({ $target });
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.notebox.notes.forEach((note) => {
            note.isOutNoteBox.bind(note)();
        });
    }
}
