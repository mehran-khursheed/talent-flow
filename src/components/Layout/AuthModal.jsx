import  { useState } from "react";

const AuthModal = ({ isOpen, onClose, mode = "login" }) => {
  const [formMode, setFormMode] = useState(mode); // "login" or "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === "login") {
      console.log("Logging in:", { username, password });
      // Call your login function here
    } else {
      console.log("Signing up:", { username, password });
      // Call your signup function here
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-96 p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {formMode === "login" ? "Log In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="bg-black text-white font-semibold rounded-lg py-3 hover:scale-105 transition-transform"
          >
            {formMode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {formMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setFormMode("signup")}
                className="text-black font-semibold underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setFormMode("login")}
                className="text-black font-semibold underline"
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
