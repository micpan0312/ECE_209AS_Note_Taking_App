export default class NotesView {
    constructor(root, { onVoiceAdd, onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onLeetAdd } = {}) {
        this.root = root;
        this.onVoiceAdd = onVoiceAdd;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.onLeetAdd = onLeetAdd;
        this.root.innerHTML = `
            <form action= "#">
                <select class="difficulty" name="Difficulty" id="long">
                    <option value="0">Easy</option>
                    <option value="1">Medium</option>
                    <option value="2">Hard</option>
                </select>
            </form>
            <div class="notes__sidebar">
                <div class="notes__list"></div>
                <button class="notes__add" type="button">Add Note</button>
                <button class="voice__add" type="button">Voice Input</button>
            </div>
            <button class="leet_add" type="button">Note Done!</button>  

            <button type="button" class="leet" title="Leetcode problems tailored for you!"  
            data-container="body" data-toggle="popover" data-placement="left" 
            data-content= "None detected." data-html="true" data-trigger="focus">
                Get Leetcode
            </button>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");
        var btnInputVoice = this.root.querySelector(".voice__add");
        const btninputLeet = this.root.querySelector(".leet_add");
        const btninputLeet1 = this.root.querySelector(".leet");
        const btnDifficulty = this.root.querySelector(".difficulty");
       
        btninputLeet1.addEventListener("click", () => {
            // btninputLeet1.dataset.content = 'hihi';
        });

        btninputLeet.addEventListener("click", () => {
            this.onLeetAdd(btnDifficulty.options[btnDifficulty.value].text);
        });

        btnInputVoice.addEventListener("click", () => {
            this.onVoiceAdd(btnInputVoice, inpTitle.value, inpBody.value);
        });

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
                <div>
                    <button class="delete_btn" type="button" id="delete">Delete</button>
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
            noteListItem.querySelector("#delete").addEventListener("click", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    console.log(noteListItem.dataset.noteId);
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            })
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }

    setLeetRecc(data) {
        const btninputLeet1 = this.root.querySelector(".leet");
        var promiseB = data.then(function(result) {
            // do something with result
            var parsedJSON = JSON.parse(result);
            var str = '';
            for (var i=0;i<parsedJSON.length;i++) {
                str += "ITEM_ID: "+ (parsedJSON[i]['ITEM_ID']) + "<br/>";
                str += "TITLE: "+ (parsedJSON[i]['TITLE']) + "<br/>";
                str += "GENRE: "+ (parsedJSON[i]['GENRE']) + "<br/>";
                str += "ACCEPTANCE: "+ (parsedJSON[i]['ACCEPTANCE']) + "<br/>";
                str += "LINK: <a href=\"" + (parsedJSON[i]['LINK']) + "\" target=\"_blank\">Link to Leetcode</a><br/>";
                str += "DIFFICULTY: "+ (parsedJSON[i]['DIFFICULTY']) + "<br/>============================<br/>";
            }

            btninputLeet1.dataset.content = str;
            return result;
         });
    }
}
