import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toJsonObject } from "../../../Utils";
import { fetchApiPost } from "../../../Requests";
import ScoreDropdown from "../ScoreDropdown";

const ShortAnswer = ({ quiz, question, setQuestion, answer, index }) => {
  const [text, setText] = useState(answer.text);
  const [updateTimeoutId, setUpdateTimeoutId] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz.archived) {
      return;
    }

    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    if (text === answer.text) {
      return;
    }

    let timeoutId = setTimeout(() => {
      let json = toJsonObject(question);
      json.questionId = question.id;

      json.meta.answers[index].text = text;

      fetchApiPost('question/edit', json, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            setQuestion(json.response);
          }
        });
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [text]);

  const deleteAnswer = () => {
    if (quiz.archived) {
      return;
    }

    let json = toJsonObject(question);
    json.questionId = question.id;

    json.meta.answers.splice(index, 1);

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });

    clearTimeout(updateTimeoutId);
  };

  const updateMark = (value) => {
    if (quiz.archived) {
      return;
    }

    if (answer.mark.toString() === value) {
      return;
    }

    clearTimeout(updateTimeoutId);

    let json = toJsonObject(question);
    json.questionId = question.id;

    json.meta.answers[index].text = text;
    json.meta.answers[index].mark = parseFloat(value);

    fetchApiPost('question/edit', json, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setQuestion(json.response);
        }
      });
  }

  return (
    <div className="w-[964px] flex flex-row py-2.5 px-0 box-border items-center justify-start gap-[15px]">
      <div className="flex-1 flex flex-row items-start justify-start gap-[50px]">
        <div className="flex-1 box-border h-[34px] flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start border-b-[1px] border-solid border-gray-100">
            <input
              className="flex-1 relative px-0.5 pt-px pb-1.5 text-lg text-gray-100 outline-none font-ibm-plex-sans"
              type="text"
              placeholder="Answer"
              value={text}
              onChange={(e) => {
                if (!quiz.archived) {
                  setText(e.target.value)
                }}}
            />
        </div>
        <ScoreDropdown initialState={answer.mark} stateHandler={updateMark} enabled={!quiz.archived} negative={false} />
      </div>
      <div className="flex flex-row pt-0 px-0 pb-1.5 items-start justify-start cursor-pointer" onClick={deleteAnswer}>
        <img
          className="relative w-7 h-7"
          alt=""
          src="/cross6.svg"
        />
      </div>
    </div>
  );
};

export default ShortAnswer
