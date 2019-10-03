import * as React from "react";
import { useState } from 'react';
import classNames from 'classnames/bind';
import ModelOptions from './ModelOptions';

const Model = props => {
  const [isHover, setIsHover] = useState(false);
  const [ShowModelInfo, setShowModelInfo] = useState(false);

  const { model, isRunning, Sessions, onProcess } = props;

  var ModelStyle = classNames({
    Model: true,
    ModelSelected: props.selected === props.model.name
  });

  return (
    <>
      <div
        className={ModelStyle}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => {
          props.handleClick(props.model.name)
        }}
      >
        <p className="ModelDisplayName">{props.model.name}</p>
        <div className="ModelButtonWrapper">
          {isHover && (
            <>
              <div
                className="ModelLearnInfo"
                onMouseEnter={() => setShowModelInfo(true)}
                onMouseLeave={() => setShowModelInfo(false)}
              >
                <svg width="15" height="15" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.875 13.875C-4.625 32.375 -4.625 62.375 13.875 80.875C32.375 99.375 62.375 99.375 80.875 80.875C99.375 62.375 99.375 32.375 80.875 13.875C62.375 -4.625 32.375 -4.625 13.875 13.875ZM49.275 19.875C53.275 19.875 56.475 23.175 56.475 27.175C56.475 31.175 53.175 34.475 49.275 34.475C45.275 34.475 41.975 31.175 41.975 27.075C41.975 23.075 45.275 19.875 49.275 19.875ZM59.575 68.775C59.375 69.375 58.975 70.075 58.575 70.475C55.975 73.175 52.775 74.775 48.975 74.775C47.175 74.775 45.475 74.775 43.675 74.475C40.775 74.075 37.075 70.475 37.575 66.675C37.975 64.075 38.375 61.475 38.775 58.875C39.575 54.375 40.375 49.775 41.175 45.275C41.175 44.975 41.275 44.675 41.275 44.375C41.275 42.475 40.675 41.775 38.775 41.575C37.975 41.475 37.175 41.375 36.375 41.175C35.475 40.875 34.975 40.075 35.075 39.375C35.175 38.575 35.675 38.075 36.675 37.875C37.175 37.775 37.775 37.775 38.375 37.775C40.575 37.775 42.775 37.775 45.075 37.775C47.475 37.775 49.775 37.775 52.175 37.775C53.875 37.775 54.875 38.575 54.875 40.275C54.875 41.675 54.675 43.075 54.375 44.475C53.475 49.675 52.475 54.775 51.575 59.975C51.275 61.675 50.875 63.375 50.675 65.075C50.575 65.875 50.675 66.775 50.875 67.575C51.175 68.675 51.975 69.275 53.075 69.175C53.975 69.075 54.875 68.775 55.775 68.375C56.475 68.075 57.075 67.575 57.775 67.375C58.975 66.975 59.875 67.675 59.575 68.775Z" fill="white" />
                </svg>
              </div>
              {ShowModelInfo && (
                <div
                  className='ModelInfo'
                  onMouseEnter={() => setShowModelInfo(true)}
                  onMouseLeave={() => setShowModelInfo(false)}
                >
                  <div
                    style={{
                      width: '100%',
                      minWidth: '270px',
                      height: '150px',
                      backgroundImage: `url(${props.model.coverImage})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                    }}
                  />
                  <p className='ModelDescription' >{props.model.description}</p>
                </div>
              )
              }
            </>
          )}
        </div>
      </div>
      {props.selected === props.model.name && (
        <ModelOptions
          Sessions={Sessions}
          allLayers={props.allLayers}
          isRunning={isRunning}
          model={props.model}
          startModelSession={(modelOptions, body) => {
            if (!isRunning) {
              props.startModelSession(
                model.defaultVersionId, modelOptions, body)
            }
          }}
          stopModelSession={() => {
            props.stopSession()
          }}
          onProcess={props.onProcess}
        />
      )}
    </>
  );
};
export default Model;