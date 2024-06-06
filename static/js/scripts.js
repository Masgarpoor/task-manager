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
        } else {
          alert("Bad request!");
        }
      } catch (error) {
        alert(error.response.data);
      }
    }
  }
});
