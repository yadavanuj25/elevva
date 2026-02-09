import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  BarChart3,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  Menu,
  X,
  Star,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";

export default function Home() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description:
        "Centralize all customer data and interactions in one powerful platform",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Get real-time insights with customizable dashboards and reports",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automation",
      description:
        "Streamline workflows and automate repetitive tasks effortlessly",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and compliance with industry standards",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description:
        "Multi-currency, multi-language support for worldwide operations",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Easy Integration",
      description: "Connect with 500+ apps and tools you already use",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    {
      value: "50K+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: <Star className="w-6 h-6" />,
    },
    {
      value: "10M+",
      label: "Contacts Managed",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc",
      content:
        "Elevva CRM transformed how we manage our customer relationships. Our sales increased by 150% in just 6 months!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Sales Director, GlobalCorp",
      content:
        "The automation features saved our team 20 hours per week. Best investment we've made for our business.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Founder, StartupHub",
      content:
        "Intuitive, powerful, and incredibly easy to use. Our entire team was up and running in less than a day.",
      avatar: "ER",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 1,000 contacts",
        "Basic analytics",
        "Email support",
        "Mobile app access",
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "Up to 10,000 contacts",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "API access",
      ],
      gradient: "from-purple-500 to-pink-500",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited contacts",
        "AI-powered insights",
        "24/7 phone support",
        "Dedicated account manager",
        "Custom development",
      ],
      gradient: "from-orange-500 to-red-500",
      popular: false,
    },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out of your account?",
      text: "You’ll be signed out and need to log in again to continue.",
      icon: "question",
      iconColor: "#dc2626",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Stay logged in",
      background: "#f9fafb",
      color: "#dc2626",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      backdrop: "rgba(0, 0, 0, 0.9)",
      customClass: {
        popup: "rounded-2xl shadow-xl p-6",
        title: "text-lg font-semibold text-[#dc2626]",
        htmlContainer: "text-sm text-gray-600",
        confirmButton:
          "px-5 py-2 rounded-lg font-medium bg-[#dc2626] hover:opacity-90 transition-all",
        cancelButton:
          "px-5 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all",
      },
    });

    if (!result.isConfirmed) return;

    const success = await logout();

    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-900 overflow-hidden">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-300/30 to-orange-300/30 rounded-full blur-3xl top-1/4 right-0 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl bottom-0 left-1/4 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor:
            scrollY > 50 ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(10px)" : "none",
          boxShadow:
            scrollY > 50 ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Elevva CRM
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                to="#testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Testimonials
              </Link>
              <Link
                to="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </Link>

              {/* Go to Dashboard (Only if logged in) */}
              {token && (
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 font-medium"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              )}

              {!token && (
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Sign In
                </Link>
              )}

              <button
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 font-medium"
                onClick={() => (token ? handleLogout() : navigate("/login"))}
              >
                {token ? "Sign out" : "GetStarted"}
              </button>
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top">
              <Link
                to="#features"
                className="block text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                to="#testimonials"
                className="block text-gray-700 hover:text-blue-600 transition-colors"
              >
                Testimonials
              </Link>
              <Link
                to="#pricing"
                className="block text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </Link>
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative  flex items-center justify-center px-6 pt-24">
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top duration-700">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700">
              Trusted by 50,000+ businesses worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100 leading-tight">
            Supercharge Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Relations
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            The all-in-one CRM platform that helps you manage customers, close
            deals faster, and grow your business exponentially.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 rounded-full text-lg font-semibold hover:bg-white hover:border-blue-600 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Floating cards animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${
                    idx === 0
                      ? "from-blue-500 to-cyan-500"
                      : idx === 1
                        ? "from-purple-500 to-pink-500"
                        : idx === 2
                          ? "from-orange-500 to-red-500"
                          : "from-green-500 to-emerald-500"
                  } rounded-xl flex items-center justify-center mb-3 text-white group-hover:rotate-12 transition-transform`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="section-features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible["section-features"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to transform how you manage customer
              relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group p-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isVisible["section-features"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="section-testimonials" className="py-32 px-6 relative">
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible["section-testimonials"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Loved by{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
          </div>

          <div className="relative h-80 md:h-64">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ${
                  idx === activeTestimonial
                    ? "opacity-100 translate-x-0"
                    : idx < activeTestimonial
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                }`}
              >
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 shadow-2xl h-full flex flex-col justify-center">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === activeTestimonial ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="section-pricing" className="py-32 px-6 relative">
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible["section-pricing"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-green-400 text-white rounded-full text-sm font-semibold">
              PRICING
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent pricing that grows with you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 bg-white/80 backdrop-blur-sm border-2 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  plan.popular
                    ? "border-purple-500 shadow-xl"
                    : "border-gray-200"
                } ${
                  isVisible["section-pricing"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {plan.popular && (
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${plan.gradient} text-white text-sm font-semibold rounded-full`}
                  >
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-6">
                  <span
                    className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle
                        className={`w-5 h-5 bg-gradient-to-r ${plan.gradient} text-transparent`}
                        style={{
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                        }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl hover:shadow-purple-500/50`
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="section-cta" className="py-32 px-6">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible["section-cta"]
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of companies already using Elevva CRM to grow
                their revenue
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Elevva CRM
            </div>
            <div className="flex gap-8 text-gray-600">
              <Link to="#" className="hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            © 2025 Elevva CRM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
