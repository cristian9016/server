const hbs = require('hbs');
const fs = require('fs');

hbs.registerHelper('obtenerCursos',()=>{
    let cursos = [];
    try{
        cursos = require('./cursos.json');
    }catch(err){
        // let text = '[]';
        // fs.writeFile('cursos.json',text,(err)=>{
        //     if(err) console.log('error creando archivo');
        //     console.log('archivo creado correctamente');
        // })
        return 'No hay cursos disponibles';

    }
    let text = '<table border=1><thead><th>NOMBRE</th><th>DESCRIPCION</th><th>VALOR</th><th>INTENSIDAD</th><th>MODALIDAD</th><th>DETALLES</th></thead><tbody>';
    cursos.forEach(curso => {
        text = text + '<tr><td>'+curso.nombre+'</td><td>'+curso.descripcion+'</td><td>'+curso.valor+'</td><td>'+(curso.intensidad?curso.intensidad:"N/A")+'</td><td>'+(curso.modalidad?curso.modalidad:"N/A")+'</td><td><form action="detalle" method="GET"><input type="hidden" name="id" value="'+curso.id+'"><button>VER</button></form></td><tr>';
    });
    text = text + '</tbody></table>';
    return text;
});