$(document).ready(function() {
    // Función para mostrar todos los clubes
    function mostrarClubes() {
        // Hacer una solicitud GET al servidor para obtener clubes
        $.ajax({
            url: 'http://localhost:3000/clubs', //Url personalizada
            type: 'GET',
            success: function(clubs) {
                const mostrarDiv = $('#mostrar'); // Seleccionar el div donde se mostrarán los clubes
                mostrarDiv.empty(); // Limpiar el div antes de mostrar nuevos datos

                // Verificar si hay clubes
                if (clubs.length > 0) {
                    // Crear una lista para mostrar los clubes
                    const lista = $('<ul></ul>'); // Crear un elemento de lista desordenada
                    clubs.forEach(club => {
                        // Crear un elemento de lista para cada club
                        const listItem = $('<li></li>').text(`${club.nombre} - ${club.email}`);
                        lista.append(listItem); // Añadir el elemento de lista a la lista
                    });
                    mostrarDiv.append(lista); // Añadir la lista al div
                } else {
                    mostrarDiv.text('No hay clubes disponibles.'); // Mensaje si no hay clubes
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener clubes:', error); // Mostrar error en consola
                alert('Error al obtener clubes'); // Mensaje de error para el usuario
            }
        });
    }

    // Llamar a la función para mostrar clubes al cargar la página
    mostrarClubes();

    // Funcionalidad para añadir un club
    $('#form-anadir').on('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        // Obtener los datos del formulario
        const formData = {
            nombre: $('#nombre').val(),
            calle: $('#calle').val(),
            numero: $('#numero').val(),
            ciudad: $('#ciudad').val(),
            codigoPostal: $('#codigo').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val(),
            fechaFundacion: $('#fecha').val(),
            deportes: $('#deportes').val(),
            imagen: $('#imagen').val()
        };

        // Obtener la lista actual de clubes para determinar el nuevo ID
        $.ajax({
            url: 'http://localhost:3000/clubs',
            type: 'GET',
            success: function(clubs) {
                // Calcular el nuevo ID basado en el máximo existente
                const newId = clubs.length > 0 ? Math.max(...clubs.map(club => club.id)) + 1 : 1;

                // Asignar el ID al nuevo club
                formData.id = newId;

                // Hacer la solicitud POST para añadir el club
                $.ajax({
                    url: 'http://localhost:3000/clubs',
                    type: 'POST',
                    contentType: 'application/json', // Indicar el tipo de contenido
                    data: JSON.stringify(formData), // Convertir los datos a formato JSON
                    success: function(response) {
                        console.log('Club añadido:', response); // Mostrar el club añadido en consola
                        alert('Club añadido exitosamente'); // Mensaje de éxito
                        mostrarClubes(); // Actualizar la lista de clubes
                    },
                    error: function(xhr, status, error) {
                        console.error('Error al añadir el club:', error); // Mostrar error en consola
                        alert('Error al añadir el club'); // Mensaje de error para el usuario
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener clubes:', error); // Mostrar error en consola
                alert('Error al obtener clubes'); // Mensaje de error para el usuario
            }
        });
    });

    // Funcionalidad para eliminar un club
    $('#form-eliminar').on('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const nombreEliminar = $('#nombre').val(); // Obtener el nombre del club a eliminar
        const emailEliminar = $('#email').val(); // Obtener el email del club a eliminar

        // Buscar el club primero
        $.ajax({
            url: 'http://localhost:3000/clubs?nombre=' + encodeURIComponent(nombreEliminar) + '&email=' + encodeURIComponent(emailEliminar),
            type: 'GET',
            success: function(clubs) {
                if (clubs.length === 1) {
                    // Si hay exactamente un club que coincide, eliminarlo
                    $.ajax({
                        url: 'http://localhost:3000/clubs/' + clubs[0].id,
                        type: 'DELETE',
                        success: function(response) {
                            alert('Club eliminado exitosamente'); // Mensaje de éxito
                            mostrarClubes(); // Actualizar la lista de clubes
                        },
                        error: function(xhr, status, error) {
                            console.error('Error al eliminar el club:', error); // Mostrar error en consola
                            alert('Error al eliminar el club'); // Mensaje de error para el usuario
                        }
                    });
                } else if (clubs.length === 0) {
                    alert('Club no encontrado'); // Mensaje si no se encuentra el club
                } else {
                    alert('Se encontraron múltiples clubes. Por favor, verifica los datos.'); // Mensaje si se encuentran múltiples clubes
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al buscar el club:', error); // Mostrar error en consola
                alert('Error al buscar el club'); // Mensaje de error para el usuario
            }
        });
    });
});
