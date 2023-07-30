import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiGet } from "../../Requests";

const CourseListUsersContainer = ({ course, loadUser }) => {
  const [buttonText, setButtonText] = useState("");
  const [loadedUsers, setLoadedUsers] = useState([]);

  const navigate = useNavigate();
  
  const loadUsers = () => {
    setLoadedUsers([]);
    setButtonText('Loading...');
    fetchApiGet('course/list_users?courseId=' + course.id, navigate).then(([response, json]) => {
      if (response.ok) {
        setButtonText('');

        setLoadedUsers(json.response);
      } else {
        setButtonText('Users were not loaded: ' + json.message);
      }
    });
  };

  return (
    <>
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold font-montserrat">List users with access to this course</div>
      </div>

      {loadedUsers.length > 0 &&
      <ul className="text-left font-ibm-plex-sans m-0">
        {loadedUsers.map((user) => <li key={user} className="py-1.5">
          <div
            className="bg-darkgray text-white inline px-3 cursor-pointer font-montserrat py-1"
            onClick={() => loadUser(user)}  
          >
            Change permissions
          </div>
          <a className="px-2.5">{user}</a>
        </li>)}
      </ul>
      }

      {buttonText === 'Loading...' &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText !== 'Loading...' &&
      <div
        className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
        onClick={loadUsers}
      >
        <div className="relative font-semibold">Load users</div>
      </div>
      }

      {buttonText.startsWith('Users were not ') &&
        <div
          className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }
    </>
  );
};

export default CourseListUsersContainer;
