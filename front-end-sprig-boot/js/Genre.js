 // API URL configuration
 const API_BASE_URL = 'http://localhost:8081';
        
 // DOM Elements
 const genresList = document.getElementById('genres-list');
 const addGenreForm = document.getElementById('add-genre-form');
 const genreNameInput = document.getElementById('genre-name');
 const editGenreModal = document.getElementById('edit-genre-modal');
 const editGenreForm = document.getElementById('edit-genre-form');
 const editGenreIdInput = document.getElementById('edit-genre-id');
 const editGenreNameInput = document.getElementById('edit-genre-name');
 const closeEditModal = document.getElementById('close-edit-modal');
 const cancelEdit = document.getElementById('cancel-edit');
 const successAlert = document.getElementById('alert-success');
 const dangerAlert = document.getElementById('alert-danger');
 const loader = document.getElementById('loader');
 
 // Show loader
 function showLoader() {
     loader.style.display = 'flex';
 }
 
 // Hide loader
 function hideLoader() {
     loader.style.display = 'none';
 }
 
 // Show success alert
 function showSuccess(message) {
     successAlert.textContent = message || 'Operación realizada con éxito';
     successAlert.style.display = 'block';
     setTimeout(() => {
         successAlert.style.display = 'none';
     }, 3000);
 }
 
 // Show error alert
 function showError(message) {
     dangerAlert.textContent = message || 'Ha ocurrido un error';
     dangerAlert.style.display = 'block';
     setTimeout(() => {
         dangerAlert.style.display = 'none';
     }, 3000);
 }
 
 // Load all genres
 async function loadGenres() {
     try {
         showLoader();
         
         const response = await fetch(`${API_BASE_URL}/api/getAllGenres`);
         
         if (!response.ok) {
             throw new Error('Error al cargar los géneros');
         }
         
         const genres = await response.json();
         
         // Render genres
         renderGenres(genres);
         
         hideLoader();
     } catch (error) {
         console.error('Error:', error);
         showError('Error al cargar los géneros');
         hideLoader();
     }
 }
 
 // Render genres in the table
 function renderGenres(genres) {
     genresList.innerHTML = '';
     
     if (genres.length === 0) {
         genresList.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay géneros disponibles</td></tr>';
         return;
     }
     
     genres.forEach(genre => {
         const row = document.createElement('tr');
         row.innerHTML = `
             <td>${genre.id}</td>
             <td>${genre.name}</td>
             <td class="table-actions">
                 <button class="btn-edit" data-id="${genre.id}" data-name="${genre.name}">
                     <i class="fas fa-edit"></i>
                 </button>
                 <button class="btn-delete" data-id="${genre.id}">
                     <i class="fas fa-trash-alt"></i>
                 </button>
             </td>
         `;
         genresList.appendChild(row);
     });
     
     // Add event listeners for edit and delete buttons
     document.querySelectorAll('.btn-edit').forEach(btn => {
         btn.addEventListener('click', function() {
             const id = this.getAttribute('data-id');
             const name = this.getAttribute('data-name');
             openEditModal(id, name);
         });
     });
     
     document.querySelectorAll('.btn-delete').forEach(btn => {
         btn.addEventListener('click', function() {
             const id = this.getAttribute('data-id');
             deleteGenre(id);
         });
     });
 }
 
 // Add a new genre
 async function addGenre(name) {
     try {
         showLoader();
         
         const response = await fetch(`${API_BASE_URL}/api/addGenre`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ name })
         });
         
         if (!response.ok) {
             throw new Error('Error al añadir el género');
         }
         
         hideLoader();
         showSuccess('Género añadido con éxito');
         
         // Reset form and reload genres
         addGenreForm.reset();
         loadGenres();
     } catch (error) {
         console.error('Error:', error);
         showError('Error al añadir el género');
         hideLoader();
     }
 }
 
 // Open edit modal
 function openEditModal(id, name) {
     editGenreIdInput.value = id;
     editGenreNameInput.value = name;
     editGenreModal.style.display = 'flex';
 }
 
 // Update a genre
 async function updateGenre(id, name) {
     try {
         showLoader();
         
         const response = await fetch(`${API_BASE_URL}/api/updateGenre/${id}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ name })
         });
         
         if (!response.ok) {
             throw new Error('Error al actualizar el género');
         }
         
         hideLoader();
         showSuccess('Género actualizado con éxito');
         
         // Close modal and reload genres
         editGenreModal.style.display = 'none';
         loadGenres();
     } catch (error) {
         console.error('Error:', error);
         showError('Error al actualizar el género');
         hideLoader();
     }
 }
 
 // Delete a genre
 async function deleteGenre(id) {
     if (confirm('¿Estás seguro de que deseas eliminar este género?')) {
         try {
             showLoader();
             
             const response = await fetch(`${API_BASE_URL}/api/deleteGenre/${id}`, {
                 method: 'DELETE'
             });
             
             if (!response.ok) {
                 throw new Error('Error al eliminar el género');
             }
             
             hideLoader();
             showSuccess('Género eliminado con éxito');
             
             // Reload genres
             loadGenres();
         } catch (error) {
             console.error('Error:', error);
             showError('Error al eliminar el género');
             hideLoader();
         }
     }
 }
 
 // Get a genre by ID
 async function getGenreById(id) {
     try {
         showLoader();
         
         const response = await fetch(`${API_BASE_URL}/api/getGenreById/${id}`);
         
         if (!response.ok) {
             throw new Error('Error al obtener el género');
         }
         
         const genre = await response.json();
         
         hideLoader();
         return genre;
     } catch (error) {
         console.error('Error:', error);
         showError('Error al obtener el género');
         hideLoader();
         return null;
     }
 }
 
 // Event Listeners
 document.addEventListener('DOMContentLoaded', () => {
     // Load genres when page loads
     loadGenres();
     
     // Add Genre Form Submit
     addGenreForm.addEventListener('submit', function(e) {
         e.preventDefault();
         const name = genreNameInput.value.trim();
         
         if (name) {
             addGenre(name);
         }
     });
     
     // Edit Genre Form Submit
     editGenreForm.addEventListener('submit', function(e) {
         e.preventDefault();
         const id = editGenreIdInput.value;
         const name = editGenreNameInput.value.trim();
         
         if (id && name) {
             updateGenre(id, name);
         }
     });
     
     // Close Edit Modal
     closeEditModal.addEventListener('click', () => {
         editGenreModal.style.display = 'none';
     });
     
     // Cancel Edit Button
     cancelEdit.addEventListener('click', () => {
         editGenreModal.style.display = 'none';
     });
     
     // Close Modal when clicking outside
     window.addEventListener('click', (e) => {
         if (e.target === editGenreModal) {
             editGenreModal.style.display = 'none';
         }
     });
 });