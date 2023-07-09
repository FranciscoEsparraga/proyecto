import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import useServer from "../../hooks/useServer.js";
import { useState } from "react";
import "./style.css";

function SignUp() {
  const navigate = useNavigate();
  const { post } = useServer();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [mainPassword, setMainPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = e.target;
    const credentials = Object.fromEntries(new FormData(form));
    const { data } = await post({ url: "/user/register", body: credentials });
    if (data) return navigate("/login");
  };

  const togglePassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <>
      <div className="signUpPage">
        <div className="signUp">
          <h2>Regístrate</h2>
        </div>

        <div className="signUpForm">
          <form onSubmit={submitHandler}>
            <div>
              <label className="signUpData" htmlFor="email">
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
              <label className="signUpData" htmlFor="nickname">
                <span>Nickname:</span>
                <div>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    autoComplete="nickname"
                    required
                  />
                </div>
              </label>
            </div>

            <div>
              <div>
                <label className="signUpData" htmlFor="password">
                  <span>Contraseña:</span>
                </label>
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type={passwordVisibility ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  onChange={(event) => setMainPassword(event.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <div>
                <label className="signUpData" htmlFor="password">
                  <span>Repetir contraseña:</span>
                </label>
              </div>
              <div>
                <input
                  id="repeat-password"
                  name="repeat-password"
                  type={passwordVisibility ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  minLength={8}
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
                    className="eye"
                  />
                </label>
              </div>
            </div>

            {repeatPassword === mainPassword ? (
              ""
            ) : (
              <p className="passwordError">Las contraseñas no coinciden</p>
            )}

            <div>
              <button type="submit">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
