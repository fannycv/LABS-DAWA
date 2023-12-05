const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(express.static(__dirname));

app.post("/upload", upload.array("files"), (req, res) => {
  const fileInfos = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  }));
  res.send(fileInfos);
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
