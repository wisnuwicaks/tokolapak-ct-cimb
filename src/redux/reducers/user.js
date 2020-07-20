import userTypes from "../types/user";

const { ON_LOGIN_FAIL, 
  ON_LOGIN_SUCCESS, 
  ON_LOGOUT_SUCCESS,
  ON_REGISTER_FAIL,
  ON_REGISTER_SUCCESS,
  ITEMS_ON_TABLE_CHANGE 
} = userTypes;

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  email : "",
  address: {},
  role: "",
  errMsg: "",
  cookieChecked: false,

  itemsOnTable : 0,
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username,email, fullName, role, id,password } = action.payload;
      return {
        ...state,
        username,
        password,
        email,
        fullName,
        role,
        id,
        cookieChecked: true,
      };
      
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload,cookieChecked:true };
    // case ON_REGISTER_SUCCESS:
    //   // const {username,password,role,fullName} = action.payload
    //   return {...state,
    //     username:action.payload.username,
    //     password:action.payload.password,
    //     fullName:action.payload.fullName,
    //     email:action.payload.email,
    //     role:action.payload.role,
    //   }
    case ON_REGISTER_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked:true };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state, cookieChecked:true };
  
    case "COOKIE_CHECK":
      return { ...state, cookieChecked: true };
    case ITEMS_ON_TABLE_CHANGE:
      return { ...state, itemsOnTable: action.payload };
    default:
      return { ...state, };
  }
};
