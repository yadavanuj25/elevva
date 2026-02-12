// src/components/dashboards/DefaultDashboard.jsx

import React from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  MessageCircle,
  Shield,
  Lock,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Rocket,
  Star,
  Users,
  Award,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Gift,
} from "lucide-react";
import { FaGraduationCap, FaLock, FaUserShield } from "react-icons/fa";
import {
  MdVerifiedUser,
  MdLockOutline,
  MdContactSupport,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi";

/**
 * Premium Default Dashboard Component
 * Onboarding and limited access design with Tailwind CSS
 */
const DefaultDashboard = () => {
  const { user, role } = useAuth();

  const gettingStartedSteps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description:
        "Add your contact information, profile photo, and preferences to personalize your experience.",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      action: "Edit Profile",
      completed: false,
    },
    {
      id: 2,
      title: "Request Access",
      description:
        "Contact your administrator to upgrade your access level and unlock more features.",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      action: "Contact Admin",
      completed: false,
    },
    {
      id: 3,
      title: "Learn the Platform",
      description:
        "Explore our comprehensive documentation, video tutorials, and training resources.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      action: "Start Learning",
      completed: false,
    },
  ];

  const features = [
    {
      title: "Dashboard Analytics",
      description: "View real-time insights and performance metrics",
      icon: TrendingUp,
      available: false,
      tier: "Pro",
    },
    {
      title: "Contact Management",
      description: "Manage and organize your customer relationships",
      icon: Users,
      available: false,
      tier: "Pro",
    },
    {
      title: "Deal Pipeline",
      description: "Track and manage your sales opportunities",
      icon: Target,
      available: false,
      tier: "Pro",
    },
    {
      title: "Reporting & Analytics",
      description: "Generate detailed reports and analytics",
      icon: FileText,
      available: false,
      tier: "Enterprise",
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team members",
      icon: Users,
      available: false,
      tier: "Pro",
    },
    {
      title: "Advanced Automation",
      description: "Automate your workflows and processes",
      icon: Zap,
      available: false,
      tier: "Enterprise",
    },
  ];

  const resources = [
    {
      title: "Documentation",
      description: "Browse comprehensive guides and API references",
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      link: "/docs",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      link: "/tutorials",
    },
    {
      title: "Support Center",
      description: "Get help from our support team",
      icon: HelpCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      link: "/support",
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share tips",
      icon: MessageCircle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      link: "/community",
    },
  ];

  const upgradeBenefits = [
    "Access to all premium features",
    "Advanced analytics and reporting",
    "Priority customer support",
    "Team collaboration tools",
    "Automation and workflows",
    "Custom integrations",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-indigo-500/30 p-8 lg:p-12 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">
                    Limited Access Account
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Hello, {user?.name?.split(" ")[0] || "there"}! 👋
                </h2>
                <p className="text-xl text-indigo-100 mb-6">
                  You're viewing a limited version of the platform. Unlock full
                  access to supercharge your productivity!
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Request Full Access
                  </button>
                  <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Watch Demo
                  </button>
                </div>
              </div>

              <div className="hidden xl:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Gift className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                  <p className="text-sm font-semibold mb-2">Special Offer</p>
                  <p className="text-3xl font-bold mb-2">30% OFF</p>
                  <p className="text-xs text-indigo-100">First 3 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 mb-2">
              Limited Access Notice
            </h3>
            <p className="text-amber-800 mb-4">
              You currently have restricted access to the platform. Contact your
              administrator to request appropriate permissions for your role, or
              upgrade your account to unlock premium features.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors">
                Contact Administrator
              </button>
              <button className="px-4 py-2 bg-white border-2 border-amber-200 text-amber-900 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className=" text-slate-900">Getting Started</h2>
            <p className="text-slate-600 mt-2">
              Complete these steps to make the most of your account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {gettingStartedSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${step.color}`}
                  ></div>

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-4 rounded-xl ${step.iconBg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-8 h-8 ${step.iconColor}`} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="font-bold text-slate-700">
                        {step.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 mb-6">{step.description}</p>

                  <button
                    className={`w-full px-6 py-3 bg-gradient-to-r ${step.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                  >
                    {step.action}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {step.completed && (
                    <div className="absolute top-4 right-4 p-2 bg-emerald-50 rounded-full">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className=" text-slate-900">Available Features</h2>
            <p className="text-slate-600 mt-2">
              Unlock these powerful features with an upgrade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-6 relative group hover:shadow-md transition-all"
                >
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {feature.tier}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="p-3 bg-slate-100 rounded-xl inline-block group-hover:bg-indigo-50 transition-colors">
                      <Icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">
                      Requires {feature.tier} plan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resources */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Learning Resources
              </h3>
              <p className="text-slate-600 mt-1">
                Get the help you need to succeed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.link}
                    className="flex items-start gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                  >
                    <div
                      className={`p-3 rounded-xl ${resource.iconBg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${resource.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {resource.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 p-8 text-white">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className=" mb-2">Upgrade Now</h2>
              <p className="text-indigo-100">Unlock all premium features</p>
            </div>

            <div className="space-y-3 mb-6">
              {upgradeBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-indigo-50">{benefit}</span>
                </div>
              ))}
            </div>

            <button className="w-full px-6 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <Star className="w-5 h-5" />
              Get Started Today
            </button>

            <p className="text-center text-sm text-indigo-200 mt-4">
              Special offer: <strong className="text-white">30% off</strong> for
              first 3 months
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;
