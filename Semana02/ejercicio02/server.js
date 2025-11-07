const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

const server = http.createServer((req, res) => {
   if (req.url === "/") {
       const filePath = path.join(__dirname, "views", "home.hbs");
       
       // Leer archivo de plantilla
       fs.readFile(filePath, "utf8", (err, templateData) => {
           if (err) {
               res.statusCode = 500;
               res.end("Error interno del servidor");
               return;
           }
           
           // Compilar plantilla con Handlebars
           const template = handlebars.compile(templateData);
           
           // Datos dinámicos a enviar
           const data = {
               title: "Servidor con Handlebars ✨",
               welcomeMessage: "¡Bienvenido al Laboratorio de Node.js",
               day: new Date().toLocaleDateString("es-PE"),
               students: ["Ana", "Luis", "Pedro", "María"]
           };
           
           // Renderizar vista con los datos
           const html = template(data);
           
           res.setHeader("Content-Type", "text/html; charset=utf-8");
           res.end(html);
       });
   } else if (req.url === "/about") {
        const filePath = path.join(__dirname, "views", "about.hbs");
       
       fs.readFile(filePath, "utf8", (err, templateData) => {
           if (err) {
               res.statusCode = 500;
               res.end("Error interno del servidor");
               return;
           }
           
           const template = handlebars.compile(templateData);
           
           const data = {
               title: "Curso - Datos",
               curso: "Node.JS desde cero",
               profesor: "Jaime Gomez",
               day: new Date().toLocaleDateString("es-PE"),
           };
           
           const html = template(data);
           
           res.setHeader("Content-Type", "text/html; charset=utf-8");
           res.end(html);
       });
   } else if (req.url === "/students") {
        const filePath = path.join(__dirname, "views", "students.hbs");
       
       fs.readFile(filePath, "utf8", (err, templateData) => {
           if (err) {
               res.statusCode = 500;
               res.end("Error interno del servidor");
               return;
           }
           
           const template = handlebars.compile(templateData);
           
           const data = {
               title: "Notas",
               mensaje: "Notas finales",
               students: [
                { nombre: "Ana", nota: "18", esAlta: true},
                { nombre: "Luis", nota: "14", esAlta: false},
                { nombre: "Pedro", nota: "16", esAlta: false},
                { nombre: "Maria", nota: "11", esAlta: true}
               ]
           };
           
           const html = template(data);
           
           res.setHeader("Content-Type", "text/html; charset=utf-8");
           res.end(html);
       });
    } else {
       res.statusCode = 404;
       res.end("<h1>404 - Página no encontrada</h1>");
   }
});

server.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}`);
});