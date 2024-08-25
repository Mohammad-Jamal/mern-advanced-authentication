import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, User,Lock } from "lucide-react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Button from "../components/Button";
import BottomDiv from "../components/BottomDiv";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {signup,error,isLoading} = useAuthStore();
  const handleSignUp = async(e) => {
    e.preventDefault();

    try {
      await signup(email,password,name);
      navigate('/verify-email')
    } catch (error) {
      console.log(error);
    }

  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-serif mt-2">{error}</p>}
          {/* password strength meter */}
          <PasswordStrengthMeter password={password} />
          
          <Button button={"SignUp"} isLoading={isLoading} />
        </form>
      </div>
      <BottomDiv text={"Already have account?"} route = {'/login'} link = {"Login"} />
    </motion.div>
  );
};

export default SignUpPage;
