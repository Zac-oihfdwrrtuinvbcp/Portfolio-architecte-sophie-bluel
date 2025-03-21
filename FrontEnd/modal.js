import { deleteWork, addWork, fetchWorks } from "./client.js";
import { createWork } from "./util.js";
import { categories } from "./main.js";
let currentModal = null;

export async function openGalleryModal(works) {

    if (currentModal) {
        currentModal.remove();
    }
    
    const modalFragment = document.getElementById('gallery-modal-template').content.cloneNode(true);
    if (!modalFragment) return;
    
    const modal = modalFragment.querySelector('.modal');
    const gallery = modalFragment.querySelector('.modal-gallery');
    
    modalFragment.querySelector('.close-button')
    .addEventListener('click', () => modal.remove());
    
    modalFragment.querySelector('.add-work-button')
    .addEventListener('click', () => openAddWorkModal());
    
    works.forEach(work => {
        const figure = createWork(work);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = '<i class="fa fa-trash-can"></i>';
        deleteButton.addEventListener('click', async () => {
            await deleteWork(work.id);
            figure.remove();

            const mainGallery = document.querySelector('.gallery');
            const mainFigure = mainGallery.querySelector(`figure[data-work-id="${work.id}"]`);
            if (mainFigure) {
                mainFigure.remove();
            }
        });
        
        figure.appendChild(deleteButton);
        gallery.appendChild(figure);
    });
    
    document.body.appendChild(modalFragment);
    currentModal = document.querySelector('.modal');
  }
  
export async function openAddWorkModal() {

    if (currentModal) {
        currentModal.remove();
    }
    
    const modalFragment = document.getElementById('add-work-modal-template').content.cloneNode(true);
    if (!modalFragment) return;
    
    const modal = modalFragment.querySelector('.modal');
    const form = modalFragment.querySelector('#add-work-form');
    const imageInput = modalFragment.querySelector('#image-upload');
    const previewImage = modalFragment.querySelector('#preview-image');
    const categorySelect = modalFragment.querySelector('#category');
    const uploadLabel = modalFragment.querySelector('.upload-label');
    
    modalFragment.querySelector('.close-button').addEventListener('click', () => modal.remove());
    
    modalFragment.querySelector('.back-button').addEventListener('click', async () => {
        const updatedWorks = await fetchWorks();
        openGalleryModal(updatedWorks);
    });
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            if ( file.size > 4 * 1024 * 1024){
                alert("File is too big!");
                return;
            }
            const [type, extension] = file.type.split("/");
            if(type !== 'image'){
                alert("File is not an image!");
                return;
            }else if (["jpeg", "png", "jpg"].includes(extension) === false){
                console.log(file.type);
                return;
            }
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadLabel.style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    console.log(categories);
    categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.id ? category.name : '';
            categorySelect.appendChild(option);
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        await addWork(formData);
            
        const updatedWorks = await fetchWorks();
        openGalleryModal(updatedWorks);
    });
    
    document.body.appendChild(modalFragment);
    currentModal = document.querySelector('.modal');
}