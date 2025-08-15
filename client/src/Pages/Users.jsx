import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../assets/Chatly_logo.png";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const navigate = useNavigate();

  const currentUser = {
    name: localStorage.getItem("userName"),
    avatar: localStorage.getItem("avatar"),
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.userName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const openChat = (user) => {
    navigate(`/chat/${user._id}`, { state: { userName: user.userName } });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-blue-800">
      {/* Sidebar */}
      <div className="flex flex-col w-full lg:w-80 bg-white/10 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-white/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-white/20 border-b border-white/20">
          <img
            src={Logo}
            alt="chatly_logo"
            className="w-12 h-12 rounded-full shadow-md"
          />
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-wide">
            Chatly
          </h1>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/15 placeholder-white/60 text-white border border-white/20 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => openChat(user)}
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt={user.userName}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 shadow-md"
                  />
                </div>
                <span className="font-medium text-white text-base lg:text-lg">
                  {user.userName}
                </span>
              </div>
            ))
          ) : (
            <p className="text-white/70 p-4">No users found.</p>
          )}
        </div>

        {/* Profile + Logout */}
        <div className="p-3 bg-white/10 border-t border-white/20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 flex-1 cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-white/20"
            onClick={() => navigate("/profile-setup")}
          >
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-white/20"
            />
            <span className="text-white font-medium text-sm lg:text-base">
              {currentUser.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-500/30 transition-colors ml-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Placeholder (large screens only) */}
      <div className="hidden lg:flex flex-col flex-1 items-center justify-center relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
        <div className="relative z-10 text-center p-4">
          <img
            src={Logo}
            alt="chatly_logo"
            className="w-32 h-32 lg:w-44 lg:h-44 opacity-70 mx-auto drop-shadow-lg"
          />
          <h2 className="mt-4 lg:mt-6 text-2xl lg:text-4xl font-extrabold text-white drop-shadow-lg">
            Welcome to Chatly
          </h2>
          <p className="text-white/80 mt-2 lg:mt-3 text-base lg:text-lg">
            Select a user from the left to start chatting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Users;
