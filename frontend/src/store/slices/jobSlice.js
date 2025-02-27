import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  message: null,
  singleJob: {},
  myJobs: [],
  fetched: false, // ✅ Added fetched flag
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    request(state) {
      state.loading = true;
      state.error = null;
    },
    success(state, action) {
      state.loading = false;
      state.jobs = action.payload;
      state.fetched = true; // ✅ Mark as fetched
    },
    failure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    successSingle(state, action) {
      state.loading = false;
      state.singleJob = action.payload;
    },
    successPost(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    successDelete(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    successMyJobs(state, action) {
      state.loading = false;
      state.myJobs = action.payload;
      state.fetched = true; // ✅ Mark as fetched
    },
    clearErrors(state) {
      state.error = null;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const fetchJobs = (city, niche, searchKeyword = "") => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.request());
    let queryParams = new URLSearchParams();
    if (searchKeyword) queryParams.append("searchKeyword", searchKeyword);
    if (city && city !== "All") queryParams.append("city", city);
    if (niche && niche !== "All") queryParams.append("niche", niche);

    const response = await axios.get(
      `http://localhost:5000/job/?${queryParams.toString()}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.success(response.data.jobs));
    dispatch(jobSlice.actions.clearErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failure(error.response?.data?.message || "Error fetching jobs"));
  }
};

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.request());
  try {
    const response = await axios.get(
      `http://localhost:5000/job/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successSingle(response.data.job));
    dispatch(jobSlice.actions.clearErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failure(error.response?.data?.message || "Error fetching job"));
  }
};

export const postJob = (data) => async (dispatch) => {
  dispatch(jobSlice.actions.request());
  try {
    const response = await axios.post(
      `http://localhost:5000/job/`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successPost(response.data.message));
    dispatch(jobSlice.actions.clearErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failure(error.response?.data?.message || "Error posting job"));
  }
};

export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.request());
  try {
    const response = await axios.get(
      `http://localhost:5000/job/my-jobs`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failure(error.response?.data?.message || "Error fetching my jobs"));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.request());
  try {
    const response = await axios.delete(
      `http://localhost:5000/job/${id}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successDelete(response.data.message));
    dispatch(jobSlice.actions.clearErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failure(error.response?.data?.message || "Error deleting job"));
  }
};

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.reset());
};

export default jobSlice.reducer;