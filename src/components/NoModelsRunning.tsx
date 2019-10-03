import * as React from "react";
import Logo from '../img/logo-green_animated.svg';

const NoModelsRunning  = () => {
  return (
    <div className="NoAllModels">
    <img src={Logo} className="Logo" alt="Logo" />
    <br/>
     No Models running
  </div>
  );
};

export default NoModelsRunning ;