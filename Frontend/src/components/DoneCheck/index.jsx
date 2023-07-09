import React, { useState, useEffect } from "react";
import "./style.css";

function DoneCheck({ complete, setComplete, handleMarkAsDone }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await handleMarkAsDone();
    setIsLoading(false);
  };

  return (
    <div className="button-done">
      <button className="button-done-position" onClick={handleClick}>
        Marcar como hecho
      </button>
    </div>
  );
}

export default DoneCheck;
