import { useEffect, useState } from "react";
import axios from "./Axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const useFetch = (url) => {
  const [isPending, setIsPending] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { admin } = useAuthContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admin.token}`
          },
          signal
        });
        setData(response.data.Message);
        setIsPending(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request was aborted');
        } else {
          setIsPending(false);
          setErrorMessage(error.response?.data?.message || error.message);
          console.log(error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, admin.token]);

  return { isPending, data, errorMessage };
};

export default useFetch;
