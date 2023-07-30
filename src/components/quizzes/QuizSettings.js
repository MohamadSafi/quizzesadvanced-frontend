import { useCallback, useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { fetchApiPost } from "../../Requests";
import { hasPermission, toJsonObject } from "../../Utils";
import { useNavigate } from "react-router-dom";
import QuizChangeUserPermissionsContainer from "./QuizChangeUserPermissionsContainer";

const QuizSettings = ({ permissions, quiz, setQuizName }) => {
  const [hidden, setHidden] = useState(true);
  const [name, setName] = useState(quiz.name);
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

    if (name === quiz.name) {
      return;
    }

    let timeoutId = setTimeout(() => {
      let json = toJsonObject(quiz);
      json.quizId = quiz.id;
      json.name = name;

      fetchApiPost("quiz/edit", json, navigate);
      setQuizName(name);
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [name]);

  let canEdit = hasPermission(permissions, "course." + quiz.courseId + ".edit");

  if (hidden) {
    return (
      <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start border-[1px] border-solid border-darkgray">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div
            className="relative font-semibold cursor-pointer"
            onClick={() => hiddenSwitcher(false)}
          >
            Settings
          </div>
          <div
            className="flex flex-row items-center justify-start cursor-pointer"
            onClick={() => hiddenSwitcher(false)}
          >
            <img
              className="relative w-[17.34px] h-[8.6px]"
              alt=""
              src="/vector4.svg"
            />
          </div>
        </div>
      </div>
    );
  }

  const updateSetting = (key) => {
    return (newState) => {
      if (quiz.archived) {
        return;
      }

      if (quiz[key] === newState) {
        return;
      }

      clearTimeout(updateTimeoutId);

      quiz[key] = newState;

      let json = toJsonObject(quiz, true);
      json.quizId = quiz.id;
      json.name = name;

      fetchApiPost("quiz/edit", json, navigate);
    };
  };

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">
      <div className="self-stretch flex flex-row items-start justify-between">
        <div
          className="relative font-semibold cursor-pointer"
          onClick={() => hiddenSwitcher(true)}
        >
          Settings
        </div>
        <div
          className="flex flex-row items-center justify-start cursor-pointer"
          onClick={() => hiddenSwitcher(true)}
        >
          <img
            className="relative w-[17.34px] h-[8.6px]"
            alt=""
            src="/vector.svg"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-lg text-darkgray font-ibm-plex-sans border-b-[1px] border-solid border-gray-100">
        <input
          className="flex-1 relative w-[1104px] px-0.5 pt-px pb-1.5 text-xl text-gray-100 font-ibm-plex-sans outline-none"
          type="text"
          placeholder="Quiz name"
          value={name}
          onChange={(e) => {
            if (!quiz.archived && canEdit) {
              setName(e.target.value);
            }
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-start gap-[15px] text-lg font-ibm-plex-sans">
        <div className="relative">Shuffle questions when exporting</div>
        <Checkbox
          initialState={quiz.exportShuffle}
          stateHandler={updateSetting("exportShuffle")}
          enabled={!quiz.archived && canEdit}
        ></Checkbox>
      </div>
      <div className="w-[964px] h-[86px] flex flex-col items-center justify-start gap-[34px]">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold">Multiple Choice</div>
        </div>
        <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
          <div className="w-[964px] flex flex-row items-start justify-between ">
            <div className="flex flex-row items-center justify-start gap-[15px]">
              <div className="relative">Shuffle answers</div>
              <Checkbox
                initialState={quiz.multipleChoiceShuffle}
                stateHandler={updateSetting("multipleChoiceShuffle")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
            <div className="flex flex-row items-center justify-start gap-[15px] mr-80">
              <div className="relative">Number the choices</div>
              <Checkbox
                initialState={quiz.multipleChoiceEnumerateAnswers}
                stateHandler={updateSetting("multipleChoiceEnumerateAnswers")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[964px] h-[86px] flex flex-col items-center justify-start gap-[34px]">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold">Single Choice</div>
        </div>
        <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
          <div className="w-[964px] flex flex-row items-start justify-between">
            <div className="flex flex-row items-center justify-start gap-[15px]">
              <div className="relative">Shuffle answers</div>
              <Checkbox
                initialState={quiz.singleChoiceShuffle}
                stateHandler={updateSetting("singleChoiceShuffle")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
            <div className="flex flex-row items-center justify-start gap-[15px] mr-80">
              <div className="relative">Number the choices</div>
              <Checkbox
                initialState={quiz.singleChoiceEnumerateAnswers}
                stateHandler={updateSetting("singleChoiceEnumerateAnswers")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[964px] h-[86px] flex flex-col items-center justify-start gap-[34px]">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold">Matching</div>
        </div>
        <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
          <div className="w-[964px] flex flex-row items-start justify-between">
            <div className="flex flex-row items-center justify-start gap-[15px]">
              <div className="relative">Shuffle sub-questions</div>
              <Checkbox
                initialState={quiz.matchingShuffle}
                stateHandler={updateSetting("matchingShuffle")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[964px] h-[86px] flex flex-col items-center justify-start gap-[34px]">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold">Short answers</div>
        </div>
        <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
          <div className="w-[964px] flex flex-row items-start justify-between">
            <div className="flex flex-row items-center justify-start gap-[15px]">
              <div className="relative">Case-sensitive</div>
              <Checkbox
                initialState={quiz.shortAnswerCaseSensitive}
                stateHandler={updateSetting("shortAnswerCaseSensitive")}
                enabled={!quiz.archived && canEdit}
              ></Checkbox>
            </div>
          </div>
        </div>
      </div>

      {hasPermission(permissions, "course." + quiz.courseId + ".edit") && (
        <QuizChangeUserPermissionsContainer quiz={quiz} />
      )}
    </div>
  );
};

export default QuizSettings;
