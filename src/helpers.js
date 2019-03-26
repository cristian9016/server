const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('obtenerCursos', (coord) => {
    let cursos = [];
    try {
        cursos = require('./cursos.json');
    } catch (err) {
        // let text = '[]';
        // fs.writeFile('cursos.json',text,(err)=>{
        //     if(err) console.log('error creando archivo');
        //     console.log('archivo creado correctamente');
        // })
        return 'No hay cursos disponibles';

    }
    let text = '<table class="table col-6 table-dark" border=1><thead><th>NOMBRE</th><th>DESCRIPCION</th><th>VALOR</th><th>DETALLES</th></thead><tbody>';
    let disponibles = cursos.filter(cur => cur.estado == 'disponible');
    disponibles.forEach(curso => {
        text = text + '<tr><td>' + curso.nombre + '</td><td>' + curso.descripcion + '</td><td>' + curso.valor + '</td><td><form action="detalle" method="GET"><input type="hidden" name="id" value="' + curso.id + '"><input type="hidden" name="coord" value="' + coord + '"><button class="btn btn-info btn-block">VER</button></form></td><tr>';
    });
    text = text + '</tbody></table>';
    if (disponibles.length == 0) {
        return 'No hay cursos disponibles';
    } else {
        return text;
    }
});
 
hbs.registerHelper('ifCond', function (coord, options) {
    if (coord == 'true') {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('obtenerInscritos', (id) => {
    let cursos = [];
    cursos = require('./cursos.json');
    let curso = cursos.find(c=>c.id == id);
    let text = '<table class="table col-6 table-dark" border=1><thead><th>NOMBRE</th><th>IDENTIFICACION</th><th>CORREO</th><th>TELEFONO</th><th></th></thead><tbody>';
    curso.matriculados.forEach(est => {
        text = text + '<tr><td>' + est.nombre + '</td><td>' + est.identificacion + '</td><td>' + est.correo + '</td><td>'+est.telefono+'</td></form></td><td><form action="/eliminar-estudiante" method="POST">'+
        '<input type="hidden" name="identificacion" value="'+est.identificacion+'"><input type="hidden" name="id" value="'+id+'"><button class="btn btn-danger btn-block">Eliminar</button></form></td><tr>';
    });
    text = text + '</tbody></table>';
    if (curso.matriculados.length == 0) {
        return 'No hay estudiantes matriculados';
    } else {
        return text;
    }
});