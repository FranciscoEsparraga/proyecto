const { getConnection } = require("../db/db");
const { generateError } = require("../helpers");
const chalk = require("chalk");

const { DB_DATABASE } = process.env;

//Crear servicio en la BBDD
const createService = async (
  title,
  request_body,
  user_id,
  service_type,
  file_name = "",
  done = false
) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [newService] = await connection.query(
      `
    INSERT INTO services (title, request_body, user_id, file_name, service_type, done) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, request_body, user_id, file_name, service_type, done]
    );

    return newService.insertId;
  } catch (e) {
    throw e;
  } finally {
    if (connection) connection.release();
  }
};

const getServiceByID = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [result] = await connection.query(
      `SELECT * FROM services WHERE id = ?`,
      [id]
    );

    if (!result.length) {
      throw generateError(`No hay ningún servicio con ID ${id}`);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllServices = async (user_id = -1) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    // const [result] = await connection.query(
    //   `SELECT * FROM services WHERE user_id != ? AND done = ? ORDER BY creation_date ASC`,
    //   [user_id, 0]
    // );

    const [result] = await connection.query(
      `SELECT * FROM services WHERE user_id != ? ORDER BY creation_date ASC`,
      [user_id]
    );
    if (result.length === 0) {
      return "No hay servicios aún";
    }

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const updateServiceStatus = async (id, serviceValue) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [result] = await connection.query(
      `SELECT * FROM services WHERE id = ?`,
      [id]
    );

    if (result.length === 0) {
      throw generateError("No hay ningún servicio con ese ID", 404);
    }

    const [update] = await connection.query(
      `UPDATE services SET done = ? WHERE id = ?`,
      [serviceValue, id]
    );

    return update;
  } finally {
    if (connection) connection.release();
  }
};

const getServiceByType = async (type, id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [result] = await connection.query(
      `SELECT * FROM services WHERE service_type LIKE ? AND user_id != ?`,
      [`%${type}%`, id]
    );

    if (result.length === 0) {
      throw generateError(
        "No existe ningún servicio que contenga " + type,
        400
      );
    }

    return result;
  } catch (e) {
    throw e;
  } finally {
    if (connection) connection.release();
  }
};

const getUserIdByNickname = async (nickname) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [result] = await connection.query(
      `SELECT * FROM users WHERE nickname = ?`,
      [nickname]
    );

    if (result.length === 0) {
      throw generateError("No existen servicios de " + nickname, 400);
    }

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const getServiceByNickname = async (nickname) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [prueba] = await getUserIdByNickname(nickname);
    const { id } = prueba;

    const [result] = await connection.query(
      `SELECT * FROM services WHERE user_id = ?`,
      [id]
    );

    // const [result] = await connection.query(
    //   `SELECT * FROM services WHERE service_type LIKE ? AND done = ? AND user_id != ?`,
    //   [`%${type}%`, 0, id]
    // );

    // if (result.length === 0) {
    //   throw generateError(
    //     "No existe ningún servicio que contenga " + type,
    //     400
    //   );
    // }

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createComment = async (
  comment,
  service_file = "",
  user_id,
  service_id,
  solution = false
) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [newComment] = await connection.query(
      `
    INSERT INTO comments (user_id, services_id, comment, serviceFile) VALUES (?, ?, ?, ?)`,
      [user_id, service_id, comment, service_file]
    );

    return newComment.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const deleteComment = async (id_s, id_c) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [getCommentByID_s] = await connection.query(
      `SELECT * FROM comments WHERE services_id = ? AND id = ?`,
      [id_s, id_c]
    );

    if (getCommentByID_s.length === 0) {
      throw generateError("No hay comentarios de este servicio", 404);
    }

    const [getCommentByID_c] = await connection.query(
      `SELECT * FROM comments WHERE id = ?`,
      [id_c]
    );

    if (getCommentByID_c.length === 0) {
      throw generateError("No hay comentarios con esta ID", 404);
    }

    const [deletedComment] = await connection.query(
      `DELETE FROM comments WHERE services_id = ? AND id = ?`,
      [id_s, id_c]
    );

    if (deletedComment.length === 0) {
      throw generateError("No hay nigun comentario", 400);
    }

    return deletedComment;
  } finally {
    if (connection) connection.release();
  }
};

const deleteService = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [service] = await connection.query(
      `SELECT * FROM services WHERE id = ?`,
      [id]
    );

    if (service.length === 0) {
      throw generateError("No hay ningún servicio con ese ID", 404);
    }

    const [deletedService] = await connection.query(
      `DELETE FROM services WHERE id = ?`,
      [id]
    );

    return deletedService;
  } finally {
    if (connection) connection.release();
  }
};

const getAllCommentsFromService = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [getCommentByID] = await connection.query(
      `SELECT * FROM comments WHERE services_id = ?`,
      [id]
    );

    return getCommentByID;
  } finally {
    if (connection) connection.release();
  }
};

const deleteAllCommentsFromService = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [commentsDeleted] = await connection.query(
      `DELETE FROM comments WHERE services_id = ?;`,
      [id]
    );

    return commentsDeleted;
  } finally {
    if (connection) connection.release();
  }
};

const deleteAllCommentsByUserFromService = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    const [commentsDeleted] = await connection.query(
      `DELETE FROM comments WHERE user_id = ?;`,
      [id]
    );

    return commentsDeleted;
  } finally {
    if (connection) connection.release();
  }
};

const deleteAllCommentsByService = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    /* Seleccionamos todos los servicios que tenga esta id */
    const [servicesSelected] = await connection.query(
      `SELECT id FROM services WHERE user_id = ?`,
      [id]
    );
    
    /* Recorremos el array generado anteriormente para borrar cada comentario en cada servicio */
    servicesSelected.forEach((service) => {
      deleteAllCommentsFromService(service.id);
    })

    return servicesSelected;
  } finally {
    if (connection) connection.release();
  }
};

const deleteAllServicesByUser = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(`USE ${DB_DATABASE}`);

    /* Borramos todos los comentarios que tenga el servicio, independientemente del usuario que lo haya publicado. Error de claves foraneas */

    const [servicesDeleted] = await connection.query(
      `DELETE FROM services WHERE user_id = ?;`,
      [id]
    );

    return servicesDeleted;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createService,
  getServiceByID,
  getAllServices,
  updateServiceStatus,
  getServiceByType,
  getServiceByNickname,
  createComment,
  deleteComment,
  getAllCommentsFromService,
  deleteService,
  deleteAllCommentsFromService,
  deleteAllServicesByUser,
  deleteAllCommentsByUserFromService,
  deleteAllCommentsByService,
};
