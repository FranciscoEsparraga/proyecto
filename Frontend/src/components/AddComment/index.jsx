import React, { useState } from "react";
import useServer from "../../hooks/useServer";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./style.css"

const AddComment = () => {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const { post } = useServer();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const getServiceIdFromURL = () => {
    const url = window.location.href;
    const parts = url.split("/");
    const serviceIdIndex = parts.findIndex((part) => part === "service");
    if (serviceIdIndex !== -1 && serviceIdIndex + 1 < parts.length) {
      return parts[serviceIdIndex + 1];
    }
    return null;
  };

  const serviceId = getServiceIdFromURL(); // Obtener el identificador del servicio de la URL

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (comment.length < 10) {
      toast.error("El comentario debe tener al menos 10 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      setShowForm(false);
      const formData = new FormData();
      formData.append("comment", comment);
      formData.append("commentFile", file);


      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: `${user.token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:3000/comments/${serviceId}`,
        formData,
        config
      );

      if (response.data) {
        toast.success("Comentario publicado con éxito");
        setComment("");
        setFile(null);
        setTimeout(() => {
          setIsLoading(false);
          setShowForm(true);
        }, 1000);
      }
    } catch (error) {
      toast.error("No se pudo publicar el comentario");
    }
  };

 return (
    <div className="add-comment">
      {showForm && (
        <>
          <h2 className="title">Añadir comentarios</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="comment">
              <label className="label">Comentario:</label>
              <textarea
                className="textarea"
                placeholder="Escriba aquí su comentario..."
                required
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            <label className="label">Subir archivo:</label>
            <input
              className="file-input"
              type="file"
              id="file"
              accept="image/*, .pdf, .doc, .docx"
              onChange={(event) => setFile(event.target.files[0])}
            />
            <button className="submit-button" type="submit">
              Publicar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddComment;
