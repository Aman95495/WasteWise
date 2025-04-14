import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { loginSuccess, loginFailure } from "../redux/user/userSlice";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/backend/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(loginFailure(data.message));
        return;
      }
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure("An error occurred. Please try again later."));
    }
  };

  const handleGithubClick = async () => {
    try {
        const provider = new GithubAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        const res = await fetch("/backend/auth/github", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL,
            }),
        });
        const data = await res.json();
        if (data.success === false) {
            loginFailure(data.message);
            return;
        }
        dispatch(loginSuccess(data));
        navigate("/");
    }
    catch (error) {
      loginFailure("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleGoogleClick} className="w-1/2 flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition duration-300">
        <FaGoogle className="text-blue-500 text-xl mr-2" /> {/* Google Icon */}
        Google
      </button>
      <button onClick={handleGithubClick} className="w-1/2 flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition duration-300">
        <FaGithub className="text-black text-xl mr-2" /> {/* GitHub Icon */}
        GitHub
      </button>
    </div>
  );
}