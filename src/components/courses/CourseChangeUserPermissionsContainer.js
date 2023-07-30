import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiGet, fetchApiPost } from "../../Requests";
import Checkbox from "../quizzes/Checkbox";
import CourseListUsersContainer from "./CourseListUsersContainer";

const CourseChangeUserPermissionsContainer = ({ course }) => {
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [loadedUser, setLoadedUser] = useState(null);

  const navigate = useNavigate();
  
  const loadUser = (email) => {
    if (email.length === 0) {
      return;
    }

    setEmail(email);

    setLoadedUser(null);
    setButtonText('Loading...');
    fetchApiGet('user/get_permissions?email=' + email, navigate).then(([response, json]) => {
      if (response.ok) {
        setEmail('');
        setButtonText('');

        let permissions = json.response;

        let loadedUser = {
          courseId: course.id,
          email: email,
          edit: permissions.includes('course.' + course.id + '.edit'),
          delete: permissions.includes('course.' + course.id + '.delete'),
          quizzesCreate: permissions.includes('course.' + course.id + '.quizzes.create'),
          quizzesDelete: permissions.includes('course.' + course.id + '.quizzes.delete'),
          quizzesArchive: permissions.includes('course.' + course.id + '.quizzes.archive'),
          quizzesClone: permissions.includes('course.' + course.id + '.quizzes.clone'),
          quizzesAccess: permissions.includes('course.' + course.id + '.quizzes.access')
        };

        setLoadedUser(loadedUser);
      } else {
        setButtonText('User was not loaded: ' + json.message);
      }
    });
  };

  const updateSetting = (key) => {
    return (newState) => {
      loadedUser[key] = newState;
    }
  };

  const saveUser = () => {
    setButtonText('Saving...');
    fetchApiPost('user/set_course_permissions', loadedUser, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setLoadedUser(null);
          setButtonText('Saved!');
        } else {
          setButtonText('User was not saved: ' + json.message);
        }
      });
  };

  const discardChanges = () => {
    setLoadedUser(null);
    setButtonText('');
  };

  return (
    <>
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold font-montserrat">Change users permissions</div>
      </div>
      {loadedUser === null &&
      <>
        <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-lg text-darkgray font-ibm-plex-sans border-b-[1px] border-solid border-gray-100">
          <input
            className="flex-1 relative w-[835px] px-0.5 pt-px pb-1.5 text-xl text-gray-100 font-ibm-plex-sans outline-none"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {buttonText !== 'Loading...' &&
        <div
          className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
          onClick={() => loadUser(email)}
        >
          <div className="relative font-semibold">Load user</div>
        </div>
        }
      </>
      }

      {loadedUser !== null &&
        <>
          <div className="self-stretch flex flex-row items-start justify-between ">
            <div className="relative font-semibold font-ibm-plex-sans">Selected user: {loadedUser.email}</div>
          </div>
          <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
            <div className="w-[693px] flex flex-row items-start justify-between">
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Edit name and permissions of this course and quizzes from this course</div>
                <Checkbox initialState={loadedUser.edit} stateHandler={updateSetting("edit")}></Checkbox>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
            <div className="w-[693px] flex flex-row items-start justify-between">
            <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Delete this course</div>
                <Checkbox initialState={loadedUser.delete} stateHandler={updateSetting("delete")}></Checkbox>
              </div>
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Create quizzes</div>
                <Checkbox initialState={loadedUser.quizzesCreate} stateHandler={updateSetting("quizzesCreate")}></Checkbox>
              </div>
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Delete quizzes</div>
                <Checkbox initialState={loadedUser.quizzesDelete} stateHandler={updateSetting("quizzesDelete")}></Checkbox>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start text-lg font-ibm-plex-sans">
            <div className="w-[693px] flex flex-row items-start justify-between">
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Archive quizzes</div>
                <Checkbox initialState={loadedUser.quizzesArchive} stateHandler={updateSetting("quizzesArchive")}></Checkbox>
              </div>
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Clone quizzes</div>
                <Checkbox initialState={loadedUser.quizzesClone} stateHandler={updateSetting("quizzesClone")}></Checkbox>
              </div>
              <div className="flex flex-row items-center justify-start gap-[15px]">
                <div className="relative">Access to all quizzes</div>
                <Checkbox initialState={loadedUser.quizzesAccess} stateHandler={updateSetting("quizzesAccess")}></Checkbox>
              </div>
            </div>
          </div>
          <div
            className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
            onClick={saveUser}
          >
            <div className="relative font-semibold">Save user</div>
          </div>
          <div
            className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
            onClick={discardChanges}
          >
            <div className="relative font-semibold">Discard changes</div>
          </div>
        </>
      }

      {(buttonText === 'Loading...' || buttonText === 'Saving...') &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText.startsWith('User was not ') &&
        <div
          className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {(buttonText === 'Saved!') &&
        <div
          className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      <CourseListUsersContainer course={course} loadUser={loadUser} />
    </>
  );
};

export default CourseChangeUserPermissionsContainer;
