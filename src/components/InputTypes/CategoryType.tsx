import * as React from "react";
import Select from 'react-select';
import { customStylesSelect, formatFieldName } from '../../utils/utils';

interface ComponentProps {
  input: any;
  categories: Array<string>;
  value: string;
  setCategory: (e) => void;
}

const CategoryType = (props: ComponentProps) => {

  const { input, categories, value } = props;


  return (
    <div className="InputType" >
      <label htmlFor={input.name}>
        {formatFieldName(input.name) + ':'}
      </label>
      <Select
        menuPlacement='auto'
        value={{label: value, value}}
        options={categories.map(c => ({
          label: c,
          value: c
        }))}
        styles={customStylesSelect}
        onChange={(e) => {
          props.setCategory(e.value)
        }}
      />
    </div>
  )
};
export default CategoryType;



