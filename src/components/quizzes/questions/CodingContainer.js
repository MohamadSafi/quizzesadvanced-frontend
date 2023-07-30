import { useCallback, useEffect, useState } from "react";
import QuestionDefaultProperties from "../QuestionDefaultProperties"
import QuestionTitle from "../QuestionTitle"
import { useNavigate } from "react-router-dom";
import CodingVariable from "../answers/CodingVariable";
import { toJsonObject, updateQuestionSetting } from "../../../Utils";
import HiddenQuestionContainer from "../HiddenQuestionContainer";
import { fetchApiPost } from "../../../Requests";
import LanguageDropdown from "../LanguageDropdown";

let lastKey = 0;

const CodingContainer = ({ quiz, initialQuestion }) => {
  const [hidden, setHidden] = useState(true);
  const [question, setQuestion] = useState(initialQuestion);
  const [runnerCode, setRunnerCode] = useState(question.meta.runnerCode);
  const [displayCode, setDisplayCode] = useState(question.meta.displayCode);
  const [updateTimeoutId, setUpdateTimeoutId] = useState(-1);
  const navigate = useNavigate();

  const hiddenSwitcher = useCallback((arg) => {
    setHidden(arg);
  }, []);

  useEffect(() => {
    if (quiz.archived) {
      return;
    }

    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    if (runnerCode === question.runnerCode && displayCode === question.displayCode) {
      return;
    }

    let timeoutId = setTimeout(() => {
      let json = toJsonObject(question);
      json.questionId = question.id;
      json.meta.runnerCode = runnerCode;
      json.meta.displayCode = displayCode;

      fetchApiPost('question/edit', json, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            setQuestion(json.response);
          }
        });
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [runnerCode, displayCode]);

  if (Object.keys(question).length === 0) {
    return <></>;
  }

  if (hidden) {
    return <HiddenQuestionContainer quiz={quiz} question={question} setQuestion={setQuestion} hiddenSwitcher={() => hiddenSwitcher(false)}/>;
  }

  const addVariable = () => {
    if (quiz.archived) {
      return;
    }

    let json = toJsonObject(question);

    json.meta.variables.push({"name": "", "value": ""});
    json.questionId = question.id;

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });
  };

  const updateSetting = (key) => updateQuestionSetting(navigate, quiz, question, setQuestion, key);

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">
      <QuestionTitle quiz={quiz} question={question} setQuestion={setQuestion} hiddenSwitcher={hiddenSwitcher} />

      <QuestionDefaultProperties quiz={quiz} question={question} setQuestion={setQuestion} />

      <div className="flex flex-col items-start justify-start gap-[25px]">
        <div className="w-[964px] flex flex-row items-start justify-start gap-[15px]">
          <div className="self-stretch relative flex items-center w-[80px] shrink-0">
            Language
          </div>
          <LanguageDropdown initialState={question.meta.language} stateHandler={updateSetting("language")} enabled={!quiz.archived}/>
        </div>
      </div>
      
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
        <textarea
          className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-monospace"
          type="text"
          placeholder="Runner code"
          value={runnerCode}
          onChange={(e) => {
            if (!quiz.archived) {
              setRunnerCode(e.target.value)
            }}}
        />
      </div>
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
        <textarea
          className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-monospace"
          type="text"
          placeholder="Display code"
          value={displayCode}
          onChange={(e) => {
            if (!quiz.archived) {
              setDisplayCode(e.target.value)
            }}}
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-[10px] text-gray-100 font-montserrat">
        <div className="relative font-semibold">Variables</div>
        <div className="flex flex-col items-start justify-start gap-[15px] text-darkgray font-ibm-plex-sans">
          {question.meta.variables.map((variable, index) => {
            lastKey++;

            return <CodingVariable key={lastKey} quiz={quiz} question={question} setQuestion={setQuestion} variable={variable} index={index} />;
          })}

          <div className="flex flex-row items-center justify-start gap-[10px] cursor-pointer" onClick={addVariable}>
            <img
              className="relative w-7 h-7"
              alt=""
              src="/gaming.svg"
            />
            <div className="flex-1 relative">Add variable</div>
          </div>
          <div className="flex-1 relative mt-[25px]">Variables can be used in format "$variableName" in question text, runner code and display code</div>
        </div>
      </div>
    </div>
  );
}

export default CodingContainer
