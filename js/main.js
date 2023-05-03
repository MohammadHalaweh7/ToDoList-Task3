const LOCAL_STORAGE_KEY = "tasksList";
const ADD_TASK_TEXT = "Add Task";
const UPDATE_TASK_TEXT = "Update Task";

const taskNameField = document.getElementById("taskName");
const assigneeField = document.getElementById("assignee");
const addButton = document.getElementById("addTaskButton");
const tasksList = document.getElementById("tasksData");
const warningAlert = document.getElementById("nameAlert");

let activeTaskId;
let isNonConfirmedListDisplayed = true;

function initialLoad() {
  addEventHandlers();
  refreshList();
}

initialLoad();

const showSuccessPopup = () => {
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Success",
    showConfirmButton: false,
    timer: 1500,
  });
};

function getTasksList() {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return JSON.parse(value) || [];
  } catch {
    return [];
  }
}

function setTasks(tasks) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, "");
  }
}

function addTask() {
  const task = {
    id: `${Math.random() * 2133}`,
    isDone: false,
    name: taskNameField.value,
    assignee: assigneeField.value,
  };

  const tasks = getTasksList();
  const newTasks = [...tasks, task];
  setTasks(newTasks);
  showSuccessPopup();
}

function refreshList(tasks = getTasksList()) {
  const tasksHTML = tasks
    .filter(({ isDone }) => (isNonConfirmedListDisplayed ? !isDone : isDone))
    .map(buildHTMLTask);
  tasksList.innerHTML = tasksHTML.join("");
  updateCounters();
}

function resetFields() {
  taskNameField.value = "";
  taskNameField.classList.remove("is-valid");
  taskNameField.classList.remove("is-invalid");
  assigneeField.value = "";
  addButton.disabled = true;
  addButton.innerHTML = ADD_TASK_TEXT;
}

function deleteTask(id) {
  // sweet alert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(({ isConfirmed }) => {
    if (!isConfirmed) return;

    const tasks = getTasksList().filter((task) => task.id !== id);
    setTasks(tasks);
    refreshList();
    if (activeTaskId === id) resetFields();

    Swal.fire("Deleted!", "Your task has been deleted.", "success");
  });
}

function search(e) {
  const searchText = e.value;

  const allTasks = getTasksList();
  const tasksToDisplay = allTasks.filter(({ name }) =>
    name.toLowerCase().includes(searchText.toLowerCase())
  );
  debounceUpdate(tasksToDisplay);
}

const debounceUpdate = debounce((tasksToDisplay) => {
  refreshList(tasksToDisplay);
});

function debounce(callback, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function previewTask(id) {
  const tasks = getTasksList();
  const task = tasks.find((task) => task.id === id);
  taskNameField.value = task.name;
  assigneeField.value = task.assignee;
  addButton.innerHTML = UPDATE_TASK_TEXT;
  activeTaskId = id;
  assigneeField.onkeyup = function () {
    addButton.removeAttribute("disabled");
  };
}

function updateTask() {
  const tasks = getTasksList();
  const newTasks = tasks.map((task) => {
    if (task.id === activeTaskId)
      return {
        ...task,
        name: taskNameField.value,
        assignee: assigneeField.value,
      };
    return task;
  });
  setTasks(newTasks);
  showSuccessPopup();
}

function toggleTaskCompletion(id) {
  const tasks = getTasksList();
  const task = tasks.find((task) => task.id === id);
  Swal.fire({
    title: `Do you want to confirm that task is ${
      task.isDone ? "undone" : "done"
    }?`,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isDenied) {
      return Swal.fire("Changes are not saved", "", "info");
    }
    if (!result.isConfirmed) return;

    const tasks = getTasksList();
    const newTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, isDone: !task.isDone };
      return task;
    });
    setTasks(newTasks);
    refreshList();
    Swal.fire("Task Is Toggled!", "", "success");
  });
}

function updateCounters(tasks = getTasksList()) {
  const completedTasksCount = tasks.reduce((acc, item) => {
    acc += item.isDone ? 1 : 0;
    return acc;
  }, 0);

  const todoCountLabel = document.getElementById("countTask");
  const doneCountLabel = document.getElementById("countDone");
  doneCountLabel.innerHTML = completedTasksCount;
  todoCountLabel.innerHTML = tasks.length - completedTasksCount;
}

function isNameValid() {
  const name = taskNameField.value;
  const namePattern = /^[A-Z].{2,}$/;
  return namePattern.test(name);
}

function buildHTMLTask(task) {
  return `
  <div class="taskDiv d-flex justify-content-between">

  <div class="taskAndAssignee">
  <p class="taskNamePara pb-2">${task.name}</p>
  <p class="assigneePara">${task.assignee}</p>
  </div>

  <div class="icons">
  <a onclick="deleteTask('${task.id}')" class="deleteIcon d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
  <a onclick="previewTask('${task.id}')" class="readIcon d-block text-warning fs-5" href="#"><i class="fa fa-id-card" aria-hidden="true"></i></a>
  <a onclick="toggleTaskCompletion('${task.id}')" class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>

  </div>

  </div>
  `;
}

function addEventHandlers() {
  addButton.onclick = function () {
    if (addButton.innerHTML === ADD_TASK_TEXT) {
      addTask();
    } else {
      updateTask();
    }

    refreshList();
    resetFields();
  };

  const deleteAllButton = document.querySelector("#deleteAllButton");
  deleteAllButton.onclick = function () {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all !",
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;
      setTasks([]);
      refreshList();
      Swal.fire("Deleted!", "All task have been deleted.", "success");
    });
  };

  taskNameField.onkeyup = function () {
    if (!isNameValid()) {
      addButton.disabled = true;
      taskNameField.classList.add("is-invalid");
      taskNameField.classList.remove("is-valid");
      warningAlert.classList.add("d-block");
      warningAlert.classList.remove("d-none");
    } else {
      addButton.removeAttribute("disabled");
      taskNameField.classList.remove("is-invalid");
      taskNameField.classList.add("is-valid");
      warningAlert.classList.remove("d-block");
      warningAlert.classList.add("d-none");
    }
  };

  const changeViewButton = document.getElementById("toggledBtn");
  changeViewButton.addEventListener("click", function () {
    if (!isNonConfirmedListDisplayed) {
      changeViewButton.innerHTML = "Confirmed";
    } else {
      changeViewButton.innerHTML = "TODO";
    }
    isNonConfirmedListDisplayed = !isNonConfirmedListDisplayed;
    refreshList();
  });
}
