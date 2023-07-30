import { useNavigate } from "react-router-dom";
import RegisterUserContainer from "../components/admin/RegisterUserContainer";
import UnregisterUserContainer from "../components/admin/UnregisterUserContainer";
import GetUserPermissionsContainer from "../components/admin/GetUserPermissionsContainer";
import SetUserPermissionsContainer from "../components/admin/SetUserPermissionsContainer";
import ChangeUserPasswordContainer from "../components/admin/ChangeUserPasswordContainer";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white w-full h-full mb-10 overflow-hidden text-center text-xl text-gray-100 justify-center font-montserrat mt-8">
      <div className="relative flex flex-col mb-12 gap-[50px] justify-center items-center">
        <div
          className=" text-[24px] font-ibm-plex-sans text-limegreen cursor-pointer"
          onClick={() => navigate("/")}
        >
          Return back
        </div>
        <div className=" text-[40px] font-semibold inline-block w-[1104px]">
          Admin panel
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-[50px] text-left">
        <RegisterUserContainer />
        <UnregisterUserContainer />
        <ChangeUserPasswordContainer />
        <GetUserPermissionsContainer />
        <SetUserPermissionsContainer />
      </div>
    </div>
  );
};

export default AdminPanel;
