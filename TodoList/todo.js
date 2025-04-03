let taskToDoInput = document.getElementById("taskToDoInput");
let resultToShow = document.getElementById("resultToShow");

// Retrieve stored tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to save tasks to localStorage
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to create and append task
function createAndAppend(data, isCompleted = false) {
    let container = document.createElement("div");
    container.classList.add("todo-item");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted; // Maintain checked state
    checkbox.id = `checking-${data}`; 

    let listToAdd = document.createElement("label");
    listToAdd.classList.add("labelEl");
    listToAdd.setAttribute("for", checkbox.id);
    listToAdd.textContent = data;

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteIcon.style.cursor = "pointer";

    // Append elements
    container.appendChild(checkbox);
    container.appendChild(listToAdd);
    container.appendChild(deleteIcon);
    resultToShow.appendChild(container);

    // Apply strikethrough if completed
    if (isCompleted) {
        listToAdd.style.textDecoration = "line-through";
        listToAdd.style.color = "gray";
    }

    // Checkbox functionality to mark as completed & update localStorage
    checkbox.addEventListener("change", function () {
        let taskIndex = tasks.findIndex(task => task.text === data);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = checkbox.checked;
            saveToLocalStorage(); // Update localStorage
        }
        listToAdd.style.textDecoration = checkbox.checked ? "line-through" : "none";
        listToAdd.style.color = checkbox.checked ? "gray" : "black";
    });

    // Delete functionality & remove from localStorage
    deleteIcon.addEventListener("click", function () {
        container.remove();
        tasks = tasks.filter(task => task.text !== data);
        saveToLocalStorage(); // Update localStorage
    });
}

// Load stored tasks on page refresh
tasks.forEach(task => createAndAppend(task.text, task.completed));

// Add new task
taskToDoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let todoItem = taskToDoInput.value.trim();
        if (todoItem !== "") {
            tasks.push({ text: todoItem, completed: false }); // Add to array
            saveToLocalStorage(); // Save to localStorage
            createAndAppend(todoItem); // Display task
            taskToDoInput.value = ""; // Clear input
        }
    }
});