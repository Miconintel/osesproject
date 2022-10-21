import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (
  firstname,
  lastname,
  email,
  password,
  passwordConfirmed
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: {
        firstname,
        lastname,
        email,
        password,
        passwordConfirmed,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged in succesfuly');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged in succesfuly');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (response.data.status === 'success')
      showAlert('success', 'logged out succesfuly');
    location.reload(true);
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', 'something happened');
  }
};
