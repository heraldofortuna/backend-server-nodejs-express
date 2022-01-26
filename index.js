const express = require("express");
const app = express();
app.use(express.json());

// Tomamos el middleware para usar y permitir solicitudes
// de todos los orígenes
const cors = require("cors");
app.use(cors());

// Middleware es una función que recibe tres parámetros
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
// Middleware se usa así
app.use(requestLogger);

// Se crea un objeto de datos iniciales para las notas
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2020-01-10T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2020-01-10T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2020-01-10T19:20:14.298Z",
    important: true,
  },
];

// Ruta inicial con un mensaje
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// Ruta del api para obtener el total de notas
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Función generadora de id
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// Ruta del api que crea una nueva nota
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };
  notes = notes.concat(note);
  response.json(note);
});

// Ruta del api que muestra una nota con respecto a su id
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Ruta del api que elimina una nota
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Middleware que se usa para capturar solicitudes realizadas a
// rutas inexistentes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Enlace del servidor http asignado a la variable app,
// para escuchar las solicitudes HTTP enviadas al puerto asignado
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
