var taskName = document.getElementById("taskName");
var assignee = document.getElementById("assignee");

var addTaskButton = document.getElementById("addTaskButton");
var clearTaskButton = document.getElementById("clearTaskButton");

var tasksData = document.getElementById("tasksData");
var tasksDataDone = document.getElementById("tasksDataDone");

var tasksArray = [];

var deleteIcon = document.querySelector(".deleteIcon");
var deleteAllButton = document.querySelector("#deleteAllButton");

var currentIndex;

var countTask = document.querySelector("#countTask");
var countDone = document.querySelector("#countDone");

var toggledBtn = document.querySelector("#toggledBtn");
var toggle = 0;

var nameAlert = document.getElementById("nameAlert");

// to check if the local storage empty or not
if (localStorage.getItem("tasksList") == null) {
  tasksArray = [];
} else {
  tasksArray = JSON.parse(localStorage.getItem("tasksList"));
  displayData();
  counter();
}
// ----------------------------------------------------------------------------------------------------------
// Add Task Button
addTaskButton.onclick = function () {
  if (addTaskButton.innerHTML == "Add-Task") {
    addTask();
    // sweet alert
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "The task has been added successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    addTaskButton.setAttribute("disabled", "disabled");
  } else {
    updateTask();
    // sweet alert
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "The task has been updated successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("addTaskButton").innerHTML = "Add-Task";
  }

  displayData();
  counter();
  clear();
};
// add task function
function addTask() {
  var done = 0;
  var taskObject = {
    done: done,
    name: taskName.value,
    assignee: assignee.value,
  };
  tasksArray.push(taskObject);
  localStorage.setItem("tasksList", JSON.stringify(tasksArray));
}
// display Data in web page
function displayData() {
  var result = "";
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].done == 0) {
      result += `
          <div class="taskDiv d-flex justify-content-between">
      
          <div class="taskAndAssignee">
          <p class="taskNamePara pb-2">${tasksArray[i].name}</p>
          <p class="assigneePara">${tasksArray[i].assignee}</p>
          </div>
      
          <div class="icons">
          <a onclick="deleteTask(${i})" class="deleteIcon d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
          <a onclick="getTaskData(${i})" class="readIcon d-block text-warning fs-5" href="#"><i class="fa fa-id-card" aria-hidden="true"></i></a>
          <a onclick="TaskDone(${i})" class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>

          </div>
      
          </div>
      
          `;
    }
  }
  tasksData.innerHTML = result;
}
// display Data done in web page
function displayDataConfirmed() {
  var result = "";

  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].done == 1) {
      result += `
          <div class="taskDiv d-flex justify-content-between">
      
          <div class="taskAndAssignee">
          <p class="taskNamePara pb-2">${tasksArray[i].name}</p>
          <p class="assigneePara">${tasksArray[i].assignee}</p>
          </div>
      
          <div class="icons">
          <a onclick="deleteTask(${i})" class="deleteIcon d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
          <a onclick="getTaskData(${i})" class="readIcon d-block text-warning fs-5" href="#"><i class="fa fa-id-card" aria-hidden="true"></i></a>
          <a  class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>
          
          </div>
      
          </div>
      
          `;
    }
  }
  tasksDataDone.innerHTML = result;
}

// clear data after add task
function clear() {
  taskName.value = " ";
  assignee.value = " ";
}

// delete task when click on delete icon
function deleteTask(index) {
  // sweet alert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasksArray.splice(index, 1);
      localStorage.setItem("tasksList", JSON.stringify(tasksArray));
      displayData();
      counter();

      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    }
  });
}

// To delete all tasks
deleteAllButton.onclick = function () {
  // sweet alert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete all !",
  }).then((result) => {
    if (result.isConfirmed) {
      tasksArray.splice(0);
      localStorage.setItem("tasksList", JSON.stringify(tasksArray));
      displayData();
      counter();
      Swal.fire("Deleted!", "All task have been deleted.", "success");
    }
  });
};

// Search function
function search(e) {
  var result = "";
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].name.toLowerCase().includes(e.value.toLowerCase())) {
      result += `
          <div class="taskDiv d-flex justify-content-between">
      
          <div class="taskAndAssignee">
          <p class="taskNamePara pb-2">${tasksArray[i].name}</p>
          <p class="assigneePara">${tasksArray[i].assignee}</p>
          </div>
      
          <div class="icons">
          <a onclick="deleteTask(${i})" class="deleteIcon d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
          <a onclick="getTaskData(${i})" class="readIcon d-block text-warning fs-5" href="#"><i class="fa fa-id-card" aria-hidden="true"></i></a>
          <a class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>
          </div>
      
          </div>
      
          `;
    }
  }

  debounceUpdate(result);
}
//Debounced search
const debounceUpdate = debounce((result) => {
  tasksData.innerHTML = result;
});
// debounce function
function debounce(callback, delay = 1500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
// to display data in text filed
function getTaskData(index) {
  taskName.value = tasksArray[index].name;
  assignee.value = tasksArray[index].assignee;
  addTaskButton.innerHTML = "Update Task";
  currentIndex = index;
}
// to update data in task div
function updateTask() {
  var taskObj = {
    name: taskName.value,
    assignee: assignee.value,
  };
  tasksArray[currentIndex].name = taskObj.name;
  tasksArray[currentIndex].assignee = taskObj.assignee;

  localStorage.setItem("tasksList", JSON.stringify(tasksArray));
}
// toggle button

toggledBtn.addEventListener("click", function () {
  if (toggle) {
    tasksDataDone.style.display = "none";
    tasksData.style.display = "block";
    toggledBtn.innerHTML = "Confirmed";
    displayData();
    toggle = !toggle;
  } else {
    tasksDataDone.style.display = "block";
    tasksData.style.display = "none";
    toggledBtn.innerHTML = "TODO";
    displayDataConfirmed();
    toggle = !toggle;
  }
});

// to check task is done or not
function TaskDone(i) {
  Swal.fire({
    title: "Do you want to confirm that task is done?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isConfirmed) {
      tasksArray[i].done = 1;
      localStorage.setItem("tasksList", JSON.stringify(tasksArray));
      displayData();
      counter();
      Swal.fire("Task Is Done!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
//
//To count num of task done and not done
function counter() {
  var todoTasksCounter = 0;
  var confirmedTasksCounter = 0;
  tasksArray.map((item) => {
    if (item.done) {
      confirmedTasksCounter++;
    } else {
      todoTasksCounter++;
    }
  });
  countTask.innerHTML = `" ${todoTasksCounter} "`;
  countDone.innerHTML = `" ${confirmedTasksCounter} "`;
}
//Nmae validation--------------------------------------------
taskName.onkeyup = function () {
  var namePattern = /^[A-Z][a-z]{2,10}$/;
  if (namePattern.test(taskName.value)) {
    addTaskButton.removeAttribute("disabled");
    taskName.classList.add("is-valid");
    taskName.classList.remove("is-invalid");
    nameAlert.classList.add("d-none");
  } else {
    addTaskButton.setAttribute("disabled", "disabled");
    taskName.classList.add("is-invalid");
    nameAlert.classList.add("d-block");
    nameAlert.classList.remove("d-none");
  }
};
