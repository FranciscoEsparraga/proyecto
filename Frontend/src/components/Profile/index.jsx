import React, { useEffect, useState } from "react";
import EditProfile from "../EditProfile";
import ServicesByUser from "../ServicesByUser";
import useServer from "../../hooks/useServer";
import ProfileCard from "../ProfileCard";
import "./style.css";
import useAuth from "../../hooks/useAuth";

function Profile({ user }) {
  const [currentUser, setCurrentUser] = useState({});
  const { get } = useServer();
  const { user: currentToken } = useAuth();

  const fetchUser = async (user) => {
    try {
      const { data } = await get({ url: `/useravatar/${user}` });
      if (data.status) {
        setCurrentUser(data.userAvatar);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUser(user);
  }, []);

  return currentUser?.id ? (
    <>
      <section className="userData">
        <h2 className="profileOwner">{`Perfil de ${user}`}</h2>
        {/* <Avatar user={user} id="profile-avatar" /> */}
      </section>
      <section>
        <ProfileCard formData={currentUser} />
      </section>
      <section>
        {currentToken &&
          currentToken.user &&
          user === currentToken.user.nickname && (
            <EditProfile nickname={user} />)}
      </section>
      <section>
        <ServicesByUser nickname={user} />
      </section>
    </>
  ) : (
    ""
  );
}

export default Profile;
