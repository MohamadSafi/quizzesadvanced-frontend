import { useEffect, useState } from "react";
import { toJsonObject } from "../../../Utils";
import { fetchApiPost } from "../../../Requests";
import { useNavigate } from "react-router-dom";

const CodingVariable = ({ quiz, question, setQuestion, variable, index }) => {
  const [name, setName] = useState(variable.name);
  const [value, setValue] = useState(variable.value);
  const [updateTimeoutId, setUpdateTimeoutId] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz.archived) {
      return;
    }

    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    if (name == variable.name && value === variable.value) {
      return;
    }

    let timeoutId = setTimeout(() => {
      let json = toJsonObject(question);
      json.questionId = question.id;

      json.meta.variables[index].name = name;
      json.meta.variables[index].value = value;

      fetchApiPost('question/edit', json, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            setQuestion(json.response);
          }
        });
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [name, value]);

  const deleteVariable = () => {
    if (quiz.archived) {
      return;
    }

    let json = toJsonObject(question);
    json.questionId = question.id;

    json.meta.variables.splice(index, 1);

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });

    clearTimeout(updateTimeoutId);
  };

  return (
    <>
      <div className="w-[964px] flex flex-row py-2.5 px-0 box-border items-center justify-start gap-[15px]">
        <div className="flex-1 flex flex-row items-start justify-start gap-[50px]">
          <div className="flex-1 box-border h-[34px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
           <input
              className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-ibm-plex-sans"
              type="text"
              placeholder="Variable"
              value={name}
              onChange={(e) =>  {
                if (!quiz.archived) {
                  setName(e.target.value)
                }}}
            />
          </div>
          <div className="flex-1 box-border h-[34px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
          <input
              className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-ibm-plex-sans"
              type="text"
              placeholder="Semicolon-separated values"
              value={value}
              onChange={(e) =>  {
                if (!quiz.archived) {
                  setValue(e.target.value)
                }}}
            />
          </div>
        </div>
        <div className="flex flex-row pt-0 px-0 pb-1.5 items-start justify-start cursor-pointer" onClick={deleteVariable}>
          <img
            className="relative w-7 h-7"
            alt=""
            src="/cross6.svg"
          />
        </div>
      </div>
    </>
  );
}

export default CodingVariable
