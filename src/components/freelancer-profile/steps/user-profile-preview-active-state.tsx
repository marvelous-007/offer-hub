import { useState } from "react";
import { Edit, Trash2, ChevronLeft, Plus, HelpCircle } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import { useFreelancerSteps } from "@/hooks/use-freelancer-steps";

// Sample user data based on the image
const sampleUserData = {
  name: "Olivia Rhye",
  email: "olivia@outlookmail.com",
  location: "Madrid (Spain) 8:53 PM local time",
  title: "Blockchain Developer || Web 3 Product Expert",
  bio: "I'm a developer experienced in building websites for small and medium-sized businesses. Whether you're trying to win work, list your services, or create a new online store, I can help.",
  bulletPoints: [
    "Knows HTML and CSS, PHP, jQuery, WordPress, and SEO",
    "Full project management from start to finish",
    "Regular communication is important to me, so let's stay in touch",
  ],
  hourlyRate: "0.267",
  skills: [
    "Solidity",
    "Information Info-graphics",
    "Brand Management",
    "Branding",
    "Product Design",
    "Branding & Marketing",
    "Brand Development",
  ],
  workExperience: [
    {
      id: 1,
      title: "Software Engineer",
      company: "Microsoft",
      startDate: "2021-08",
      endDate: "Present",
      location: "USA, Washington",
      description:
        "This is your job experience description section. Lorem ipsum.",
    },
  ],
  education: [
    {
      id: 1,
      institution: "Northwestern University",
      degree: "Bachelor of Science(BSC) || Computer Sci",
      startDate: "2017-09",
      endDate: "2021-05",
      location: "USA, New Jersey",
      description:
        "This is your job experience description section. Lorem ipsum.",
    },
    {
      id: 2,
      institution: "Northwestern University",
      degree: "Bachelor of Science(BSC) || Computer Sci",
      startDate: "2017-09",
      endDate: "2021-05",
      location: "USA, New Jersey",
      description:
        "This is your job experience description section. Lorem ipsum.",
    },
  ],
  languages: [
    {
      id: 1,
      language: "English",
      level: "Fluent",
    },
    {
      id: 2,
      language: "Spanish",
      level: "Fluent",
    },
  ],
  profilePicture: "/api/placeholder/50/50", // Using placeholder as per instructions
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  if (dateString === "Present" || dateString === "present") return "present";

  try {
    const date = new Date(dateString);
    // Extract month and year
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch (e) {
    return dateString;
  }
};

export default function UserProfilePreview() {
  const { prevStep } = useFreelancerSteps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = sampleUserData;

  // Handle profile submission
  const handleSubmitProfile = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Profile submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  // Empty NFT badges array for display
  const nftBadges = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-y-8 items-center justify-center w-full">
      <div className="max-w-5xl mx-auto pb-10">
        <h1 className="text-2xl font-semibold text-gray-800 py-6">
          Preview Profile
        </h1>

        {/* Confirmation Banner */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-2">
              <div className="rounded-full bg-green-500 p-1 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <p className="text-gray-700">
              Looking good Olivia.
              <br />
              Make any edits you want, then submit your profile. You can make
              more changes after it's live.
            </p>
            <button
              onClick={handleSubmitProfile}
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit profile"}
            </button>
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden relative">
              <img
                src={userData.profilePicture}
                alt={`${userData.name}'s profile`}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{userData.name}</h2>
              <p className="text-gray-600 text-sm">{userData.email}</p>
              <p className="text-gray-500 text-xs flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {userData.location}
              </p>
            </div>
            <button className="text-gray-500 hover:text-gray-700 ml-auto">
              <Edit size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{userData.title}</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <Edit size={16} />
            </button>
          </div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700">{userData.bio}</p>
            <button className="text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0">
              <Edit size={16} />
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {userData.bulletPoints.map((point, index) => (
              <li key={index} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
          <div className="flex justify-start items-center gap-4">
            <div className="flex justify-between items-center shadow-md rounded-lg p-4 w-[16rem] gap-8">
              <div className="flex items-center">
                <span className="bg-gray-200 rounded-full p-2 mr-3">
                  <FaEthereum />
                </span>
                <div>
                  <span className="font-semibold">
                    {userData.hourlyRate} ETH
                  </span>
                  <p className="text-xs text-gray-500">Service Fee</p>
                </div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Edit size={16} />
            </button>
          </div>
        </div>

        {/* NFT Achievements Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2">
                NFTs achievements badge
              </h3>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            {nftBadges.map((badge, index) => (
              <div
                key={index}
                className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <Edit size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <button className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {userData.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h4 className="font-medium">
                    {exp.company} || {exp.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
                <p className="text-gray-500 text-sm">{exp.location}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Edit size={12} className="mr-1" /> Edit
                  </button>
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Trash2 size={12} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <button className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-6">
            {userData.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">{edu.institution}</h4>
                </div>
                <p className="text-sm">{edu.degree}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
                <p className="text-gray-500 text-sm">{edu.location}</p>
                <p className="text-gray-700 mt-2">{edu.description}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Edit size={12} className="mr-1" /> Edit
                  </button>
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Trash2 size={12} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Languages</h3>
            <button className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {userData.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{lang.language}: </span>
                  <span className="text-gray-500">{lang.level}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Edit size={12} className="mr-1" /> Edit
                  </button>
                  <button className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1 flex items-center">
                    <Trash2 size={12} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
      </div>
      <div className="mt-8 w-full border-t border-gray-200 pt-4 h-32 flex items-center">
        <div className="flex items-center gap-x-4 w-full justify-between max-w-5xl mx-auto h-fit">
          <button
            className="flex items-center text-gray-600 px-4 py-2"
            onClick={prevStep}
          >
            <ChevronLeft size={16} className="mr-2" /> Back
          </button>
          <button
            onClick={handleSubmitProfile}
            disabled={isSubmitting}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full"
          >
            {isSubmitting ? "Submitting..." : "Submit your profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
