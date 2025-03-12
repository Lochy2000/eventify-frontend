import { jwtDecode } from "jwt-decode";
import axiosInstance from '../api/axiosDefaults';

export const setTokenTimeStamp = (data) => {
    const refreshTokenTimeStamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimeStamp", refreshTokenTimeStamp);
};

export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimeStamp");
};

export const removeTokenTimeStamp = () => {
    localStorage.removeItem("refreshTokenTimeStamp");
};

/**
 * Fetches more data for infinite scrolling components
 * 
 * @param {Object} resource - The resource containing results and next URL
 * @param {Function} setResource - Function to update the resource state
 */
export const fetchMoreData = async (resource, setResource) => {
  try {
    // Extract the URL for the next page from the resource
    const { next } = resource;
    if (next) {
      // If there is a next page, fetch it
      const { data } = await axiosInstance.get(next);
      // Update the resource with the new data
      setResource(prevResource => ({
        ...prevResource,
        next: data.next,
        // Concatenate the new results with the existing ones
        results: [...prevResource.results, ...data.results],
      }));
    }
  } catch (err) {
    console.error(err);
  }
};