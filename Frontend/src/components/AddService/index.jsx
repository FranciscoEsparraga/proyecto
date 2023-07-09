import React, { useState } from "react";
import useServer from "../../hooks/useServer";
import toast from "react-hot-toast";
import { categories } from "../../config";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const AddService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredType, setRequiredType] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const { post } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (description.length < 15) {
      toast.error("La descripción debe tener al menos 15 caracteres");
      return;
    }
    if (title.length < 15) {
      toast.error("El título debe tener al menos 15 caracteres");
      return;
    }
    if (!requiredType) {
      toast.error("Debes seleccionar una categoría");
      return;
    }

    try {
      setIsLoading(true);
      setShowForm(false);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("request_body", description);
      formData.append("required_type", requiredType);
      formData.append("file", file);

      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "content-type": "multipart/form-data",
          Authorization: `${user.token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/service/add",
        formData,
        config
      );

      if (response.status === 200) {
        toast.success(`Servicio ${title} creado con éxito`);
        setTitle("");
        setDescription("");
        setRequiredType("");
        setFile(null);
        setTimeout(() => {
          setIsLoading(false);
          setShowForm(true);
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        toast.error(error.response.data.message);
      } else {
        toast.error(`No se ha podido generar el servicio. ${error}`);
      }
    }
  };

  return (
    <div className="add-service">
      {showForm && (
        <>
          <h2 className="add-service-title">Añadir servicio</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title" className="form-label">
              Título:
            </label>
            <input
              id="title"
              className="form-input"
              placeholder="Escriba aquí el título del servicio.."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="requiredType" className="form-label">
              Descripción:
            </label>
            <textarea
              id="requiredType"
              rows="4"
              className="form-textarea"
              placeholder="Escriba aquí la descripción del servicio..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <select
              id="categories"
              className="form-select"
              value={requiredType}
              onChange={(event) => setRequiredType(event.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="form-label  " htmlFor="file">
              Subir archivo:
            </label>
            <input
              className="form-file"
              aria-describedby="file_help"
              id="file"
              type="file"
              onChange={(event) => setFile(event.target.files[0])}
            />

            <div>
              <button className="submit-button" type="submit">
                Crear servicio
              </button>
            </div>
          </form>
        </>
      )}
      {isLoading}
    </div>
  );
};

export default AddService;
