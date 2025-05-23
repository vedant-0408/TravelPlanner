const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const ADMIN_API_ROUTES = {
  LOGIN: `${BASE_URL}/admin/login`,
  CREATE_JOB: `${BASE_URL}/admin/create-job`,
  GET_JOB_DETAILS: `${BASE_URL}/admin/get-job`,
};

export const USER_API_ROUTES = {
  GET_ALL_TRIPS: `${BASE_URL}/get-trips`,
  GET_CITY_TRIPS: `${BASE_URL}/trips`,
  GET_TRIP_DATA: `${BASE_URL}/get-trip-details`,
  LOGIN: `${BASE_URL}/login`,
  SIGNUP: `${BASE_URL}/signup`,
  ME: `${BASE_URL}/auth/me`,
  CREATE_BOOKING: `${BASE_URL}/create-booking`,
};
