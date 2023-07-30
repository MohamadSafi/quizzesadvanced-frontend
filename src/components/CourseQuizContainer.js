import { useEffect, useState, useCallback } from "react";
import QuizContainer from "./QuizContainer";
import { useNavigate } from "react-router-dom";
import { fetchApiGet, fetchApiPost } from "../Requests";
import Checkbox from "./quizzes/Checkbox";
import CourseSettings from "./courses/CourseSettings";
import { hasPermission } from "../Utils";

const CourseQuizContainer = ({ course, id }) => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState(undefined);
  const [showArchived, setShowArchived] = useState(
    localStorage.getItem("showArchived") === "1"
  );
  const [quizzesToRender, setQuizzesToRender] = useState([]);
  const [courseTitle, setCourseTitle] = useState(course.name)

  const showArchivedSwitcher = (value) => {
    localStorage.setItem("showArchived", value ? "1" : "0");
    setShowArchived(value);
  };

  const handleCreateQuiz = useCallback(() => {
    fetchApiPost(
      "quiz/add",
      {
        courseId: id,
        quizName: "New quiz",
      },
      navigate
    ).then(([response, json]) => {
      if (response.ok) {
        navigate("/quiz?id=" + json.response.id);
      }
    });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onReturnToHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (quizzes === undefined) {
      return;
    }

    let newQuizzesToRender = [[]];
    for (let i in quizzes) {
      const quiz = quizzes[i];
      if (quiz.archived && !showArchived) {
        continue;
      }

      let lastList = newQuizzesToRender[newQuizzesToRender.length - 1];
      if (lastList.length === 2) {
        newQuizzesToRender.push([[quiz, i]]);
      } else {
        lastList.push([quiz, i]);
      }
    }

    setQuizzesToRender(newQuizzesToRender);
  }, [quizzes, showArchived]);

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchApiGet('user/get_my_permissions', navigate)
      .then(([response, json]) => {
        setPermissions(json.response);
      })
  }, []);

  if (quizzes === undefined) {
    fetchApiGet("quiz/get_from_course?courseId=" + id, navigate).then(
      ([response, json]) => {
        if (response.ok) {
          json.response.sort((a, b) => b.id - a.id);
          setQuizzes(json.response);
        }
      }
    );
    return <></>;
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-[100px] mt-8">
      <div className="self-stretch flex flex-row items-center justify-around">
        <div className="relative">
          Current user: {localStorage.getItem("email")}
        </div>
        <div className="flex flex-row items-center justify-start gap-[15px] text-left">
          <div className="relative">Show archived</div>
          <Checkbox
            initialState={showArchived}
            stateHandler={showArchivedSwitcher}
          />
        </div>
        <div
          className="relative text-crimson cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
      <div className="flex flex-col items-center justify-start gap-[50px] text-lg text-white">
        <div className="flex flex-col items-center justify-start gap-[50px] text-lg text-white">
          <div
            className="relative text-5xl text-limegreen cursor-pointer"
            onClick={onReturnToHomeClick}
          >
            Return to home page
          </div>
          <div className="self-stretch relative text-21xl font-semibold font-montserrat text-gray-100">
            {courseTitle}
          </div>

          {hasPermission(permissions, 'course.' + course.id + '.edit') &&
            <CourseSettings course={{id: id, name: courseTitle}} setCourseTitle={setCourseTitle}/>
          }

          {quizzesToRender.map((wrappedQuizzes) => (
            <div className="self-stretch overflow-hidden flex flex-row flex-wrap items-start justify-start gap-[35px] text-left">
              {wrappedQuizzes.map((a) => {
                let quiz = a[0];
                let index = a[1];
                return (
                  <QuizContainer
                    permissions={permissions}  
                    key={quiz.id}
                    id={quiz.id}
                    courseId={id}
                    text={quiz.name}
                    quiz={quiz}
                    quizzes={quizzes}
                    index={index}
                    setQuizzes={setQuizzes}
                  />
                );
              })}
            </div>
          ))}

          {hasPermission(permissions, 'course.' + course.id + '.quizzes.create') &&
          <div
            className="bg-limegreen w-[835px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer text-left font-montserrat"
            onClick={handleCreateQuiz}
          >
            <div className="relative font-semibold">Create quiz</div>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default CourseQuizContainer;
