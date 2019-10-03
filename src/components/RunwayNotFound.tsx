import * as React from "react";
import Logo from '../img/logo-green_animated.svg';

const RunwayNotFound  = () => {

  return (
    <div className="RunwayNotFound">
      <img src={Logo} className="Logo" alt="Logo" />
      <br/>
      <p><b> RunwayML Not Detected</b></p>
      <br/>
      <p>Make sure the RunwayML app is running and you are signed in.</p>
      <br/>
      <p>Don’t have Runway?</p>
      <a href="https://runwayml.com/download" target='_blank'>https://runwayml.com/download</a>
    </div>
  );
};
export default RunwayNotFound ;