import React from "react";
import { Route, Switch, withRouter,Redirect } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Axios from 'axios'
import { API_URL } from "./constants/API";
import {itemOnTableChange} from './redux/actions'

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreen from "./views/screens/Auth/AuthScreen";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import AdminDashboard from "./views/screens/Admin/AdminDashboard"
import AllProduct from "./views/screens/AllProduct/AllProduct"
import PageNotFound from "./views/screens/PageNotFound/PageNotFound"
import { userKeepLogin, cookieChecker } from "./redux/actions";

import Cart from "./views/screens/Cart/Cart";
import Wishlist from "./views/screens/Wishlist/Wishlist";
import Payment from "./views/screens/Admin/Payment";
import Members from "./views/screens/Admin/Members"
import History from "./views/screens/History/History"
import Report from "./views/screens/Admin/Report"

const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    // setTimeout(() => {
    //   let cookieResult = cookieObj.get("authData");
    //   if (cookieResult) {
    //     this.props.keepLogin(cookieResult);
    //   } else {
    //     this.props.cookieChecker();
    //   }
    // }, 2000);
  
      let cookieResult = cookieObj.get("authData");
      if (cookieResult) {
        this.props.keepLogin(cookieResult);
      
     
      } else {
        this.props.cookieChecker();
      }
    
///////

  }

  
  renderAdminRoutes = () =>{
  ///////////sasdasd
    ////memberikan komenter
    if(this.props.user.role==="admin")
    {
      return <>
      <Route exact path="/admin/dashboard" component={AdminDashboard}/>
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/report" component={Report} />
      <Route exact path="/member" component={Members} />
      </>
    }
    else{
      return <Redirect to="/pagenotfound" />;
    }

  }
  render() {

    if (this.props.user.cookieChecked) {
      
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreen} />
            <Route
              exact
              path="/product/:productId"
              component={ProductDetails}
            />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/wishlist" component={Wishlist} />
            <Route exact path="/allproduct" component={AllProduct} />
            
            
            <Route exact path="/history" component={History} />
         
            <Route exact path="/pagenotfound" component={PageNotFound} />
            

            {this.renderAdminRoutes()}
          </Switch>
          {/* <div style={{ height: "120px" }} /> */}
        </>
      );
    } else {

      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
  itemOnTableChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

/**
 * PR
 * 1. Add to cart, jika barang double, qty yg akan bertambah
 * 2. Di Home, ketika click PHONE/LAPTOP/TAB/DESKTOP
 * 3. Di navbar, ketika ketik, secara otomatis filter products
 * 4. Di cart, buat button checkout, serta dengan proses checkout
 * 5. Ketika confirm checkout, lakukan POST request ke db.json ke transaction
 *    -> lalu cart harus kosong
 */
