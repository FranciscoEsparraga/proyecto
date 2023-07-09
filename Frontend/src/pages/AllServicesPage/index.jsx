import React from "react";
import AddService from "../../components/AddService/index.jsx";
import ServicesList from "../../components/ServiceList/index.jsx";
import useAuth from "../../hooks/useAuth.js";
import { Link } from "react-router-dom";
import "./style.css";

function AllServicesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <main>
        <ServicesList />
        {!isAuthenticated && (
          <div className="agregar-servicios">
            <p>
              <Link className="agregar-auth" to="/signup">
                Regístrate
              </Link>{" "}
              o{" "}
              <Link className="agregar-auth" to="/login">
                inicia sesión
              </Link>{" "}
              para agregar servicios.
            </p>
          </div>
        )}
        {isAuthenticated && <AddService />}
      </main>
    </>
  );
}

export default AllServicesPage;
