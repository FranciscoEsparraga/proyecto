const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const { unlink } = require("fs/promises");
const jwt = require("jsonwebtoken");

// DICCIONARIO DE ESTADOS DE UN SERVICIO //
const SERVICE_STATUS = Object.freeze({
  DONE: "DONE",
  UNDONE: "UNDONE",
});

// DICCIONARIO DE VALORES DE UN SERVICIO //
const SERVICES_VALUES = Object.freeze({
  DONE: 1,
  UNDONE: 0,
});

// EXTENSIÓN DE ARCHIVOS PERMITIDOS //
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "pdf", "doc"];

const TYPE_OF_SERVICE = ["SERVICE", "USER", "COMMENT"];

const USER_PATH = "../Frontend/public/fotosUsuario";
const SERVICE_PATH = "../Frontend/public/publicServices";
const COMMENT_PATH = "../Frontend/public/commentFiles";

const categories = [
  "Diseño Gráfico",
  "Traducción",
  "Copywriting",
  "Programación",
  "Fotografía",
  "Audio",
  "Vídeo",
  "Otros",
];

//Generar errores personalizados en respuesta a una solicitud HTTP en caso de error en el server
const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

//Comprobar si un directorio existe en el sistema de archivos y lo crea si no
const createPathIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
};

//Obtenemos una categoria aleatoria para el generador de servicios
const getRandomCategory = () => {
  const maxNumber = categories.length;
  const random = Math.floor(Math.random() * maxNumber);
  return categories[random];
};

//Obtener la key de un diccionario por su value
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function getExtensionFile(filename) {
  return filename.split(".").slice(-1);
}

function checkIfExtensionIsAllowed(fileExtension) {
  const [ext] = fileExtension;
  return ALLOWED_EXTENSIONS.includes(ext);
}

function checkIfTypeOfServiceIsAllowed(typeOfFile) {
  return TYPE_OF_SERVICE.includes(typeOfFile);
}

/*async function checkIfProfilePictureExists(nickname = "") {
  const directoryPath = path.join(__dirname, USER_PATH);
  fs_no_promises.readdir(directoryPath, (e, files) => {
    if (e) {
      console.log("No se pudo leer el directorio");
    }
    files.forEach(async (file) => {
      if (file.startsWith(`${nickname} -`)) {
        const filePath = path.join(__dirname, `${USER_PATH}/${file}`);
        await removeFile(filePath);
      }
    });
  });
}*/

async function checkIfProfilePictureExists(nickname = "") {
  const USER_PATH = "../Frontend/public/fotosUsuario";
  const directoryPath = path.join(__dirname, USER_PATH);
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      if (file.startsWith(`${nickname} -`)) {
        const filePath = path.join(directoryPath, file);
        await fs.unlink(filePath);
      }
    }
  } catch (e) {
    console.log("No se pudo leer el directorio:", e);
  }
}

async function removeFile(filepath) {
  try {
    await unlink(filepath);
    console.log(filepath, "Se ha borrado correctamente");
  } catch (e) {
    console.log("Ha ocurrido un error!", e.message);
  }
}

async function uploadFilesInFolder(
  req,
  fieldNamePostman,
  typeOfFile,
  nickname = "",
  titleOfService = ""
) {
  /* 
    fieldNamePostman = Nombre que tiene el campo en postman

    typeOfFile => User -> Cuando sea la foto de perfil de usuario
                  Service -> Cuando queramos subir ficheros de un servicio. Ya sea petición o respuesta. 
  */

  if (!checkIfTypeOfServiceIsAllowed(typeOfFile.toUpperCase())) {
    throw generateError("Tipo de fichero no permitido", 401);
  }

  if (!fieldNamePostman) {
    throw generateError("Necesitas indicar el nombre del campo", 400);
  }

  //Tratar el fichero
  let fileName;
  let uploadPath;

  if (req.files && req.files[fieldNamePostman]) {
    let sampleFile = req.files[fieldNamePostman];

    let currentPath;

    if (typeOfFile.toUpperCase() === "USER") {
      currentPath = USER_PATH;
    } else if (typeOfFile.toUpperCase() === "SERVICE") {
      currentPath = SERVICE_PATH;
    } else if (typeOfFile.toUpperCase() === "COMMENT") {
      currentPath = COMMENT_PATH;
    }

    //Creamos el path
    const uploadDir = path.join(__dirname, currentPath);

    //Crear directorio si no existe
    await createPathIfNotExists(uploadDir);

    /* DEFINIMOS RUTAS Y NOMBRE DE LOS ARCHIVOS SI ES FOTO DE PERFIL */
    if (typeOfFile.toUpperCase() === "USER") {
      //Vamos a borrar la foto anterior existente.
      checkIfProfilePictureExists(nickname);

      //Obtener la extensión del fichero para guardarlo de la misma forma
      fileName = `${nickname} - profile picture - ${nanoid(
        24
      )}.${getExtensionFile(sampleFile.name)}`;

      uploadPath = uploadDir + "\\" + fileName;

      //Subir el fichero
      sampleFile.mv(uploadPath, function (e) {
        if (e) {
          throw generateError("No se pudo enviar el archivo", 400);
        }
      });

      const [halfPath] = USER_PATH.split("Frontend").slice(-1);

      return `..${halfPath}/${fileName}`;
    } else if (typeOfFile.toUpperCase() === "SERVICE") {
      //Comprobar si la extension es valida.
      if (!checkIfExtensionIsAllowed(getExtensionFile(sampleFile.name))) {
        throw generateError(
          `Formato no válido. Tipos de formatos permitidos: ${ALLOWED_EXTENSIONS}`,
          415
        );
      }

      //Obtener la extensión del fichero para guardarlo de la misma manera
      fileName = `${nickname} - ${titleOfService} - ${nanoid(
        5
      )}.${getExtensionFile(sampleFile.name)}`;

      uploadPath = uploadDir + "\\" + fileName;
      const [halfPath] = SERVICE_PATH.split("Frontend").slice(-1);

      //Subir el fichero
      sampleFile.mv(uploadPath, function (e) {
        if (e) {
          throw generateError("No se pudo enviar el archivo", 400);
        }
      });
      return `${halfPath}/${fileName}`;
    } else if (typeOfFile.toUpperCase() === "COMMENT") {
      //Comprobar si la extension es valida.
      if (!checkIfExtensionIsAllowed(getExtensionFile(sampleFile.name))) {
        throw generateError(
          `Formato no válido. Tipos de formatos permitidos: ${ALLOWED_EXTENSIONS}`,
          415
        );
      }

      //Obtener la extensión del fichero para guardarlo de la misma manera
      fileName = `${nickname} - ${titleOfService} - ${nanoid(
        5
      )}.${getExtensionFile(sampleFile.name)}`;

      uploadPath = uploadDir + "\\" + fileName;

      const [halfPath] = COMMENT_PATH.split("Frontend").slice(-1);

      //Subir el fichero
      sampleFile.mv(uploadPath, function (e) {
        if (e) {
          throw generateError("No se pudo enviar el archivo", 400);
        }
      });
      return `${halfPath}/${fileName}`;
    }
  }
}

module.exports = {
  generateError,
  createPathIfNotExists,
  SERVICE_STATUS,
  SERVICES_VALUES,
  getKeyByValue,
  getExtensionFile,
  checkIfExtensionIsAllowed,
  ALLOWED_EXTENSIONS,
  uploadFilesInFolder,
  removeFile,
  getRandomCategory,
};
