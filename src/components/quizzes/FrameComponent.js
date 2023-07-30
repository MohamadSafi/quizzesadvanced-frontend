import { useState } from "react";
import { fetchApiPost } from "../../Requests";
import { useNavigate } from "react-router-dom";
import { toJsonObject } from "../../Utils";

const choiceToMeta = {
  'Multiple Choice': 'MULTIPLE_CHOICE',
  'Single Choice': 'SINGLE_CHOICE',
  'Matching': 'MATCHING',
  'Short answer': 'SHORT_ANSWER',
  'True/False': 'TRUE_FALSE',
  'Coding': 'CODING',
};

const FrameComponent = ({ quiz, setQuiz, onClose }) => {
  const navigate = useNavigate();

  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentSelection = (componentName) => {
    setSelectedComponent(componentName);
  };

  const handleAddComponent = () => {
    if (selectedComponent) {      
      let questionType = choiceToMeta[selectedComponent];
      fetchApiPost('question/add', {
        'quizId': quiz.id,
        'questionType': questionType
      }, navigate).then(([response, json]) => {
        if (response.ok) {
          let json1 = toJsonObject(quiz);

          json1.questions.push(json.response)

          setQuiz(json1);
          onClose();
        }
      });
    }
  };

  return (
    <div className="relative bg-white flex flex-col py-2 px-0 box-border items-start justify-start max-w-full max-h-full overflow-auto text-left text-base text-gray-200 font-ibm-plex-sans">
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "Multiple Choice"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("Multiple Choice")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "Multiple Choice" ? "text-green-500" : ""
          }`}
        >
          Multiple Choice
        </div>
      </div>
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "Single Choice"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("Single Choice")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "Single Choice" ? "text-green-500" : ""
          }`}
        >
          Single Choice
        </div>
      </div>
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "Matching"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("Matching")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "Matching" ? "text-green-500" : ""
          }`}
        >
          Matching
        </div>
      </div>
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "Short answer"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("Short answer")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "Short answer" ? "text-green-500 " : ""
          }`}
        >
          Short answer
        </div>
      </div>
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "True/False"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("True/False")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "True/False" ? "text-green-500 " : ""
          }`}
        >
          True/False
        </div>
      </div>
      <div
        className={`bg-silver w-[500px] flex flex-row cursor-pointer hover:bg-green-200 py-3 px-6 box-border items-center justify-start gap-[16px] ${
          selectedComponent === "Coding"
            ? "cursor-pointer hover:bg-green-200"
            : ""
        }`}
        onClick={() => handleComponentSelection("Coding")}
      >
        <div
          className={`flex-1 relative leading-[146%] ${
            selectedComponent === "Coding" ? "text-green-500 " : ""
          }`}
        >
          Coding
        </div>
      </div>
      {selectedComponent && (
        <button
          className="self-stretch text-lg text-white bg-limegreen overflow-hidden flex flex-row mx-6 my-4 py-4 px-0 items-center justify-center cursor-pointer "
          onClick={handleAddComponent}
        >
          Add
        </button>
      )}
    </div>
  );
};

export default FrameComponent;
