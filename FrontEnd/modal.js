import { deleteWork, addWork } from "./client.js";
import { createWork } from "./util.js";

export async function openGalleryModal(works) {
    
    const modalFragment = document.getElementById('gallery-modal-template').content.cloneNode(true);
    if (!modalFragment) return;
    
    const modal = modalFragment.querySelector('.modal');
    const gallery = modalFragment.querySelector('.modal-gallery');
    
    modalFragment.querySelector('.close-button')
    .addEventListener('click', () => modal.remove());
    
    // modalFragment.querySelector('.add-work-button')
    // .addEventListener('click', () => openAddWorkModal());
    
    works.forEach(work => {
        const figure = createWork(work);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = '<i class="fa fa-trash-can"></i>';
        deleteButton.addEventListener('click', async () => {
            await deleteWork(work.id);
            figure.remove();
        });
        
        figure.appendChild(deleteButton);
        gallery.appendChild(figure);
    });
    
    document.body.appendChild(modalFragment);
  }
  