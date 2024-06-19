const listElement = document.querySelector(".list");
const addButton = document.querySelector(".add-task-button");
const input = document.querySelector(".task-title-field");
const isCompletedElement = document.querySelector(".completed-btn");

const allRadio = document.getElementById("all");
const completedRadio = document.getElementById("completed");
const inProgressRadio = document.getElementById("in-progress");

const pagination = document.querySelector(".pagination");
const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");
const pageLabel = document.querySelector(".page-lable");

axios.defaults.baseURL = "http://localhost:3000";

const limit = 3;
let currentPage = 1;
let finished = undefined;
let totalTasks, totalPages;

listElement.addEventListener("click", async (event) => {
  const target = event.target;
  const id = target.parentElement.dataset.id;

  if (target.classList.contains("toggle-button")) {
    const title =
      target.parentElement.parentElement.querySelector(".title").innerText;
    const completed = target.classList.contains("success") ? true : false;

    try {
      const { data } = await axios.put(`/tasks/${id}`, {
        title,
        completed,
      });

      if (data.success) {
        const statusElement = target.parentElement.querySelector(".status");

        if (target.classList.contains("success")) {
          target.classList.remove("success");
          target.classList.add("secondary");

          statusElement.classList.remove("secondary");
          statusElement.classList.add("success");
          statusElement.innerHTML = "Completed";
        } else {
          target.classList.remove("secondary");
          target.classList.add("success");

          statusElement.classList.remove("success");
          statusElement.classList.add("secondary");
          statusElement.innerHTML = "In progress";
        }
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  } else if (target.classList.contains("edit-button")) {
    const titleElement =
      target.parentElement.parentElement.querySelector(".title");
    const title = prompt("Please enter new title:", titleElement.textContent);

    if (title && title.trim().length >= 3) {
      const completed = target.parentElement
        .querySelector(".toggle-button")
        .classList.contains("success")
        ? false
        : true;
      try {
        const { data } = await axios.put(`/tasks/${id}`, {
          title,
          completed,
        });

        if (data.success) {
          titleElement.innerHTML = title;
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    } else if (title) {
      alert("Please enter at least 3 characters.");
    }
  } else if (target.classList.contains("delete-button")) {
    if (confirm("Are you sure?")) {
      try {
        const { data } = await axios.delete(`/tasks/${id}`);
        if (data.success) {
          target.parentElement.parentElement.remove();
          if (!document.querySelectorAll(".task").length) {
            currentPage--;
            loadTask();
          }
        } else {
          alert("Bad request!");
        }
      } catch (error) {
        alert(error.response.data);
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadTask();
});

addButton.addEventListener("click", (event) => {
  event.preventDefault();
  addTaskHandler();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTaskHandler();
  }
});

async function loadTask() {
  try {
    const { data } = await axios.get(
      `/tasks?page=${currentPage}&limit=${limit}&finished=${finished}`
    );

    if (data.success) {
      if (data.body.length) {
        let htmlGenerate = data.body
          .map((task) => {
            return `
      <div class="task" data-id="${task.id}">
          <div>
            <p class="title">${task.title}</p>
          </div>

        <div class="operations" data-id="${task.id}">
          <p class="status ${task.completed ? "success" : "secondary"}">
            ${task.completed ? "Completed" : "In progress"}
          </p>

          <button
            class="toggle-button button ${
              !task.completed ? "success" : "secondary"
            }"
          >
            Toggle
          </button>

          <button class="edit-button button">Edit</button>
          <button class="delete-button button">Delete</button>
        </div>
      </div>
          `;
          })
          .join("");
        listElement.innerHTML = htmlGenerate;
        input.value = "";
        isCompletedElement.checked = false;
      } else {
        listElement.innerHTML = `<h1 class="not-any-tesk" style="text-align: center;">There is not any task</h1>`;
      }
      totalTasks = data.totalTasks;
      if (totalTasks > limit) {
        pagination.classList.remove("display-none");
        totalPages = Math.ceil(totalTasks / limit);
        prevButton.disabled = nextButton.disabled = false;
        if (currentPage === 1) {
          prevButton.disabled = true;
        } else if (currentPage === totalPages) {
          nextButton.disabled = true;
        }

        pageLabel.innerText = `Page ${currentPage} of ${totalPages}`;
      } else {
        pagination.classList.add("display-none");
        totalPages = 1;
      }
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
}

nextButton.addEventListener("click", () => {
  currentPage++;
  loadTask();
});

prevButton.addEventListener("click", () => {
  currentPage--;
  loadTask();
});

allRadio.addEventListener("change", () => {
  finished = undefined;
  currentPage = 1;
  loadTask();
});

completedRadio.addEventListener("change", () => {
  finished = true;
  currentPage = 1;
  loadTask();
});

inProgressRadio.addEventListener("change", () => {
  finished = false;
  currentPage = 1;
  loadTask();
});

async function addTaskHandler() {
  const title = input.value;
  const isCompleted = isCompletedElement.checked;

  if (title.trim()) {
    try {
      const { data } = await axios.post("/tasks", {
        title,
        isCompleted,
      });

      if (data.success) {
        if (totalTasks % limit) {
          currentPage = totalPages;
        } else {
          currentPage = totalPages + 1;
        }
        loadTask();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  } else {
    alert("Please enter one title.");
  }
}
