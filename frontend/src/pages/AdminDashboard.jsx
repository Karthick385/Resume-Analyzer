import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);

  const [formData, setFormData] =
    useState({
      title: "",
      company: "",
      description: "",
      skills: "",
    });

  const fetchJobs = async () => {
    const res = await axios.get(
      "https://resume-analyzer-api-2yf7.onrender.com/api/jobs"
    );

    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://resume-analyzer-api-2yf7.onrender.com/api/jobs",
      {
        ...formData,
        skills:
          formData.skills.split(","),
      }
    );

    fetchJobs();

    setFormData({
      title: "",
      company: "",
      description: "",
      skills: "",
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        Admin Dashboard
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <input
          name="title"
          placeholder="Job Title"
          className="border p-2 w-full"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          name="company"
          placeholder="Company"
          className="border p-2 w-full"
          value={formData.company}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          name="skills"
          placeholder="React,Node.js,MongoDB"
          className="border p-2 w-full"
          value={formData.skills}
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded">
          Add Job
        </button>
      </form>

      <div className="mt-10">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border p-4 mb-3 rounded"
          >
            <h2 className="font-bold">
              {job.title}
            </h2>

            <p>{job.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;