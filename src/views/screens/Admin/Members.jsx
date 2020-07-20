import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class Members extends React.Component {
  state = {
    memberList: [],
    memberDetailList: [],
    activeProducts: [],
    modalOpen: false,
  };

  getMemberList = () => {
    Axios.get(`${API_URL}/users`,{
        
    })
      .then((res) => {
        this.setState({ memberList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteMember = (id) =>{

    Axios.delete(`${API_URL}/users/${id}`)
    .then(res=>{
      this.getMemberList()
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
    
  }

  renderMemberList = () => {
    return this.state.memberList.map((val, idx) => {
    const {id,fullName,username,email,role}=val
      return (
        <>
          <tr>
         
            <td> {id} </td>
            <td>
              {fullName}
            </td>
            <td>{username}</td>
            <td>{email}</td>
            <td>{role}</td>
          
            <td>
                <div className="d-flex">
                    <ButtonUI type="outlined" className="ml-3"> Delete</ButtonUI>
                </div>
            </td>
          </tr>
         
        </>
      );
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


  viewMemberDetails = (id) => {
      Axios.get(`${API_URL}/transactions_detail`,{
          params:{
              transactionId : id
          }
      })
      .then(res=>{
          console.log(res.data)
          this.setState({memberDetailList:res.data})
        //   this.renderDetails()
      })
      .catch()
    this.setState({
      modalOpen: true,
    });

  };
  renderDetails = () =>{
      return this.state.memberDetailList.map((val,idx)=>{
          const {id,fullName,username,role}=val
          return (
              <tr>
            <td>{idx+1}</td>
            <td>{id}</td>
            <td>{fullName}</td>
            <td>{username}</td>
            <td>{role}</td>
            </tr>
          )
      })
  }
  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getMemberList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getMemberList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Members</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
          
                <th>User ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderMemberList()}</tbody>
          </table>
        </div>
    
      </div>
    );
  }
}

export default Members;
