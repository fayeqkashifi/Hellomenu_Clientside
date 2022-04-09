import makeAnimated from "react-select/animated";
import { components } from "react-select";

export const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          className="mx-1"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

export const animatedComponents = makeAnimated();
