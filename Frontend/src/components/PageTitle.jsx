import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const updatePageTitle = () => {
      const currentPath = window.location.pathname;
      let pageTitle = "Portal Digital";

      if (currentPath === "/") {
        pageTitle = "Página de inicio";
      } else if (currentPath === "/about") {
        pageTitle = "Conócenos";
      } else if (currentPath === "/services") {
        pageTitle = "Servicios";
      } else if (currentPath === "/login") {
        pageTitle = "Iniciar sesión";
      } else if (currentPath === "/signup") {
        pageTitle = "Registrarse";
      } else if (currentPath === "/users") {
        pageTitle = "Usuari@s";
      } else if (currentPath === "*") {
        pageTitle = "404 - Not Found";
      } else if (currentPath.startsWith("/profile/")) {
        pageTitle = "Información de perfil";
      } else if (currentPath.startsWith("/service/")) {
        pageTitle = "Información de servicio";
      } else if (currentPath.startsWith("/user/")) {
        pageTitle = "Información de usuario";
      }

      document.title = "portalDigital | " + pageTitle;
    };
    setTimeout(updatePageTitle, 0);
  }, [location]);

  return null;
}

export default PageTitle;
