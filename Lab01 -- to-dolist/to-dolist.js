const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tareas = [];
let contadorId = 1;

const categorias = {
  "Estudio": [],
  "Trabajo": [],
  "Personal": []
};

// Funciones del sistema:
function agregarTarea(titulo, descripcion, categoria) {
  if (!categorias[categoria]) {
    console.log("Categoría no válida. Use: Estudio, Trabajo o Personal.");
    return;
  }

  const tarea = {
    id: contadorId++,
    titulo,
    descripcion,
    categoria,
    estado: "Pendiente"
  };

  tareas.push(tarea);
  categorias[categoria].push(tarea);
  console.log("Tarea agregada con éxito.");
}

function listarTareas() {
  console.log("\nLista de Tareas:");
  if (tareas.length === 0) {
    console.log("No hay tareas registradas.");
    return;
  }
  tareas.forEach(t => {
    console.log(`[${t.estado}] (${t.id}) ${t.titulo} - ${t.categoria}`);
  });
}

function listarPorCategoria(categoria) {
  if (!categorias[categoria]) {
    console.log(" Categoría no válida.");
    return;
  }
  console.log(`\n Tareas en categoría: ${categoria}`);
  if (categorias[categoria].length === 0) {
    console.log("No hay tareas en esta categoría.");
    return;
  }
  categorias[categoria].forEach(t => {
    console.log(`[${t.estado}] (${t.id}) ${t.titulo}`);
  });
}

function marcarCompletada(id) {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea) {
    console.log("No existe una tarea con ese ID.");
    return;
  }
  tarea.estado = "Completada";
  console.log(`La tarea (${id}) ha sido marcada como completada.`);
}


function mostrarMenu() {
  console.log(`
===== GESTOR DE TAREAS =====
1. Agregar tarea
2. Listar todas las tareas
3. Marcar tarea como completada
4. Listar tareas por categoría
5. Salir
  `);
}

function ejecutarOpcion(opcion) {
  switch (opcion) {
    case "1":
      rl.question("Título: ", titulo => {
        rl.question("Descripción: ", descripcion => {
          rl.question("Categoría (Estudio/Trabajo/Personal): ", categoria => {
            agregarTarea(titulo, descripcion, categoria);
            mostrarMenu();
          });
        });
      });
      break;
    case "2":
      listarTareas();
      mostrarMenu();
      break;
    case "3":
      rl.question("Ingrese el ID de la tarea: ", id => {
        marcarCompletada(parseInt(id));
        mostrarMenu();
      });
      break;
    case "4":
      rl.question("Categoría (Estudio/Trabajo/Personal): ", categoria => {
        listarPorCategoria(categoria);
        mostrarMenu();
      });
      break;
    case "5":
      console.log("Saliendo del gestor...");
      rl.close();
      break;
    default:
      console.log("Opción inválida.");
      mostrarMenu();
  }
}


mostrarMenu();
rl.on("line", ejecutarOpcion);
