import { useRef, useEffect } from "react";

// GET RANDOM VECTOR

const sample = (mean = 0, sigma = 1, nSamples = 10) => {
  let runTotal = 0;
  for (let i = 0; i < nSamples; i++) {
    runTotal += Math.random();
  }
  return (sigma * (runTotal - nSamples / 2)) / (nSamples / 2) + mean;
};

export const randomVector = (length, mean, sigma) => {
  const ret = [];
  for (var i = 0; i < length; i++) {
    ret.push(sample(mean, sigma));
  }
  return ret;
};

export const timeout = ms => new Promise(res => setTimeout(res, ms))

// REACT SELECT

export const customStylesSelect = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted grey',
    padding: 14,
    color: state.isSelected ? '#fff' : '#1c1c1c',
  }),
  control: base => ({
    ...base,
    background: '#fff',
  })
}

export const capitalizeString = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const formatFieldName = (str, sep = '') => {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/_/g, ' ')
    .split(' ')
    .map(s => capitalizeString(s))
    .join(' ');
}

export const useInterval = (callback, delay, runImmediately = false) => {
  const savedCallback = useRef(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    if (runImmediately) tick();
    return () => clearInterval(id);
  }, [delay]);
}
