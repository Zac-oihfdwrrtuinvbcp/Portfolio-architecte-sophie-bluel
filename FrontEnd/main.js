import { fetchCategories, fetchWorks, deleteWork } from "./client.js";
import { displayWorks } from "./util.js";
import { openGalleryModal } from "./modal.js";

function displayCategories(categories) {
  const portfolioSection = document.querySelector("#portfolio");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("category-buttons");

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    category.id === 0 && button.classList.add("selected");

    button.addEventListener("click", async () => {
      document.querySelector(".selected").classList.remove("selected");
      button.classList.add("selected");
      const sortedWorks =
        category.id === 0
          ? works
          : works.filter((work) => work.categoryId === category.id);
      displayWorks(sortedWorks);
    });
    buttonContainer.appendChild(button);
  });

  portfolioSection.insertBefore(
    buttonContainer,
    portfolioSection.querySelector(".gallery")
  );
}

const categories = await fetchCategories();
categories.unshift({ id: 0, name: "Tous" });

const authButton = document.getElementById("auth-button");
const token = localStorage.getItem("token");

if (token) {
  console.log("Logged in:", token);

  //show edit mode banner
  document.querySelector(".edit-mode").style.display = "flex";

  //update login/logout button
  authButton.textContent = "logout";
  authButton.href = "#";
  authButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });

  //show edit button
  const editButton = document.querySelector(".edit-button");
  editButton.style.display = "inline-block";
  editButton.addEventListener("click", () => openGalleryModal(works));

} else {
  authButton.textContent = "login";
  authButton.href = "login.html";
  displayCategories(categories);
}

const works = await fetchWorks();
displayWorks(works);
