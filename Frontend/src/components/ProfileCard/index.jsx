import React from "react";
import "./style.css";
const ProfileCard = ({ formData }) => {
  return (
    <>
      <div className="profileCard">
        <h3 className="title">Datos personales:</h3>
        <div className="field">
          <span className="fieldName">Nickname:</span>
          <span className="fieldData">{formData.nickname}</span>
        </div>
        <div className="field">
          <span className="fieldName">Email:</span>
          <span className="fieldData">{formData.email}</span>
        </div>
        <div className="field">
          <span className="fieldName">Nombre:</span>
          <span className="fieldData">{formData.name}</span>
        </div>
        <div className="field">
          <span className="fieldName">Apellido:</span>
          <span className="fieldData">{formData.surname}</span>
        </div>
        <div className="field">
          <span className="fieldName">Biografía:</span>
          <span className="fieldData">{formData.biography}</span>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
