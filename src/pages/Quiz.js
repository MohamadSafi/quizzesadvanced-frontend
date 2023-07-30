import { useState, useCallback, useEffect } from "react";
import PortalPopup from "../components/PortalPopup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRoot, fetchApiGet } from "../Requests";
import QuizSettings from "../components/quizzes/QuizSettings";
import MultipleChoiceContainer from "../components/quizzes/questions/MultipleChoiceContainer";
import TrueFalseContainer from "../components/quizzes/questions/TrueFalseContainer";
import MatchingContainer from "../components/quizzes/questions/MatchingContainer";
import SingleChoiceContainer from "../components/quizzes/questions/SingleChoiceContainer";
import FrameComponent from "../components/quizzes/FrameComponent";
import ShortAnswerContainer from "../components/quizzes/questions/ShortAnswerContainer";
import CodingContainer from "../components/quizzes/questions/CodingContainer";
import { confirmAlert } from "react-confirm-alert";
import { download } from "../Utils";

let quizMock = {
  id: 0,
  courseId: 0,
  name: "",
  exportShuffle: false,
  multipleChoiceMultipleAnswers: false,
  multipleChoiceShuffle: false,
  multipleChoiceEnumerateAnswers: false,
  multipleChoiceZeroPoints: false,
  matchingShuffle: false,
  matchingEnumerateAnswers: false,
  shortAnswerCaseSensitive: false,
  course: {
    id: 0,
    name: "",
  },
  questions: [],
};

const Quiz = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let id = parseInt(searchParams.get("id"));

  const [isFrameOpen, setFrameOpen] = useState(false);
  const [quiz, setQuiz] = useState(quizMock);
  const [exporting, setExporting] = useState(false);
  const [quizName, setQuizName] = useState(quiz.name);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  const openFrame = useCallback(() => {
    setFrameOpen(true);
  }, []);

  const closeFrame = useCallback(() => {
    setFrameOpen(false);
  }, []);

  const onReturnToMainClick = useCallback(() => {
    navigate("/course?id=" + quiz.courseId);
  }, [quiz, navigate]);

  useEffect(() => {
    if (quiz.id === 0) {
      fetchApiGet("quiz/get?quizId=" + id, navigate).then(
        ([response, json]) => {
          setQuiz(json.response);
          setQuizName(json.response.name);
        }
      );
    }

    fetchApiGet('user/get_my_permissions', navigate)
      .then(([response, json]) => {
        setPermissions(json.response);
      })
  }, []);

  if (quiz.id === 0) {
    return <></>;
  }

  const createQuestionComponent = (question) => {
    switch (question.meta.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
      case "SINGLE_CHOICE":
        return (
          <SingleChoiceContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
      case "MATCHING":
        return (
          <MatchingContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
      case "SHORT_ANSWER":
        return (
          <ShortAnswerContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
      case "TRUE_FALSE":
        return (
          <TrueFalseContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
      case "CODING":
        return (
          <CodingContainer
            key={question.id}
            quiz={quiz}
            initialQuestion={question}
          />
        );
    }
  };

  const exportQuiz = () => {
    setExporting(true);

    let headers = {};

    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    headers["Authorization"] = "Bearer " + localStorage.getItem("token");

    fetch(apiRoot + "quiz/export?quizId=" + quiz.id, {
      headers: headers,
    })
      .then(async (response) => [response, await response.text()])
      .then(([response, text]) => {
        if (response.ok) {
          download(
            '<?xml version="1.0" encoding="UTF-8"?>' + text,
            quizName + ".xml"
          );
        } else {
          let json = JSON.parse(text);
          if (json.message === "quiz.export.coding_question_evaluation_error") {
            let message = "Variables: ";
            for (const variableName of Object.keys(json.problemInfo.variables)) {
              message +=
                variableName +
                " = " +
                json.problemInfo.variables[variableName] +
                "; ";
            }

            message += " | Output: " + json.problemInfo.output;

            confirmAlert({
              title:
                "Error occured during the compilation or running of the coding question",
              message: message,
              buttons: [
                {
                  label: "Download the response",
                  onClick: () => {
                    download(text, quizName + "_error.json");
                  },
                },
                {
                  label: "Close",
                },
              ],
            });
          } else if (json.message === "quiz.export.coding_question_empty_variable") {
            let message = "Variable name: " + json.problemInfo.variableName;

            confirmAlert({
              title: "Got empty variable in the coding question",
              message: message,
              buttons: [
                {
                  label: "Download the response",
                  onClick: () => {
                    download(text, quizName + "_error.json");
                  },
                },
                {
                  label: "Close",
                },
              ],
            });
          } else if (json.message === "quiz.export.coding_question_empty_output") {
            let message = "Variables: ";
            for (const variableName of Object.keys(json.problemInfo.variables)) {
              message +=
                variableName +
                " = " +
                json.problemInfo.variables[variableName] +
                ";";
            }

            confirmAlert({
              title: "Got empty output after running of the coding question",
              message: message,
              buttons: [
                {
                  label: "Download the response",
                  onClick: () => {
                    download(text, quizName + "_error.json");
                  },
                },
                {
                  label: "Close",
                },
              ],
            });
          } else {
            confirmAlert({
              title: "Error occured during the export",
              message: json.message,
              buttons: [
                {
                  label: "Download the response",
                  onClick: () => {
                    download(text, quizName + "_error.json");
                  },
                },
                {
                  label: "Close",
                },
              ],
            });
          }
        }

        setExporting(false);
      });
  };

  let sortedQuestions = quiz.questions.sort((a, b) => a.id - b.id);

  return (
    <>
      <div className="relative bg-white w-full h-full mb-10 overflow-hidden text-center text-xl text-gray-100 justify-center font-montserrat mt-8">
        <div className="relative flex flex-col mb-12 gap-[50px] justify-center items-center">
          <div
            className=" text-[24px] font-ibm-plex-sans text-limegreen cursor-pointer"
            onClick={onReturnToMainClick}
          >
            Return back
          </div>
          <div className=" text-[40px] font-semibold inline-block w-[1104px]">
            {quiz.course.name} | {quizName}
          </div>
        </div>
        <div className=" flex flex-col items-center justify-center gap-[50px] text-left">
          <QuizSettings permissions={permissions} quiz={quiz} setQuizName={setQuizName} />

          <div className="flex flex-col items-start justify-start gap-[25px] text-lg font-ibm-plex-sans">
            {sortedQuestions.map(createQuestionComponent)}
            {!quiz.archived && (
              <div
                className="w-[1104px] self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
                onClick={openFrame}
              >
                <div className="relative font-semibold">Add question</div>
              </div>
            )}

            {!exporting && (
              <div
                className="w-[1104px] self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
                onClick={exportQuiz}
              >
                <div className="relative font-semibold">Export</div>
              </div>
            )}

            {exporting && (
              <div className="w-[1104px] self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat">
                <div className="relative font-semibold">Exporting...</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isFrameOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeFrame}
        >
          <FrameComponent quiz={quiz} setQuiz={setQuiz} onClose={closeFrame} />
        </PortalPopup>
      )}
    </>
  );
};

export default Quiz;
