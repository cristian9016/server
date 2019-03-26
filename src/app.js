const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 8080;
require('./helpers');

let partialsDirectory = path.join(__dirname, '../partials');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
hbs.registerPartials(partialsDirectory);

app.get('/', (req, res) => {
    res.render('course-list');
});

app.get('/crear', (req, res) => {
    res.render('create-course');
});

app.post('/crear', (req, res) => {
    let curso = req.body;
    let cursos = [];
    try {
        cursos = require('./cursos.json');
        let exist = cursos.find(cur => cur.id == curso.id);
        if (exist == undefined) { 
            cursos.push(curso);
            let list = JSON.stringify(cursos);
            console.log(list);
            fs.writeFile('./src/cursos.json', list, (err) => {
                if (err) console.log('Error guardando curso');
                console.log('Documento actualizado');
            })
            res.redirect('/');
        } else {
            res.send('El curso con id ' + curso.id + ' ya existe');
        }
    } catch (err) {
        cursos.push(curso);
        let list = JSON.stringify(cursos);
        console.log(list);
        fs.writeFile('./src/cursos.json', list, (err) => {
            if (err) console.log('Error guardando curso');
            console.log('Documento Creado');
        })
        res.redirect('/');
    }
});

app.get('/detalle',(req,res)=>{
    let id = req.query.id;
    res.send(id);
});


app.listen(port, () => {
    console.log('escuchando en puerto ' + port);
});