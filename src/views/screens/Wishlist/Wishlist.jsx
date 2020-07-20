import React from "react";
import { connect } from "react-redux";

import swal from 'sweetalert'
import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import {itemOnTableChange} from '../../../redux/actions'
import { Link } from "react-router-dom";

class Wishlist extends React.Component {
  state ={
    wishListData :[],
    isCheckOut : false,
    totalCartPrice : 0,
    cartDataNow :[],
  }

  componentDidMount() {
 
    this.getWishListData();

  
  }

  componentDidUpdate() {
    // this.getWishListData();
    if(this.state.wishListData.length !==this.props.user.itemsOnTable){
      // this.getWishListData();
      // this.renderWishListData();
    }
  }


  getWishListData = () => {
    Axios.get(`${API_URL}/wishlist`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ wishListData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });

      // this.props.itemOnTableChange(this.state.wishListData.length)
     
  };


  deleteWishList = (id) =>{
    const {wishListData} = this.state
  
    Axios.delete(`${API_URL}/wishlist/${id}`)
    .then(res=>{
      this.getWishListData()
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
    console.log(wishListData)
    
  }

  addToCart = (valItemSelected) =>{
    const {wishListData} = this.state
    Axios.get(`${API_URL}/carts`,{
        params:{
            userId:this.props.user.id
        }
    })
        .then((res) => {
          console.log(res);
           this.setState({cartDataNow:res.data})
           let cekDuplicate = this.state.cartDataNow.findIndex(val=>{
                return val.productId==valItemSelected.id
            })
            if(cekDuplicate==-1){
                console.log(valItemSelected.id);
                Axios.post(`${API_URL}/carts`, {
                userId: this.props.user.id,
                productId: valItemSelected.id,
                quantity: 1,
                })
                .then((res) => {
                    console.log(res);
                    swal("Add to Wishlist", "Your item has been added to your wishlist", "success");
                    this.deleteWishList(valItemSelected.id)
                    this.props.itemOnTableChange(this.state.cartDataNow.length)
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            else{
                swal("Add to wishlist", "Your item has been added to your cart", "success");
                Axios.get(`${API_URL}/carts/${this.state.cartDataNow[cekDuplicate].id}`)
                .then((resSameData)=>{
                    const {data}=resSameData
                    console.log(data)
                    Axios.put(`${API_URL}/carts/${data.id}`,
                    {
                        "userId": this.state.cartDataNow[cekDuplicate].userId,
                        "productId": this.state.cartDataNow[cekDuplicate].productId,
                        "quantity": this.state.cartDataNow[cekDuplicate].quantity+1,
                        "id": this.state.cartDataNow[cekDuplicate].id
                    })
                    .then(res=>{
                        this.deleteWishList(valItemSelected.id)
                        console.log(res)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })

            }
          })
      
  }

  onConfirmBtn = () =>{
    const {wishListData} = this.state
    
    let arrItem = wishListData.map((val)=>{
      const {quantity, product,productId,id} = val
      const {productName,price,image,category} = product
      return {productId,quantity,productName,price,image,category}
    })

    let transaction = {
      userId: this.props.user.id,
      totalPrice : this.state.totalCartPrice,
      status: "pending",
      item: [...arrItem],
    }
    console.log(transaction)
    Axios.post(`${API_URL}/transactions`,transaction)
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })

        wishListData.forEach(val => {
          this.deleteCart(val.id)
        });
  }

  renderWishListData = ()=>{
    
    return this.state.wishListData.map((val,index)=>{
      const {userId,productId,product,id} = val
      const {productName,price,image,category,desc} = product
    
      return (
        
        <tr key={`beda-${id}`}>
          <td>{index+1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{desc}</td>
          <td> 
             <img src={`${image}`} style={{ objectFit:"contain", height:"150px" }}/>
          </td> 
          <td className="text-nowrap">
            <button className="btn btn-primary" onClick={()=>{this.addToCart(val)}}>Add To Cart</button>
            <button className="btn btn-danger ml-2" onClick={()=>{this.deleteWishList(id)}}>DELETE</button>
        </td>
          <td>
            
        </td>
          </tr>
        
      )
    })
  }
  render() {
    
    if(this.state.wishListData.length<1)
    {
      return (
        <div className="alert alert-primary text-center" role="alert">
          Anda belum punya wishlist, Yuk cari produk impianmu
        </div>
      )
    }
    else{
      return (
        <div className="container">
          <div className="text-center"><h1>Wish List</h1></div>
          <div>
            <table className="table">
              <thead>
              <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th> Action</th>
                  </tr>
              </thead>
              <tbody>
                  {this.renderWishListData()
                    
                  }
              </tbody>
            </table>
            
           {
             this.state.isCheckOut? 
             <>
              <div className="card p-3">

                <h4> Total Price : {new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(this.state.totalCartPrice)} </h4>
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
              >Add To Cart
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

export default connect(mapStateToProps,mapDispatchToProps)(Wishlist);
