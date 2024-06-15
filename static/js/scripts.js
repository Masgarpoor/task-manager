const listElement = document.querySelector(".list");
const addButton = document.querySelector(".add-task-button");
const input = document.querySelector(".task-title-field");
const isCompletedElement = document.querySelector(".completed-btn");

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
            listElement.innerHTML = `<h1 class="not-any-tesk" style="text-align: center;">There is not any task</h1>`;
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data } = await axios.get("/tasks");

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
      } else {
        listElement.innerHTML = `<h1 class="not-any-tesk" style="text-align: center;">There is not any task</h1>`;
      }
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
});

addButton.addEventListener("click", addTaskHandler);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTaskHandler();
  }
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
        const id = data.body.id;
        const taskHtml = `
      <div class="task" data-id="${id}">
          <div>
            <p class="title">${title}</p>
          </div>

        <div class="operations" data-id="${id}">
          <p class="status ${isCompleted ? "success" : "secondary"}">
            ${isCompleted ? "Completed" : "In progress"}
          </p>

          <button
            class="toggle-button button ${
              !isCompleted ? "success" : "secondary"
            }"
          >
            Toggle
          </button>

          <button class="edit-button button">Edit</button>
          <button class="delete-button button">Delete</button>
        </div>
      </div>
          `;
        if (listElement.querySelector(".not-any-tesk")) {
          listElement.querySelector(".not-any-tesk").remove();
        }
        listElement.insertAdjacentHTML("beforeend", taskHtml);
        input.value = "";
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  } else {
    alert("Please enter one title.");
  }
}
