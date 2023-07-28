import axios from 'axios'



export const axiosVerifyVendor = async (identifier:string)=>{
    // Assuming your axiosVerifyVendor function looks something like this
  try {
    const url = `https://business-name-verifier.onrender.com/company/getsingle?reg_number=${identifier}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error:any) {
    // Handle the error here
    if (error.response && error.response.status === 404) {
      return "not found"; // Return an empty array to indicate no data found
    }
    throw error; // Re-throw other errors
  }
};
