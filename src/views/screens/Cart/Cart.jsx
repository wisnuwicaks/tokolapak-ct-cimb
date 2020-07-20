import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import {itemOnTableChange} from '../../../redux/actions'
import { Link } from "react-router-dom";
import swal from "sweetalert";

class Cart extends React.Component {
  state ={
    cartData :[],
    
    isCheckOut : false,
    
    totalCartPrice : 0,
    delivery: 0,
   
  }

  componentDidMount() {
    
    this.getCartData();
    // alert(this.state.cartData.length)
    // this.props.itemOnTableChange(this.state.cartData.length)
  
  }

  componentDidUpdate() {
    // this.getCartData();
    if(this.state.cartData.length !==this.props.user.itemsOnTable){
      // this.getCartData();
      // this.renderCartData();
    }
  }

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",

      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ cartData: res.data });
     
        this.props.itemOnTableChange(this.state.cartData.length)
      })
      .catch((err) => {
        console.log(err);
      });

      // this.props.itemOnTableChange(this.state.cartData.length)
     
  };


  deleteCart = (id) =>{
    const {cartData} = this.state
  
    Axios.delete(`${API_URL}/carts/${id}`)
    .then(res=>{
      this.getCartData()
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
    console.log(cartData)
    
  }

  renderCartData = ()=>{
    
    return this.state.cartData.map((val,index)=>{
      const {quantity,product,id} = val
      const { productName,price,image,category } = product
    
      return (
        
        <tr key={`beda-${id}`}>
          <td>{index+1}</td>
          <td>{productName}</td>
          <td>{new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(price)}</td>
          <td>{quantity}</td>
          <td> 
             <img src={`${image}`} style={{ objectFit:"contain", height:"150px" }}/>
          </td> 
          <td>
            <button className="btn btn-danger" onClick={()=>{this.deleteCart(id)}}>DELETE</button></td>
          </tr>
        
      )
    })
  }

  onCheckOutBtnHandler = () =>{
    const {cartData} = this.state
    this.setState({totalCartPrice:0})
    this.setState({isCheckOut:!this.state.isCheckOut})
    let subTotal = 0
    let total = 0

      cartData.forEach(val => {
        const {quantity, product,id} = val
        const {productName,price,image,category} = product
        subTotal = quantity *price
        total += subTotal
      });
      this.setState({totalCartPrice:total})
     
  }

  
  delivery = (e) =>{
    const {value} = e.target
    this.setState({delivery:value})
  
  }

  onConfirmBtn = () =>{
    const {cartData,delivery} = this.state
    
    let arrItem = cartData.map((val)=>{
      const {quantity, product,productId,id} = val
      const {productName,price,image,category} = product
      return {productId,quantity,productName,price,image,category}
    })
    // let ongkir = this.state.delivery
    let hargaTotal = parseInt(this.state.totalCartPrice) + parseInt(this.state.delivery)
    let transactionData = {
      userId: this.props.user.id,
      totalPrice : hargaTotal,
      status: "pending",
      buyDate : new Date().toString(),
      endTrx : "-"
    }
    console.log(transactionData)
    Axios.post(`${API_URL}/transactions`,transactionData)
    .then(resTranscations=>{
      
      cartData.map((val)=>{
        const {quantity,productId, product,id} = val
        const {productName,price,image,category} = product
        Axios.post(`${API_URL}/transactions_detail`,{
        
          transactionId: resTranscations.data.id,
          productId: productId,
          price: price,
          quantity: quantity,
          total_price: (quantity*price)
        
        })
        .then(res=>{
          console.log(res.data)
          swal("Success Payment","Waiting for admin confirmation","success")
        })
      })
      cartData.forEach(val => {
        this.deleteCart(val.id)
      });
   
      
    })
    .catch(err=>{
      console.log(err)
    })

     
  }
  render() {
    
    if(this.state.cartData.length<1)
    {
      return (
        <div className="alert alert-primary text-center" role="alert">
          Anda belum punya belanjaan, Yuk belanja dulu
        </div>
      )
    }
    else{
      return (
        <div className="container">
          <div className="text-center"><h1>CART</h1></div>
          <div>
            <table className="table">
              <thead>
              <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {this.renderCartData()
                    
                  }
              </tbody>
            </table>
            
           {
             this.state.isCheckOut? 
             <>
              <div className="card p-3">
              <div>
                  <h5>Choose Delivery Duration : </h5>
                  <select
                    value={this.state.delivery}
       
                    onChange={(e) => this.delivery(e)}
                  >
                    <option value={0}>Economy</option>
                    <option value={100000}>Instant</option>
                    <option value={50000}>Same Day</option>
                    <option value={20000}>Express</option>
              
                  </select>
             
                </div>
                <h5>Total Price : {new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(this.state.totalCartPrice)} </h5>
                <h5>Delivery Cost :Rp.{" "}{this.state.delivery}</h5>
                <h3>Total Payment : 
                  {new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(parseInt(this.state.totalCartPrice) + parseInt(this.state.delivery))} 
                  </h3>
                
                    
                <div className="d-flex mt-3"> 
                    <ButtonUI type="contained" onClick={this.onConfirmBtn}> Confirm</ButtonUI>
                    <ButtonUI type="outlined" onClick={this.onCheckOutBtnHandler} className="ml-3"> Cancel</ButtonUI>  
                </div>
              </div>
             </>
             :
             <>
             <div className="d-flex justify-content-start">
              <ButtonUI type="contained" 
              onClick={this.onCheckOutBtnHandler }
              >Checkout
              </ButtonUI>
            </div>
             </>
           }
        
          </div>
        </div>
      );
    }
  }
}



const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps ={
  itemOnTableChange
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
