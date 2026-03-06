/* Load saved tasks */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* CLOCK WITH DATE */

function updateClock(){

let now = new Date();

let hours = now.getHours().toString().padStart(2,'0');
let minutes = now.getMinutes().toString().padStart(2,'0');
let seconds = now.getSeconds().toString().padStart(2,'0');

document.getElementById("clock").innerText =
hours + ":" + minutes + ":" + seconds;

document.getElementById("todayDate").innerText =
now.toDateString();

}

setInterval(updateClock,1000);
updateClock();


/* SAVE TASKS */

function save(){

localStorage.setItem("tasks", JSON.stringify(tasks));

}


/* ADD TASK */

function addTask(){

let text = document.getElementById("taskInput").value;
let priority = document.getElementById("priority").value;
let date = document.getElementById("dueDate").value;
let time = document.getElementById("dueTime").value;

if(text === "") return;

tasks.push({
text,
priority,
date,
time,
completed:false,
alarmTriggered:false
});

document.getElementById("taskInput").value = "";

save();
render();

}


/* DISPLAY TASKS */

function render(){

let list = document.getElementById("taskList");

list.innerHTML = "";

tasks.forEach((task,i)=>{

let li = document.createElement("li");

li.classList.add(task.priority);

if(task.completed) li.classList.add("completed");

li.innerHTML = `
<span onclick="toggleTask(${i})">

${task.text}

<br>

⏰ ${task.date || ""} ${task.time || ""}

</span>

<button onclick="deleteTask(${i})">❌</button>
`;

list.appendChild(li);

});

updateStats();

}


/* COMPLETE TASK */

function toggleTask(i){

tasks[i].completed = !tasks[i].completed;

save();
render();

}


/* DELETE TASK */

function deleteTask(i){

tasks.splice(i,1);

save();
render();

}


/* CLEAR ALL TASKS */

function clearTasks(){

tasks = [];

save();
render();

}


/* TASK STATISTICS */

function updateStats(){

let total = tasks.length;

let completed = tasks.filter(t => t.completed).length;

let pending = total - completed;

document.getElementById("totalTasks").innerText = total;

document.getElementById("completedTasks").innerText = completed;

document.getElementById("pendingTasks").innerText = pending;

let percent = (completed / total) * 100 || 0;

document.getElementById("progressBar").style.width = percent + "%";

}


/* ALARM SOUND */

let alarmSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");


/* CHECK ALARM EVERY SECOND */

setInterval(checkAlarm,1000);

function checkAlarm(){

let now = new Date();

let currentDate = now.toISOString().split("T")[0];

let currentTime = now.toTimeString().slice(0,5);

tasks.forEach(task=>{

if(task.date === currentDate && task.time === currentTime && !task.alarmTriggered){

task.alarmTriggered = true;

alert("⏰ Reminder: " + task.text);

alarmSound.loop = true;
alarmSound.play();

/* Stop alarm after 10 seconds */

setTimeout(()=>{

alarmSound.pause();
alarmSound.currentTime = 0;

},10000);

}

});

}


/* DARK MODE */

document.getElementById("modeToggle").onclick = ()=>{

document.body.classList.toggle("dark");

}


/* INITIAL RENDER */

render();