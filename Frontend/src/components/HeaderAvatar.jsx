import Avatar from "./Avatar";

const HeaderAvatar = ({ user }) => {
  return (
    <div className="header-avatar">
      <Avatar avatar={user.picture} username={user.name} />
    </div>
  );
};

export default HeaderAvatar;
