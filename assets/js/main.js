var taskName = document.getElementById("taskName");
var assignee = document.getElementById("assignee");

var addTaskButton = document.getElementById("addTaskButton");
var clearTaskButton = document.getElementById("clearTaskButton");

var tasksData = document.getElementById("tasksData");

var tasksArray = [];

var deleteIcon = document.querySelector(".deleteIcon");

// Add Task Button
addTaskButton.onclick = function () {
  addTask();
  displayData();
  clear();
};
// add task function
function addTask() {
  var taskObject = {
    name: taskName.value,
    assignee: assignee.value,
  };
  tasksArray.push(taskObject);
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
          <a  class="deleteIcon mb-3 d-block text-danger fs-5" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
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
