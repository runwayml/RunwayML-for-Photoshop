import * as React from "react";
import Select from 'react-select';
import { customStylesSelect, formatFieldName } from '../../utils/utils';


interface ComponentProps {
  input: any;
  layers: Array<any>;
  setSelectedLayer: (e) => void;
  selectedLayerId: number;
  activeLayerId: number;
  fixed: boolean;
}

const ImageType = (props: ComponentProps) => {
 
  const { input, layers, fixed, selectedLayerId, activeLayerId } = props;

  const activeLayer = layers.find(l => l.id === activeLayerId);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="InputType" >
      <label htmlFor={input.name}>
        {formatFieldName(input.name) + ':'}
      </label>
      {fixed && activeLayer && <p>{activeLayer.name}</p>}
      {!fixed && selectedLayer && 

      
      <Select
        menuPlacement='auto'
        options={layers.map(l => ({
          label: l.name,
          value: l.id
        }))}
        styles={customStylesSelect}
        value={{label: selectedLayer.name, value: selectedLayer.id}}
        onChange={(e) => {
          props.setSelectedLayer(e.value)
        }}
      />}
    </div>
  )
};
export default ImageType;