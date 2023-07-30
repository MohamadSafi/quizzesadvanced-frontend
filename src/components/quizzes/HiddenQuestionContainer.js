import { useNavigate } from "react-router-dom";
import { handleDeleteTemplate } from "../../Utils";

const HiddenQuestionContainer = ({ quiz, question, setQuestion, hiddenSwitcher }) => {
  const navigate = useNavigate();

  let title = question.name === "" ? question.text : question.name;
  if (title === "" || !title) {
    title = "<empty title>";
  }

  if (title.length >= 50) {
    title = title.substring(0, 45) + '...';
  }

  const handleDelete = handleDeleteTemplate(quiz, question, setQuestion, navigate);

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start text-xl font-montserrat border-[1px] border-solid border-darkgray">
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold cursor-pointer" onClick={hiddenSwitcher}>{title}</div>
        <div className="flex flex-row items-center justify-start gap-[25px]">
          {!quiz.archived &&
          <img className="relative w-7 h-7 cursor-pointer" alt="" src="/trash.svg" onClick={handleDelete}/>
          }

          <img
            className="relative w-[17.34px] h-[8.6px] cursor-pointer"
            alt=""
            src="/vector5.svg"
            onClick={hiddenSwitcher}
          />
        </div>
      </div>
    </div> 
  );
};

export default HiddenQuestionContainer;
