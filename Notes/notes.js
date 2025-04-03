// Load notes from localStorage or initialize with sample data
let notes = JSON.parse(localStorage.getItem("notes")) || [
    { id: 1, title: "Meeting Notes", content: "Discussed project timelines and deliverables.", folder: "Work", tags: ["Urgent"] },
    { id: 2, title: "Grocery List", content: "Milk, Bread, Eggs, Butter", folder: "Personal", tags: [] },
    { id: 3, title: "Study Plan", content: "Complete Chapter 5 by Friday.", folder: "Study", tags: ["Important"] },
];

let selectedFolder = "All"; // Default selected folder
let selectedTag = null; // Track the selected tag for filtering
let selectedNoteId = null; // Track the selected note for adding tags

// Function to save notes to localStorage
function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to render notes
function renderNotes(notesToRender = notes) {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";

    // Filter notes based on the selected folder and tag
    let filteredNotes = notesToRender;

    if (selectedFolder !== "All") {
        filteredNotes = filteredNotes.filter(note => note.folder === selectedFolder);
    }

    if (selectedTag) {
        filteredNotes = filteredNotes.filter(note => note.tags.includes(selectedTag));
    }

    filteredNotes.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="tags">
                ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <div class="note-actions">
                <button class="btn btn-sm btn-outline-primary add-tag-btn" data-note-id="${note.id}">
                    <i class="fas fa-tag"></i> Add Tag
                </button>
                <button class="btn btn-sm btn-outline-danger delete-note-btn" data-note-id="${note.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        notesList.appendChild(noteCard);
    });

    // Add event listeners to "Add Tag" buttons
    document.querySelectorAll(".add-tag-btn").forEach(button => {
        button.addEventListener("click", () => {
            selectedNoteId = button.getAttribute("data-note-id");
            const modal = new bootstrap.Modal(document.getElementById("addTagModal"));
            modal.show();
        });
    });

    // Add event listeners to "Delete Note" buttons
    document.querySelectorAll(".delete-note-btn").forEach(button => {
        button.addEventListener("click", () => {
            const noteId = button.getAttribute("data-note-id");
            deleteNote(noteId);
        });
    });
}

// Function to delete a note
function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId); // Remove the note from the array
    saveNotesToLocalStorage(); // Save updated notes to localStorage
    renderNotes(); // Re-render the notes list
}

// Save Note from Modal
document.getElementById("saveNoteBtn").addEventListener("click", () => {
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    const folder = document.getElementById("noteCategory").value;

    if (!title || !content || !folder) {
        alert("Please fill in all fields.");
        return;
    }

    const newNote = {
        id: notes.length + 1,
        title,
        content,
        folder,
        tags: []
    };
    notes.push(newNote);
    saveNotesToLocalStorage(); // Save updated notes to localStorage
    renderNotes();

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addNoteModal"));
    modal.hide();

    // Clear the form
    document.getElementById("noteForm").reset();
});

// Save Tag from Modal
document.getElementById("saveTagBtn").addEventListener("click", () => {
    const tagName = document.getElementById("tagName").value;

    if (!tagName) {
        alert("Please select a tag.");
        return;
    }

    // Find the selected note and add the tag
    const note = notes.find(note => note.id == selectedNoteId);
    if (note && !note.tags.includes(tagName)) {
        note.tags.push(tagName);
        saveNotesToLocalStorage(); // Save updated notes to localStorage
        renderNotes();
    }

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addTagModal"));
    modal.hide();

    // Clear the form
    document.getElementById("tagForm").reset();
});

// Handle Folder Clicks
document.querySelectorAll("#folder-list li").forEach(folder => {
    folder.addEventListener("click", () => {
        selectedFolder = folder.textContent.trim(); // Get the folder name
        selectedTag = null; // Reset selected tag when folder is clicked
        renderNotes(); // Re-render notes based on the selected folder
    });
});

// Handle Tag Clicks
document.querySelectorAll("#tag-list li").forEach(tag => {
    tag.addEventListener("click", () => {
        selectedTag = tag.textContent.trim(); // Get the tag name
        selectedFolder = "All"; // Reset selected folder when tag is clicked
        renderNotes(); // Re-render notes based on the selected tag
    });
});

// Search Notes
document.getElementById("search-notes").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
});

// Initial Render
renderNotes();