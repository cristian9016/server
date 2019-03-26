const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 8080;
require('./helpers');
const dirNode_modules = path.join(__dirname , '../node_modules');

let cursos = [];

let partialsDirectory = path.join(__dirname, '../partials');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
hbs.registerPartials(partialsDirectory);


app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.get('/', (req, res) => {
    let msg = req.query.success ? 'Matriculado correctamente' : '';
    res.render('course-list', {
        coord: 'false',
        mensaje: msg
    });
});

app.get('/crear', (req, res) => {
    let error = req.query.error;
    if (error) {
        res.render('create-course', {
            mensaje: 'Ya existe un curso con ese id.'
        });
    } else {
        res.render('create-course', {
            mensaje: ''
        });
    }

});
 
app.post('/crear', (req, res) => {
    let curso = req.body;
    try {
        cursos = require('./cursos.json');
        let exist = cursos.find(cur => cur.id == curso.id);
        console.log("valor de exist " + JSON.stringify(exist));
        if (!exist) {
            curso.matriculados = [];
            cursos.push(curso);
            guardar();
            res.redirect('/coordinador?success=true');
        } else {
            res.redirect('/crear?error=true');
        }
    } catch (err) {
        cursos.push(curso);
        guardar();
        res.redirect('/');
    }
});

app.get('/detalle', (req, res) => {
    let id = req.query.id;
    let coord = req.query.coord;
    let msg = req.query.eliminado?'Estudiante eliminado correctamente':'';
    cursos = require('./cursos.json');
    let curso = cursos.find(cur => cur.id == id);
    res.render('course-detail', {
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        valor: curso.valor,
        intensidad: curso.intensidad,
        modalidad: curso.modalidad,
        id: id,
        coord: coord,
        mensaje:msg
    });
});

app.get('/registro', (req, res) => {
    let id = req.query.id;
    res.render('registro', {
        id: id
    });
});
 
app.post('/registro', (req, res) => {
    let estudiante = req.body;
    cursos = require('./cursos.json');
    let curso = cursos.find(cur => cur.id == estudiante.id);
    let est = curso.matriculados.find(est => est.identificacion == estudiante.identificacion);
    if (!est) {
        curso.matriculados.push(estudiante);
        cursos[curso] = curso;
        guardar();
        res.redirect('/?success=true');
    } else {
        res.render('registro', {
            id: estudiante.id,
            mensaje: 'El estudiante ya esta matriculado en este curso'
        });
    }
});

app.get('/coordinador', (req, res) => {
    let msg = req.query.success ? 'Curso creado correctamente' : req.query.close ? 'Curso cerrado correctamente' : ''

    res.render('course-list-coordinador', {
        coord: 'true',
        mensaje: msg
    });
});

app.get('/cerrar-curso', (req, res) => {
    let id = req.query.id;
    cursos = require('./cursos.json');
    curso = cursos.find(cur => cur.id == id);
    curso.estado = 'cerrado',
        cursos[curso] = curso;
    guardar();
    res.redirect('/coordinador?close=true');
});

app.post("/eliminar-estudiante", (req, res) => {
    let body = req.body;
    cursos = require('./cursos.json');
    curso = cursos.find(cur => cur.id == body.id);
    curso.matriculados = curso.matriculados.filter(estu => estu.identificacion != body.identificacion);
    cursos[curso] = curso;
    guardar();
    res.redirect('/detalle?id=' + body.id + '&coord=true&eliminado=true');
});

let guardar = () => {
    let list = JSON.stringify(cursos);
    fs.writeFile('./src/cursos.json', list, (err) => {
        if (err) console.log('Error guardando curso');
        console.log('Documento Creado');
    })
}

app.listen(port, () => {
    console.log('escuchando en puerto ' + port);
});