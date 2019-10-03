import * as React from "react";
import { formatFieldName } from "../../utils/utils";

interface ComponentProps {
  input: any;
  setTextArea: (e) => void;
}

const TextType = (props: ComponentProps) => {

  const {input } = props;

  return (
    <div className="InputType" >
    <label htmlFor={input.name}>
      {formatFieldName(input.name) + ':'}
    </label>
    <textarea
      name={input.name}
      className="topcoat-textarea"
      rows={6}
      cols={36}
      placeholder="Write Content"
      onChange={(e) => {
        props.setTextArea(e.target.value)
      }}
    />
  </div>
  )
};
export default TextType;