var taskName = document.getElementById("taskName");
var assignee = document.getElementById("assignee");

var addTaskButton = document.getElementById("addTaskButton");
var clearTaskButton = document.getElementById("clearTaskButton");

var tasksData = document.getElementById("tasksData");

var tasksArray = [];

var deleteIcon = document.querySelector(".deleteIcon");
var deleteAllButton = document.querySelector("#deleteAllButton");

// to check if the local storage empty or not
if (localStorage.getItem("tasksList") == null) {
  tasksArray = [];
} else {
  tasksArray = JSON.parse(localStorage.getItem("tasksList"));
  displayData();
}
// ----------------------------------------------------------------------------------------------------------
// Add Task Button
addTaskButton.onclick = function () {
  addTask();
  displayData();
  clear();

  // sweet alert
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "The task has been added successfully",
    showConfirmButton: false,
    timer: 1500,
  });
};
// add task function
function addTask() {
  var taskObject = {
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
    result += `
          <div class="taskDiv d-flex justify-content-between">
      
          <div class="taskAndAssignee">
          <p class="taskNamePara pb-2">${tasksArray[i].name}</p>
          <p class="assigneePara">${tasksArray[i].assignee}</p>
          </div>
      
          <div class="icons">
          <a onclick="deleteTask(${i})" class="deleteIcon mb-3 d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
          <a class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>
          </div>
      
          </div>
      
          `;
  }
  tasksData.innerHTML = result;
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
      localStorage.removeItem("tasksList");
      tasksArray = [];
      tasksData.innerHTML = "";

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
          <a onclick="deleteTask(${i})" class="deleteIcon mb-3 d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
          <a class="readIcon d-block text-success fs-5" href="#"><i class="fa fa-check-circle" aria-hidden="true"></i></a>
          </div>
      
          </div>
      
          `;
    }
  }
  tasksData.innerHTML = result;
}
