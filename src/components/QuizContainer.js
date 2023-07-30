import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import { fetchApiPost } from "../Requests";
import { hasPermission, toJsonArray } from "../Utils";

const QuizContainer = ({ permissions, courseId, id, text, quiz, index, quizzes, setQuizzes }) => {
  const [quizName, setQuizName] = useState(text);
  const navigate = useNavigate();

  const handleClone = () => {
    fetchApiPost("quiz/clone", {
      quizId: id
    }, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          let newQuizzes = toJsonArray(quizzes);
          newQuizzes.unshift(json.response);
          setQuizzes(newQuizzes);
        }
      });
  };

  const handleEdit = () => {
    navigate("/quiz?id=" + id);
  };

  const confirmAlertTemplate = (title, action, onYesClick) => {
    return confirmAlert({
      title: "Confirm " + title,
      message: "Are you sure you want to " + action + " this quiz?",
      buttons: [
        {
          label: "Yes",
          onClick: onYesClick,
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = () => {
    return confirmAlertTemplate("Deletion", "delete", () => {
      fetchApiPost("quiz/delete", {
        quizId: id
      }, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            let newQuizzes = toJsonArray(quizzes);
            newQuizzes.splice(index, 1);
            setQuizzes(newQuizzes);
          }
        });
    });
  };

  const handleArchive = () => {
    return confirmAlertTemplate("Archivation", "archive", () => {
      fetchApiPost("quiz/archive", {
        quizId: id,
        archived: true
      }, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            let newQuizzes = toJsonArray(quizzes);
            newQuizzes[index] = json.response;
            setQuizzes(newQuizzes);
          }
        });
    });
  };

  const handleUnarchive = () => {
    return confirmAlertTemplate("Unarchivation", "unarchive", () => {
      fetchApiPost("quiz/archive", {
        quizId: id,
        archived: false
      }, navigate)
        .then(([response, json]) => {
          if (response.ok) {
            let newQuizzes = toJsonArray(quizzes);
            newQuizzes[index] = json.response;
            setQuizzes(newQuizzes);
          }
        });
    });
  };

  if (quiz.archived) {
    return (
      <div className="relative bg-white box-border w-[400px] h-[300px] overflow-hidden shrink-0 text-13xl text-darkgray font-montserrat border-[1px] border-solid border-darkgray">
        <div className="absolute top-[20px] left-[25px] font-semibold inline-block w-[350px]">
          {quizName}
        </div>
        
        <div className="absolute top-[186px] left-[23px] w-[352px] flex flex-row items-start justify-start gap-[10px] text-lg text-white font-ibm-plex-sans">
          <div className="flex-1 bg-limegreen h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleEdit}>
            <div className="relative font-semibold">View</div>
          </div>
          {hasPermission(permissions, 'course.' + courseId + '.quizzes.archive') &&
          <div className="flex-1 bg-limegreen h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleUnarchive}>
            <div className="relative font-semibold">Unarchive</div>
          </div>
          }
        </div>

        <div className="absolute top-[234px] left-[23px] w-[352px] flex flex-row items-start justify-start gap-[10px] text-lg text-white font-ibm-plex-sans">
          {hasPermission(permissions, 'course.' + courseId + '.quizzes.clone') &&
          <div className="flex-1 bg-darkgray h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleClone}>
            <div className="relative font-semibold">Clone</div>
          </div>
          }
          {hasPermission(permissions, 'course.' + courseId + '.quizzes.delete') &&
          <div className="flex-1 bg-crimson h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleDelete}>
            <div className="relative font-semibold">Delete</div>
          </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white box-border w-[400px] h-[300px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
      <div className="absolute top-[20px] left-[25px] text-13xl font-semibold font-montserrat text-gray-100 inline-block w-[350px]">
        {quizName}
      </div>
      <div className="absolute top-[186px] left-[23px] w-[352px] flex flex-row items-start justify-start gap-[10px]">
        {(hasPermission(permissions, 'course.' + courseId + '.quizzes.access') || hasPermission(permissions, 'quiz.' + quiz.id + '.access')) &&
        <div className="flex-1 bg-limegreen h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleEdit}>
          <div className="relative font-semibold">Edit</div>
        </div>
        }
        {hasPermission(permissions, 'course.' + courseId + '.quizzes.archive') &&
        <div className="flex-1 bg-crimson h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleArchive}>
          <div className="relative font-semibold cursor-pointer">Archive</div>
        </div>
        }
      </div>
      <div className="absolute top-[234px] left-[23px] w-[352px] flex flex-row items-start justify-start gap-[10px]">
        {hasPermission(permissions, 'course.' + courseId + '.quizzes.clone') &&
        <div className="flex-1 bg-darkgray h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleClone}>
          <div className="relative font-semibold">Clone</div>
        </div>
        }
        {hasPermission(permissions, 'course.' + courseId + '.quizzes.delete') &&
        <div className="flex-1 bg-crimson h-[38px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer" onClick={handleDelete}>
          <div className="relative font-semibold">Delete</div>
        </div>
        }
      </div>
    </div>
  );
};

export default QuizContainer;
