import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    request(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    success(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    failure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    successMessage(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    reset(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchEmployerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.request());
  try {
    const response = await axios.get(`https://talent-park-production.up.railway.app/application/employer`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.success(response.data.applications));
  } catch (error) {
    dispatch(applicationSlice.actions.failure(error.response?.data?.message || "Something went wrong"));
  }
};

export const fetchJobSeekerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.request());
  try {
    const response = await axios.get(`https://talent-park-production.up.railway.app/application/jobseeker`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.success(response.data.applications));
  } catch (error) {
    dispatch(applicationSlice.actions.failure(error.response?.data?.message || "Something went wrong"));
  }
};

export const postApplication = (data, jobId) => async (dispatch) => {
  dispatch(applicationSlice.actions.request());
  try {
    const response = await axios.post(
      `https://talent-park-production.up.railway.app/application/${jobId}/apply`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(applicationSlice.actions.successMessage(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failure(error.response?.data?.message || "Something went wrong"));
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.request());
  try {
    const response = await axios.delete(`https://talent-park-production.up.railway.app/application/${id}`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.successMessage(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failure(error.response?.data?.message || "Something went wrong"));
  }
};

export const clearAllApplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearErrors());
};

export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.reset());
};

export default applicationSlice.reducer;