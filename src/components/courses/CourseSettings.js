import { useCallback, useEffect, useState } from "react";
import { fetchApiPost } from "../../Requests";
import { toJsonObject } from "../../Utils";
import { useNavigate } from "react-router-dom";
import CourseChangeUserPermissionsContainer from "./CourseChangeUserPermissionsContainer";

const CourseSettings = ({ setCourseTitle, course }) => {
  const [hidden, setHidden] = useState(true);
  const [name, setName] = useState(course.name);
  const [updateTimeoutId, setUpdateTimeoutId] = useState(-1);
  const navigate = useNavigate();

  const hiddenSwitcher = useCallback((arg) => {
    setHidden(arg);
  }, []);

  useEffect(() => {
    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    if (name === course.name) {
      return;
    }

    let timeoutId = setTimeout(() => {
      course.name = name;

      let json = toJsonObject(course);
      json.courseId = course.id;

      fetchApiPost('course/edit', json, navigate);      

      setCourseTitle(name);
    }, 500);

    setUpdateTimeoutId(timeoutId);
  }, [name]);

  if (hidden) {
    return (
      <div className="box-border w-[835px] flex flex-col py-[50px] px-[70px] items-start justify-start border-[1px] border-solid border-darkgray text-gray-100 text-xl">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold cursor-pointer font-montserrat" onClick={() => hiddenSwitcher(false)}>Settings</div>
          <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => hiddenSwitcher(false)}>
            <img
              className="relative w-[17.34px] h-[8.6px]"
              alt=""
              src="/vector4.svg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border w-[835px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray text-gray-100 text-xl">
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold cursor-pointer font-montserrat" onClick={() => hiddenSwitcher(true)}>Settings</div>
        <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => hiddenSwitcher(true)}>
          <img
            className="relative w-[17.34px] h-[8.6px]"
            alt=""
            src="/vector.svg"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-lg text-darkgray font-ibm-plex-sans border-b-[1px] border-solid border-gray-100">
        <input
          className="flex-1 relative w-[835px] px-0.5 pt-px pb-1.5 text-xl text-gray-100 font-ibm-plex-sans outline-none"
          type="text"
          placeholder="Course name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <CourseChangeUserPermissionsContainer course={course} />
    </div>
  );
}

export default CourseSettings
