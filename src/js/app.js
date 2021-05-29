let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalata el div actual segun el tab al que se presiona
    mostrarSeccion();

    // Oculta o muestra una seccion sergun al tab en que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior

    paginaSiguiente();

    paginaAnterior();

    // Comprueba página actual para ocultar o mostrar la paginaciíon
    botonesPaginador();

    // Muestra el resumen de la cita o el mensaje de error en caso de no completar el formulario
    mostrarResumen();

    // Almacena el nombre de la cita en objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    //Deshabilita dias anteriores
    deshabilitarFechaAnterior();

    // Almacenar la hora de cita en el objeto
    horaCita();
}

function mostrarSeccion() {
    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    // Eliminar la clase de actual en el tab anterior

    const tabAnterior = document.querySelector('.tabss .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    // Resalta el tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}


function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabss button')

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })

}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {
            servicios
        } = db;

        // Generar el HTML
        servicios.forEach(servicio => {
            const {
                id,
                nombre,
                precio
            } = servicio;
            // Dom Scripting
            // Generar el nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar el precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');


            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita 
            servicioDiv.onclick = seleccionarServicio // No se le pone el add event listener porque el addevent solo sirve sobre contenido creado , en cambio la el one hanlder xd(sin el adevenlist) es cunado vayas a crear contenido


            // Inyectar precio y nombre al div de Servicio, para agregar contenido siempre usar la función AppenChild
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectar en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);


        })

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;
    // Forzar que el elemento al que le damos click sea un div
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement
    } else {
        elemento = e.target;
    }

    // Verificar si tiene la clase selccionado
    if (elemento.classList.contains('seleccionado')) { // Dato de vital importancia para el desarrollo de mi vida xd: El contains sirve para verificar clases
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent, // Para seleccion el primer hijo, osea el primer elemento en este caso es el parrafo
            precio: elemento.firstElementChild.nextElementSibling.textContent // Aqui puse second element Child con esperanza pero no existe xd, porque si tubieramos 1000 elementos imaginate como seria p manin xd, para eso usamos next Element sibling
        }

        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const {
        servicios
    } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); // Como que filtra por el id para poder eliminarlo, lo va a filtrar y va a traer los que sean diferentes al id que le haya dado click 
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const {
        servicios
    } = cita;
    cita.servicios = [...servicios, servicioObj]; // Los ... son una forma de copiar el objeto, y luego le agregamos el nuevo arreglo con ServiciosObj
    console.log(cita);
}


function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();

    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    // Logica del paginador
    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar')
        mostrarResumen(); // Estamos en la pagina 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la seccion en la que se muestra por la página

}

function mostrarResumen() {
    // Destructuring
    const {
        nombre,
        fecha,
        hora,
        servicios
    } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen')

    //Limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    // Validación de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen el Div, inyectar con el appenchild
        resumenDiv.appendChild(noServicios);

        return; //En caso de que se ejecute el if ya no se ejectuta el siguiente codigo
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`; // innerHTML trata a las etiquetas de HTML como son, en cambio textContent todo lo pone como texto, por eso en este caso usamos el InnerHTML

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0


    // Iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        //console.log(parseInt (totalServicio[1].trim() ));

        cantidad += parseInt (totalServicio[1].trim());

        // Inyectar texto y precio en el Div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;
    
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); // Trim es para eliminar espacios en blanco

        // Validación de que nombreTexto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto; // Aquí lo estamos agregando a cita

        }
    })
}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta, previa entonces no hago otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //console.log(alerta)

    // Inyectar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 2300);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {


        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) { // Por si no atendemos ciertos dias
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Los domingos no atendemos.Gracias por si comprensión', 'error')
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }
        // const opciones = {    // Para mostrarlo en diferentes formatos
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }
        //console.log(dia.toLocaleDateString('es-ES', opciones)); // Usamos esto para elegir el idioma
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    // Formato deseado: AAAA-MM-DD

    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':') // Split divide a la hora de los minutos

        if (hora[0] < 9 || hora[0] > 21) {
            mostrarAlerta('A esa hora no atendemos. Gracias por su comprensión', 'error')
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita; // Lo agregamos a la variable global
            console.log(cita);
        }
    })
}