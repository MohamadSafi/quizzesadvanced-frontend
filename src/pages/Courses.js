import React, { useEffect, useState } from "react";
import CourseContainer from "../components/CourseContainer";
import { useNavigate } from "react-router-dom";
import { fetchApiGet, fetchApiPost } from "../Requests";
import { hasPermission, toJsonArray } from "../Utils";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchApiGet('user/get_my_permissions', navigate)
      .then(([response, json]) => {
        setPermissions(json.response);
      })
  }, []);

  useEffect(() => {
    fetchApiGet("course/get_all", navigate).then(([response, json]) => {
      if (response.ok) {
        setCourses(json.response);
      }
    });
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const createCourse = () => {
    fetchApiPost("course/add", {
      name: 'New course'
    }, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          let json1 = toJsonArray(courses);
          json1.push(json.response);
          setCourses(json1);
        }
      })
  }

  return (
    <div className="relative bg-white w-full h-full mb-10 overflow-hidden text-center text-5xl text-darkgray font-ibm-plex-sans justify-center mt-8">
      <div className="relative flex flex-col gap-[100px] justify-center items-center">
        <div className="self-stretch flex flex-row items-center justify-around">
          <div className="relative">
            Current user: {localStorage.getItem("email")}
          </div>

          {localStorage.getItem("showAdminPanel") === "true" &&
            <div className="relative cursor-pointer" onClick={() => navigate("/admin")}>
              Admin-panel
            </div>
          }

          <div
            className="relative text-crimson cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
        <div className="w-[835px] flex flex-col items-center justify-start gap-[50px] text-21xl text-gray-100 font-montserrat">
          <div className="self-stretch relative font-semibold">Courses</div>
          {courses.map((course) => (
            <CourseContainer
              key={course.id}
              id={course.id}
              courseTitle={course.name}
            />
          ))}

          {hasPermission(permissions, 'course.create') &&
          <div
            className="bg-limegreen w-[835px] overflow-hidden flex flex-row py-4 px-0 box-border items-center justify-center cursor-pointer text-left text-lg text-white"
            onClick={createCourse}
          >
            <div className="relative font-semibold">Create course</div>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Courses;
