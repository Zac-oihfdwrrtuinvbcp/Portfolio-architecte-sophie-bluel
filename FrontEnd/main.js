import { fetchCategories, fetchWorks, deleteWork } from "./client.js";

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

const displayWorks = (works) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = createWork(work);
    gallery.appendChild(figure);
  });
};

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

function openEditModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => modal.remove());
  modalContent.appendChild(closeButton);

  const title = document.createElement("h3");
  title.textContent = "Galerie photo";
  modalContent.appendChild(title);

  const gallery = document.createElement("div");
  gallery.classList.add("gallery");
  works.forEach((work) => {
    const figure = createWork(work);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteWork(work.id, figure));

    figure.appendChild(deleteButton);
    gallery.appendChild(figure);
  });

  modalContent.appendChild(gallery);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// document.addEventListener('DOMContentLoaded', () => {
//     const authButton = document.getElementById('auth-button');
//     const token = localStorage.getItem('token');

//     if (token) {
//         authButton.textContent = 'logout';
//         authButton.href = '#';
//         authButton.addEventListener('click', () => {
//             localStorage.removeItem('token');
//             window.location.reload();
//         });
//     } else {
//         authButton.textContent = 'login';
//         authButton.href = 'login.html';
//     }
// });

const categories = await fetchCategories();
categories.unshift({ id: 0, name: "Tous" });

const authButton = document.getElementById("auth-button");
const token = localStorage.getItem("token");

if (token) {
  authButton.textContent = "logout";
  authButton.href = "#";
  authButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });

  console.log("Logged in:", token);

  const editButton = document.createElement("button");
  editButton.textContent = "Modifier";
  editButton.addEventListener("click", openEditModal);
  const portfolioSection = document.querySelector("#portfolio");
  portfolioSection
    .querySelector("h2")
    .insertAdjacentElement("afterend", editButton);
} else {
  authButton.textContent = "login";
  authButton.href = "login.html";
  displayCategories(categories);
}

const works = await fetchWorks();
displayWorks(works);
