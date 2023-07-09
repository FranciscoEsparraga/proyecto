import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useServer from "../../hooks/useServer";
import "./style.css";



const EditProfile = ({ nickname }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { get } = useServer();
  const [currentUser, setCurrentUser] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    name: "",
    surname: "",
    password: "",
    repeatPassword: "",
    biography: "",
  });

  /* Cogemos el id de usuario para usarlo en el siguiente GET*/
  const fetchUser = async () => {
    try {
      const { data } = await get({ url: `/useravatar/${nickname}` });
      if (data.status) {
        setCurrentUser(data.userAvatar);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));


    if (name === "password" || name === "repeatPassword") {
      setRepeatPassword(value);
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fD = new FormData();

    fD.append("userPhoto", file);
    fD.append("email", formData.email);
    fD.append("nickname", formData.nickname);
    fD.append("name", formData.name);
    fD.append("surname", formData.surname);
    fD.append("password", formData.password);
    fD.append("biography", formData.biography);



    if (formData.password !== formData.repeatPassword) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/user/${currentUser.id}/edit`,
        fD,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `${user.token}`,
          },
        }
      );

      // Actualizar el estado con los datos actualizados del usuario
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: response.data.email,
        userPhoto: file,
        nickname: response.data.nickname,
        name: response.data.name,
        surname: response.data.surname,
        password: response.data.password,
        biography: response.data.biography,
        // Actualiza otros campos si es necesario
      }));

      setTimeout(function request() {
        setSuccessMessage("Perfil actualizado");
        toast.success("Tu perfil se ha actualizado");
        setTimeout(() => {
          navigate("/logout");
        }, 6000);
      }, 1500);



      setSuccessMessage("Cambios guardados.");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="editCard">
      <h2>Editar Perfil</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userPhoto">Foto de Perfil</label>
          <input
            type="file"
            id="userPhoto"
            name="userPhoto"
            accept=".jpg, .jpeg, .png"
            onChange={handleFile}
          />
        </div>
        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nickname">Nombre de Usuario</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="surname">Apellidos</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <div className="password-input">
            <input
              type={passwordVisibility ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={passwordVisibility ? faEyeSlash : faEye}
              className="password-icon"
              onClick={togglePassword}
            />
          </div>
        </div>
        <div>
          <label htmlFor="repeatPassword">Repetir Contraseña</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="biography">Biografía</label>
          <textarea
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProfile;
