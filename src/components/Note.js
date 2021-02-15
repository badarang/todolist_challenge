import Trash from "./Trash.js";
import { cardStorage } from "../utils/customStorage.js";
import { Hash } from "../utils/hash.js";
function displayTextWidth(text, font) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}
export default class Note {
    constructor({ $target, notebox, noteData, id, element, modal }) {
        this.noteData = noteData;
        this.pos = {
            x: this.noteData.pos.x,
            y: this.noteData.pos.y,
        };
        this.speed = {
            x: 0,
            y: 0,
        };

        this.modal = modal;
        this.notebox = notebox;

        this.$target = $target;
        this.$element = this.createNote(element);
        this.$element.querySelector(".note-importance").value = noteData.importance;
        const salt = Hash.getSalt();
        this.id = id || Hash.createHash(noteData.title + noteData.description + noteData.importance + salt);
        this.$element.id = this.id;
        this.$header = this.$element.querySelector(".note-header");
        this.mouseUpEL = this.closeDragElement.bind(this);
        this.mouseMoveEL = this.elementDrag.bind(this);

        this.setDragEvent.bind(this)();
        this.$element.style.top = `${this.pos.y}px`;
        this.$element.style.left = `${this.pos.x}px`;
        this.isOutNoteBox();
        let textTitleWidth = displayTextWidth(this.noteData.title, "italic 14pt verdana");
        this.$element.style.width = `${textTitleWidth}px`;
    }
    chkShake(e) {
        console.log(e);
        const $contentShake = document.querySelector(".modal__content");
        $contentShake.addEventListener("animationend", () => {
            $contentShake.classList.hidden("shake");
        });
    }
    createNote(innerHTML) {
        const $note = document.createElement("div");
        $note.className = "note";
        $note.addEventListener("click", (e) => {
            e.stopPropagation();

            const $sender = document.createElement("div");
            $sender.className = "sender";

            const $input1 = document.createElement("input");
            $input1.className = "modal-title__input";
            const $input2 = document.createElement("input");
            $input2.className = "modal-description__input";
            const $input3 = document.createElement("input");
            $input3.className = "modal-importance__input";
            $input1.type = "text";
            $input2.type = "text";
            $input1.maxLength = "20";
            $input2.maxLength = "42";
            $input3.type = "range";
            $input3.id = "volume";
            $input3.min = "0";
            $input3.max = "3";
            let $pTitle = this.$element.querySelector(".note-title");
            let $pDescription = this.$element.querySelector(".note-description");
            let $pImportance = this.$element.querySelector(".note-importance");
            $input1.value = $pTitle.textContent;
            $input2.value = $pDescription.textContent;
            $input3.value = $pImportance.value;
            $sender.appendChild($input1);
            $sender.appendChild($input2);
            $sender.appendChild($input3);
            this.modal.renderModal({
                title: "Edit Note",
                subject: {
                    data1: $input1,
                    type1: "element",
                },
                description: {
                    data2: $input2,
                    type2: "element",
                },
                importance: {
                    data3: $input3,
                    type3: "element",
                },
                onContinue: () => {
                    if ($input1.value != "" && $input2.value != "") {
                        $pTitle.innerText = $input1.value;
                        $pDescription.innerText = $input2.value;
                        $pImportance.value = $input3.value;
                        const changedNoteData = this.noteData;
                        changedNoteData.importance = $input3.value;
                        cardStorage.replaceNoteData(this.id, {
                            id: this.id,
                            element: this.$element.innerHTML,
                            noteData: changedNoteData,
                        });
                    }
                },
            });
        });
        if (!innerHTML) {
            const $noteHeader = document.createElement("div");
            $noteHeader.className = "note-header";

            let $noteTitle = document.createElement("p");
            $noteTitle.className = "note-title";
            $noteTitle.textContent = this.noteData.title;

            let $noteDescription = document.createElement("p");
            $noteDescription.className = "note-description";
            $noteDescription.textContent = this.noteData.description;

            let $inputContainer = document.createElement("div");
            $inputContainer.className = "input-container";
            let $inputCover = document.createElement("div");
            $inputCover.className = "input-cover";
            let $noteImportance = document.createElement("input");
            $noteImportance.type = "range";
            $noteImportance.min = "0";
            $noteImportance.max = "3";
            $noteImportance.className = "note-importance";
            $noteImportance.value = this.noteData.importance;

            $note.appendChild($noteHeader);
            $note.appendChild($noteTitle);
            $note.appendChild($noteDescription);
            $note.appendChild($inputContainer);
            $inputContainer.appendChild($inputCover);
            $inputContainer.appendChild($noteImportance);
        } else {
            $note.innerHTML = innerHTML;
        }
        this.$target.appendChild($note);

        return $note;
    }

    setDragEvent() {
        this.$header.addEventListener("mousedown", this.dragMouseDown.bind(this));
    }

    dragMouseDown(e) {
        const trash = document.querySelector(".trash-container");
        trash.classList.add("show");
        const trashIcon = document.querySelector(".fas");
        trashIcon.classList.remove("hide");
        trashIcon.classList.add("nohide");
        e.preventDefault();
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.$element.style.zIndex = "100";
        document.addEventListener("mouseup", this.mouseUpEL);
        document.addEventListener("mousemove", this.mouseMoveEL);
    }

    elementDrag(e) {
        e.preventDefault();
        this.speed.x = this.pos.x - e.clientX;
        this.speed.y = this.pos.y - e.clientY;
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;

        this.$element.style.top = this.$element.offsetTop - this.speed.y + "px";
        this.$element.style.left = this.$element.offsetLeft - this.speed.x + "px";
    }

    closeDragElement() {
        const trash = document.querySelector(".trash-container");
        trash.classList.remove("show");
        const trashIcon = document.querySelector(".fas");
        trashIcon.classList.add("hide");
        trashIcon.classList.remove("nohide");
        if (this.pos.y > 720) {
            let deleteConfirm;
            deleteConfirm = confirm("Are you sure delete your card?");
            if (deleteConfirm) {
                cardStorage.removeNoteData();
                location.reload();
            }
        }
        this.setRealPos.bind(this)();
        this.isOutNoteBox.bind(this)();
        this.reAppendChild.bind(this)();
        this.$element.style.zIndex = "0";
        document.removeEventListener("mouseup", this.mouseUpEL);
        document.removeEventListener("mousemove", this.mouseMoveEL);
        const changedNoteData = this.noteData;
        changedNoteData.pos = this.pos;
        cardStorage.replaceNoteData(this.id, {
            id: this.id,
            element: this.$element.innerHTML,
            noteData: changedNoteData,
        });
    }

    reAppendChild() {
        this.$element.remove();
        this.notebox.$notebox.appendChild(this.$element);
    }

    setRealPos() {
        this.pos.y = this.$element.offsetTop - this.speed.y;
        this.pos.x = this.$element.offsetLeft - this.speed.x;
        this.speed.y = 0;
        this.speed.x = 0;
    }

    isOutNoteBox() {
        const noteBox_clientRect = this.notebox.$notebox.getBoundingClientRect();
        const note_clientRect = this.$element.getBoundingClientRect();
        let flag = false;

        if (this.pos.x < noteBox_clientRect.left) {
            this.pos.x = noteBox_clientRect.left;
            flag = true;
        }

        if (this.pos.y < noteBox_clientRect.top) {
            this.pos.y = noteBox_clientRect.top;
            flag = true;
        }

        if (this.pos.x + note_clientRect.width > noteBox_clientRect.left + noteBox_clientRect.width) {
            this.pos.x = noteBox_clientRect.left + noteBox_clientRect.width - note_clientRect.width;
            flag = true;
        }

        if (this.pos.y + note_clientRect.height > noteBox_clientRect.top + noteBox_clientRect.height) {
            this.pos.y = noteBox_clientRect.top + noteBox_clientRect.height - note_clientRect.height;
            flag = true;
        }

        if (flag) {
            this.$element.style.top = this.pos.y + "px";
            this.$element.style.left = this.pos.x + "px";
        }
    }
}
