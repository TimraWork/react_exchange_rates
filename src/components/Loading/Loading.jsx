
import React from "react";
import "./Loading.scss";

export const Loading = ({color, size}) => {
  return (
    <div className= {`loading ${color ? `loading--${color}` : ''} ${size ? `loading--${size}` : ''}`}>
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
}
