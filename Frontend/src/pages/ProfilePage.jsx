import React from "react";
import Profile from "../components/Profile";
import { useParams } from "react-router";

function ProfilePage() {
  const { nickname } = useParams();

  return (
    <main>
      <Profile user={nickname} />
    </main>
  );
}

export default ProfilePage;
