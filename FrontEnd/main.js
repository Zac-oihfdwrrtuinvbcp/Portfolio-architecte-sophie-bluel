async function fetchCategories() {
    try {
        const res = await fetch('http://localhost:5678/api/categories');
        const categories = await res.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchWorks() {
    try {
        const res = await fetch('http://localhost:5678/api/works');
        const works = await res.json();
        return works;
    } catch (error) {
        console.error('Error fetching works:', error);
        return [];
    }
}

function displayCategories(categories) {
    const portfolioSection = document.querySelector('#portfolio');
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('category-buttons');

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        category.id === 0 && button.classList.add('selected');

        button.addEventListener('click', async () => {
            document.querySelector('.selected').classList.remove('selected');
            button.classList.add('selected');
            const sortedWorks = category.id === 0 ? works : works.filter(work => work.categoryId === category.id);
            displayWorks(sortedWorks);
        });
        buttonContainer.appendChild(button);
    });

    portfolioSection.insertBefore(buttonContainer, portfolioSection.querySelector('.gallery'));
}

const displayWorks = works => {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

const categories = await fetchCategories();
categories.unshift({ id: 0, name: 'Tous' });
displayCategories(categories);
const works = await fetchWorks();
displayWorks(works);

