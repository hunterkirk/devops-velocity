const stages = [
  { name: "Plan", color: "rgba(0,150,255,0.7)" },
  { name: "Develop", color: "rgba(255,215,0,0.75)" },
  { name: "Test", color: "rgba(255,69,0,0.75)" },
  { name: "Integrate", color: "rgba(0,255,127,0.75)" },
  { name: "Deploy", color: "rgba(0,255,255,0.75)" },
  { name: "Operate", color: "rgba(100,149,237,0.75)" },
  { name: "Monitor", color: "rgba(255,140,0,0.75)" },
  { name: "Feedback", color: "rgba(173,255,47,0.75)" }
];

let projects = JSON.parse(localStorage.getItem("devops_projects")) || [];
let selectedProjectIndex = null;

const projectList = document.getElementById("projectList");
const addProjectBtn = document.getElementById("addProjectBtn");
const gaugesPanel = document.getElementById("gaugesPanel");
const projectTitle = document.getElementById("projectTitle");

function saveProjects() {
  localStorage.setItem("devops_projects", JSON.stringify(projects));
}

function renderProjects() {
  projectList.innerHTML = '';

  projects.forEach((project, index) => {
    const container = document.createElement("div");
    container.className = "flex items-center justify-between group";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cursor-pointer text-sm text-white hover:text-blue-400 flex-1";
    nameSpan.textContent = project.name;

    nameSpan.onclick = () => {
      selectProject(index);
    };

    nameSpan.oncontextmenu = (e) => {
      e.preventDefault();
      const newName = prompt("Edit project name:", project.name);
      if (newName && newName.trim()) {
        projects[index].name = newName.trim();
        saveProjects();
        renderProjects();
        if (index === selectedProjectIndex) {
          projectTitle.textContent = newName;
        }
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Delete Project";
    deleteBtn.className = "invisible group-hover:visible text-red-400 hover:text-red-600 text-sm ml-2";

    deleteBtn.onclick = () => {
      const confirmDelete = confirm(`Are you sure you want to delete "${project.name}"?`);
      if (confirmDelete) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects();
        if (index === selectedProjectIndex) {
          selectedProjectIndex = null;
          projectTitle.textContent = "Select a project";
          gaugesPanel.innerHTML = "";
        }
      }
    };

    container.appendChild(nameSpan);
    container.appendChild(deleteBtn);
    projectList.appendChild(container);
  });
}


function selectProject(index) {
  selectedProjectIndex = index;
  const project = projects[index];
  projectTitle.textContent = project.name;
  renderGauges(project.stages);
}

function renderGauges(stageValues) {
  gaugesPanel.innerHTML = '';
  stageValues.forEach((value, i) => {
    const stage = stages[i];
    const card = document.createElement("div");
    card.className = "bg-gray-800 p-4 rounded-lg text-center shadow-md";

    const h2 = document.createElement("h2");
    h2.className = "text-lg font-semibold mb-2";
    h2.textContent = stage.name;

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;

    card.appendChild(h2);
    card.appendChild(canvas);
    gaugesPanel.appendChild(card);

    const gauge = new RadialGauge({
      renderTo: canvas,
      width: 200,
      height: 200,
      units: "",
      value: value,
      minValue: 0,
      maxValue: 100,
      barWidth: 10,
      colorBarProgress: stage.color,
      colorPlate: "#1f2937",
      colorBackground: "#1f2937",
      colorUnits: "#fff",
      colorValue: "#fff",
      colorMajorTicks: "#bbb",
      colorMinorTicks: "#888",
      borders: false,
      animation: true
    }).draw();

    canvas.onclick = () => {
      const newVal = prompt(`Set value for ${stage.name}`, value);
      if (newVal !== null) {
        const intVal = parseInt(newVal);
        if (!isNaN(intVal) && intVal >= 0 && intVal <= 100) {
          projects[selectedProjectIndex].stages[i] = intVal;
          saveProjects();
          renderGauges(projects[selectedProjectIndex].stages);
        } else {
          alert("Please enter a number between 0 and 100.");
        }
      }
    };
  });
}

addProjectBtn.onclick = () => {
  const name = prompt("Enter project name:");
  if (name) {
    const newProject = {
      name,
      stages: Array(stages.length).fill(0)
    };
    projects.push(newProject);
    saveProjects();
    renderProjects();
  }
};

renderProjects();
