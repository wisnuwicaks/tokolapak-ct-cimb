import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import swal from "sweetalert";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS,ON_REGISTER_SUCCESS,ON_REGISTER_FAIL, ON_LOGOUT_SUCCESS,ITEMS_ON_TABLE_CHANGE } = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;

    Axios.get(`${API_URL}/users`, {
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          swal('Login Success','Happy shoping',"success")
          
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
        } else {
          swal('Login Failed','Username or password was wrong',"error")
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username or password was wrong",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username or password was wrong",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObj.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username: userData.username,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_REGISTER_FAIL,
            payload: "Username already used",
          });
        } else {
          Axios.post(`${API_URL}/users`, { ...userData, role: "user" })
            .then((res) => {
              swal('Regitration Success','Please Sign-in to buy',"success")
              console.log(userData);
              dispatch({
                type: ON_REGISTER_SUCCESS,
                payload: userData,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

// export const onSearchInput = (searchInput) => {
//   return {
//     type: ON_SEARCH_INPUT_CHANGE,
//     payload : searchInput
//   };
// };

export const itemOnTableChange = (numberofitems) =>{
 
  return {
    type : ITEMS_ON_TABLE_CHANGE,
    payload : numberofitems,
  }
}