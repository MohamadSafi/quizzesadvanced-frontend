import { useNavigate } from "react-router-dom";
import { handleDeleteTemplate } from "../../Utils";

const QuestionTitle = ({ quiz, question, setQuestion, hiddenSwitcher }) => {
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
    <div className="self-stretch flex flex-row items-start justify-between text-xl font-montserrat">
      <div className="relative font-semibold cursor-pointer" onClick={() => hiddenSwitcher(true)}>
        {title}
      </div>
      <div className="flex flex-row items-center justify-start gap-[25px]">
        {!quiz.archived &&
        <img className="relative w-7 h-7 cursor-pointer" alt="" src="/trash.svg" onClick={handleDelete}/>
        }
        <img
          className="relative w-[17.34px] h-[8.6px] cursor-pointer"
          alt=""
          src="/vector9.svg"
          onClick={() => hiddenSwitcher(true)}
        />
      </div>
    </div>
  );
}

export default QuestionTitle
