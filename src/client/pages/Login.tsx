import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import menuImage from "../assets/images/menu.png";
import { AiOutlineGoogle } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
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
      <form
        onSubmit={loginHandler}
        className="z-20 flex flex-col p-4 pt-20 text-black rounded-md"
      >
        <div className="">
          <img src={menuImage} className="h-[6rem] w-[15rem]" />
        </div>

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

        <span className="mt-2 font-bold">Test accounts:</span>

        <div className="flex space-x-2">
          <span>guest@gmail.com</span>
          <span>|</span>
          <span>guest123</span>
        </div>

        <div className="flex space-x-2">
          <span>test@gmail.com</span>
          <span>|</span>
          <span>guest123</span>
        </div>

        <Link to="/register" className="mt-5 text-center text-gray-400">
          Create an account
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Login;
