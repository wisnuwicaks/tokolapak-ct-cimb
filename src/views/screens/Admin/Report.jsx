import React from 'react'
import "../Admin/AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import {connect} from 'react-redux'
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button"

import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";
class Report extends React.Component{
    state = {
        paymentList: [],
        productStatistic: [],
        transactions_detail_success:[],
       
      };
    componentDidMount() {
        this.getPaymentList();
        this.getProductStatistic();
      }
      
      getProductStatistic = ()=>{
        Axios.get(`${API_URL}/products`,{
            params:{
              _embed:"transactions_detail"
            }
        })
          .then((res) => {
            // console.log(res.data)
            this.setState({ productStatistic: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      renderProductStatistic = ()=>{
      const {productStatistic,paymentList} = this.state
        let successProduct = []
        paymentList.map((val, idx) => {
            const {id, userId,totalPrice,status,buyDate,endTrx,user,transactions_detail} = val;
            const {username,fullName,email} = user
            transactions_detail.forEach((detail)=>{
              const {productId,quantity} = detail
              let  cari = successProduct.findIndex((valSuccess)=>valSuccess.productId==productId)
              if(cari ==-1 ){
                successProduct = [...successProduct,{"productId":productId,"quantity":quantity}]
              }
              else{
                successProduct[cari].quantity +=quantity
              }
            })
           
        });

        productStatistic.forEach((val)=>{
          // const {id,productName,image,transactions_detail} = val
          let cari = successProduct.findIndex((filter)=>filter.productId==val.id)
          console.log(cari)
          if(cari !==-1){
            successProduct[cari].productName=val.productName
            successProduct[cari].image=val.image
          }
         
      })

      return successProduct.map((val)=>{
        const {productId,productName,quantity,image} = val
        return <>
        <tr>
            <td>{productId}</td>
            <td>{productName}</td>
            <td>{quantity}</td>
            <td><img src={image} style={{ objectFit:"contain", height:"70px" }}/></td>
        </tr>
        </>
      })
     
      }
      getPaymentList = () => {
        Axios.get(`${API_URL}/transactions`,{
            params:{
                status:"success",
              _expand:"user",
              _embed:"transactions_detail"
            }
        })
          .then((res) => {
            // console.log(res.data)
            this.setState({ paymentList: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      };

  renderPaymentList = () => {
    const {transactions_detail_success} = this.state
      let arrUsername = []
      let successProduct = []
      this.state.paymentList.map((val, idx) => {
          const {id, userId,totalPrice,status,buyDate,endTrx,user,transactions_detail} = val;
          successProduct = [...successProduct,...transactions_detail]
          const {username,fullName,email} = user
            let  cari = arrUsername.findIndex((val)=>val.username==username)
            if(cari ==-1 ){
                arrUsername = [...arrUsername,{"fullName":fullName,"username":username,"email":email,"money":totalPrice}]
            }
            else{
                arrUsername[cari].money +=totalPrice
            }
      });

    
    return arrUsername.map((val)=>{
      const {fullName,username,email,money} = val
        return <>
        <tr>
          <td> {fullName}</td>
          <td> {username} </td>
          <td> {email}</td>
          <td>{new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(money)} </td>
        </tr>
      </>
    })
  };


    render(){
        return(
            <>
        <div className="container" >
          <caption className="p-3">
            <h2>User Success Transactions</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr > 
              
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Total Buying</th>
            
            
              </tr>
            </thead>
            <tbody>{this.renderPaymentList()}</tbody>
          </table>
        </div>

        <div className="container" >
          <caption className="p-3">
            <h2>Product Statistics</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr > 
                <th> Product ID</th>
                <th> Product Name</th>
                <th> Total Buyed </th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>{this.renderProductStatistic()}</tbody>
          </table>
        </div>
        </>
        )
    }
}

export default Report