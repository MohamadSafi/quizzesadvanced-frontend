import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApiGet, fetchApiPost } from "../../Requests";
import Checkbox from "./Checkbox";
import QuizListUsersContainer from "./QuizListUsersContainer";

const QuizChangeUserPermissionsContainer = ({ quiz }) => {
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
          quizId: quiz.id,
          email: email,
          access: permissions.includes('quiz.' + quiz.id + '.access')
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
    fetchApiPost('user/set_quiz_permissions', loadedUser, navigate)
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
                <div className="relative">Access to this quiz</div>
                <Checkbox initialState={loadedUser.access} stateHandler={updateSetting("access")}></Checkbox>
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

      <QuizListUsersContainer quiz={quiz} loadUser={loadUser} />
    </>
  );
};

export default QuizChangeUserPermissionsContainer;
