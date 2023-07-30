import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateQuestionSetting } from "../../../Utils";
import QuestionTitle from "../QuestionTitle";
import QuestionDefaultProperties from "../QuestionDefaultProperties";
import Checkbox from "../Checkbox";
import HiddenQuestionContainer from "../HiddenQuestionContainer";

const TrueFalseContainer = ({ quiz, initialQuestion }) => {
  const [hidden, setHidden] = useState(true);
  const [question, setQuestion] = useState(initialQuestion);
  const navigate = useNavigate();

  const hiddenSwitcher = useCallback((arg) => {
    setHidden(arg);
  }, []);

  const updateSetting = (key) => updateQuestionSetting(navigate, quiz, question, setQuestion, key);

  if (Object.keys(question).length === 0) {
    return <></>;
  }

  if (hidden) {
    return <HiddenQuestionContainer quiz={quiz} question={question} setQuestion={setQuestion} hiddenSwitcher={() => hiddenSwitcher(false)}/>;
  }

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">
      <QuestionTitle quiz={quiz} question={question} setQuestion={setQuestion} hiddenSwitcher={hiddenSwitcher} />

      <QuestionDefaultProperties quiz={quiz} question={question} setQuestion={setQuestion} />

      <div className="flex flex-col items-start justify-start gap-[25px]">
        <div className="w-[964px] flex flex-row items-start justify-between">
         <div className="flex flex-row items-center justify-start gap-[15px]">
            <div className="relative">Correct answer: </div>
            <Checkbox initialState={question.meta.correctAnswer} stateHandler={updateSetting("correctAnswer")} enabled={!quiz.archived}></Checkbox>
            {question.meta.correctAnswer && `True`}
            {!question.meta.correctAnswer && `False`}
          </div>
          <div className="flex flex-row items-center justify-start gap-[15px]">
            <div className="relative">Protect from cheating</div>
            <Checkbox initialState={question.meta.cheatingProtection} stateHandler={updateSetting("cheatingProtection")} enabled={!quiz.archived}></Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseContainer;
