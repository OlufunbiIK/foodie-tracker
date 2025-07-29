import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ChefHat,
} from "lucide-react";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Create user data object
      const userData = {
        id: Date.now(), // In real app, this would come from your API
        name: isLogin ? formData.email.split("@")[0] : formData.name,
        email: formData.email,
        avatar: null, // You could add avatar support later
      };

      // Call the success callback to notify the parent App component
      onAuthSuccess(userData);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-orange-600/20 animate-pulse"></div>
      </div>

      {/* Floating food icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 text-4xl animate-bounce opacity-20"
          style={{ animationDelay: "0s" }}
        >
          🍕
        </div>
        <div
          className="absolute top-40 right-20 text-3xl animate-bounce opacity-20"
          style={{ animationDelay: "0.5s" }}
        >
          🍜
        </div>
        <div
          className="absolute bottom-40 left-20 text-3xl animate-bounce opacity-20"
          style={{ animationDelay: "1s" }}
        >
          🥗
        </div>
        <div
          className="absolute bottom-20 right-16 text-4xl animate-bounce opacity-20"
          style={{ animationDelay: "1.5s" }}
        >
          🍰
        </div>
        <div
          className="absolute top-1/2 left-1/4 text-2xl animate-bounce opacity-20"
          style={{ animationDelay: "2s" }}
        >
          🍱
        </div>
        <div
          className="absolute top-1/3 right-1/3 text-3xl animate-bounce opacity-20"
          style={{ animationDelay: "2.5s" }}
        >
          🥘
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl transform hover:rotate-12 transition-all duration-300">
                <ChefHat className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                Foodie
                <span className="italic font-light text-yellow-200 ml-1">
                  Tracker
                </span>
              </h1>
            </div>
            <p className="text-white/80 text-lg">
              {isLogin ? "Welcome back, chef!" : "Join our culinary community"}
            </p>
          </div>

          {/* Auth form */}
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative">
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5"></div>

              {/* Form header */}
              <div className="relative p-6 pb-4">
                <div className="flex items-center justify-center space-x-1 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium ${
                      isLogin
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium ${
                      !isLogin
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name field (Sign up only) */}
                  {!isLogin && (
                    <div className="transform transition-all duration-500 ease-out">
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 z-10" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-4 text-gray-800 placeholder-gray-500 border transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                            errors.name
                              ? "border-red-300 focus:ring-red-200"
                              : "border-white/30 focus:ring-white/40"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-300 text-sm mt-1 ml-2">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 z-10" />
                    <input
                      type={isLogin ? "email" : "text"}
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-4 text-gray-800 placeholder-gray-500 border transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                        errors.email
                          ? "border-red-300 focus:ring-red-200"
                          : "border-white/30 focus:ring-white/40"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-300 text-sm mt-1 ml-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-4 pr-12 text-gray-800 placeholder-gray-500 border transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                        errors.password
                          ? "border-red-300 focus:ring-red-200"
                          : "border-white/30 focus:ring-white/40"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="text-red-300 text-sm mt-1 ml-2">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password field (Sign up only) */}
                  {!isLogin && (
                    <div className="transform transition-all duration-500 ease-out">
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 z-10" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-4 pr-12 text-gray-800 placeholder-gray-500 border transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                            errors.confirmPassword
                              ? "border-red-300 focus:ring-red-200"
                              : "border-white/30 focus:ring-white/40"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors z-10"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {errors.confirmPassword && (
                          <p className="text-red-300 text-sm mt-1 ml-2">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Forgot Password link (Login only) */}
                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-white/80 hover:text-white text-sm transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Toggle auth mode */}
                <div className="mt-6 text-center">
                  <p className="text-white/80">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      onClick={toggleAuthMode}
                      className="ml-2 text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {/* Social login options */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 text-white/80">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                      <span className="text-2xl mr-2">🍎</span>
                      <span className="text-white font-medium">Apple</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                      <span className="text-2xl mr-2">🌐</span>
                      <span className="text-white font-medium">Google</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-yellow-300/15 to-pink-300/15 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-300/15 to-purple-300/15 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-white/60 text-sm">
            By {isLogin ? "signing in" : "creating an account"}, you agree to
            our{" "}
            <button className="text-yellow-300 hover:text-yellow-200 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-yellow-300 hover:text-yellow-200 transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
