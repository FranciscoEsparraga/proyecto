import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useServer from "../hooks/useServer";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./deleteButtons.css";

function DeleteService({ serviceId, onDelete }) {
  const { delete: deleteService, get } = useServer();
  const { user, isAuthenticated } = useAuth();
  const { id: idService } = useParams();
  const navigate = useNavigate();
  const [serviceOwner, setServiceOwner] = useState({});

  const handleDelete = async () => {
    try {
      await deleteService({ url: `/service/${serviceId}/delete` });
      toast.success("Servicio borrado exitosamente");
      navigate("/services");
      // onDelete();
    } catch (error) {
      toast.error("Error al borrar el servicio");
    }
  };

  const fetchServiceOwner = async () => {
    try {
      const { data } = await get({ url: `/service/${idService}` });
      setServiceOwner(data.message);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchServiceOwner();
  }, []);

  return (
    <>
      {/* {(userOwner === user.user.id || user.user.admin)} */}
      {/* user.user.admin || serviceOwner.user_id === user.user.id */}
      {isAuthenticated &&
      !serviceOwner.done && //Si esta hecho, no podemos borrar el servicio
      (user.user.admin || serviceOwner.user_id === user.user.id) ? (
        <button className="deleteButton" onClick={handleDelete}>
          Borrar servicio
        </button>
      ) : (
        ""
      )}
    </>
  );
}

export default DeleteService;
