       // Script para establecer la fecha actual
       document.addEventListener('DOMContentLoaded', function() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            currentDateElement.textContent = today.toLocaleDateString('es-ES', options);
        }
    }); 

      // URL base de la API
      const API_BASE_URL = 'http://localhost:8081/api';
        
      // Función para establecer la fecha actual
      function setCurrentDate() {
          const currentDateElement = document.getElementById('current-date');
          if (currentDateElement) {
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const today = new Date();
              currentDateElement.textContent = today.toLocaleDateString('es-ES', options);
          }
      }
      
      // Función para hacer peticiones a la API de manera segura
      async function fetchAPI(endpoint) {
          try {
              const response = await fetch(`${API_BASE_URL}/${endpoint}`);
              
              if (!response.ok) {
                  throw new Error(`Error en la petición: ${response.status}`);
              }
              
              // Primero intentamos obtener el texto
              const responseText = await response.text();
              
              // Si no hay contenido, devolvemos un array vacío
              if (!responseText.trim()) {
                  return [];
              }
              
              try {
                  // Intentamos parsear el JSON
                  return JSON.parse(responseText);
              } catch (parseError) {
                  console.error('Error al parsear JSON:', parseError, 'Texto recibido:', responseText);
                  return [];
              }
          } catch (error) {
              console.error(`Error al obtener ${endpoint}:`, error);
              return [];
          }
      }
      
      // Función para cargar y mostrar la cantidad de registros
      async function loadStats() {
          // Definir los endpoints y sus elementos correspondientes
          const stats = [
              { endpoint: 'getAllAdmins', element: 'admin-count' },
              { endpoint: 'getAllMovies', element: 'movie-count' },
              { endpoint: 'getAllActors', element: 'actor-count' },
              { endpoint: 'getAllGenres', element: 'genre-count' },
              { endpoint: 'getAllActorMovies', element: 'actormovie-count' }
          ];
          
          // Cargar cada estadística
          for (const stat of stats) {
              try {
                  const data = await fetchAPI(stat.endpoint);
                  const countElement = document.getElementById(stat.element);
                  
                  if (countElement) {
                      // Si tenemos datos válidos, mostramos la cantidad
                      if (Array.isArray(data)) {
                          countElement.textContent = data.length;
                      } else {
                          countElement.textContent = '?';
                      }
                  }
              } catch (error) {
                  console.error(`Error al cargar estadística ${stat.endpoint}:`, error);
                  const countElement = document.getElementById(stat.element);
                  if (countElement) {
                      countElement.textContent = '!';
                  }
              }
          }
      }
      
      // Inicializar la aplicación cuando se carga la página
      document.addEventListener('DOMContentLoaded', function() {
          // Establecer la fecha actual
          setCurrentDate();
          
          // Cargar estadísticas
          loadStats();
          
          // Hacer que las tarjetas sean clicables (ya está en el HTML con onclick)
          // Esto es una opción alternativa si prefieres hacerlo con JavaScript
          /*
          document.getElementById('admin-card').addEventListener('click', function() {
              window.location.href = 'admin.html';
          });
          
          document.getElementById('movie-card').addEventListener('click', function() {
              window.location.href = 'movie.html';
          });
          
          document.getElementById('actor-card').addEventListener('click', function() {
              window.location.href = 'actor.html';
          });
          
          document.getElementById('genre-card').addEventListener('click', function() {
              window.location.href = 'genre.html';
          });
          
          document.getElementById('actormovie-card').addEventListener('click', function() {
              window.location.href = 'actor-movie.html';
          });
          */
      });