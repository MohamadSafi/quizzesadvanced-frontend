import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import HiddenQuestionContainer from "../HiddenQuestionContainer";
import QuestionTitle from "../QuestionTitle";
import QuestionDefaultProperties from "../QuestionDefaultProperties";
import { toJsonObject, updateQuestionSetting } from "../../../Utils";
import Checkbox from "../Checkbox";
import ShortAnswer from "../answers/ShortAnswer";
import { fetchApiPost } from "../../../Requests";

let lastKey = 0;

const ShortAnswerContainer = ({ quiz, initialQuestion }) => {
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

  const addAnswer = () => {
    if (quiz.archived) {
      return;
    }

    let json = toJsonObject(question);

    json.meta.answers.push({"text": "", "mark": 0.0});
    json.questionId = question.id;

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });
  };

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">
      <QuestionTitle quiz={quiz} question={question} setQuestion={setQuestion} hiddenSwitcher={hiddenSwitcher} />

      <QuestionDefaultProperties quiz={quiz} question={question} setQuestion={setQuestion} />

      <div className="w-[964px] flex flex-row items-start justify-between">
        <div className="flex flex-row items-center justify-start gap-[15px]">
          <div className="relative">Case-sensitive</div>
          <Checkbox initialState={question.meta.caseSensitive} stateHandler={updateSetting("caseSensitive")} enabled={!quiz.archived}></Checkbox>
        </div>
        <div className="flex flex-row items-center justify-start gap-[15px]">
          <div className="relative">Protect from cheating</div>
          <Checkbox initialState={question.meta.cheatingProtection} stateHandler={updateSetting("cheatingProtection")} enabled={!quiz.archived}></Checkbox>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start gap-[10px] font-montserrat">
        <div className="relative font-semibold">Correct answers</div>
        <div className="flex flex-col items-start justify-start gap-[15px] text-darkgray font-ibm-plex-sans">
          {question.meta.answers.map((answer, index) => {
            lastKey++;

            return <ShortAnswer key={lastKey} quiz={quiz} question={question} setQuestion={setQuestion} index={index} answer={answer} />}
          )}
          
          <div className="flex flex-row items-center justify-start gap-[10px] cursor-pointer" onClick={addAnswer}>
            <img
              className="relative w-7 h-7"
              alt=""
              src="/gaming.svg"
            />
            <div className="flex-1 relative">Add answer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerContainer;
