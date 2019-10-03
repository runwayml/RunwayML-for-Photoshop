import * as React from "react";
import {useState} from 'react';
import Switch from "react-switch";

const Footer = props => {

  const [IsChecked, setIsChecked] = useState(true)

  const updateLocation = (isRemote) =>{
    setIsChecked(isRemote)
    props.setRunLocation(isRemote ? 'Remote' : 'Local')
  }
  return (
  <>
   <section className="Footer">
    <div>
      <label htmlFor="material-switch" className="SwitchLocation">
        <span>{IsChecked ? 'Remote' : 'Local' }</span>
        <Switch
          checked={IsChecked}
          onChange={()=> {
            updateLocation(!IsChecked)
          }}
          onColor="#808080"
          onHandleColor="#2bfda4"
          handleDiameter={12}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={10}
          width={28}
          className="react-switch"
          id="material-switch"
          disabled={props.amountModelsRunning > 0}
        />
      </label>
    </div>   
    <div className="FooterStopButton">
      <button className={props.amountModelsRunning > 0 ? "buttonCTASTOP" : "buttonCTADISABLED"} 
        onClick={() => {
          props.updateStatus()
        }}
      >
        Stop {props.amountModelsRunning} Models  
      </button>
    </div>
  </section>
  </>
  );
};

export default Footer;
