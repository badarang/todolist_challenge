import Note from "./Note.js";
import { cardStorage } from "../utils/customStorage.js";
function getMousePosition(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    return { x, y };
}

export default class Notebox {
    constructor({ $target, modal }) {
        this.$target = $target;
        this.modal = modal;

        this.$notebox = this.createNotebox();
        this.notes = [];
        const noteDataAll = cardStorage.getNoteDataAll();
        for (let idx in noteDataAll) {
            const { noteData, id, element } = noteDataAll[idx];
            this.createNote(noteData, id, element);
        }
    }

    createNotebox() {
        const $notebox = document.createElement("div");
        $notebox.className = "notebox shadow";
        $notebox.addEventListener("click", (e) => {
            const input1 = document.createElement("input");
            const input2 = document.createElement("input");
            const input3 = document.createElement("input");
            const { x, y } = getMousePosition(e);
            input1.type = "text";
            input1.placeholder = "title";
            input1.className = "modal-title__input";
            input2.type = "text";
            input2.placeholder = "description";
            input2.className = "modal-description__input";
            input1.maxLength = "20";
            input2.maxLength = "42";
            input3.type = "range";
            input3.id = "volume";
            input3.min = "0";
            input3.max = "3";
            input3.value = "1";
            input3.title = "importance";
            input3.className = "modal-importance__input";
            this.modal.renderModal({
                title: "Add Note",
                subject: {
                    data1: input1,
                    type1: "element",
                },
                description: {
                    data2: input2,
                    type2: "element",
                },
                importance: {
                    data3: input3,
                    type3: "element",
                },
                onContinue: () => {
                    if (input1.value != "" && input2.value != "") {
                        this.createNote({
                            title: input1.value,
                            description: input2.value,
                            importance: input3.value,
                            pos: { x, y },
                        });
                    }
                },
            });
        });

        this.$target.appendChild($notebox);

        return $notebox;
    }

    createNote(noteData, id = null, element = null) {
        const newNote = new Note({
            $target: this.$target,
            notebox: this,
            noteData,
            id,
            element,
            modal: this.modal,
        });
        if (!id) {
            const saveData = { noteData: newNote.noteData, id: newNote.id, element: newNote.$element.innerHTML };
            cardStorage.setNoteData(saveData);
        }
        this.notes.push(newNote);
    }
}
