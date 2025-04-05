import { deleteWork, addWork, fetchWorks } from "./client.js";
import { createWork, displayWorks } from "./util.js";
import { categories } from "./main.js";
let currentModal = null;

export async function openGalleryModal(works) {

    if (currentModal) {
        currentModal.remove();
    }
    
    const modalFragment = document.getElementById('gallery-modal-template').content.cloneNode(true);
    if (!modalFragment) return;
    
    const modal = modalFragment.querySelector('.modal-container');
    const gallery = modalFragment.querySelector('.modal-gallery');
    
    modalFragment.querySelector('.close-button')
    .addEventListener('click', () => modal.remove());
    
    modalFragment.querySelector('.add-work-button')
    .addEventListener('click', () => openAddWorkModal());
    
    works.forEach(work => {
        const figure = createWork(work, false);

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
    currentModal = document.querySelector('.modal-container');
  }
  
export async function openAddWorkModal() {

    if (currentModal) {
        currentModal.remove();
    }
    
    const modalFragment = document.getElementById('add-work-modal-template').content.cloneNode(true);
    if (!modalFragment) return;
    
    const modal = modalFragment.querySelector('.modal-container');
    const form = modalFragment.querySelector('#add-work-form');
    const imageInput = modalFragment.querySelector('#image-upload');
    const previewImage = modalFragment.querySelector('#preview-image');
    const categorySelect = modalFragment.querySelector('#category');
    const uploadLabel = modalFragment.querySelector('.upload-label');
    const titleInput = modalFragment.querySelector('#title');
    const submitButton = modalFragment.querySelector('.submit-button');

    const imageError = modalFragment.querySelector('.image-error');
    const titleError = modalFragment.querySelector('.title-error');
    const categoryError = modalFragment.querySelector('.category-error');

    const validationState = {
        image: false,
        title: false,
        category: false
    };
    
    modalFragment.querySelector('.close-button').addEventListener('click', () => modal.remove());
    
    modalFragment.querySelector('.back-button').addEventListener('click', async () => {
        const updatedWorks = await fetchWorks();
        openGalleryModal(updatedWorks);
    });
    
    // Image validation
    imageInput.addEventListener('change', (e) => {
        imageError.textContent = '';
        validationState.image = false;

        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            if ( file.size > 4 * 1024 * 1024){
                imageError.textContent = 'L\'image est trop volumineuse (max 4Mo)';
                return;
            }
            const [type, extension] = file.type.split("/");
            if(type !== 'image'){
                imageError.textContent = 'Le fichier doit être une image';
                return;
            }else if (["jpeg", "png", "jpg"].includes(extension) === false){
                imageError.textContent = 'Format non supporté (jpg, jpeg, png uniquement)';
                return;
            }

            validationState.image = true;
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadLabel.style.display = 'none';
                updateSubmitButton();
            };

            reader.readAsDataURL(file);
        }
    });

    //Title validation
    titleInput.addEventListener('input', () => {
        titleError.textContent = '';
        validationState.title = false;

        if (titleInput.value.length < 3){
            titleError.textContent = 'Le titre doit contenir au moins 3 caractères';
        } else if (titleInput.value.length > 55){
            titleError.textContent = 'Le titre doit contenir au maximum 55 caractères';
        } else{
            validationState.title = true;
        }

        updateSubmitButton();
    });

    // Category validation
    categorySelect.addEventListener('change', () => {
        categoryError.textContent = '';
        validationState.category = false;

        console.log(categorySelect.value);

        if (categorySelect.value == 0){
            categoryError.textContent = 'Veuillez sélectionner une catégorie';
            updateSubmitButton()
            return;
        }

        validationState.category = true;
        updateSubmitButton();
    });

    function updateSubmitButton() {
        if (validationState.image && validationState.title && validationState.category) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
    }
    
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
        displayWorks(updatedWorks);
    });
    
    document.body.appendChild(modalFragment);
    currentModal = document.querySelector('.modal-container');
}