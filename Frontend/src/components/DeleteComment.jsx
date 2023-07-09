import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useServer from "../hooks/useServer";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./deleteButtons.css";

function DeleteComment({ commentId, onDelete }) {
  const { delete: deleteComment, get } = useServer();
  const { id: idService } = useParams();
  const [serviceOwner, setServiceOwner] = useState({});
  const [commentOwner, setcommentOwner] = useState({});
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteComment({
        url: `/service/${idService}/comments/${commentId}/delete`,
      });
      toast.success("Comentario borrado exitosamente");
      // onDelete();
    } catch (error) {
      toast.error("Error al borrar el comentario");
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

  const fetchCommentOwner = async () => {
    try {
      const { data } = await get({ url: `/service/${idService}` });
      setServiceOwner(data.message);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCommentOwner();
  }, []);

  return (
    <>     
        <button className="deleteButton2"
        onClick={handleDelete}>
        Borrar comentario
      </button>
    </>
  );
}

export default DeleteComment;


