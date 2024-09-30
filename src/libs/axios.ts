import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

// Use this in a component to use it.

// export const fetchData = async () => {
//   try {
//     const response = await axios.get('/endpoint');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching data', error);
//     throw error;
//   }
// };
