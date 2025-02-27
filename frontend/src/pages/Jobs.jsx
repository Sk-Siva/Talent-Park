import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 List of cities and domains (Easily expandable)
  const cities = [
    "All",
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Thanjavur",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Thanjavur",
    "Hosur",
    "Nagercoil",
    "Kanchipuram"
  ]
  const domains = ["All",
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }

    dispatch(fetchJobs(city, niche, ""));
  }, [dispatch, city, niche, error, isAuthenticated, navigate]);

  const handleSearch = () => {
    if (isAuthenticated) {
      dispatch(fetchJobs(city, niche, searchKeyword));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="container my-4">
          {/* 🔍 Search Bar */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Find Job <FaSearch />
            </button>
          </div>

          {/* 🎯 Filters & Job Listings Row */}
          <div className="row">
            {/* 🔹 Filters Section (Left) */}
            <div className="col-md-3">
              <div className="card p-3 mb-3">
                <h5 className="mb-3">Filter By City</h5>
                {cities.map((city, index) => (
                  <div className="form-check" key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      className="form-check-input"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => {
                        setCity(city);
                        setSelectedCity(city);
                      }}
                    />
                    <label htmlFor={city} className="form-check-label">{city}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔹 Domains Section */}
            <div className="col-md-3">
              <div className="card p-3 mb-3">
                <h5 className="mb-3">Filter By Domain</h5>
                {domains.map((domain, index) => (
                  <div className="form-check" key={index}>
                    <input
                      type="radio"
                      id={domain}
                      name="niche"
                      className="form-check-input"
                      value={domain}
                      checked={selectedNiche === domain}
                      onChange={() => {
                        setNiche(domain);
                        setSelectedNiche(domain);
                      }}
                    />
                    <label htmlFor={domain} className="form-check-label">{domain}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔹 Job Listings (Right) */}
            <div className="col-md-6">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <div className="card mb-3 p-3" key={job._id}>
                    <p className={`badge ${job.hiringMultipleCandidates === "Yes" ? "bg-success" : "bg-primary"}`}>
                      {job.hiringMultipleCandidates === "Yes" ? "Hiring Multiple Candidates" : "Hiring"}
                    </p>
                    <h5 className="title">{job.title}</h5>
                    <p className="text-muted">{job.companyName}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Salary:</strong> Rs. {job.salary}</p>
                    <p><strong>Posted On:</strong> {job.jobPostedOn.substring(0, 10)}</p>

                    <Link className="btn btn-primary" to={`/post/application/${job._id}`}>
                      Apply Now
                    </Link>
                  </div>
                ))
              ) : (
                <img src="./notfound.png" alt="job-not-found" className="w-100" />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;