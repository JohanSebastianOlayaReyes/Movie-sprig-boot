// URL base de la API
const API_BASE_URL = 'http://localhost:8081/api';

// Elementos del DOM
const movieListSection = document.getElementById('movieList');
const movieDetailSection = document.getElementById('movieDetail');
const movieFormSection = document.getElementById('movieForm');
const movieGrid = document.getElementById('movieGrid');
const detailContent = document.getElementById('detailContent');
const addMovieForm = document.getElementById('addMovieForm');
const formTitle = document.getElementById('formTitle');
const movieIdInput = document.getElementById('movieId');
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnSubmit = document.getElementById('btnSubmit');

// Botones de navegación
const btnShowList = document.getElementById('btnShowList');
const btnShowForm = document.getElementById('btnShowForm');
const btnBackToList = document.getElementById('btnBackToList');
const btnCancelForm = document.getElementById('btnCancelForm');

// Estado de la aplicación
let currentView = 'list';
let movies = [];
let isEditMode = false;

// Manejadores de eventos para la navegación
btnShowList.addEventListener('click', () => showView('list'));
btnShowForm.addEventListener('click', () => {
    isEditMode = false;
    formTitle.textContent = 'Añadir Nueva Película';
    showView('form');
});
btnBackToList.addEventListener('click', () => showView('list'));
btnCancelForm.addEventListener('click', () => showView('list'));

// Manejador para la búsqueda
btnSearch.addEventListener('click', handleSearch);

// Manejador para el formulario
addMovieForm.addEventListener('submit', handleFormSubmit);

// Función para mostrar la vista seleccionada
function showView(view) {
    currentView = view;
    
    // Ocultar todas las secciones
    movieListSection.classList.add('hidden');
    movieDetailSection.classList.add('hidden');
    movieFormSection.classList.add('hidden');
    
    // Mostrar la sección seleccionada
    switch (view) {
        case 'list':
            movieListSection.classList.remove('hidden');
            fetchMovies(); // Cargar películas al mostrar la lista
            btnShowList.classList.add('active');
            btnShowForm.classList.remove('active');
            break;
        case 'detail':
            movieDetailSection.classList.remove('hidden');
            btnShowList.classList.add('active');
            btnShowForm.classList.remove('active');
            break;
        case 'form':
            movieFormSection.classList.remove('hidden');
            btnShowList.classList.remove('active');
            btnShowForm.classList.add('active');
            if (!isEditMode) {
                addMovieForm.reset(); // Limpiar el formulario solo si no estamos en modo edición
                movieIdInput.value = '';
            }
            break;
    }
}

// Función para cargar todas las películas
async function fetchMovies() {
    try {
        // Mostrar estado de carga
        movieGrid.innerHTML = '<div class="loading">Cargando películas...</div>';
        
        const response = await fetch(`${API_BASE_URL}/getAllMovies`);
        
        if (!response.ok) {
            throw new Error('Error al cargar películas');
        }
        
        movies = await response.json();
        
        if (movies.length === 0) {
            movieGrid.innerHTML = '<div class="loading">No hay películas disponibles</div>';
            return;
        }
        
        // Renderizar las películas
        renderMovies(movies);
    } catch (error) {
        console.error('Error:', error);
        movieGrid.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Función para renderizar la lista de películas
function renderMovies(movies) {
    movieGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Género:</strong> ${movie.genre}</p>
            <div class="action-icons">
                <button class="icon-button edit" title="Editar película">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-button delete" title="Eliminar película">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Añadir evento click para ver detalles (en el cuerpo de la tarjeta)
        movieCard.addEventListener('click', (e) => {
            // Verificar que no se hizo clic en los iconos de acción
            if (!e.target.closest('.action-icons')) {
                showMovieDetails(movie.id);
            }
        });
        
        // Añadir eventos para los botones de acción
        const editButton = movieCard.querySelector('.edit');
        const deleteButton = movieCard.querySelector('.delete');
        
        // Evento para editar
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que se active el evento click de la tarjeta
            handleEditMovie(movie);
        });
        
        // Evento para eliminar
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que se active el evento click de la tarjeta
            handleDeleteMovie(movie.id);
        });
        
        movieGrid.appendChild(movieCard);
    });
}

// Función para mostrar detalles de una película
async function showMovieDetails(id) {
    try {
        // Mostrar estado de carga
        detailContent.innerHTML = '<div class="loading">Cargando detalles...</div>';
        showView('detail');
        
        const response = await fetch(`${API_BASE_URL}/getMovieById/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los detalles de la película');
        }
        
        const movie = await response.json();
        
        // Renderizar los detalles (ocultando el ID para el usuario final)
        detailContent.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Género:</strong> ${movie.genre}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        detailContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Función para manejar la edición de una película
function handleEditMovie(movie) {
    // Cambiar a modo edición
    isEditMode = true;
    
    // Actualizar el título del formulario
    formTitle.textContent = 'Editar Película';
    
    // Rellenar el formulario con los datos de la película
    movieIdInput.value = movie.id;
    document.getElementById('title').value = movie.title;
    document.getElementById('director').value = movie.director;
    document.getElementById('genre').value = movie.genre;
    
    // Mostrar el formulario
    showView('form');
}

// Función para manejar la eliminación de una película
async function handleDeleteMovie(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta película?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/deleteMovie/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar la película');
        }
        
        // Mostrar mensaje de éxito
        showNotification('Película eliminada con éxito', 'success-message');
        
        // Actualizar la lista de películas
        fetchMovies();
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error-message');
    }
}

// Función para manejar la búsqueda de películas por ID
async function handleSearch() {
    const searchId = searchInput.value.trim();
    
    if (!searchId) {
        alert('Por favor, introduce un ID válido para buscar');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/getMovieById/${searchId}`);
        
        if (!response.ok) {
            throw new Error('No se encontró ninguna película con ese ID');
        }
        
        const movie = await response.json();
        
        // Mostrar los detalles de la película encontrada
        showMovieDetails(movie.id);
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error-message');
    }
}

// Función para manejar el envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        genre: document.getElementById('genre').value
    };
    
    // Si estamos en modo edición, incluir el ID
    const movieId = movieIdInput.value;
    let url, method;
    
    if (isEditMode && movieId) {
        url = `${API_BASE_URL}/updateMovie/${movieId}`;
        method = 'PUT';
    } else {
        url = `${API_BASE_URL}/addMovie`;
        method = 'POST';
    }
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
            throw new Error(`Error al ${isEditMode ? 'actualizar' : 'añadir'} la película`);
        }
        
        // Mostrar la lista actualizada
        showView('list');
        
        // Limpiar el formulario
        addMovieForm.reset();
        movieIdInput.value = '';
        
        // Restablecer el modo
        isEditMode = false;
        
        // Mostrar mensaje de éxito
        showNotification(`Película ${isEditMode ? 'actualizada' : 'añadida'} con éxito`, 'success-message');
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error: ${error.message}`, 'error-message');
    }
}

// Función para mostrar notificaciones
function showNotification(message, className) {
    const notification = document.createElement('div');
    notification.className = `notification ${className}`;
    notification.textContent = message;
    
    // Añadir la notificación al principio de la vista actual
    if (currentView === 'list') {
        movieListSection.insertBefore(notification, movieListSection.firstChild);
    } else if (currentView === 'form') {
        movieFormSection.insertBefore(notification, movieFormSection.firstChild);
    } else if (currentView === 'detail') {
        movieDetailSection.insertBefore(notification, movieDetailSection.firstChild);
    }
    
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar la aplicación
function initApp() {
    showView('list');
}

// Iniciar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', initApp);