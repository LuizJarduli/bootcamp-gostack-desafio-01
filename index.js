const { response } = require('express');
const express = require('express');

const server = express();
server.use(express.json());
let contador = 1;

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}; Total de Requests: ${++contador}`);
    next();
    console.timeEnd('Request');
});

const projects = [];

//middlewares
const projectIsInArray = (req, res, next) => {
    const project = projects[projects.indexOf(projects.find(projeto => projeto.id === req.params.id))];
    if (!project) {
        return res.status(400).json({ error: "project does not exists!" });
    }

    return next();
}

//listar todos os projetos
server.get("/projects", (req, res) => {
    return res.json(projects)
});

//adicionar projeto novo com id e title
server.post("/projects", (req, res) => {
    const { id } = req.body;
    const { title } = req.body;
    const { tasks } = req.body;

    projects.push({
        id,
        title,
        tasks
    });

    return res.json(projects)
});

//adicionar nova tarefa a um projeto
server.post("/projects/:id/tasks", projectIsInArray, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    let project = projects.find(projeto => projeto.id === id);
    project.tasks.push(title);
    return res.json(projects);

});

//deletar um projeto da lista
server.delete("/projects/:id", projectIsInArray, (req, res) => {
    const { id } = req.params;
    let project = projects.find(projeto => projeto.id === id);
    projects.splice(projects.indexOf(project), 1);
    return res.json(projects);
});


//Alterar titulo do projeto
server.put("/projects/:id", projectIsInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    let project = projects.find(projeto => projeto.id === id);
    projects[projects.indexOf(project)].title = title;
    return res.json(projects);
});


server.listen(5200);