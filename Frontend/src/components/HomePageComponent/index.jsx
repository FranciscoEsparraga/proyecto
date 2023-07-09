import "./style.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";



function HomePageComponent() {
  const { isAuthenticated } = useAuth();
  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "600px",
  };
  return (
    <main className="home-page">
      <div className="page-name">
        <h2>Collabs</h2>
        <div id="div-noLink">
          <span>Porque no estás solo,</span>
          <Link to="/services">
            <span id="div-link">colabora!</span>
          </Link>
        </div>
        <div className="div-decoration1">Audio</div>
        <div className="div-decoration2">Video</div>
        <div className="div-decoration3">Fotografía</div>
        <div className="div-decoration4">Traducción</div>
        <div className="div-decoration5">Programación</div>
      </div>
    </main>
  );
}

export default HomePageComponent;
