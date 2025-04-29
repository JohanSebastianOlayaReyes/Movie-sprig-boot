  // URL base de la API
  const API_BASE_URL = 'http://localhost:8081/api';

  // Elementos del DOM
  const relationListSection = document.getElementById('relationList');
  const relationDetailSection = document.getElementById('relationDetail');
  const relationFormSection = document.getElementById('relationForm');
  const relationGrid = document.getElementById('relationGrid');
  const detailContent = document.getElementById('detailContent');
  const addRelationForm = document.getElementById('addRelationForm');
  const formTitle = document.getElementById('formTitle');
  const relationIdInput = document.getElementById('relationId');
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
  let relations = [];
  let isEditMode = false;

  // Manejadores de eventos para la navegación
  btnShowList.addEventListener('click', () => showView('list'));
  btnShowForm.addEventListener('click', () => {
      isEditMode = false;
      formTitle.textContent = 'Añadir Nueva Relación';
      showView('form');
  });
  btnBackToList.addEventListener('click', () => showView('list'));
  btnCancelForm.addEventListener('click', () => showView('list'));

  // Manejador para la búsqueda
  btnSearch.addEventListener('click', handleSearch);

  // Manejador para el formulario
  addRelationForm.addEventListener('submit', handleFormSubmit);

  // Función para mostrar la vista seleccionada
  function showView(view) {
      currentView = view;
      
      // Ocultar todas las secciones
      relationListSection.classList.add('hidden');
      relationDetailSection.classList.add('hidden');
      relationFormSection.classList.add('hidden');
      
      // Mostrar la sección seleccionada
      switch (view) {
          case 'list':
              relationListSection.classList.remove('hidden');
              fetchRelations(); // Cargar relaciones al mostrar la lista
              btnShowList.classList.add('active');
              btnShowForm.classList.remove('active');
              break;
          case 'detail':
              relationDetailSection.classList.remove('hidden');
              btnShowList.classList.add('active');
              btnShowForm.classList.remove('active');
              break;
          case 'form':
              relationFormSection.classList.remove('hidden');
              btnShowList.classList.remove('active');
              btnShowForm.classList.add('active');
              if (!isEditMode) {
                  addRelationForm.reset(); // Limpiar el formulario solo si no estamos en modo edición
                  relationIdInput.value = '';
              }
              break;
      }
  }

  // Función para cargar todas las relaciones Actor-Movie
  async function fetchRelations() {
      try {
          // Mostrar estado de carga
          relationGrid.innerHTML = '<div class="loading">Cargando relaciones...</div>';
          
          const response = await fetch(`${API_BASE_URL}/getAllActorMovies`);
          
          if (!response.ok) {
              throw new Error('Error al cargar relaciones');
          }
          
          // Primero obtener el texto de la respuesta para depuración
          const responseText = await response.text();
          console.log('Respuesta del servidor:', responseText);
          
          try {
              // Intentar parsear el texto como JSON
              relations = JSON.parse(responseText);
          } catch (parseError) {
              console.error('Error al parsear JSON:', parseError);
              throw new Error(`Error al procesar datos: ${parseError.message}`);
          }
          
          if (!Array.isArray(relations)) {
              console.error('La respuesta no es un array:', relations);
              throw new Error('Formato de respuesta incorrecto: se esperaba un array');
          }
          
          if (relations.length === 0) {
              relationGrid.innerHTML = '<div class="loading">No hay relaciones disponibles</div>';
              return;
          }
          
          // Renderizar las relaciones
          renderRelations(relations);
      } catch (error) {
          console.error('Error:', error);
          relationGrid.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      }
  }

  // Función para renderizar la lista de relaciones
  function renderRelations(relations) {
      relationGrid.innerHTML = '';
      
      relations.forEach(relation => {
          // Verificar que la relación tiene la estructura esperada
          console.log('Procesando relación:', relation);
          
          // Extraer los datos de forma segura con comprobaciones
          const id = relation.id || 'Sin ID';
          const papel = relation.papel || 'Sin papel';
          
          // Extraer información del actor de forma segura
          let actorName = 'N/A';
          let actorId = 'N/A';
          if (relation.actor) {
              actorId = relation.actor.id || 'N/A';
              actorName = relation.actor.name || 'Sin nombre';
          }
          
          // Extraer información de la película de forma segura
          let movieTitle = 'N/A';
          let movieId = 'N/A';
          if (relation.movie) {
              movieId = relation.movie.id || 'N/A';
              movieTitle = relation.movie.title || 'Sin título';
          }
          
          const relationCard = document.createElement('div');
          relationCard.className = 'relation-card';
          relationCard.innerHTML = `
              <h3>Papel: ${papel}</h3>
              <p><strong>ID:</strong> ${id}</p>
              <p><strong>Actor:</strong> ${actorName} (ID: ${actorId})</p>
              <p><strong>Película:</strong> ${movieTitle} (ID: ${movieId})</p>
              <div class="action-icons">
                  <button class="icon-button edit" title="Editar relación">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="icon-button delete" title="Eliminar relación">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </div>
          `;
          
          // Añadir evento click para ver detalles (en el cuerpo de la tarjeta)
          relationCard.addEventListener('click', (e) => {
              // Verificar que no se hizo clic en los iconos de acción
              if (!e.target.closest('.action-icons')) {
                  showRelationDetails(id);
              }
          });
          
          // Añadir eventos para los botones de acción
          const editButton = relationCard.querySelector('.edit');
          const deleteButton = relationCard.querySelector('.delete');
          
          // Evento para editar
          editButton.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevenir que se active el evento click de la tarjeta
              handleEditRelation(relation);
          });
          
          // Evento para eliminar
          deleteButton.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevenir que se active el evento click de la tarjeta
              handleDeleteRelation(id);
          });
          
          relationGrid.appendChild(relationCard);
      });
  }

  // Función para mostrar detalles de una relación
  async function showRelationDetails(id) {
      try {
          // Mostrar estado de carga
          detailContent.innerHTML = '<div class="loading">Cargando detalles...</div>';
          showView('detail');
          
          const response = await fetch(`${API_BASE_URL}/getActorMovieById/${id}`);
          
          if (!response.ok) {
              throw new Error('Error al cargar los detalles de la relación');
          }
          
          // Primero obtener el texto de la respuesta para depuración
          const responseText = await response.text();
          console.log('Respuesta del servidor (detalles):', responseText);
          
          let relation;
          try {
              // Intentar parsear el texto como JSON
              relation = JSON.parse(responseText);
          } catch (parseError) {
              console.error('Error al parsear JSON de detalles:', parseError);
              throw new Error(`Error al procesar datos de detalles: ${parseError.message}`);
          }
          
          console.log('Datos de la relación:', relation);
          
          // Extraer los datos de forma segura
          const papel = relation.papel || 'Sin papel';
          const relationId = relation.id || 'Sin ID';
          
          // Extraer información del actor de forma segura
          let actorName = 'N/A';
          let actorId = 'N/A';
          if (relation.actor) {
              actorId = relation.actor.id || 'N/A';
              actorName = relation.actor.name || 'Sin nombre';
          }
          
          // Extraer información de la película de forma segura
          let movieTitle = 'N/A';
          let movieId = 'N/A';
          if (relation.movie) {
              movieId = relation.movie.id || 'N/A';
              movieTitle = relation.movie.title || 'Sin título';
          }
          
          // Renderizar los detalles
          detailContent.innerHTML = `
              <h3>Papel: ${papel}</h3>
              <p><strong>ID:</strong> ${relationId}</p>
              <p><strong>Actor:</strong> ${actorName} (ID: ${actorId})</p>
              <p><strong>Película:</strong> ${movieTitle} (ID: ${movieId})</p>
          `;
      } catch (error) {
          console.error('Error:', error);
          detailContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      }
  }

  // Función para manejar la edición de una relación
  function handleEditRelation(relation) {
      // Cambiar a modo edición
      isEditMode = true;
      
      // Actualizar el título del formulario
      formTitle.textContent = 'Editar Relación';
      
      // Rellenar el formulario con los datos de la relación de forma segura
      relationIdInput.value = relation.id || '';
      
      // Extraer ID del actor de forma segura
      let actorId = '';
      if (relation.actor && relation.actor.id) {
          actorId = relation.actor.id;
      }
      document.getElementById('actorId').value = actorId;
      
      // Extraer ID de la película de forma segura
      let movieId = '';
      if (relation.movie && relation.movie.id) {
          movieId = relation.movie.id;
      }
      document.getElementById('movieId').value = movieId;
      
      // Extraer papel de forma segura
      document.getElementById('papel').value = relation.papel || '';
      
      // Mostrar el formulario
      showView('form');
  }

  // Función para manejar la eliminación de una relación
  async function handleDeleteRelation(id) {
      if (!confirm('¿Estás seguro de que deseas eliminar esta relación?')) {
          return;
      }
      
      try {
          const response = await fetch(`${API_BASE_URL}/deleteActorMovie/${id}`, {
              method: 'DELETE'
          });
          
          if (!response.ok) {
              throw new Error('Error al eliminar la relación');
          }
          
          // Mostrar mensaje de éxito
          showNotification('Relación eliminada con éxito', 'success-message');
          
          // Actualizar la lista de relaciones
          fetchRelations();
      } catch (error) {
          console.error('Error:', error);
          showNotification(`Error: ${error.message}`, 'error-message');
      }
  }

  // Función para manejar la búsqueda de relaciones por ID
  async function handleSearch() {
      const searchId = searchInput.value.trim();
      
      if (!searchId) {
          alert('Por favor, introduce un ID válido para buscar');
          return;
      }
      
      try {
          const response = await fetch(`${API_BASE_URL}/getActorMovieById/${searchId}`);
          
          if (!response.ok) {
              throw new Error('No se encontró ninguna relación con ese ID');
          }
          
          const relation = await response.json();
          
          // Mostrar los detalles de la relación encontrada
          showRelationDetails(relation.id);
      } catch (error) {
          console.error('Error:', error);
          showNotification(`Error: ${error.message}`, 'error-message');
      }
  }

  // Función para manejar el envío del formulario
  async function handleFormSubmit(event) {
      event.preventDefault();
      
      const actorId = document.getElementById('actorId').value.trim();
      const movieId = document.getElementById('movieId').value.trim();
      const papel = document.getElementById('papel').value.trim();
      
      // Validación básica
      if (!actorId || !movieId || !papel) {
          showNotification('Por favor, complete todos los campos', 'error-message');
          return;
      }
      
      const formData = {
          actor: { id: actorId },
          movie: { id: movieId },
          papel: papel
      };
      
      // Si estamos en modo edición, incluir el ID
      const relationId = relationIdInput.value;
      let url, method;
      
      if (isEditMode && relationId) {
          url = `${API_BASE_URL}/updateActorMovie/${relationId}`;
          method = 'PUT';
          formData.id = relationId; // Incluir el ID en el cuerpo para actualización
      } else {
          url = `${API_BASE_URL}/addActorMovie`;
          method = 'POST';
      }
      
      // Mostrar los datos que se enviarán para depuración
      console.log('Enviando datos:', JSON.stringify(formData));
      console.log('URL:', url);
      console.log('Método:', method);
      
      try {
          const response = await fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          
          // Obtener respuesta en texto para depuración
          const responseText = await response.text();
          console.log('Respuesta del servidor (formulario):', responseText);
          
          if (!response.ok) {
              throw new Error(`Error al ${isEditMode ? 'actualizar' : 'añadir'} la relación. Servidor respondió: ${response.status}`);
          }
          
          // Mostrar la lista actualizada
          showView('list');
          
          // Limpiar el formulario
          addRelationForm.reset();
          relationIdInput.value = '';
          
          // Restablecer el modo
          isEditMode = false;
          
          // Mostrar mensaje de éxito
          const actionText = isEditMode ? 'actualizada' : 'añadida';
          showNotification(`Relación ${actionText} con éxito`, 'success-message');
          
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
          relationListSection.insertBefore(notification, relationListSection.firstChild);
      } else if (currentView === 'form') {
          relationFormSection.insertBefore(notification, relationFormSection.firstChild);
      } else if (currentView === 'detail') {
          relationDetailSection.insertBefore(notification, relationDetailSection.firstChild);
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