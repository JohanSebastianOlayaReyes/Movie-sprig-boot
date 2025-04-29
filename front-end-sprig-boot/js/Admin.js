const API_BASE_URL = 'http://localhost:8081';
        
// DOM Elements
const menuItems = document.querySelectorAll('.menu-item[data-section]');
const sections = document.querySelectorAll('[id$="-content"]');
const currentDateEl = document.getElementById('current-date');
const adminCountEl = document.getElementById('admin-count');
const recentAdminsList = document.getElementById('recent-admins');
const adminList = document.getElementById('admin-list');

// Modal Elements
const adminModal = document.getElementById('admin-modal');
const closeModal = document.querySelector('.close-modal');
const adminForm = document.getElementById('admin-form');
const adminIdInput = document.getElementById('admin-id');
const adminNameInput = document.getElementById('admin-name');
const adminPasswordInput = document.getElementById('admin-password');
const adminEmailInput = document.getElementById('admin-email');
const adminPhoneInput = document.getElementById('admin-phone');
const addAdminBtn = document.getElementById('add-admin-btn');
const cancelAdminBtn = document.getElementById('cancel-admin');
const modalTitle = document.getElementById('modal-title');

// Elementos de Búsqueda
const adminSearch = document.getElementById('admin-search');
const searchButton = document.getElementById('search-admin-btn');
const searchResults = document.getElementById('search-results');
const sectionAdminSearch = document.getElementById('admin-section-search');
const sectionSearchButton = document.getElementById('section-search-admin-btn');
const sectionSearchResults = document.getElementById('section-search-results');

// Set current date
const setCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('es-ES', options);
};

// Navigation
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all menu items
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to the clicked menu item
        item.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the selected section
        const sectionId = `${item.dataset.section}-content`;
        document.getElementById(sectionId).style.display = 'block';
        
        // Load data for the section if needed
        if (item.dataset.section === 'admin') {
            loadAdmins();
        }
        
        // Ocultar los resultados de búsqueda al cambiar de sección
        if (searchResults) searchResults.classList.remove('show');
        if (sectionSearchResults) sectionSearchResults.classList.remove('show');
    });
});

// Fetch all admins
const loadAdmins = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/getAllAdmins`);
        if (!response.ok) {
            throw new Error('Error al cargar administradores');
        }
        
        const admins = await response.json();
        renderAdmins(admins);
        renderRecentAdmins(admins.slice(0, 5)); // Show only the 5 most recent
        adminCountEl.textContent = admins.length;
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar los administradores');
    }
};

// Render admins in the admin table
const renderAdmins = (admins) => {
    adminList.innerHTML = '';
    
    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone}</td>
            <td class="admin-actions">
                <button class="btn-edit" data-id="${admin.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" data-id="${admin.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        adminList.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editAdmin(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteAdmin(btn.dataset.id));
    });
};

// Render recent admins in the dashboard
const renderRecentAdmins = (admins) => {
    recentAdminsList.innerHTML = '';
    
    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone}</td>
            <td class="admin-actions">
                <button class="btn-view" data-id="${admin.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        recentAdminsList.appendChild(row);
    });
    
    // Add event listeners for view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            // Switch to admin section and highlight the admin
            document.querySelector('.menu-item[data-section="admin"]').click();
            // Could implement highlighting the specific admin
        });
    });
};

// Add a new admin
const addAdmin = () => {
    modalTitle.textContent = 'Añadir Administrador';
    adminIdInput.value = '';
    adminForm.reset();
    adminModal.style.display = 'flex';
    adminPasswordInput.disabled = false;
    adminPasswordInput.required = true;
};

// Edit an admin
const editAdmin = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/getAdminById/${id}`);
        if (!response.ok) {
            throw new Error('Error al cargar el administrador');
        }
        
        const admin = await response.json();
        
        modalTitle.textContent = 'Editar Administrador';
        adminIdInput.value = admin.id;
        adminNameInput.value = admin.name;
        // Don't set the password field for security
        adminPasswordInput.value = '';
        adminPasswordInput.disabled = true;
        adminPasswordInput.required = false;
        adminEmailInput.value = admin.email;
        adminPhoneInput.value = admin.phone;
        
        adminModal.style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar el administrador');
    }
};

// Delete an admin
const deleteAdmin = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/deleteAdmin/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar el administrador');
            }
            
            // Reload admin list
            loadAdmins();
            
            alert('Administrador eliminado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al eliminar el administrador');
        }
    }
};

// Save admin (create or update)
const saveAdmin = async (e) => {
    e.preventDefault();
    
    const admin = {
        name: adminNameInput.value,
        email: adminEmailInput.value,
        phone: adminPhoneInput.value
    };
    
    // Add password only when creating a new admin
    if (!adminIdInput.value) {
        admin.password = adminPasswordInput.value;
    }
    
    try {
        let url, method;
        
        if (adminIdInput.value) {
            // Update existing admin
            url = `${API_BASE_URL}/api/updateAdmin/${adminIdInput.value}`;
            method = 'PUT';
        } else {
            // Create new admin
            url = `${API_BASE_URL}/api/addAdmin`;
            method = 'POST';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(admin)
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar el administrador');
        }
        
        // Close modal and reload admin list
        adminModal.style.display = 'none';
        loadAdmins();
        
        alert(adminIdInput.value ? 'Administrador actualizado correctamente' : 'Administrador creado correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al guardar el administrador');
    }
};

// Funciones para la búsqueda de administradores
// Función para buscar administradores por ID o nombre
const searchAdmins = async (query, resultContainer) => {
    try {
        // Limpiar resultados anteriores
        resultContainer.innerHTML = '<div class="searching">Buscando...</div>';
        resultContainer.classList.add('show');
        
        // Obtener todos los administradores
        const response = await fetch(`${API_BASE_URL}/api/getAllAdmins`);
        
        if (!response.ok) {
            throw new Error('Error al obtener administradores');
        }
        
        const allAdmins = await response.json();
        let foundAdmins = [];
        
        // Primero intentamos buscar por ID (asumiendo que el query es un número)
        if (!isNaN(query) && query.trim() !== '') {
            const adminById = allAdmins.find(admin => admin.id == query);
            if (adminById) {
                foundAdmins = [adminById];
            }
        }
        
        // Si no se encontró por ID o no es un número, buscamos por nombre
        if (foundAdmins.length === 0) {
            foundAdmins = allAdmins.filter(admin => 
                admin.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        displaySearchResults(foundAdmins, resultContainer);
        
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        resultContainer.innerHTML = `
            <div class="no-results">Error al realizar la búsqueda: ${error.message}</div>
        `;
    }
};

// Función para mostrar resultados de búsqueda
const displaySearchResults = (admins, resultContainer) => {
    if (admins.length === 0) {
        resultContainer.innerHTML = `
            <div class="no-results">No se encontraron administradores con ese criterio</div>
        `;
    } else {
        let resultsHTML = '';
        admins.forEach(admin => {
            resultsHTML += `
                <div class="search-result-item" data-id="${admin.id}">
                    <strong>${admin.name}</strong> (ID: ${admin.id})
                    <div>Email: ${admin.email}</div>
                    <div>Teléfono: ${admin.phone || 'N/A'}</div>
                </div>
            `;
        });
        
        resultContainer.innerHTML = resultsHTML;
        
        // Añadir evento click a los resultados
        resultContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const adminId = this.getAttribute('data-id');
                showAdminDetails(adminId);
                resultContainer.classList.remove('show'); // Ocultar resultados al seleccionar
            });
        });
    }
};

// Función para mostrar detalles de un administrador
const showAdminDetails = (adminId) => {
    // Cambiar a la sección de administradores
    document.querySelector('.menu-item[data-section="admin"]').click();
    
    // Esperar un momento para que se cargue la tabla
    setTimeout(() => {
        // Buscar el administrador en la tabla y resaltarlo
        const adminRows = document.querySelectorAll('#admin-list tr');
        adminRows.forEach(row => {
            const idCell = row.querySelector('td:first-child');
            if (idCell && idCell.textContent === adminId) {
                // Quitar resaltado de las filas anteriores
                adminRows.forEach(r => r.classList.remove('highlighted-row'));
                
                // Resaltar la fila actual
                row.classList.add('highlighted-row');
                
                // Hacer scroll a la fila
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Opcional: abrir el modal de edición
                editAdmin(adminId);
            }
        });
    }, 300);
};

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    loadAdmins();
    
    // Inicializar eventos de búsqueda si existen los elementos
    if (searchButton && adminSearch && searchResults) {
        // Evento para el botón de búsqueda en el dashboard
        searchButton.addEventListener('click', () => {
            const query = adminSearch.value.trim();
            if (query !== '') {
                searchAdmins(query, searchResults);
            } else {
                searchResults.classList.remove('show');
            }
        });
        
        // Ejecutar búsqueda al presionar Enter
        adminSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
        
        // Limpiar resultados cuando se borra el campo
        adminSearch.addEventListener('input', function() {
            if (this.value.trim() === '') {
                searchResults.classList.remove('show');
            }
        });
    }
    
    // Inicializar eventos para la búsqueda en la sección de administradores
    if (sectionSearchButton && sectionAdminSearch && sectionSearchResults) {
        // Evento para el botón de búsqueda en la sección de administradores
        sectionSearchButton.addEventListener('click', () => {
            const query = sectionAdminSearch.value.trim();
            if (query !== '') {
                searchAdmins(query, sectionSearchResults);
            } else {
                sectionSearchResults.classList.remove('show');
            }
        });
        
        // Ejecutar búsqueda al presionar Enter
        sectionAdminSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sectionSearchButton.click();
            }
        });
        
        // Limpiar resultados cuando se borra el campo
        sectionAdminSearch.addEventListener('input', function() {
            if (this.value.trim() === '') {
                sectionSearchResults.classList.remove('show');
            }
        });
    }
    
    // Hacer que el botón "Ver todos" redirija a la sección de administradores
    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                document.querySelector(`.menu-item[data-section="${section}"]`).click();
            }
        });
    });
});

// Menu item click events are already set in the navigation section

// Add Admin button
addAdminBtn.addEventListener('click', addAdmin);

// Close modal
closeModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// Cancel button in modal
cancelAdminBtn.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// Click outside modal to close
window.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
    }
});

// Submit admin form
adminForm.addEventListener('submit', saveAdmin);

// Initialize functionality to create some admins when none exist
const initializeSampleData = async () => {
    try {
        // Create sample admins if none exist
        const response = await fetch(`${API_BASE_URL}/api/getAllAdmins`);
        if (!response.ok) {
            throw new Error('Error al cargar administradores');
        }
        
        const admins = await response.json();
        
        if (admins.length === 0) {
            // Call the create admins endpoint
            await fetch(`${API_BASE_URL}/api/CreateAdmins`);
            loadAdmins(); // Reload the admins list
        }
    } catch (error) {
        console.error('Error initializing sample data:', error);
    }
};

// Call the initialize function
initializeSampleData();