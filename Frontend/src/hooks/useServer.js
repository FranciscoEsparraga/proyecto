import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";

import Http from "../services/Http.js";
import useAuth from "./useAuth.js";

import { useNavigate } from "react-router-dom";

function useServer() {
  const { token, setUser } = useAuth();
  const navigate = useNavigate();

  const handleResponse = ({ data, loading, error }) => {
    if (data?.data) {
      const user = jwt_decode(data.data);
      setUser({ user, token: data.data });
      toast.success(`Bienvenid@ ${user.nickname}`, { duration: 5000 });
    }

    if (error) {
      toast.error(error.message);
      // navigate("/404");
    }

    return { data, loading, error };
  };

  return {
    get: ({ url }) => Http({ method: "GET", url, token }).then(handleResponse),
    post: ({ url, body, headers }) =>
      Http({ method: "POST", url, body, token, headers }).then(handleResponse),
    put: ({ url, body }) =>
      Http({ method: "PUT", url, body, token }).then(handleResponse),
    patch: ({ url, body }) =>
      Http({ method: "PATCH", url, body, token }).then(handleResponse),
    delete: ({ url }) =>
      Http({ method: "DELETE", url, token }).then(handleResponse),
  };
}

export default useServer;
