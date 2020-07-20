import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import Axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { logoutHandler,onSearchInput,itemOnTableChange } from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    itemsNumberOnNavbar :0,
    userIdActive : 0
  };

  componentDidMount(){  
    // this.itemsOnCart()
    // this.props.itemOnTableChange(this.state.itemsNumberOnNavbar)
    // this.setState({userIdActive:this.props.user.id})
  //  this.setState({itemsNumberOnNavbar:this.props.user.itemsOnTable})
  }

  // cekCartDb = () =>{
  //   Axios.get(`${API_URL}/carts`,{
  //     params:{
  //       userId:this.props.user.id
  //     }
  //   })
  //   .then(res=>{
  //     return res.data.length
  //   })
  // }
  //komponen ini hanya akan berjalan sekali ketika terdapat perubahan user active 
  //baik ketika logout atau signin
  componentDidUpdate(){ //hanya akan ketriger jika userID global state dan userIdActive berbeda
    const {itemsNumberOnNavbar,itemsOnCart} = this.state
    // if(userIdActive!==this.props.user.id){
    //   // this.itemsOnCart()
    // }
    // alert(itemsNumberOnNavbar)
    // if(itemsNumberOnNavbar !==this.props.user.itemsOnTable){

    //   this.setState({itemsNumberOnNavbar:this.props.user.itemsOnTable})
    // }
  }
 
  // itemsOnCart = () =>{
  //   Axios.get(`${API_URL}/carts`,{
  //     params:{
  //       userId:this.props.user.id
  //     }
  //   })
  //   .then(res=>{
  //     this.setState({itemsNumberOnNavbar:res.data.length})
  //     // this.props.itemOnTableChange(res.data.length)
  //   })
  //   .catch(err=>{
  //     console.log(err)
  //   })

  // }
  searcBarInputHandler = (e) =>{
    const {searchBarInput} = this.state
    const {value} = e.target
    this.setState({searchBarInput:value});
    this.props.onSearchInput(searchBarInput)
  }
  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            // value={this.state.searchBarInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Cari produk impianmu disini"
            onChange={(e)=>this.props.onSearchInput(e.target.value)}
            
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {this.props.user.role=="admin"? 
                  
                  <>
                  <DropdownItem>
                   <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/admin/dashboard"
                   >
                     Dashboard
                   </Link>
                 </DropdownItem>
                 <DropdownItem>
                   <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/member"
                   >
                      Members
                   </Link>
                  </DropdownItem>
                 <DropdownItem>
                   <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/payment"
                   >Payments  
                   </Link>
                  </DropdownItem>

                  <DropdownItem>
                   <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/report"
                   >Report  
                   </Link>
                  </DropdownItem>
                   
                 </>
                  :
                  <>
                  <DropdownItem>
                   <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/history"
                   >
                     History
                   </Link>
                 </DropdownItem>
                 
                 <DropdownItem>
                 <Link
                     style={{ color: "inherit", textDecoration: "none" }}
                     to="/wishlist"
                   >
                   Wishlist
                   </Link>
                   </DropdownItem>
                 
                 </>
                  
                  }
                 
                </DropdownMenu>
              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {/* {this.state.itemsNumberOnNavbar} */}
                    {this.props.user.itemsOnTable}

                  </small>
                </CircleBg>
              </Link>
           
              <Link to="/auth" className="ml-3" style={{textDecoration:"none",color:"inherit"}}>
              <ButtonUI
                    onClick={this.logoutBtnHandler}
                    className="ml-3"
                    type="contained"
                  >
                    Logout
                    </ButtonUI>
                  
              </Link>
            
            </>
          ) : (
            <>
              <ButtonUI className="mr-3" type="textual">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign in
                </Link>
              </ButtonUI>
              <ButtonUI type="contained">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign up
                </Link>
              </ButtonUI>
            </>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    search : state.searchInput
  };
};
const mapDispatchToProps = {
  onLogout: logoutHandler,
  onSearchInput,
  itemOnTableChange,
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);