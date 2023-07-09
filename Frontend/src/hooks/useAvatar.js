import { useEffect, useState } from "react";
import useServer from "./useServer";

function useAvatar(id, token) {
  const [avatar, setAvatar] = useState([]);

  const { get } = useServer();

  const fetchAvatar = async () => {
    const { data } = await get({
      url: `/userphoto/${id}`,
    });
    setAvatar(data);
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return avatar;
}

export default useAvatar;
