//Error general
const generalError = (error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
};

//Error 404
const error404 = (req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
};

module.exports = { generalError, error404 };
