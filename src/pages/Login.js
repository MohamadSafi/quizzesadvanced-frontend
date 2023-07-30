import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo-2.png";
import background from "../assests/innopolis.jpg";
import { fetchApiPost } from "../Requests";

const LoginScreen = () => {
  localStorage.removeItem("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    fetchApiPost("auth/login", {
      email: username,
      password: password,
    }).then(([response, json]) => {
      if (response.ok) {
        localStorage.setItem("token", json.response.token);
        localStorage.setItem("email", json.response.email);

        let permissions = json.response.permissions;
        localStorage.setItem("showAdminPanel", permissions.includes("*") || permissions.includes("auth.register_user") || permissions.includes("auth.unregister_user"));

        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="bg-white p-10 rounded-xl shadow-2xl w-200 font-montserrat items-center justify-center">
          <div className="flex items-center justify-center">
            <img className="h-20 shadow-xl mx-auto" src={logo} />
          </div>
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to QuMoGen
          </h2>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <button
              onClick={handleLogin}
              className="flex w-full justify-center cursor-pointer rounded-md bg-limegreen px-3 py-1.5 text-sm font-montserrat leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${background})`,
          filter: "blur(5px)", // Adjust the blur value as needed
          zIndex: -1,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default LoginScreen;
