import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { fetchApiGet, fetchApiPost } from "../../Requests";
import { useNavigate } from "react-router-dom";

const GetUserPermissionsContainer = () => {
  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("");
  const navigate = useNavigate();

  if (hidden) {
    return (
      <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start border-[1px] border-solid border-darkgray">
        <div className="self-stretch flex flex-row items-start justify-between">
          <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(false)}>Get user permissions</div>
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

  const getUserPermissions = () => {
    if (email.length === 0) {
      return;
    }

    setButtonText('Fetching data...');
    fetchApiGet('user/get_permissions?email=' + email, navigate)
      .then(([response, json]) => {
        if (response.ok) {
          setButtonText('Fetched data: ' + (json.response.length !== 0 ? json.response.join(', ') : '<empty>'));
        } else {
          setButtonText('Data was not fetched: ' + json.message);
        }
      });
  };

  return (
    <div className="box-border w-[1104px] flex flex-col py-[50px] px-[70px] items-start justify-start gap-[34px] border-[1px] border-solid border-darkgray">      
      <div className="self-stretch flex flex-row items-start justify-between">
        <div className="relative font-semibold cursor-pointer" onClick={() => setHidden(true)}>Get user permissions</div>
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
        onClick={getUserPermissions}
      >
        <div className="relative font-semibold">Get user permissions</div>
      </div>

      {buttonText.startsWith('Fetched data: ') &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText === 'Fetching data...' &&
        <div
          className="self-stretch bg-darkgray overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }

      {buttonText.startsWith('Data was not fetched: ') &&
        <div
          className="self-stretch bg-crimson overflow-hidden flex flex-row py-4 px-0 items-center justify-center text-white font-montserrat"
        >
          <div className="relative font-semibold">{buttonText}</div>
        </div>
      }
    </div>
  );
};

export default GetUserPermissionsContainer;
