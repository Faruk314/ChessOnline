import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import menuImage from "../assets/images/menu.png";
import { AiOutlineGoogle } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("farukspahictz@gmail.com");
  const [password, setPassword] = useState("ispitivac");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields must be filled");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/login`,
        {
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
      <div className="fixed top-[7rem]">
        <img src={menuImage} className="w-[17rem] h-[20rem]" />
      </div>

      <form
        onSubmit={loginHandler}
        className="z-20 flex flex-col p-4 pt-20 text-black rounded-md"
      >
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
          className="px-2 py-3 bg-transparent border rounded-md shadow-sm border-amber-900 focus:outline-none"
        />

        <button className="px-2 py-3 mt-5 text-xl font-bold text-white rounded-md bg-amber-900">
          LOGIN
        </button>

        <Link to="/register" className="mt-5 text-center text-gray-400">
          Create an account
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Login;
