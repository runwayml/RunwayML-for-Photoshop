import * as React from "react";
import { Range } from 'react-range';
import { formatFieldName } from "../../utils/utils";

interface ComponentProps {
  input: any;
  onChange: (e) => void;
  value: number;
}

const NumberType = (props: ComponentProps) => {
  const { input, value, onChange } = props;

  return (
    <div className="InputType" >
      <label htmlFor={input.name}>
        {formatFieldName(input.name) + ':'}
      </label>

      <Range
        step={input.step}
        min={input.min}
        max={input.max}
        values={[value]}
        onChange={values => {
          onChange(values[0]);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '95%',
              borderRadius: '25px',
              backgroundColor: '#ccc',
              margin: '0 auto'
            }}
          >
            {children}
            
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              position:'sticky',
              top: '0',
              height: '16px',
              width: '16px',
              borderRadius: '50%',
              borde:'1px solid #d0d0d0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff'
            }}
          >
          </div>
        )}
      />

 
    </div>
  )
};
export default NumberType;