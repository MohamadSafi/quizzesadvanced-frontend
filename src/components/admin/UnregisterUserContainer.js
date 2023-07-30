import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { fetchApiPost } from "../../Requests";
import { useNavigate } from "react-router-dom";

const UnregisterUserContainer = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("");
  const navigate = useNavigate();

  if (hidden) {
    return (
      <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start border-[1px] border-solid border-darkgray">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(false)}>Remove user</div>
          <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => setHidden(false)}>
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

  const confirmUnregistration = () => {
    if (email.length === 0) {
      return;
    }

    confirmAlert({
      title: "Confirm Unregistration",
      message: 'Email: ' + email,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setButtonText('Removing...');
            fetchApiPost('auth/unregister', {
              email: email
            }, navigate).then(([response, json]) => {
              if (response.ok) {
                if (json.response.email) {
                  setButtonText('Removed successfully!');
                } else {
                  setButtonText('User was not removed: user.not_found');  
                }
              } else {
                setButtonText('User was not removed: ' + json.message);
              }
            });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">      
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(true)}>Remove user</div>
          <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => setHidden(true)}>
            <img
              className="relative w-[17.34px] h-[8.6px]"
              alt=""
              src="/vector.svg"
            />
          </div>
      </div>
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-lg text-darkgray font-ibm-plex-sans border-b-[1px] border-solid border-gray-100">
        <input
          className="flex-1 relative w-[1104px] px-0.5 pt-px pb-1.5 text-xl text-gray-100 font-ibm-plex-sans outline-none"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div
        className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
        onClick={confirmUnregistration}
      >
        <div className="relative font-semibold">Remove user</div>
      </div>

      {buttonText.startsWith('Removed successfully!') &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText === 'Removing...' &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText.startsWith('User was not removed: ') &&
        <div
          className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }
    </div>
  );
};

export default UnregisterUserContainer;
