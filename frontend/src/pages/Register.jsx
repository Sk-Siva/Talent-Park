import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/slices/userSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const nichesArray = [
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

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegsiter = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    if (role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Create a new account</h3>
          </div>
          <form onSubmit={handleRegsiter}>
            <div className="wrapper">
              <div className="inputTag">
                <label>Register As</label>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="Employer">Register as an Employer</option>
                    <option value="Job Seeker">Register as a Job Seeker</option>
                  </select>
                </div>
              </div>
              <div className="inputTag">
                <label>Name</label>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Email Address</label>
                <div>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputTag">
                <label>Phone Number</label>
                <div>
                  <input
                    type="number"
                    placeholder="Enter your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Address</label>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputTag">
                <label>Password</label>
                <div>
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {role === "Job Seeker" && (
              <>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Domain 1</label>
                    <div>
                      <select
                        value={firstNiche}
                        onChange={(e) => setFirstNiche(e.target.value)}
                      >
                        <option value="">Domain</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Domain 2</label>
                    <div>
                      <select
                        value={secondNiche}
                        onChange={(e) => setSecondNiche(e.target.value)}
                      >
                        <option value="">Domain</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Domain 3</label>
                    <div>
                      <select
                        value={thirdNiche}
                        onChange={(e) => setThirdNiche(e.target.value)}
                      >
                        <option value="">Domain</option>
                        {nichesArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Coverletter</label>
                    <div>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Upload your Resume</label>
                    <div>
                      <input
                        type="file"
                        onChange={resumeHandler}
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <button type="submit">
              Register
            </button>
            <p className="text-center">Already Have an Account?</p>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
