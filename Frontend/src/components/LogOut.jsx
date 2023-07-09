import { useEffect } from "react";
import { localStorageKey } from "../config";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LogOut() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      window.location.reload();
    };

    toast
      .promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: "Cerrando sesión...",
      })
      .then(logout);

    return () => {
      toast.dismiss();
    };
  }, [user.user.nickname, navigate]);

  return;
}

export default LogOut;
