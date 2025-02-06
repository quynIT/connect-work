import React, { useState } from "react";
import { Search, Plus, MapPin, DollarSign, FileText, X } from "lucide-react";

// Define the job listing interface
interface JobListing {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  status: string;
  attachments: string[];
}

const MgRecruitment: React.FC = () => {
  // Sample initial job listings
  const [jobListings, setJobListings] = useState<JobListing[]>([
    {
      title: "Software Engineer",
      description: "Develop and maintain software applications.",
      location: "Hanoi, Vietnam",
      salaryRange: "5000 - 7000 USD",
      status: "open",
      attachments: ["https://example.com/resume.pdf"],
    },
    {
      title: "Product Manager",
      description: "Lead product strategy and development.",
      location: "Ho Chi Minh City, Vietnam",
      salaryRange: "6000 - 8000 USD",
      status: "open",
      attachments: ["https://example.com/resume2.pdf"],
    },
  ]);

  // State for search input
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for create job listing modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // State for new job listing form
  const [newListing, setNewListing] = useState<JobListing>({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    status: "open",
    attachments: [],
  });

  // Filter job listings based on search term
  const filteredListings = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes in create listing form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle attachment input
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListing((prev) => ({
      ...prev,
      attachments: [e.target.value],
    }));
  };

  // Submit new job listing
  const handleSubmitListing = () => {
    // Validate form
    if (!newListing.title || !newListing.description || !newListing.location) {
      alert("Please fill in all required fields");
      return;
    }

    // Add new listing to job listings
    setJobListings((prev) => [...prev, newListing]);

    // Reset form and close modal
    setNewListing({
      title: "",
      description: "",
      location: "",
      salaryRange: "",
      status: "open",
      attachments: [],
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Job Listings</h1>

        {/* Search and Create Section */}
        <div className="flex mb-6">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Create Listing
          </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredListings.map((job, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {job.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "open"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{job.description}</p>

              <div className="grid grid-cols-3 gap-4 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-blue-400" size={20} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-green-400" size={20} />
                  <span>{job.salaryRange}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 text-purple-400" size={20} />
                  <a
                    href={job.attachments[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    View Attachment
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Listing Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                Create Job Listing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newListing.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newListing.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Job description details"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newListing.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Hanoi, Vietnam"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={newListing.salaryRange}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 5000 - 7000 USD"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Attachment URL
                  </label>
                  <input
                    type="text"
                    name="attachments"
                    value={newListing.attachments[0] || ""}
                    onChange={handleAttachmentChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. https://example.com/job-details.pdf"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={newListing.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmitListing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                  >
                    Create Job Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MgRecruitment;
