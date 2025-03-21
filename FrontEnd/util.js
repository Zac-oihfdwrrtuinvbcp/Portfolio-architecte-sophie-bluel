export function displayWorks (works) {
    const gallery = document.querySelector(".gallery");
    const fragment = new DocumentFragment();
    gallery.innerHTML = "";

    works.forEach((work) => {
        const figure = createWork(work);
        fragment.appendChild(figure);
      });
    gallery.appendChild(fragment);
  };
  
export function createWork(work) {
    const figure = document.createElement("figure");
    figure.dataset.workId = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
  
    figure.appendChild(img);
    figure.appendChild(figcaption);
    return figure;
  }