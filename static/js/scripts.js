const listElement = document.querySelector(".list");

listElement.addEventListener("click", async (event) => {
  const target = event.target;
  const id = target.parentElement.dataset.id;

  if (target.classList.contains("toggle-button")) {
    try {
      const response = await axios.post("/toggle-task", { id });
      if (response.data === true) {
        location.reload();
      } else {
        alert(response.data);
      }
    } catch (e) {
      alert(e.response.data);
    }
  } else if (target.classList.contains("edit-button")) {
    const titleElement =
      target.parentElement.parentElement.querySelector(".title");
    const title = prompt("Please enter new title:", titleElement.textContent);

    if (title && title.length >= 3) {
      try {
        const response = await axios.post("/edit-task", {
          id,
          title,
        });

        if (response.data === true) {
          location.reload();
        } else {
          alert(response.data);
        }
      } catch (error) {
        alert(error.response.data);
      }
    } else if (title) {
      alert("Please enter at least 3 characters.");
    }
  } else if (target.classList.contains("delete-button")) {
    if (confirm("Are you sure?")) {
      try {
        const response = await axios.post("/delete-task", {
          id,
        });
        if (response.data) {
          target.parentElement.parentElement.remove();
          if (!document.querySelectorAll(".task").length) {
            listElement.innerHTML = `<h1 style="text-align: center;">There is not any task</h1>`;
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
    const { data } = await axios.get("/get-all-tasks");
    console.log(data);

    if (data instanceof Array) {
      const listElement = document.querySelector(".js-list");
      if (data.length) {
        let htmlGenerate = data
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
        listElement.innerHTML = `<h1 style="text-align: center;">There is not any task</h1>`;
      }
    }
  } catch (error) {
    console.log(error);
  }
});
