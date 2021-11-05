import {useState, useEffect} from 'react';

export const useRequest = (apiUrl, init) => {
  const [requestStatus, setRequestStatus] = useState({
    data: undefined,
    loading: false,
    error: ""
  });

  const sendRequest = async (url) => {
    setRequestStatus({ loading: true, data: undefined,  error: undefined });

    try {
      const result = await url;

      if (result.data) { setRequestStatus({ loading: false, data: result.data.result.courses, error: undefined }); }
    } catch (err) {

      if (err.response) {

        if(err.response.status === 404 || err.response.status === 400){
          console.log('E ', err.response);
          setRequestStatus({ loading: false, error: err.response.data.error ? err.response.data.error : err.response.data.errorMessage,  data: undefined});
        } else{
          setRequestStatus({ loading: false, error: err.response.data.errorMessage,  data: undefined});
        }
      } else if (err.request) { // The request was made but no response was received
        console.log("err.request = ", err.request);
      } else { // Something happened in setting up the request that triggered an Error
        console.log('err.message = ', err.message);
        setRequestStatus({ loading: false, error: err.message,  data: undefined});
      }
    }
  }

  const removeStatusData = () => {
    setRequestStatus({ loading: false, data: undefined,  error: undefined });
  }

  useEffect(() => {
    if(init) sendRequest(apiUrl());
  }, []); // eslint-disable-line

  return { requestStatus, sendRequest, removeStatusData };
};
