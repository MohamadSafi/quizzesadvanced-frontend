import React, { useState } from "react";

const options = [
  { value: "CUSTOM", label: "Custom" },
  { value: "PROPORTIONAL", label: "Proportional" },
  { value: "ZERO_IF_AT_LEAST_ONE_IS_WRONG", label: "Zero if at least one is wrong" },
];

const GradingSchemaDropdown = ({ initialState, stateHandler, enabled }) => {
  if (enabled === undefined) {
    enabled = true;
  }

  const [selectedOption, setSelectedOption] = useState(() =>
    options.find((option) => option.value === initialState)
  );

  const handleOptionChange = (event) => {
    if (!enabled) {
      return;
    }

    const selectedValue = event.target.value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    setSelectedOption(selectedOption);

    stateHandler(selectedOption.value);
  };

  return (
    <div className="box-border w-[270px] h-[34px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
      <div className="flex-1 relative">
        <select
          value={selectedOption.value}
          onChange={handleOptionChange}
          className="flex-1 relative w-[240px] text-base"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GradingSchemaDropdown;
