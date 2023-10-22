import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import menuImage from "../assets/images/menu.png";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Register = () => {
  const [userName, setUsername] = useState("faruk");
  const [email, setEmail] = useState("farukspahictz@gmail.com");
  const [password, setPassword] = useState("ispitivac");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          userName,
          email,
          password,
        }
      );

      setIsLoggedIn(true);
      setLoggedUserInfo(response.data.userInfo);
      navigate("/menu");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error);
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <section className="flex flex-col space-y-10 items-center justify-center bg-amber-100 h-[100vh]">
      <div className="fixed top-[6rem]">
        <img src={menuImage} className="w-[17rem] h-[20rem]" />
      </div>

      <form
        onSubmit={registerHandler}
        className="z-20 flex flex-col p-4 pt-20 text-black rounded-md"
      >
        <label className="mt-5 text-black">Username</label>
        <input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="px-2 py-3 bg-transparent border rounded-md shadow-sm border-amber-900 focus:outline-none"
        />
        <label className="mt-5 text-black">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="px-2 py-3 bg-transparent border rounded-md shadow-sm border-amber-900 focus:outline-none"
        />
        <label className="mt-5 text-black">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="px-2 py-3 bg-transparent border rounded-md shadow-sm border-amber-900 focus:outline-none "
        />

        <button className="px-2 py-3 mt-5 text-xl font-bold text-white rounded-md bg-amber-900 ">
          REGISTER
        </button>

        <Link to="/" className="mt-5 text-center text-gray-400">
          Already have an account?
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Register;
