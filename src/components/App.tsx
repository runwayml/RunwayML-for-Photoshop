import * as React from "react";
import { useState, useEffect } from 'react';
import RunwayNotFound from './RunwayNotFound';
import NavigateTabs from './NavigateTabs';
import Model from './Model';
import Footer from './Footer';
import Flash from './Flash';
import NoModelsRunning from './NoModelsRunning';
import {
  getAllModels,
  healthcheck,
  startModelSession,
  stopModelSession,
  getModelSessions,
  stopAllModelSessions,
  runModel,
} from '../utils/api';

import { placeOutput } from '../utils/photoshop'

const App = props => {
  const [AllModels, setAllModels] = useState([])
  const [Sessions, setSessions] = useState([])
  const [ModelSelected, setModelSelected] = useState()
  const [HealthCheck, setHealthCheck] = useState()
  const [ModelsView, setModelsView] = useState('ALL')
  const [filter, setFilter] = useState('')
  const [runLocation, setRunLocation] = useState("Remote")
  const [processingOutput, setProcessingOutput] = useState(false)
  const [dataToProcess, setDataToProcess] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  }

  useEffect(() => {
    updatePlugin();
  }, []);

  useEffect(() => {
    Object.keys(dataToProcess).forEach(versionId => {
      const modelSession = Sessions.find(s => s.modelVersionId === parseInt(versionId));
      if (modelSession && modelSession.runningStatus === 'RUNNING') {
        processData(dataToProcess[versionId], parseInt(versionId));
        delete dataToProcess[versionId];
      }
    })
  });

  const updatePlugin = async () => {
    await getModels();
    await getSessions();
  }

  useEffect(() => {
    const checkHealth = async () => {
      const response = await healthcheck();
      setHealthCheck(response);
      if (!HealthCheck && response) {
        updatePlugin();
      }
    }
    checkHealth();
    const intervalId = setInterval(() => {
      checkHealth();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const getModels = async () => {
    const response = await getAllModels();
    const psModels = response.models.filter(m =>
      m.commands && (m.commands[0].outputs[0].type === 'image' || m.commands[0].outputs[0].type === 'segmentation')
    )
    setAllModels(psModels)
  }

  const getSessions = async () => {
    const response = await getModelSessions();
    setSessions(response.modelSessions);
  }

  const processData = async (body, modelVersionId) => {
    const modelSession = Sessions.find(s => s.model.defaultVersionId === modelVersionId);
    if (!modelSession || modelSession.runningStatus !== 'RUNNING') return;
    setProcessingOutput(true)
    const url = `${modelSession.url}/${modelSession.model.commands[0].name}`;
    const output = await runModel(url, body);
    const lookup = modelSession.model.commands[0].outputs.filter(out => {
      out.type === 'image' || out.type === 'text'
      return out
    });
    const outputName = lookup[0].name;
    const img = output[outputName];
    placeOutput(modelSession.model.name, outputName, img);
    setProcessingOutput(false)
  }

  const startSession = async (
    modelVersionId,
    modelOptions,
    providerOptions,
    body
  ) => {
    try {
      await startModelSession(
        modelVersionId,
        modelOptions,
        providerOptions
      );
      updatePlugin();
      setDataToProcess({ ...dataToProcess, [modelVersionId]: JSON.parse(JSON.stringify(body)) });
    } catch (e) {
      showError(e.message);
    }
  }

  const stopSession = async (id) => {
    const response = await stopModelSession(id);
    updatePlugin();
  }

  const stopAllModels = async () => {
    const response = await stopAllModelSessions();
    if (response.success) {
      updatePlugin();
    } else {
      stopAllModels()
    }
  }

  const photoshopRunningModels = Sessions.filter(m => m.application === 'Photoshop')

  const searchResults = AllModels
    .filter(m =>
      m.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((m, i) => (
      <Model
        key={i}
        model={m}
        runLocation
        selected={ModelSelected}
        Sessions={Sessions}
        isRunning={photoshopRunningModels.some(psm => psm.model.defaultVersionId === m.defaultVersionId)}
        handleClick={(modelSelected) => {
          setModelSelected(modelSelected)
        }}
        onProcess={(body) => processData(body, m.defaultVersionId)}
        startModelSession={(
          modelVersionId,
          modelOptions,
          body) => {
          startSession(
            modelVersionId,
            modelOptions,
            {
              runLocation
            },
            body)
        }}
        stopSession={() => {
          const SessionModel = Sessions.filter(sm => sm.model.defaultVersionId === m.defaultVersionId)
          stopSession(SessionModel[0].id)
        }}
      />
    ))

  return (
    <>
      {HealthCheck ? (
        <>
          <NavigateTabs
            setView={(view) => setModelsView(view)}
            currentView={ModelsView}
            amountModelsRunning={photoshopRunningModels.length}
          />

          <div className="Header">
            <input
              type="search"
              placeholder="Search for models"
              id="search"
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
          </div>
          {ModelsView === 'ALL' && (
            <div className="AllModels">
              {searchResults}
            </div>
          )}
          {ModelsView === 'RUNNING' && photoshopRunningModels.length > 0 ? (

            <div className="AllModels">
              {photoshopRunningModels
                .sort((a, b) => a.model.name.localeCompare(b.model.name))
                .map((model, i) => {
                return (
                  <Model
                    key={i}
                    model={model.model}
                    selected={ModelSelected}
                    Sessions={Sessions}
                    runLocation
                    isRunning={photoshopRunningModels.some(psm => psm.model.defaultVersionId === model.model.defaultVersionId)}
                    handleClick={(modelSelected) => {
                      setModelSelected(modelSelected)
                    }}
                    stopSession={() => { stopSession(model.id) }}
                    onProcess={(body) => processData(body, model.defaultVersionId)}
                  />
                )
              })}
            </div>
          ) : (
              <NoModelsRunning />
            )
          }

          <Footer
            amountModelsRunning={photoshopRunningModels.length}
            updateStatus={() => stopAllModels()}
            setRunLocation={(location) => setRunLocation(location)}
          />
        </>
      ) :
        <RunwayNotFound />
      }

      {processingOutput &&  <Flash message={'Processing Output'} />}
      {errorMessage && <Flash message={errorMessage} error />}
    </>
  );
};
export default App;