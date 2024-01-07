class MyNotes {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        if(document.querySelector("#my-notes")) {
            document.getElementById("my-notes").addEventListener("click", this.handleNoteClick.bind(this));
            document.querySelector(".submit-note").addEventListener("click", this.handleCreateNote.bind(this));
        }
    }

    async handleCreateNote() {
        const newNoteData = this.getNewNoteData();

        try {
            const responseData = await this.sendNoteRequest('POST', newNoteData);

            if (responseData !== "You have reached your note limit.") {
                this.clearNewNoteFields();
                this.displayNewNote(responseData);
            } else {
                this.showNoteLimitMessage();
            }

        } catch (error) {
            console.log(error);
        }
    }

    handleNoteClick(e) {
        if (e.target.classList.contains("delete-note")) {
            this.handleDeleteNoteClick(e);
        } else if (e.target.classList.contains("edit-note")) {
            this.handleEditNoteClick(e);
        } else if (e.target.classList.contains("update-note")) {
            this.handleUpdateNoteClick(e);
        }
    }

    getNewNoteData() {
        const title = document.querySelector(".new-note-title").value;
        const content = document.querySelector(".new-note-body").value;

        return {
            title,
            content,
            status: 'publish'
        };
    }

    async handleUpdateNoteClick(e) {
        const thisNote = e.target.closest("li");
        const updatedNoteData = this.getUpdatedNoteData(thisNote);

        try {
            const responseData = await this.sendNoteRequest('POST', updatedNoteData, thisNote.dataset.id);
            this.makeNoteReadOnly(thisNote);
            console.log('Note updated');
            console.log(responseData);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }

    getUpdatedNoteData(thisNote) {
        return {
            title: thisNote.querySelector(".note-title-field").value,
            content: thisNote.querySelector(".note-body-field").value
        };
    }

    async handleDeleteNoteClick(e) {
        const thisNote = e.target.closest("li");

        try {
            const responseData = await this.sendNoteRequest('DELETE', {}, thisNote.dataset.id);
            thisNote.remove();
            console.log('Note deleted');
            console.log(responseData);

            this.updateNoteLimitMessage(responseData.userNoteCount);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    async sendNoteRequest(method, data, noteId = '') {
        const rootUrl = universityData.root_url + '/wp-json/wp/v2/note/';
        const nonce = universityData.nonce;
        const url = noteId ? `${rootUrl}${noteId}` : rootUrl;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: method !== 'DELETE' ? JSON.stringify(data) : null
            });

            const results = await response.json();

            if (results.message === "You have reached your note limit.") {
                return results.message;
            }

            return results;
        } catch (error) {
            throw error;
        }
    }

    handleEditNoteClick(e) {
        const thisNote = e.target.closest("li");

        if (thisNote.dataset.state === "editable") {
            this.cancelNoteEdit(thisNote);
        } else {
            this.makeNoteEditable(thisNote);
        }
    }

    makeNoteEditable(thisNote) {
        thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel';
        this.updateNoteFieldsAccessibility(thisNote, { readonly: false, class: "note-active-field" });
        thisNote.querySelector(".update-note").classList.add("update-note--visible");
        thisNote.dataset.state = "editable";
        this.storeOriginalNoteData(thisNote);
    }

    makeNoteReadOnly(thisNote) {
        thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> Edit';
        this.updateNoteFieldsAccessibility(thisNote, { readonly: true, class: "note-active-field" });
        thisNote.querySelector(".update-note").classList.remove("update-note--visible");
        thisNote.dataset.state = "cancel";
    }

    cancelNoteEdit(thisNote) {
        this.restoreOriginalNoteData(thisNote);
        this.makeNoteReadOnly(thisNote);
    }

    updateNoteFieldsAccessibility(thisNote, { readonly, class: className }) {
        thisNote.querySelectorAll(".note-title-field, .note-body-field").forEach(field => {
            field.setAttribute("readonly", readonly);
            field.classList[readonly ? "remove" : "add"](className);
        });
    }

    storeOriginalNoteData(thisNote) {
        thisNote.dataset.origTitle = thisNote.querySelector(".note-title-field").value;
        thisNote.dataset.origBody = thisNote.querySelector(".note-body-field").value;
    }

    restoreOriginalNoteData(thisNote) {
        thisNote.querySelector(".note-title-field").value = thisNote.dataset.origTitle;
        thisNote.querySelector(".note-body-field").value = thisNote.dataset.origBody;
    }

    displayNewNote(responseData) {
        const newNoteHtml = `
            <li data-id="${responseData.id}">
                <input readonly class="note-title-field" value="${responseData.title.raw}">
                <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</span>
                <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</span>
                <textarea readonly class="note-body-field">${responseData.content.raw}</textarea>
                <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
            </li>
        `;

        document.getElementById("my-notes").insertAdjacentHTML('afterbegin', newNoteHtml);
    }

    clearNewNoteFields() {
        document.querySelector(".new-note-title").value = "";
        document.querySelector(".new-note-body").value = "";
    }

    showNoteLimitMessage() {
        document.querySelector(".note-limit-message").classList.add("active");
    }

    updateNoteLimitMessage(userNoteCount) {
        const noteLimitMessage = document.querySelector(".note-limit-message");
        if (userNoteCount < 5) {
            noteLimitMessage.classList.remove("active");
        }
    }
}

export default MyNotes
