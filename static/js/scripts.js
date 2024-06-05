const listElement = document.querySelector(".list");

listElement.addEventListener("click", async (event) => {
  const target = event.target;
  const id = target.parentElement.parentElement.dataset.id;
  if (target.classList.contains("toggle-button")) {
    let response;
    console.log(id);
    try {
      response = await axios.post("/toggle-task", { id });
      if (response.data === true) {
        location.reload();
      } else {
        alert(response.data);
      }
    } catch (e) {
      alert(e.message);
    }
  }
});
