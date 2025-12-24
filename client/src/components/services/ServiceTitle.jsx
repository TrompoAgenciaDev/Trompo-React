import React from "react";
import "../../assets/styles/service-title.css";

const ServiceTitle = ({ area, titulo }) => {
  return (
    <div className="full-container">
      <div className="full-container title-container-disegn black-bg">
        <div className="container title-container">
          <h3 className="display-title">[{area}]</h3>
        </div>
        <div className="container">
          <div className="container grid-container">
            <div className="container">
              <div className="title-creative">
                <h1 className="display-title">{titulo}</h1>                
              </div>
            </div>
            <div className="container">
              <div className="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width={62} height={62} viewBox="0 0 62 62" fill="none">
                  <path
                    d="M31 7L31 55M31 55L55 31M31 55L7 31"
                    stroke="#FED332"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;

