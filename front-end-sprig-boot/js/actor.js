// URL base para la API
const API_URL = 'http://localhost:8081/api';

// Referencias a elementos del DOM
const actorForm = document.getElementById('actor-form');
const actorsList = document.getElementById('actors-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const loadSampleDataBtn = document.getElementById('load-sample-data');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search');
const actorsCount = document.getElementById('actors-count');
const toastSuccess = document.getElementById('toast-success');
const toastSuccessMessage = document.getElementById('toast-success-message');
const toastError = document.getElementById('toast-error');
const toastErrorMessage = document.getElementById('toast-error-message');

// Variables para el estado de la aplicación
let isEditing = false;
let actorIdToEdit = null;
let allActors = []; // Almacena todos los actores para búsqueda
let currentSearchTerm = ''; // Término de búsqueda actual

// Cargar todos los actores al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadActors();
    
    // Evento para buscar cuando se presiona Enter en el campo de búsqueda
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchActors();
        }
    });
});

// Event listeners
actorForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
loadSampleDataBtn.addEventListener('click', loadSampleData);
searchBtn.addEventListener('click', searchActors);
clearSearchBtn.addEventListener('click', clearSearch);

// Funciones
function showLoader() {
    loader.style.display = 'flex';
}

function hideLoader() {
    loader.style.display = 'none';
}

// Mostrar notificación toast
function showToast(type, message) {
    const toast = type === 'success' ? toastSuccess : toastError;
    const messageElement = type === 'success' ? toastSuccessMessage : toastErrorMessage;
    
    // Actualizamos el mensaje
    messageElement.textContent = message;
    
    // Mostramos el toast
    toast.classList.add('show');
    
    // Ocultamos después de 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function hideToast(id) {
    document.getElementById(id).classList.remove('show');
}

function loadActors() {
    showLoader();
    fetch(`${API_URL}/getAllActors`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar actores');
            }
            return response.json();
        })
        .then(actors => {
            allActors = actors; // Guardamos todos los actores
            renderActors(actors);
            updateActorCount(actors.length);
            hideLoader();
        })
        .catch(error => {
            console.error('Error al cargar actores:', error);
            actorsList.innerHTML = '<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Error al cargar los actores. Por favor, intenta de nuevo.</p>';
            hideLoader();
            showToast('error', 'Error al cargar los actores. Por favor, intenta de nuevo.');
        });
}

function renderActors(actors) {
    if (actors.length === 0) {
        actorsList.innerHTML = '<p class="empty-message">No hay actores registrados.</p>';
        return;
    }
    
    let html = '<div class="actor-grid">';
    actors.forEach(actor => {
        html += `
            <div class="actor-item">
                <h3>${actor.firstName} ${actor.lastName}</h3>
                <p><i class="fas fa-map-marker-alt"></i> País: ${actor.country || 'No especificado'}</p>
                <div class="actor-actions">
                    <button class="btn-edit" onclick="editActor(${actor.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="deleteActor(${actor.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    actorsList.innerHTML = html;
}

function updateActorCount(count) {
    actorsCount.textContent = `${count} actor${count !== 1 ? 'es' : ''} encontrado${count !== 1 ? 's' : ''}`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const actorData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        country: document.getElementById('country').value.trim()
    };
    
    // Validación simple
    if (!actorData.firstName || !actorData.lastName) {
        showToast('error', 'Por favor, completa los campos requeridos');
        return;
    }
    
    if (isEditing) {
        updateActor(actorIdToEdit, actorData);
    } else {
        createActor(actorData);
    }
}

function createActor(actorData) {
    showLoader();
    fetch(`${API_URL}/addActor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear actor');
        }
        return response.json();
    })
    .then(() => {
        resetForm();
        loadActors();
        showToast('success', `Actor ${actorData.firstName} ${actorData.lastName} creado correctamente`);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Error al crear el actor. Por favor, intenta de nuevo.');
        hideLoader();
    });
}

function updateActor(id, actorData) {
    showLoader();
    fetch(`${API_URL}/updateActor/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar actor');
        }
        return response.json();
    })
    .then(() => {
        resetForm();
        loadActors();
        showToast('success', `Actor ${actorData.firstName} ${actorData.lastName} actualizado correctamente`);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Error al actualizar el actor. Por favor, intenta de nuevo.');
        hideLoader();
    });
}

function deleteActor(id) {
    // Encontrar el actor para mostrar su nombre en la confirmación
    const actor = allActors.find(a => a.id === id);
    const actorName = actor ? `${actor.firstName} ${actor.lastName}` : 'este actor';
    
    if (confirm(`¿Estás seguro de que deseas eliminar a ${actorName}?`)) {
        showLoader();
        fetch(`${API_URL}/deleteActor/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar actor');
            }
            loadActors();
            showToast('success', `Actor ${actorName} eliminado correctamente`);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Error al eliminar el actor. Por favor, intenta de nuevo.');
            hideLoader();
        });
    }
}

// Función para editar un actor
function editActor(id) {
    showLoader();
    fetch(`${API_URL}/getActorById/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener actor');
            }
            return response.json();
        })
        .then(actor => {
            // Llenar el formulario con los datos del actor
            document.getElementById('firstName').value = actor.firstName;
            document.getElementById('lastName').value = actor.lastName;
            document.getElementById('country').value = actor.country || '';
            
            // Cambiar el estado de la aplicación a modo edición
            isEditing = true;
            actorIdToEdit = actor.id;
            
            // Actualizar la interfaz para reflejar el modo de edición
            formTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Actor';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
            cancelBtn.style.display = 'inline-block';
            
            // Hacer scroll hacia el formulario para mejor UX
            actorForm.scrollIntoView({ behavior: 'smooth' });
            
            hideLoader();
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('error', 'Error al cargar el actor para editar. Por favor, intenta de nuevo.');
            hideLoader();
        });
}

function resetForm() {
    actorForm.reset();
    isEditing = false;
    actorIdToEdit = null;
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Actor';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    cancelBtn.style.display = 'none';
}

function loadSampleData() {
    showLoader();
    fetch(`${API_URL}/CreateActor`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar datos de ejemplo');
            }
            return response;
        })
        .then(() => {
            loadActors();
            showToast('success', 'Datos de ejemplo cargados correctamente');
        })
        .catch(error => {
            console.error('Error al cargar datos de ejemplo:', error);
            showToast('error', 'Error al cargar datos de ejemplo. Por favor, intenta de nuevo.');
            hideLoader();
        });
}

// Función para buscar actores
function searchActors() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        // Si la búsqueda está vacía y ya estamos mostrando todos los actores, no hacemos nada
        if (!currentSearchTerm) return;
        
        // Si había una búsqueda anterior, la limpiamos
        clearSearch();
        return;
    }
    
    // Guardamos el término de búsqueda actual
    currentSearchTerm = searchTerm;
    
    // Obtenemos el filtro seleccionado
    const filterType = document.querySelector('input[name="search-filter"]:checked').value;
    
    // Filtramos los actores según el término de búsqueda y el filtro
    let filteredActors;
    
    if (filterType === 'name') {
        // Buscar solo por nombre
        filteredActors = allActors.filter(actor => 
            `${actor.firstName} ${actor.lastName}`.toLowerCase().includes(searchTerm)
        );
    } else if (filterType === 'country') {
        // Buscar solo por país
        filteredActors = allActors.filter(actor => 
            actor.country && actor.country.toLowerCase().includes(searchTerm)
        );
    } else {
        // Buscar en todos los campos (default)
        filteredActors = allActors.filter(actor => 
            `${actor.firstName} ${actor.lastName}`.toLowerCase().includes(searchTerm) ||
            (actor.country && actor.country.toLowerCase().includes(searchTerm))
        );
    }
    
    // Actualizamos la UI
    renderActors(filteredActors);
    updateActorCount(filteredActors.length);
    
    // Mostramos el botón para limpiar la búsqueda
    clearSearchBtn.style.display = 'inline-block';
    
    // Mensaje según los resultados
    if (filteredActors.length === 0) {
        showToast('info', `No se encontraron actores que coincidan con "${searchTerm}"`);
    } else {
        showToast('success', `Se encontraron ${filteredActors.length} actor(es) para "${searchTerm}"`);
    }
}

// Función para limpiar la búsqueda
function clearSearch() {
    searchInput.value = '';
    currentSearchTerm = '';
    clearSearchBtn.style.display = 'none';
    
    // Mostrar todos los actores de nuevo
    renderActors(allActors);
    updateActorCount(allActors.length);
}

// Exportamos las funciones que necesitan ser accesibles globalmente
window.editActor = editActor;
window.deleteActor = deleteActor;
window.hideToast = hideToast;