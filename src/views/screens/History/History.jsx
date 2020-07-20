import React from "react";
import "../Admin/AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import {connect} from 'react-redux'
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button"

import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class History extends React.Component {
  state = {
    historyList: [],
    trxDetail: [],
    activeProducts: [],
    productDetails:[],
    modalOpen: false,
  };

  componentDidMount() {
    this.getTransactionList();
    this.getProductDetails()
  }

  getTransactionList = () => {
    Axios.get(`${API_URL}/transactions`,{
        params:{
          userId : this.props.user.id,
          status:"success",
          _expand:"user",
          _embed:"transactions_detail"
        }
    })
      .then((res) => {
        this.setState({ historyList: res.data });
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProductDetails = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ productDetails: res.data });
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  detailTrxState = (trxId) =>{
    const {historyList,trxDetail} =this.state
    for(let val of historyList){
      if( val.id==trxId){
        this.setState({trxDetail:[...val.transactions_detail]})
      }
    }
      this.setState({
      modalOpen: true,
    });
  
  }

  renderDetailTrx = ()=>{
    const {trxDetail,productDetails}=this.state
    let detailOfProduct = [...trxDetail]
    
    detailOfProduct.forEach((val,idx)=>{
        const {productId} = val
        let index = productDetails.findIndex(filter=>filter.id==productId)
          detailOfProduct[idx].productName=productDetails[index].productName
          detailOfProduct[idx].image=productDetails[index].image
      })
  
      return detailOfProduct.map((val=>{
        const {id,price,productId,quantity,total_price,productName,image} = val
        return <>
          <tr> 
            <td>{productId}</td>
            <td>{productName}</td>
            <td>{price}</td>
            <td>{quantity}</td>
            <td> {total_price}</td>
            <td><img src={image} style={{ objectFit:"contain", height:"70px" }}/></td>
          </tr>
      </> 
      }))
   
    
  }


  renderHistory = ()=>{
    const {historyList}=this.state
    return historyList.map((val,idx)=>{
      const {id,totalPrice,status,user,buyDate,endTrx} = val
      const {userId,fullName,email,username}=user
      return <tr>
          <td>{id}</td>
          <td>{buyDate}</td>
          <td>{endTrx}</td>
          <td>{status}</td>
          <td>{totalPrice}</td>
          <td>
            <ButtonUI
              onClick={(e)=>this.detailTrxState(id)}
            > Details 
          </ButtonUI></td>
      </tr>
    })
  }

  
  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  render(){
    return (
      <div>
      <div className="container">
        <div className="card mt-4">
        <caption className="mt-3 text-center"><h2>History</h2></caption>
          <table className="table mt-2">
            <thead>
              <tr>
                <th> Trx ID</th>
                <th> Buy Date</th>
                <th> End Transactions</th>
                <th> Status</th>
                <th> Total Price</th>
                <th> Action</th>
              </tr>
            </thead>
            <tbody>
                {this.renderHistory()}
            </tbody>
          </table>
        </div>
      </div>


        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="modal-lg"
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
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Image</th>
                    </thead>
                    <tbody>
                      {
                      
                        this.state.trxDetail.length>0 ?this.renderDetailTrx(): null
                      
                      }
                        
                    </tbody>
                </table>
               
                <div className="col-12 mt-3">
                    <center>
                        <ButtonUI
                    className="w-50"
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
    )
  }
}


const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };
  export default connect(mapStateToProps)(History)
