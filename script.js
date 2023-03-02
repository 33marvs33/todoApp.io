const form = document.querySelector("form");
const userInput = document.querySelector(".todo-input");
const activeTask = document.querySelector(".active");
const completedTask = document.querySelector(".completed");
const clearTask = document.querySelector(".clear");
const remaining = document.querySelector(".remaining");
const allTask = document.querySelector(".all");
const sunIcon = document.querySelector(".sun");

// draggable selector//
const taskContainer = document.querySelector(".todos-container");
// ================
let DATAS = JSON.parse(localStorage.getItem("task")) || [];



window.addEventListener("DOMContentLoaded", () => {
  if (DATAS.length <= 0) {
    document.querySelector('.data').classList.add('slide')
    setTimeout(() => {
      document.querySelector('.data').classList.remove('slide');
    },3000)
    return;
  } else {
    display(DATAS);
  }
});



// event listener form//
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (userInput.value == "") {
    alert("please enter a task");
    return;
  } else {
    const data = {
      id: new Date().getTime(),
      value: userInput.value,
      completed: false,
    };
    DATAS.push(data);
    localStorage.setItem("task", JSON.stringify(DATAS));
    display(DATAS);
    form.reset();
    userInput.focus();
  }
});



// display function//
function display(data) {
  checkItems();
  taskContainer.innerHTML = "";
  data.forEach((val, index) => {
    taskContainer.innerHTML += `
        <li class="todo ${val.id}" id="drag" draggable="true">
        <span class="icon">
        <img class="check hidden" src="icon-check.svg" alt="check">
        </span>
        <input class="input-task" type="text" value="${val.value}" readonly="true">
        <span class="delete">
        <img  src="icon-cross.svg" alt="cross-icon">
        </span>
    </li> `;

    checking(val,index)
  });

  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteTask(e);
    });
  });
  const checkBtn = document.querySelectorAll(".icon");
  checkBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetId = parseInt(e.currentTarget.parentElement.classList[1]);
      // function to check if completed //
      completeTask(targetId, e);
    });
  });

  // draggable event//
  const draggableEl = document.querySelectorAll("#drag");
  draggableEl.forEach((drag) => {
    drag.addEventListener("dragstart", (e) => {
      drag.classList.add("dragging");
    });
    drag.addEventListener("dragend", () => {
      drag.classList.remove("dragging");
    });
  });

  taskContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggable = document.querySelector(".dragging");
    taskContainer.appendChild(draggable);
  });
}


// ==================================================//
// ==================FUNCTIONS================================//
//function to check if completed//
function completeTask(targetId, e) {
  const cheked = e.currentTarget.parentElement.childNodes[1];
  const icon = e.currentTarget.parentElement.childNodes[1].children[0];
  const inputData = e.currentTarget.parentElement.childNodes[3];
  cheked.classList.toggle("checked");
  icon.classList.toggle("hidden");
  if (cheked.classList.contains("checked")) {
    inputData.classList.add("complete");
    DATAS.forEach((key) => {
      if (key.id == targetId) {
        key.completed = true;
      }
    });
    localStorage.setItem("task", JSON.stringify(DATAS));
  } else if(!cheked.classList.contains('checked')) {
    DATAS.forEach((key) => {
      if (key.id == targetId) {
        key.completed = false;
      }
    });
    inputData.classList.remove("complete");
    localStorage.setItem("task", JSON.stringify(DATAS));
  }
  checkItems();
}

// delete function//
function deleteTask(e) {
  const targetTask = e.currentTarget.parentElement.classList[1];
  DATAS = DATAS.filter((key) => key.id !== parseInt(targetTask));
  localStorage.setItem("task", JSON.stringify(DATAS));
  e.currentTarget.parentElement.remove();
  checkItems();
}

// checking if completed and displaying when content loaded//
function checking(val, index) {
  const iconBackground = document.getElementsByClassName("icon")[index];
    const checkIcon = document.getElementsByClassName("check")[index];
    const inputEl = document.getElementsByClassName("input-task")[index];
    if (val.completed == true) {
      checkIcon.classList.remove("hidden");
      iconBackground.classList.add("checked");
      inputEl.classList.add("complete");
    } else {
      iconBackground.classList.remove("checked");
      checkIcon.classList.add("hidden");
      inputEl.classList.remove("complete");
    }
}

// function for the not completed tasks//
activeTask.addEventListener("click", () => {
  const ACTIVE = DATAS.filter((data) => data.completed !== true);
  display(ACTIVE);
});

// function for the completed tasks//
completedTask.addEventListener("click", () => {
  const COMPLETED = DATAS.filter((data) => data.completed === true);
  display(COMPLETED);
});

// function for all Task//

allTask.addEventListener("click", () => {
  display(DATAS);
});

//function to delete all tasks//
clearTask.addEventListener("click", () => {
  DATAS.length = 0;
  localStorage.setItem("task", JSON.stringify(DATAS));
  display(DATAS);
});

//function to update the items//
function checkItems() {
  const newlength = DATAS.filter((key) => key.completed === true);
  remaining.innerText = DATAS.length - newlength.length;
}

// function for the theme toggle//
sunIcon.addEventListener("click", () => {
  const background = document.querySelector(".background");
  const source = background.children[0];
  const sourceImg = background.children[1];
  const bodyel = document.body;
  bodyel.classList.add("light-mode");
  if (bodyel.classList.contains("light-mode")) {
    source.setAttribute("srcset", "bg-desktop-light.jpg");
    sourceImg.setAttribute("src", "bg-mobile-light.jpg");
    const moonIcon = document.querySelector(".moon");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    moonIcon.addEventListener("click", () => {
      bodyel.classList.remove("light-mode");
      moonIcon.classList.add("hidden");
      sunIcon.classList.remove("hidden");
      source.setAttribute("srcset", "bg-desktop-dark.jpg");
      sourceImg.setAttribute("src", "bg-mobile-dark.jpg");
    });
  }
});
