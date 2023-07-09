import "./style.css";
import { useEffect, useState } from "react";
import useServer from "../../hooks/useServer";

//getUserPhoto desde backend
const AvatarHeader = ({ user = "" }) => {
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
        <div>
          <img
            className="avatarHeader"
            src={userAvatar}
            alt={`Avatar de ${user}`}
          />
        </div>
      </div>
    </>
  );
};

export default AvatarHeader;
