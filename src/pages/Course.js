import { useNavigate, useSearchParams } from "react-router-dom";
import CourseQuizContainer from "../components/CourseQuizContainer";
import { useCallback, useEffect, useState } from "react";
import { fetchApiGet } from "../Requests";

const courseMock = {
  id: 0,
  name: "",
};

const Course = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let id = parseInt(searchParams.get("id"));

  const [course, setCourse] = useState(courseMock);
  const navigate = useNavigate();

  const onReturnToHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (course.id === 0) {
      fetchApiGet("course/get?courseId=" + id, navigate).then(
        ([response, json]) => {
          setCourse(json.response);
        }
      );
    }
  }, []);

  if (course.id === 0) {
    return <></>;
  }

  return (
    <div className="relative bg-white w-full h-[14690px] overflow-hidden text-center text-5xl text-darkgray font-ibm-plex-sans">
      <CourseQuizContainer course={course} id={id} />
    </div>
  );
};

export default Course;
