import { Link } from "react-router-dom";
import "./style.css";

const NotFoundPage = () => {
  return (
    <main className="not-found-main">
      <div className="not-found">
        <h2>404 - Página no encontrada</h2>
        <img src="..\public\images\chillCat.png" alt="chill cat3" />
        <p>Ten paciencia, todos nos sentimos perdidos de vez en cuando. </p>
        <Link to="/">
          <button>Volver al Inicio</button>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
