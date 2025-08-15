import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthData from "../Data/Data";
import axios from 'axios';

const Auth = () => {
  const [auth, setAuth] = useState("Register");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  function handleAuth() {
    setAuth(auth === "Register" ? "SignUp" : "Register");
    setData({});
  }

  const Data = auth === "Register" ? AuthData : AuthData.filter(ele => ele.label !== "Name");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (auth === "Register") {
        res = await axios.post("http://localhost:5000/auth/register", {
          userName: data.Name,
          gmail: data.Gmail,
          password: data.Password
        });
      } else {
        res = await axios.post("http://localhost:5000/auth/login", {
          gmail: data.Gmail,
          password: data.Password
        });
      }

      setData({});

      localStorage.clear();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.userName);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("bio", res.data.user.bio || "");
      localStorage.setItem("avatar", res.data.user.avatar || "");


      navigate("/profile-setup");
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-pink-700 to-blue-700 px-4">
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-white/20">
        
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
          {auth === "Register" ? "Register to Chatly" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {Data.map(element => (
            <div key={element.id} className="flex flex-col">
              <label className="mb-2 text-white/80 font-semibold">{element.label}</label>
              <input
                type={element.type || "text"}
                name={element.id}
                placeholder={element.placeholder}
                value={data[element.label] || ""}
                onChange={e => setData(prev => ({ ...prev, [element.label]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition-all duration-300"
              />
            </div>
          ))}

          <p className="text-sm sm:text-base text-center text-white/70">
            {auth === "Register" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={handleAuth}
                  className="text-pink-400 cursor-pointer hover:underline"
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <span
                  onClick={handleAuth}
                  className="text-pink-400 cursor-pointer hover:underline"
                >
                  Register
                </span>
              </>
            )}
          </p>

          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
