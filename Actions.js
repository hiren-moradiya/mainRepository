import axios from 'axios';

export const EMAIL = 'EMAIL';
export const PASSWORD = 'PASSWORD';
export const REQUIST_URL = 'REQUIST_URL';
export const FETCH_LOGIN_URL_SUCCESS = 'FETCH_LOGIN_URL_SUCCESS';
export const FETCH_EMPLOYEE_URL_SUCCESS = 'FETCH_EMPLOYEE_URL_SUCCESS';
export const FETCH_URL_FAILURE = 'FETCH_URL_FAILURE';
export const loginEmail = email => ({
  type: EMAIL,
  payload: email,
});

export const loginPassword = password => ({
  type: PASSWORD,
  payload: password,
});

export const requestUrl = () => {
  return {
    type: REQUIST_URL,
  };
};

export const fetchLoginUrlSucces = token => {
  return {
    type: FETCH_LOGIN_URL_SUCCESS,
    payload: token,
  };
};

export const fetchEmployeeUrlSucces = data => {
  return {
    type: FETCH_EMPLOYEE_URL_SUCCESS,
    payload: data,
  };
};

export const fetchUrlFailure = error => {
  return {
    type: FETCH_URL_FAILURE,
    payload: error,
  };
};

export const loginAPI = (requestBody, onRequest, onError, onSuccess) => {
  return dispatch => {
    dispatch(requestUrl());
    onRequest();
    axios
      .post('http://192.168.10.167:4000/auth/login', requestBody)
      .then(response => {
        const accessToken = response.data?.data?.accessToken;
        const message = response.data?.message;
        if (accessToken) {
          dispatch(fetchLoginUrlSucces(accessToken));
          onSuccess(message);
        } else {
          dispatch(fetchUrlFailure(message));
          onError(message);
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(fetchUrlFailure(error));
        onError();
      });
  };
};

export const getEmployee = (token, onError) => {
  return dispatch => {
    axios
      .get('http://192.168.10.167:4000/employee', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(response => {
        const data = response?.data?.data;
        dispatch(fetchEmployeeUrlSucces(data));
      })
      .catch(error => {
        const message = error.response.data.message;
        dispatch(fetchUrlFailure(message));
        onError(message);
      });
  };
};

export const addEmployee = (userDetails, token, onSuccess, onError) => {
  return dispatch => {
    axios
      .post('http://192.168.10.167:4000/employee', userDetails, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(response => {
        const data = response?.data?.data;
        const successMessage = response?.data?.message;
        // dispatch(fetchEmployeeUrlSucces(...data, {userDetails}));
        onSuccess(successMessage);
        // console.log('response', data);
      })
      .catch(error => {
        const errorMessage = error?.response?.data.message;
        onError(errorMessage);
        // console.log('errorMessage', errorMessage);
      });
  };
};

export const removeUser = (token, id, onSuccess, onError) => {
  // console.log('id', id);
  return dispatch => {
    axios
      .delete(`http://192.168.10.167:4000/employee/${id}/`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(response => {
        const successMessage = response?.data?.message;
        onSuccess(successMessage);

        // console.log(response);
      })
      .catch(error => {
        const errorMessage = error?.response?.data.message;
        onError(errorMessage);
        // console.log(error);
      });
  };
};

export const editUser = (id, userData, token, onSuccessUser, onErrorUser) => {
  return dispatch => {
    axios
      .patch(
        `http://192.168.10.167:4000/employee/${id}/`,
        userData,

        {headers: {Authorization: `Bearer ${token}`}},
      )
      .then(response => {
        const message = response?.data?.message;
        onSuccessUser(message);
      })
      .catch(error => {
        const errorMessage = error?.response?.data.message;
        onErrorUser(errorMessage);
      });
  };
};
