import React, { useEffect, useState } from "react";
import {
  FileText, MapPin, Phone, RefreshCcw, Mail, Eye,
  Building, Star, ArrowLeft, Briefcase, Wallet,
  Laptop, Clock, Shield, Users, Info, CalendarDays,
  ReceiptIndianRupee, Globe, Github, Award, GraduationCap,
  Linkedin, BarChart3, TrendingUp, ExternalLink, BookOpen,
  ChevronRight, Zap, Target, Code2, MessageSquare
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { getProfileById } from "../../services/profileServices";
import NoData from "../ui/NoData";
import PageTitle from "../../hooks/PageTitle";
import { BarLoader } from "react-spinners";
import BackButton from "../ui/buttons/BackButton";
import EditButton from "../ui/buttons/EditButton";
import { BASE_URL } from "../../config/api";
import { swalError } from "../../utils/swalHelper";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 70) return { bg: "bg-emerald-500", text: "text-emerald-600", bar: "#10b981", ring: "#10b981" };
  if (score >= 40) return { bg: "bg-amber-400", text: "text-amber-500", bar: "#f59e0b", ring: "#f59e0b" };
  return { bg: "bg-red-400", text: "text-red-500", bar: "#f87171", ring: "#ef4444" };
};

const levelBadge = {
  Expert: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Intermediate: "bg-amber-100  text-amber-700   dark:bg-amber-900/40   dark:text-amber-300",
  Beginner: "bg-red-100    text-red-700     dark:bg-red-900/40     dark:text-red-300",
};

// ─────────────────────────────────────────────
// Candidate Score Ring
// ─────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const clr = scoreColor(score ?? 0);
  const data = [{ name: "score", value: score ?? 0, fill: clr.ring }];
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%" outerRadius="100%"
            data={data} startAngle={90} endAngle={-270}
            barSize={10}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#e5e7eb" }} />
            <Tooltip formatter={(v) => [`${v}/100`, "Score"]} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${clr.text}`}>{score ?? "–"}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Candidate Score
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Skill Bar Card
// ─────────────────────────────────────────────
const SkillBar = ({ skill }) => {
  const { bg, text } = scoreColor(skill.confidenceScore);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${levelBadge[skill.level] || levelBadge.Intermediate}`}>
            {skill.level}
          </span>
          {skill.source === "both" && (
            <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 px-1.5 py-0.5 rounded-full font-semibold">
              ✓ Verified
            </span>
          )}
          {skill.source === "comment" && (
            <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-semibold">
              Recruiter
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {skill.yearsOfExperience > 0 && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{skill.yearsOfExperience}y</span>
          )}
          <span className={`text-xs font-bold ${text}`}>{skill.confidenceScore}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${bg}`}
          style={{ width: `${skill.confidenceScore}%` }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Timeline Item
// ─────────────────────────────────────────────
const TimelineItem = ({ title, sub, period, desc, icon, isLast }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-accent-light dark:bg-gray-700 border-2 border-accent-dark flex items-center justify-center text-accent-dark shrink-0">
        {icon}
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-600 mt-1" />}
    </div>
    <div className="pb-5">
      <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
      {sub && <p className="text-xs text-accent-dark font-medium mt-0.5">{sub}</p>}
      {period && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{period}</p>}
      {desc && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Info Row
// ─────────────────────────────────────────────
const InfoRow = ({ icon, label, value, href }) => (
  <div className="flex items-start gap-2.5 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
    <span className="mt-0.5 text-gray-400 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate">
          {value} <ExternalLink size={11} />
        </a>
      ) : (
        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{value || <span className="text-gray-400 italic text-xs">Not provided</span>}</p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Section Card
// ─────────────────────────────────────────────
const Card = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-[#E8E8E9] dark:border-gray-700 overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E8E8E9] dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/80">
      <span className="text-accent-dark">{icon}</span>
      <h3 className="font-semibold text-gray-800 dark:text-white text-sm tracking-wide">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const ViewProfile = () => {
  const { id } = useParams();
  PageTitle("Elevva | Profile View");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfileById(); }, [id]);

  const fetchProfileById = async () => {
    setLoading(true);
    try {
      const res = await getProfileById(id);
      if (res.success && res.profile) setProfile(res.profile);
    } catch (err) {
      swalError("Error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort skills by confidence score DESC
  const sortedSkills = [...(profile?.skills || [])].sort((a, b) =>
    (b.confidenceScore ?? 0) - (a.confidenceScore ?? 0)
  );
  const expertSkills = sortedSkills.filter(s => s.level === "Expert");
  const intermediateSkills = sortedSkills.filter(s => s.level === "Intermediate");
  const beginnerSkills = sortedSkills.filter(s => s.level === "Beginner");

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
          <BarLoader height={6} width={200} color="currentColor" cssOverride={{ borderRadius: "999px" }} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="min-h-[70vh] flex justify-center items-center"><NoData title="Profile Not Found" /></div>;
  }

  const candidateScore = profile.candidateScore ?? null;

  return (
    <div className="space-y-4">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-800 dark:text-white">Profile Details</h2>
          {profile.profileCode && (
            <span className="text-accent-dark bg-accent-light dark:bg-white text-[11px] px-2 py-0.5 border-b border-accent-dark rounded font-semibold">
              #{profile.profileCode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProfileById}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500">
            <RefreshCcw size={15} />
          </button>
          <EditButton onClick={() => navigate(`/profiles/${profile._id}/edit`)} />
          <BackButton onClick={() => navigate("/profiles")} />
        </div>
      </div>

      {/* ── Hero Header Card ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#E8E8E9] dark:border-gray-700 overflow-hidden">
        {/* gradient banner */}
        <div className="h-20 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
        <div className="px-6 pb-5 -mt-10">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 select-none">
                {profile.fullName?.slice(0, 2).toUpperCase()}
              </div>
              <div className="mb-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{profile.fullName}</h1>
                {profile.currentCompany && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Building size={12} /> {profile.currentCompany}
                    {profile.totalExp && <span className="text-gray-400 mx-1">·</span>}
                    {profile.totalExp && <span>{profile.totalExp} exp</span>}
                  </p>
                )}
                {profile.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-lg leading-relaxed line-clamp-2">
                    {profile.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${profile.status === "Active" ? "bg-green-500" : profile.status === "Banned" ? "bg-red-500" : "bg-gray-500"
                    }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />{profile.status}
                  </span>
                  {profile.candidateSource && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <Zap size={11} /> {profile.candidateSource}
                    </span>
                  )}
                  {profile.workMode && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      <Laptop size={11} /> {profile.workMode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score Ring */}
            {candidateScore != null && <ScoreRing score={candidateScore} />}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* ──── Left Column ──── */}
        <div className="space-y-4 lg:col-span-1">

          {/* Contact */}
          <Card title="Contact" icon={<Phone size={15} />}>
            <InfoRow icon={<Mail size={14} />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <InfoRow icon={<Phone size={14} />} label="Phone" value={profile.phone} href={profile.phone ? `tel:${profile.phone}` : null} />
            {profile.alternatePhone && <InfoRow icon={<Phone size={14} />} label="Alt Phone" value={profile.alternatePhone} />}
            <InfoRow icon={<MapPin size={14} />} label="Current Location" value={profile.currentLocation} />
            <InfoRow icon={<MapPin size={14} />} label="Preferred Location" value={profile.preferredLocation} />
          </Card>

          {/* Online Presence */}
          {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
            <Card title="Online Presence" icon={<Globe size={15} />}>
              {profile.linkedinUrl && (
                <InfoRow icon={<Linkedin size={14} />} label="LinkedIn" value="View Profile" href={profile.linkedinUrl} />
              )}
              {profile.githubUrl && (
                <InfoRow icon={<Github size={14} />} label="GitHub" value="View Repos" href={profile.githubUrl} />
              )}
              {profile.portfolioUrl && (
                <InfoRow icon={<Globe size={14} />} label="Portfolio" value="Visit Site" href={profile.portfolioUrl} />
              )}
            </Card>
          )}

          {/* Compensation */}
          <Card title="Compensation & Availability" icon={<ReceiptIndianRupee size={15} />}>
            <InfoRow icon={<Wallet size={14} />} label="Current CTC" value={profile.currentCTC ? `₹ ${profile.currentCTC}` : null} />
            <InfoRow icon={<TrendingUp size={14} />} label="Expected CTC" value={profile.expectedCTC ? `₹ ${profile.expectedCTC}` : null} />
            <InfoRow icon={<Clock size={14} />} label="Notice Period" value={profile.noticePeriod} />
          </Card>

          {/* Resume */}
          {profile.resume && (
            <Card title="Resume" icon={<FileText size={15} />}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FileText size={16} className="text-accent-dark" />
                  <span className="truncate max-w-[140px]">{profile.resume.originalName}</span>
                </div>
                <a href={`${BASE_URL}/${profile.resume.path}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-accent-dark text-white rounded-lg hover:opacity-90 transition">
                  <Eye size={13} /> View
                </a>
              </div>
              {profile.resumeS3Url && (
                <a href={profile.resumeS3Url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 mt-3 hover:underline">
                  <ExternalLink size={11} /> View on S3 (Cloud Copy)
                </a>
              )}
            </Card>
          )}

          {/* Submitted By */}
          <Card title="Profile Owner" icon={<Info size={15} />}>
            <InfoRow icon={<Users size={14} />} label="Added By" value={profile.submittedBy?.fullName} />
            <InfoRow icon={<Mail size={14} />} label="Email" value={profile.submittedBy?.email} />
            <InfoRow icon={<CalendarDays size={14} />} label="Created" value={
              new Date(profile.createdAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: true
              })
            } />
          </Card>
        </div>

        {/* ──── Right Column ──── */}
        <div className="space-y-4 lg:col-span-2">

          {/* Professional Info */}
          <Card title="Professional Summary" icon={<Briefcase size={15} />}>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Company", value: profile.currentCompany, icon: <Building size={14} /> },
                { label: "Experience", value: profile.totalExp, icon: <Briefcase size={14} /> },
                { label: "Work Mode", value: profile.workMode, icon: <Laptop size={14} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-start gap-2">
                  <span className="mt-0.5 text-accent-dark">{icon}</span>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
            {profile.techStack && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.techStack?.split(",").map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* ── Skills Confidence Matrix ── */}
          {sortedSkills.length > 0 && (
            <Card title="Skills Confidence Matrix" icon={<BarChart3 size={15} />}>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Expert
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Intermediate
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Beginner
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Verified (CV + Recruiter)
                </div>
              </div>

              {expertSkills.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Star size={11} /> Expert Level
                  </p>
                  {expertSkills.map((s, i) => <SkillBar key={i} skill={s} />)}
                </div>
              )}
              {intermediateSkills.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Target size={11} /> Intermediate Level
                  </p>
                  {intermediateSkills.map((s, i) => <SkillBar key={i} skill={s} />)}
                </div>
              )}
              {beginnerSkills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <BookOpen size={11} /> Beginner Level
                  </p>
                  {beginnerSkills.map((s, i) => <SkillBar key={i} skill={s} />)}
                </div>
              )}
            </Card>
          )}

          {/* ── Work Experience ── */}
          {profile.experience?.length > 0 && (
            <Card title="Work Experience" icon={<Briefcase size={15} />}>
              {profile.experience.map((exp, i) => (
                <TimelineItem
                  key={i}
                  icon={<Building size={14} />}
                  title={exp.title || "Role not specified"}
                  sub={exp.company}
                  period={`${exp.startDate || "?"} – ${exp.endDate || "Present"}${exp.location ? " · " + exp.location : ""}`}
                  desc={exp.description}
                  isLast={i === profile.experience.length - 1}
                />
              ))}
            </Card>
          )}

          {/* ── Education ── */}
          {profile.education?.length > 0 && (
            <Card title="Education" icon={<GraduationCap size={15} />}>
              {profile.education.map((edu, i) => (
                <TimelineItem
                  key={i}
                  icon={<GraduationCap size={14} />}
                  title={edu.degree ? `${edu.degree}${edu.field ? " in " + edu.field : ""}` : edu.field || "Degree"}
                  sub={edu.institution}
                  period={`${edu.startYear || "?"} – ${edu.endYear || "?"}${edu.grade ? " · " + edu.grade : ""}`}
                  isLast={i === profile.education.length - 1}
                />
              ))}
            </Card>
          )}

          {/* ── Certifications ── */}
          {profile.certifications?.length > 0 && (
            <Card title="Certifications" icon={<Award size={15} />}>
              <div className="flex flex-wrap gap-3">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 min-w-[180px]">
                    <Award size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{cert.name}</p>
                      {cert.issuer && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}</p>}
                      {cert.year && <p className="text-xs text-amber-600 mt-0.5 font-medium">{cert.year}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── Languages ── */}
          {profile.languages?.length > 0 && (
            <Card title="Languages" icon={<MessageSquare size={15} />}>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
