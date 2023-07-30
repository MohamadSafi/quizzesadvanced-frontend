import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const CourseContainer = ({ courseTitle, id }) => {
  const navigate = useNavigate();

  const handleCourse = useCallback(() => {
    navigate("/course?id=" + id);
  }, [navigate, courseTitle, id]);
  return (
    <div className="self-stretch overflow-hidden flex flex-col py-[50px] px-[25px] items-center justify-start border-[1px] border-solid border-darkgray cursor-pointer" onClick={handleCourse}>
      <div className="relative font-semibold">
        {courseTitle}
      </div>
    </div>
  );
};

export default CourseContainer;
