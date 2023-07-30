import React, { useState } from "react";

const options = [
  { value: "100", label: "100%" },
  { value: "90", label: "90%" },
  { value: "83.33333", label: "83,33333%" },
  { value: "80", label: "80%" },
  { value: "75", label: "75%" },
  { value: "70", label: "70%" },
  { value: "66.66667", label: "66,66667%" },
  { value: "60", label: "60%" },
  { value: "50", label: "50%" },
  { value: "40", label: "40%" },
  { value: "33.33333", label: "33,33333%" },
  { value: "30", label: "30%" },
  { value: "25", label: "25%" },
  { value: "20", label: "20%" },
  { value: "16.66667", label: "16,66667%" },
  { value: "14.28571", label: "14,28571%" },
  { value: "12.5", label: "12,5%" },
  { value: "11.11111", label: "11,11111%" },
  { value: "10", label: "10%" },
  { value: "5", label: "5%" },

  { value: "0", label: "0%" },

  { value: "-5", label: "-5%" },
  { value: "-10", label: "-10%" },
  { value: "-11.11111", label: "-11,11111%" },
  { value: "-12.5", label: "-12,5%" },
  { value: "-14.28571", label: "-14,28571%" },
  { value: "-16.66667", label: "-16,66667%" },
  { value: "-20", label: "-20%" },
  { value: "-25", label: "-25%" },
  { value: "-30", label: "-30%" },
  { value: "-33.33333", label: "-33,33333%" },
  { value: "-40", label: "-40%" },
  { value: "-50", label: "-50%" },
  { value: "-60", label: "-60%" },
  { value: "-66.66667", label: "-66,66667%" },
  { value: "-70", label: "-70%" },
  { value: "-75", label: "-75%" },
  { value: "-80", label: "-80%" },
  { value: "-83.33333", label: "-83,33333%" },
  { value: "-90", label: "-90%" },
  { value: "-100", label: "-100%" },
];

const ScoreDropdown = ({ initialState, stateHandler, negative, enabled }) => {
  if (enabled === undefined) {
    enabled = true;
  }

  if (negative === undefined) {
    negative = true;
  }

  const [selectedOption, setSelectedOption] = useState(() =>
    options.find((option) => option.value === initialState.toString())
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
    <div className="box-border w-[180px] h-[34px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
      <div className="flex-1 relative">
        <select
          value={selectedOption.value}
          onChange={handleOptionChange}
          className="flex-1 relative w-[150px] text-base"
        >
          {options.map((option) => {
            if (!negative && option.value.charAt(0) === '-') {
              return <></>;
            }
            
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  );
};

export default ScoreDropdown;
