import React from "react";
import "./Payment.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class Payment extends React.Component {
  state = {
    paymentList: [],
    paymentListDetail: [],
    activeProducts: [],
    modalOpen: false,
    activePage: "success",
  };



  componentDidMount() {
    this.getPaymentList();
  }

  getPaymentList = () => {
    Axios.get(`${API_URL}/transactions`,{
        params:{
          _expand:"user"
        }
    })
      .then((res) => {
        console.log(res.data)
        this.setState({ paymentList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  deleteProduct = (id) =>{

    Axios.delete(`${API_URL}/products/${id}`)
    .then(res=>{
      this.getPaymentList()
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
    
  }

  viewPaymentDetailsBtn = (id) => {
    Axios.get(`${API_URL}/transactions_detail`,{
        params:{
            transactionId : id
        }
    })
    .then(res=>{
        console.log(res.data)
        this.setState({paymentListDetail:res.data})
      //   this.renderPaymentDetails()
    })
    .catch()
  this.setState({
    modalOpen: true,
  });

};


  renderPaymentList = () => {
    return this.state.paymentList.map((val, idx) => {
      const {id, userId,totalPrice,status,buyDate,endTrx,user} = val;
      const {username} = user
      return <>
      {status==this.state.activePage ?
        (
          <tr>
        
            <td> {userId}</td>
            <td> {username} </td>
            <td>
              {" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalPrice)}{" "}
            </td>
            <td>{status}</td>
            <td>{buyDate}</td>
            <td>{endTrx}</td>
            <td><ButtonUI type="contained" onClick={() => this.viewPaymentDetailsBtn(id)}> View Details</ButtonUI></td>
            <td><ButtonUI type="outlined" onClick={() => this.confirmTranscation(id)}> Confirm Transaction</ButtonUI></td>
          </tr>
        )
    
      : 
      null
      }
      </>
    });
  };

 
  renderPaymentDetails = () =>{
      return this.state.paymentListDetail.map((val)=>{
          const {transactionId,productId,price,quantity,total_price}=val
          return (
              <tr>
            <td>{transactionId}</td>
            <td>{productId}</td>
            <td>{price}</td>
            <td>{quantity}</td>
            <td>{total_price}</td>
            </tr>
          )
      })
  }
  confirmTranscation =(idSusccess)=>{
    Axios.get(`${API_URL}/transactions/${idSusccess}`)
    .then(res=>{
      if (res.data.status !=="success"){
        Axios.patch(`${API_URL}/transactions/${idSusccess}`,{
      
          status:"success",
          endTrx: new Date().toString(),
      })
      .then(res=>{
        console.log(res.data)
        this.getPaymentList()
      })
      .catch(err=>{
        console.log(err)
      })
      }
      else{
        swal("Confirmation Status","Selected transaction already confirmed","error")
      }
    })
    
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  

  render() {
    return (
      <div className="py-4 mx-5">
        <div className="d-flex flex-row">
              <ButtonUI
                className={`auth-screen-btn ${
                  this.state.activePage == "success" ? "active" : null
                }`}
                type="outlined"
                onClick={() => this.setState({ activePage: "success" })}
              >
                Success Transactions
              </ButtonUI>
              <ButtonUI
                className={`ml-3 auth-screen-btn ${
                  this.state.activePage == "pending" ? "active" : null
                }`}
                type="outlined"
                onClick={() => this.setState({ activePage: "pending" })}
              >
                Pending Transactions
              </ButtonUI>
            </div>
        <div className="dashboard" >
          <caption className="p-3">
            <h2>Transactions</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr > 
              
                <th>User ID</th>
                <th>Username</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Buy Date</th>
                <th>Finish Trx</th>
                <th colSpan="2" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>{this.renderPaymentList()}</tbody>
          </table>
        </div>
       
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Payment Details</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
             
                <div className="row">
              
                <table className="table">
                    <thead>
                        <th>Transaction ID</th>
                        <th>Product ID</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </thead>
                    <tbody>
                        {this.renderPaymentDetails()}
                    </tbody>
                </table>
               
                <div className="col-12 mt-3">
                    <center>
                        <ButtonUI
                    className="w-100"
                    onClick={this.toggleModal}
                    type="outlined"
                    >
                    OK
                    </ButtonUI>
                    </center>
                    
                </div>
                
               
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Payment;
