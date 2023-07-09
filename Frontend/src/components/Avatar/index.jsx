import "./avatar.css";
import { useEffect, useState } from "react";
import useServer from "../../hooks/useServer";

//getUserPhoto desde backend
const Avatar = ({ user = "" }) => {
  const [userAvatar, setUserAvatar] = useState("");

  const { get } = useServer();
  const fetchUserImg = async (user) => {
    try {
      const { data } = await get({ url: `/userAvatar/${user}` });
      setUserAvatar(data.userAvatar.userPhoto);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUserImg(user);
  }, []);

  return (
    <>
      <div className="avatar-container">
        <img className="avatar" src={userAvatar} alt={`Avatar de ${user}`} />
      </div>
    </>
  );
};

export default Avatar;
