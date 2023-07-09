const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const path = require("path");
const { nanoid } = require("nanoid");
const {
  generateError,
  createPathIfNotExists,
  getExtensionFile,
  uploadFilesInFolder,
} = require("../helpers");

const {
  createUser,
  getUserByEmail,
  getAllFieldsExceptPassword,
  editUser,
  deleteUser,
  getUserPhoto,
  getUserData,
  getUserAvatar,
  getAllUsers,
} = require("../db/users");
const { getConnection } = require("../db/db");
const {
  deleteAllServicesByUser,
  deleteAllCommentsByUserFromService,
  deleteAllCommentsByService
} = require("../db/services");

const { DB_DATABASE } = process.env;

const newUserController = async (req, res, next) => {
  try {
    const {
      email,
      nickname,
      name,
      surname,
      password,
      biography,
      userPhoto,
      ko_fi,
    } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      nickname: Joi.string().required(),
    });

    if (!email || !password || !nickname) {
      throw generateError(
        "Debes introducir un email, contraseña y nickname",
        401
      );
    }
    const defaultAvatar = "../images/default_avatar.png";
    const avatar = userPhoto || defaultAvatar;

    //Encriptar la contraseña
    // const passwordHash = await bcrypt.hash(password, 10);

    const id = await createUser(
      email,
      password,
      nickname,
      name,
      surname,
      biography,
      avatar,
      ko_fi
    );

    res.send({
      status: "ok",
      message: `User created with id ${id}`,
    });
  } catch (e) {
    next(e);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError("Debes introducir email y contraseña", 400);
    }

    //utilizamos validador de JOI
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw generateError(error.details.message, 400);
    }

    //recojo los datos de la base de datos del usuario con ese mail
    const user = await getUserByEmail(email);
    //compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Usuario o contraseña incorrecta", 401);
    }
    //creo el payload del token
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      userPhoto: user.userPhoto,
      admin: user.admin,
    };

    //firmo el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    //envio el token
    //el token es publico, garantiza que las contraseñas son las correctas
    res.send({
      status: "ok",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const id_params = +req.params.id;
    const admin = req.admin;
    const id = req.userId;

    let userNickname;

    if (id_params === id || admin) {
      /* Borramos todos los comentarios del usuario*/
      // await deleteAllCommentsFromService(id_params);
      await deleteAllCommentsByUserFromService(id_params);
      await deleteAllCommentsByService(id_params)
      await deleteAllServicesByUser(id_params);
      userNickname = await deleteUser(id_params);
    } else {
      throw generateError("No puedes borrar otro usuario", 401);
    }

    res.send({
      status: "ok",
      message: `User ${userNickname} deleted`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdController(id);

    res.send({
      status: "ok",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFieldsExceptPasswordController = async (req, res, next) => {
  const { id } = req.params;
  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const userId = await getAllFieldsExceptPassword(id);

    res.send({
      status: "ok",
      information: userId,
    });
  } catch (e) {
    next(e);
  }
};

const getUserByIdController = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [result] = await connection.query(
      `
      SELECT id, email FROM users WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError("No hay ningún usuario con ese ID", 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getUserPhotoController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userPhoto = await getUserPhoto(id);

    res.send({
      status: "ok",
      data: userPhoto,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDataController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userData = await getUserData(id);
    res.send({
      status: "ok",
      userData: userData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsersController = async (req, res, next) => {
  try {
    const userData = await getAllUsers();
    res.send({
      status: "ok",
      userData: userData,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAvatarController = async (req, res, next) => {
  try {
    const { nickname } = req.params;

    const userAvatar = await getUserAvatar(nickname);

    res.send({
      status: "ok",
      userAvatar: userAvatar,
    });
  } catch (error) {
    next(error);
  }
};

const editUserController = async (req, res, next) => {
  const id_params = +req.params.id;
  const id = req.userId;
  const admin = req.admin;

  let tmp_user = {}; //Objeto que le vamos a pasar a editUser();

  try {
    //Comprobacion para evitar que puedas editar otro usuario
    if (id !== id_params && !admin && id_params !== 0) {
      throw generateError("No puedes editar otro usuario", 403);
    }

    const [user] = await getAllFieldsExceptPassword(id_params);
    let { email, nickname, name, surname, password, biography, kofi } =
      req.body;

    let userPhoto = await uploadFilesInFolder(
      req,
      "userPhoto",
      "user",
      user.nickname
    );

    email = email || user.email;
    userPhoto = userPhoto || user.userPhoto;
    nickname = nickname || user.nickname;
    name = name || user.name;
    surname = surname || user.surname;
    password = password || user.password;
    biography = biography || user.biography;
    kofi = kofi || user.ko_fi;

    if (email != user.email) {
      user.email = email;
    }
    if (userPhoto != user.userPhoto) {
      user.userPhoto = userPhoto;
    }
    if (nickname != user.nickname) {
      user.nickname = nickname;
    }
    if (name != user.name) {
      user.name = name;
    }
    if (surname != user.surname) {
      user.surname = surname;
    }
    if (password != user.password) {
      //Aquí tendremos que hacer un check para comprobar que la contraseña que introduce es igual a la antigua
      //Encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
    }
    if (biography != user.biography) {
      user.biography = biography;
    }
    if (kofi != user.ko_fi) {
      user.ko_fi = kofi;
    }

    //Añadimos campos al objeto
    tmp_user.id = id_params;
    tmp_user.email = user.email;
    tmp_user.nickname = user.nickname;
    tmp_user.name = user.name;
    tmp_user.surname = user.surname;
    tmp_user.password = user.password;
    tmp_user.biography = user.biography;
    tmp_user.userPhoto = user.userPhoto;
    tmp_user.ko_fi = user.ko_fi;

    const updatedUser = await editUser(tmp_user);

    if (updatedUser.changedRows === 0) {
      res.send({
        status: "ok",
        data: "Ningún campo ha sido actualizado",
      });
    } else {
      res.send({
        status: "ok",
        data: "Perfil actualizado",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  loginController,
  deleteUserController,
  getUserController,
  getUserByIdController,
  getUserPhotoController,
  editUserController,
  getAllFieldsExceptPasswordController,
  getUserDataController,
  getUserAvatarController,
  getAllUsersController,
};
