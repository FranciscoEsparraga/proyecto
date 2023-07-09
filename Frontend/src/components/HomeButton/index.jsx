import { NavLink } from "react-router-dom";
import "./style.css";

function HomeButton() {
  return (
    <NavLink to="/">
      <img src="\..\..\..\public\Logo.png" className="home-button" />
    </NavLink>
  );
}

export default HomeButton;
