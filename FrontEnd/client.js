export async function login(credentials) {
    
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        if (!response.ok) {
            let error = new Error(data.message);
            error.name = `http error ${response.status} ${response.statusText}`;
            throw error;
        }
        
        return data;
}

export async function fetchCategories() {
    try {
        const res = await fetch('http://localhost:5678/api/categories');
        const categories = await res.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

export async function fetchWorks() {
    try {
        const res = await fetch('http://localhost:5678/api/works');
        const works = await res.json();
        return works;
    } catch (error) {
        console.error('Error fetching works:', error);
        return [];
    }
}

export async function deleteWork(id) {
    try {
        const res = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!res.ok) {
            console.error('Failed to delete work');
        }
    } catch (error) {
        console.error('Error deleting work:', error);
    }
}

export async function addWork(formData) {
    try {
        const res = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        if (!res.ok) {
            console.error('Failed to add work');
        }
    } catch (error) {
        console.error('Error adding work:', error);
    }
}