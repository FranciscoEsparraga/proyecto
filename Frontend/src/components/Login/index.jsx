import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useServer from "../../hooks/useServer.js";
import { useState } from "react";
import "./style.css";

function Login() {
  const navigate = useNavigate();
  const { post } = useServer();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = e.target;
    const credentials = Object.fromEntries(new FormData(form));
    const { data } = await post({ url: "/user/login", body: credentials });
    if (data) {
      navigate("/");
    }
  };

  const togglePassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <>
      <div className="loginPage">
        <div className="login">
          <h2>Iniciar sesión</h2>
        </div>
        <div className="loginForm">
          <form onSubmit={submitHandler}>
            <div>
              <label className="loginData" htmlFor="email">
                <span>Correo electrónico:</span>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="loginData" htmlFor="password">
                <span>Contraseña:</span>
                <div>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisibility ? "text" : "password"}
                    autoComplete="current-password"
                    required
                  />
                  <input
                    type="checkbox"
                    id="ojoPassword"
                    className="hidden"
                    onChange={togglePassword}
                  />
                  <label htmlFor="ojoPassword">
                    <FontAwesomeIcon
                      icon={passwordVisibility ? faEye : faEyeSlash}
                      className="login-eye"
                    />
                  </label>
                </div>
              </label>
            </div>

            <div>
              <button type="submit">Inicia Sesión</button>
            </div>
          </form>

          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/signup">
              <button>Regístrate</button>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
