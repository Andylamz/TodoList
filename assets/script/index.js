const form = document.querySelector(".form");
const lists = document.querySelector(".lists");
const todo_input = document.querySelector("#todo-input");

// Local storage
class Storage {
  static addToStorage(todoArr) {
    let storage = localStorage.setItem("todo", JSON.stringify(todoArr));
    return storage;
  }

  static getStorage() {
    let storage =
      localStorage.getItem("todo") === null
        ? []
        : JSON.parse(localStorage.getItem("todo"));
    return storage;
  }
}

// load array from local storage
let todoArr = Storage.getStorage();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (todo_input.value.trim() === "") {
    return alert("Input field cannot be empty");
  }
  const id = Math.random() * 99999999;
  const todo = new Todo(id, todo_input.value);

  // Adding todo (data)
  todoArr = [todo, ...todoArr];

  // UIs
  UI.clearInput();
  UI.editTodo();
  renderUI();
  //
  // Add to local storage
  Storage.addToStorage(todoArr);
  //   editFunction();
});

// make OOP instance
class Todo {
  constructor(id, todo) {
    this.id = id;
    this.todo = todo;
  }
}

// display todo
class UI {
  // Display Data when this is called(submit)
  static displayData() {
    let displayData = todoArr.map((item) => {
      return `
                <div class="todo">
                    <p>${item.todo}</p>
                    <span>
                        <i class="edit fa-solid fa-pen" data-id=${item.id}></i>
                        <i class="remove fa-solid fa-trash" data-id=${item.id}></i>
                    </span>
                </div>
                `;
    });
    lists.innerHTML = displayData.join(" ");
  }

  // Clear input field when its called
  static clearInput() {
    todo_input.value = "";
  }

  // Delete todo card (UI)
  static removeTodo() {
    lists.addEventListener("click", function handler(e) {
      if (e.target.classList.contains("remove")) {
        e.target.parentElement.parentElement.remove();
        let btnId = e.target.dataset.id;
        UI.removeArrayTodo(btnId);
      }
    });
  }
  static editTodo() {
    if (!this.editListenerAdded) {
      document.querySelector(".lists").addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
          const id = +e.target.dataset.id;
          const newContent = prompt("Enter new content for your todo");
          UI.editArrayTodo(id, newContent);
        }
      });
      this.editListenerAdded = true;
    }
  }
  // Remove todo from data
  static removeArrayTodo(id) {
    todoArr = todoArr.filter((item) => item.id !== +id);
    Storage.addToStorage(todoArr);
  }
  static editArrayTodo(id, content) {
    const target = todoArr.find((item) => item.id === id);
    if (target) {
      target.todo = content;
      Storage.addToStorage(todoArr);
      UI.displayData();
    }
  }
}
// first render
function renderUI() {
  UI.displayData();
  UI.removeTodo();
  UI.editTodo();
}
renderUI();
