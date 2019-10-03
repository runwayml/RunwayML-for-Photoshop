import * as React from "react";

const NavigateTabs = props => {
  const { currentView, amountModelsRunning } = props;
  return (
    <>
      <div
        className="NavigateBar"
        style={{
          width: '100%'
        }}
      >
        <div
          className="NavigateItem"
          onClick={() => {
            props.setView('ALL')
          }}
        >
          <button
            className="NavigateButton"
            style={{
              background: currentView === 'ALL' ? '#1d1d1d' : '#424242',
              borderRight: currentView === 'ALL' ?  '1px solid  #3b3b3b' : 'none',
              color: currentView === 'ALL' ? 'white' : '#5f5f5f',
              borderBottom:  currentView === 'ALL' ?  'none' : '1px solid #3b3b3b'

            }}
          >All Models</button>
        </div>
        <div
          className="NavigateItem"
          onClick={() => {
            props.setView('RUNNING')
          }}
        >
          <button
            className="NavigateButton"
            style={{
              background: currentView === 'RUNNING' ? '#1d1d1d' : '#424242',
              color: currentView === 'RUNNING' ? 'white' : '#5f5f5f',
              borderLeft: currentView === 'RUNNING' ?  '1px solid  #3b3b3b' : 'none',
              borderBottom:  currentView === 'RUNNING' ?  'none' : '1px solid #3b3b3b'
            }}
          >
            <p>
              <span 
                className="RunningModelsNotification"
                style={{
                  background: currentView === 'RUNNING' ? '#2bfda4' : '#4c4c4c',
                  color: currentView === 'RUNNING' ? '#1d1d1d' : '#00864d',
                }}
              >
                {amountModelsRunning}
              </span>
              Running Models
              </p>
            </button>
        </div>
      </div>
    </>
  );
};
export default NavigateTabs;