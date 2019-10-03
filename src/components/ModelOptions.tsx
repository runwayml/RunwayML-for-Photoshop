import * as React from "react";
import { useState, useEffect } from 'react';
import CategoryType from './InputTypes/CategoryType';
import TextType from './InputTypes/TextType';
import NumberType from './InputTypes/NumberType';
import ImageType from './InputTypes/ImageType';
import Flash from './Flash';
import {
  layerContentToBase64,
  getAllLayers,
  getActiveLayerId
} from '../utils/photoshop';
import { randomVector, useInterval } from '../utils/utils';

const ModelOptions = props => {
  const options = props.model.options;
  const inputs = props.model.commands[0].inputs;
  const [layers, setLayers] = useState([]);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [ContentInputForKey, setContentInputForKey] = useState({});
  const [modelOptions, setModelOptions] = useState({});
  const { isRunning, Sessions, model } = props;

  const modelInSession = Sessions && Sessions.find(s => s.model.defaultVersionId === model.defaultVersionId);
  const runningStatus = modelInSession ? modelInSession.runningStatus : 'NOT_RUNNING';

  const setOption = (key, value) => setModelOptions({...modelOptions, [key]: value})
  const setInput = (key, value) => setContentInputForKey({...ContentInputForKey, [key]: value})

  const updateLayers = () => {
    getAllLayers().then(setLayers);
    getActiveLayerId().then(setActiveLayerId);
  }

  useInterval(updateLayers, 500, true);

  useEffect(() => {
    options.map((option) => {
      if (option.type === 'category' || option.type === 'file') {
        setOption(option.name, option.oneOf[0])
      } else if (option.type === 'number') {
        setOption(option.name, option.default)
      }
    })
  }, []);


  useEffect(() => {
    inputs.map((input, i) => {
      const isFirstImageInput = inputs.findIndex(inp => inp.type === 'image' || inp.type === 'segmentation') === i;
      if (isFirstImageInput) return;
      if (ContentInputForKey[input.name]) return;
      if (input.type === 'category') {
        setInput(input.name, input.oneOf[0])
      } else if (input.type === 'number') {
        setInput(input.name, input.default)
      } else if (input.type === 'image' || input.type === 'segmentation') {
        if (!isFirstImageInput) {
          setInput(input.name, layers.length > 0 ? layers[0].id : null);
        }
      }
    })
  }, [layers]);

  const generateBody = async () => {
    var body = {};
    for (const input of inputs) {
      switch (input.type) {
        case 'category':
          body[input.name] = ContentInputForKey[input.name];
          break;
        case 'vector':
          const generatedVector = randomVector(input.length, input.samplingMean, input.samplingStd);
          body[input.name] = generatedVector
          break;
        case 'text':
          body[input.name] = ContentInputForKey[input.name];;
          break;
        case 'number':
          body[input.name] = ContentInputForKey[input.name];;
          break;
        case 'image':
          let imageLayer = await layerContentToBase64(ContentInputForKey[input.name]);
          body[input.name] = imageLayer;
          break;
        case 'segmentation':
          let segmentedLayer = await layerContentToBase64(ContentInputForKey[input.name], 'image/png');
          body[input.name] = segmentedLayer;
          break;
      }
    }
    return body;
  }

  let btnTxt;
  let btnClass;

  if (isRunning && runningStatus === 'STARTING') {
    btnTxt = 'Model Starting'
    btnClass = 'buttonCTADISABLED'
  } else if (isRunning && runningStatus === 'RUNNING') {
    btnTxt = 'Re-Generate'
    btnClass = 'buttonCTA'
  } else if (!isRunning) {
    btnTxt = 'Run and Generate'
    btnClass = 'buttonCTA'
  }

  return (
    <>
      <div className="ModelOptions">

        {options
          .filter(opt => opt.type === 'category' || opt.type === 'file')
          .map((opt, i) => {
            return <CategoryType
              key={i}
              input={opt}
              value={modelOptions[opt.name]}
              categories={opt.oneOf}
              setCategory={(value) => {
                setOption(opt.name, value);
              }}
            />
          })}

        {inputs.map((input, i) => {
          const isFirstImageInput = inputs.findIndex(inp => inp.type === 'image' || inp.type === 'segmentation') === i;
          const value = ContentInputForKey[input.name];
          
          switch (input.type) {
            case 'category':
              return (
                <CategoryType
                  key={i}
                  input={input}
                  value={ContentInputForKey[input.name]}
                  categories={input.oneOf}
                  setCategory={(cat) => setInput(input.name, cat)}
                />
              )
            case 'text':
              return (
                <TextType
                  key={i}
                  input={input}
                  setTextArea={(text) => setInput(input.name, text)}
                />
              )
            case 'number':
              return (
                <NumberType
                  key={i}
                  input={input}
                  value={value}
                  onChange={(num) => setInput(input.name, num)}
                />
              )
            case 'image':
            case 'segmentation':
              return (
                <ImageType
                  key={i}
                  input={input}
                  layers={layers}
                  fixed={isFirstImageInput}
                  activeLayerId={activeLayerId}
                  selectedLayerId={ContentInputForKey[input.name]}
                  setSelectedLayer={(layerId) => setInput(input.name, layerId)}
                />
              )
          }
        })}

        <div className='ButtonActions'>
          <button
            type='button'
            className={btnClass}
            onClick={async (e) => {
              const body = await generateBody();
              if (isRunning) {
                props.onProcess(body)
              } else {
                props.startModelSession(modelOptions, body)
              }
            }}
          >
            {btnTxt}
          </button>
          {isRunning && (
            <button
              type='button'
              className="buttonCTASTOP"
              onClick={() => {
                props.stopModelSession()
              }}
            >
              Stop Model
            </button>
          )}
        </div>

        {isRunning && runningStatus === 'STARTING' && <Flash message={'Model Starting'} />}
      </div>
    </>
  )
}
export default ModelOptions;