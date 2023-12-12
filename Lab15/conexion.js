const mysql = require("mysql");
const express = require("express");
const app = express();
const port = 3000; // Puedes ajustar el número de puerto según tus necesidades

const { body, validationResult } = require("express-validator");
// Configurar Pug como motor de plantillas
app.set("view engine", "pug");
app.set("views", "./views");

// Configurar Express.js para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Middleware para procesar datos enviados en formularios
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {
  connection.query("SELECT * FROM carreras", (error, carreras) => {
    if (error) {
      console.error("Error al obtener los datos de carreras: ", error);
      return;
    }

    connection.query("SELECT * FROM alumnos", (error, resultados) => {
      if (error) {
        console.error("Error al obtener los datos: ", error);
        return;
      }

      res.render("index", { datos: resultados, carreras: carreras });
    });
  });
});

// Manejar la solicitud POST para agregar alumno con validación
app.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("edad")
      .isInt({ min: 1 })
      .withMessage("La edad debe ser un número entero mayor a 0"),
    body("email").isEmail().withMessage("Ingrese un correo electrónico válido"),
    body("carrera_id")
      .isInt({ min: 1 })
      .withMessage("Seleccione una carrera válida"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const datos = await connection.promise().query("SELECT * FROM alumnos");
      res.render("index", { datos: datos[0], errors: errors.array() });
    } else {
      const nuevoAlumno = {
        nombre: req.body.nombre,
        edad: req.body.edad,
        email: req.body.email,
        carrera_id: req.body.carrera_id,
      };

      // Consulta SQL de inserción
      const consulta = "INSERT INTO alumnos SET ?";

      // Ejecutar la consulta de inserción
      connection.query(consulta, nuevoAlumno, (error, results) => {
        if (error) {
          console.error("Error al insertar alumno: ", error);
          return;
        }
        console.log("Alumno insertado exitosamente");
        res.redirect("/");
      });
    }
  }
);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345678",
  database: "laboratorio15",
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a MySQL: ", error);
    return;
  }
  console.log("Conexión exitosa a MySQL");
});

// Cerrar la conexión cuando sea necesario
// connection.end();

// Ejecutar una consulta SELECT
connection.query("SELECT * FROM alumnos", (error, results) => {
  if (error) {
    console.error("Error al ejecutar la consulta: ", error);
    return;
  }
  console.log("Resultados de la consulta: ", results);
});

// Ruta para mostrar el formulario de edición
app.get("/editar/:id", (req, res) => {
  const alumnoId = req.params.id;
  // Obtener los datos del alumno a editar
  connection.query(
    "SELECT * FROM alumnos WHERE id = ?",
    [alumnoId],
    (error, resultado) => {
      if (error) {
        console.error("Error al obtener datos para editar: ", error);
        return;
      }
      // Renderizar la vista de edición y pasar los datos del alumno
      res.render("editar", { alumno: resultado[0] });
    }
  );
});

// Manejar la solicitud POST para actualizar datos
app.post("/editar/:id", (req, res) => {
  const alumnoId = req.params.id;
  const nuevoNombre = req.body.nombre;
  const nuevaEdad = req.body.edad;
  const nuevoEmail = req.body.email;
  const nuevaCarreraId = req.body.carrera_id;

  // Consulta SQL de actualización
  const consulta =
    "UPDATE alumnos SET nombre = ?, edad = ?, email = ?, carrera_id = ? WHERE id = ?";

  // Ejecutar la consulta de actualización
  connection.query(
    consulta,
    [nuevoNombre, nuevaEdad, nuevoEmail, nuevaCarreraId, alumnoId],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar datos: ", error);
        return;
      }
      console.log("Datos del alumno actualizados exitosamente");
      res.redirect("/");
    }
  );
});

// Ruta para manejar la eliminación de un dato
app.get("/eliminar/:id", (req, res) => {
  const alumnoId = req.params.id;
  // Consulta SQL de eliminación
  const consulta = "DELETE FROM alumnos WHERE id = ?";
  // Ejecutar la consulta de eliminación
  connection.query(consulta, [alumnoId], (error, results) => {
    if (error) {
      console.error("Error al eliminar dato: ", error);
      return;
    }
    console.log("Dato eliminado exitosamente");
    res.redirect("/");
  });
});

app.get("/alumnos-cursos", (req, res) => {
  const query = `
    SELECT alumnos.id as alumno_id, alumnos.columna1 as nombre_alumno, cursos.nombre
    FROM alumnos
    LEFT JOIN cursos ON alumnos.id = cursos.alumno_id
  `;

  connection.query(query, (error, resultados) => {
    if (error) {
      console.error("Error al obtener los datos: ", error);
      return;
    }
    res.render("alumnosCursos", { datos: resultados });
  });
});

// Obtener la cantidad de alumnos por carrera
app.get("/consulta1", (req, res) => {
  connection.query(
    "SELECT c.nombre AS carrera, COUNT(*) AS cantidad_alumnos FROM alumnos a JOIN carreras c ON a.carrera_id = c.id GROUP BY c.nombre",
    (error, resultados) => {
      if (error) {
        console.error("Error en la consulta: ", error);
        return res.status(500).send("Error en la consulta");
      }
      res.render("consulta1", { resultados });
    }
  );
});

// Obtener el promedio de edad de los alumnos por carrera
app.get("/consulta2", (req, res) => {
  connection.query(
    "SELECT c.nombre AS carrera, AVG(a.edad) AS promedio_edad FROM alumnos a JOIN carreras c ON a.carrera_id = c.id GROUP BY c.nombre",
    (error, resultados) => {
      if (error) {
        console.error("Error en la consulta: ", error);
        return res.status(500).send("Error en la consulta");
      }
      res.render("consulta2", { resultados });
    }
  );
});

// Obtener los alumnos que tienen la misma edad y pertenecen a la misma carrera
app.get("/consulta3", (req, res) => {
  connection.query(
    "SELECT a1.nombre AS alumno1, a2.nombre AS alumno2, a1.edad, c.nombre AS carrera FROM alumnos a1 JOIN alumnos a2 ON a1.edad = a2.edad AND a1.carrera_id = a2.carrera_id AND a1.nombre <> a2.nombre JOIN carreras c ON a1.carrera_id = c.id",
    (error, resultados) => {
      if (error) {
        console.error("Error en la consulta: ", error);
        return res.status(500).send("Error en la consulta");
      }
      res.render("consulta3", { resultados });
    }
  );
});

// Obtener todos los alumnos de una carrera específica
app.get("/consulta4", (req, res) => {
  const carreraEspecifica = "Ingeniería Informática";
  connection.query(
    "SELECT a.nombre, a.edad, c.nombre AS carrera FROM alumnos a JOIN carreras c ON a.carrera_id = c.id WHERE c.nombre = ?",
    [carreraEspecifica],
    (error, resultados) => {
      if (error) {
        console.error("Error en la consulta: ", error);
        return res.status(500).send("Error en la consulta");
      }
      res.render("consulta4", { resultados });
    }
  );
});
