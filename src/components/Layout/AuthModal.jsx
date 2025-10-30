import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthModal = ({ isOpen, onClose, mode = "login" }) => {
  const [formMode, setFormMode] = useState(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Fix: Update formMode when the mode prop changes
  useEffect(() => {
    setFormMode(mode);
  }, [mode]);

  // Fix: Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    
    try {
      if (formMode === "login") {
        const result = await login(email, password);

        if (result.success) {
          console.log("✅ Login successful");
          onClose();
          navigate("/dashboard");
        } else {
          alert(result.error || "Login failed");
        }
      } else {
        const result = await signup(email, password);

        if (result.success) {
          console.log("✅ Signup successful");
          onClose();
          navigate("/dashboard");
        } else {
          alert(result.error || "Signup failed");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formMode)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-96 p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {formMode === "login" ? "Log In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none text-black focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-semibold rounded-lg py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Please wait..." : (formMode === "login" ? "Log In" : "Sign Up")}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {formMode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setFormMode("signup")}
                disabled={loading}
                className="text-black font-semibold underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setFormMode("login")}
                disabled={loading}
                className="text-black font-semibold underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
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