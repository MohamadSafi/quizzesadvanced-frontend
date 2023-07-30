import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { fetchApiPost } from "../../Requests";
import { useNavigate } from "react-router-dom";

const RegisterUserContainer = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState("");
  const [buttonText, setButtonText] = useState("");
  const navigate = useNavigate();

  if (hidden) {
    return (
      <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start border-[1px] border-solid border-darkgray">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(false)}>Register user</div>
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

  const confirmRegistration = () => {
    if (email.length === 0) {
      return;
    }

    confirmAlert({
      title: "Confirm Registration",
      message: 'Email: ' + email + ' | Permissions: [' + permissions.split(' ') + ']',
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setButtonText('Registering...');
            fetchApiPost('auth/register', {
              email: email,
              permissions: permissions.split(' ')
            }, navigate).then(([response, json]) => {
              if (response.ok) {
                let password = json.response.password;

                if (password) {
                  setButtonText('Registered successfully! Generated password: ' + password);
                } else {
                  setButtonText('User was not registered: user.already_exists');  
                }
              } else {
                setButtonText('User was not registered: ' + json.message);
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
        <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(true)}>Register user</div>
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
      <div className="self-stretch flex flex-row pt-px px-0.5 pb-1.5 items-start justify-start text-lg text-darkgray font-ibm-plex-sans border-b-[1px] border-solid border-gray-100">
        <input
          className="flex-1 relative w-[1104px] px-0.5 pt-px pb-1.5 text-xl text-gray-100 font-ibm-plex-sans outline-none"
          type="text"
          placeholder="Space-separated permissions"
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
        />
      </div>

      <div
        className="self-stretch bg-limegreen overflow-hidden flex flex-row py-4 px-0 items-center justify-center cursor-pointer text-white font-montserrat"
        onClick={confirmRegistration}
      >
        <div className="relative font-semibold">Register user</div>
      </div>

      {buttonText.startsWith('Registered successfully!') &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText === 'Registering...' &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText.startsWith('User was not registered: ') &&
        <div
          className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }
    </div>
  );
};

export default RegisterUserContainer;
