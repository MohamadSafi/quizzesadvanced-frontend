import { useEffect, useState } from "react";

const Checkbox = ({ initialState, stateHandler, enabled }) => {
  const canBeDefault = typeof initialState !== "boolean";

  if (enabled === undefined) {
    enabled = true;
  }

  let realInitialState;
  if (canBeDefault) {
    realInitialState = initialState;
  } else {
    realInitialState = initialState ? "TRUE" : "FALSE";
  }

  const [state, setState] = useState(realInitialState);

  const stateSwitcher = () => {
    if (!enabled) {
      return;
    }

    switch (state) {
      case "FALSE":
        setState("TRUE")
        break;
      case "TRUE":
        setState(canBeDefault ? "DEFAULT" : "FALSE")
        break;
      default:
        setState("FALSE")
        break;
    }
  };

  useEffect(() => {
    stateHandler(canBeDefault ? state : (state === "TRUE" ? true : false))
  }, [state]);


  switch (state) {
    case "FALSE":
      return (
        <div className="bg-crimson w-7 h-7 overflow-hidden shrink-0 flex flex-col items-center justify-center cursor-pointer" onClick={stateSwitcher}>
          <img className="relative w-5 h-5" alt="" src="/cross.svg" />
        </div>
      );
    
    case "TRUE":
      return (
        <div className="bg-limegreen w-7 h-7 overflow-hidden shrink-0 flex flex-col items-center justify-center cursor-pointer" onClick={stateSwitcher}>
          <img
            className="relative w-5 h-5"
            alt=""
            src="/privacy--security1.svg"
          />
        </div>
      );

    default:
      return <div className="bg-darkgray w-7 h-7 overflow-hidden shrink-0 cursor-pointer" onClick={stateSwitcher} />;
  }
}

export default Checkbox
