import React from "react";
import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from 'sweetalert'
import Axios from "axios";
import {connect} from 'react-redux'
import { API_URL } from "../../../constants/API";
import {itemOnTableChange} from '../../../redux/actions'
class ProductDetails extends React.Component {
  state = {
    productData: {
      image: "",
      productName: "",
      price: 0,
      desc: "",
      category: "",
      id: 0,
    },
    cartDataNow :[],
  
  };

  addToWishListHandler = () =>{
    if(this.props.user.id<1){
        swal("Sorry :(", "You have not login yet, please login before add your item", "error");
    }
    else{
        Axios.get(`${API_URL}/wishlist`,{
            params:{
                userId:this.props.user.id
            }
        })
        .then((res)=>{
            let cekDuplicate = res.data.findIndex(val=>{
                return val.productId==this.state.productData.id
            })

            if(cekDuplicate==-1){
                console.log(this.state.productData.id);
                Axios.post(`${API_URL}/wishlist`, {
                    userId: this.props.user.id,
                    productId: this.state.productData.id,
                
                })
                .then((res) => {
                    console.log(res);
                    swal("Add to cart", "Your item has been added to your wishlist","success");
                 
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            else{
                swal("Add to wishlist", "This item already saved in your wishlist","error");
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
  }
  
  addToCartHandler = () => {
    // POST method ke /cart
    // Isinya: userId, productId, quantity
    // console.log(this.props.user.id);
    if(this.props.user.id<1){
        swal("Sorry :(", "You have not login yet, please login before add your item", "error");
    }
    else{
        Axios.get(`${API_URL}/carts`,{
            params:{
                userId:this.props.user.id
            }
        })
            .then((res) => {
              console.log(res);
               this.setState({cartDataNow:res.data})
               let cekDuplicate = this.state.cartDataNow.findIndex(val=>{
                    return val.productId==this.state.productData.id
                })
                if(cekDuplicate==-1){
                    console.log(this.state.productData.id);
                    Axios.post(`${API_URL}/carts`, {
                    userId: this.props.user.id,
                    productId: this.state.productData.id,
                    quantity: 1,
                    })
                    .then((res) => {
                        console.log(res);
                        swal("Add to cart", "Your item has been added to your cart", "success");
                        this.props.itemOnTableChange(this.state.cartDataNow.length)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
                else{
                    swal("Add to cart", "Your item has been added to your cart", "success");
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
    }
  
    componentDidMount(){
        const {productData} = this.state
        Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
        .then((res)=>{
            this.setState({productData:{...productData,...res.data}})
          
        })
        .catch(err=>{
            console.log(err)
        })
    }
    render(){
        const {productName,
        price,
        category,
        image,
        desc,
        id
        } = this.state.productData
        return(
            <div className="container">
                <div className="row py-4">
                    <div className ="col-6 text-center"> 
                        <img 
                        style={{width:"100%", objectFit:"contain", height:"550px"}}
                        src={image} alt=""/>
                    </div>
                    <div className="col-6">
                    <h3> {productName}</h3>
                    <h4>{new Intl.NumberFormat("id-ID",{style:"currency", currency: "IDR"}).format(price)}</h4>
                        <p className="mt-4">{desc}</p>
                        <div className="d-flex mt-4">
                            <ButtonUI onClick={this.addToCartHandler}>
                                Add To Cart
                            </ButtonUI>
                            <ButtonUI className="ml-4" type="outlined"
                                onClick={this.addToWishListHandler}> 
                                Add To Wishlist
                            </ButtonUI>
                        </div>   
                    </div>
                    
                </div>                    
            </div>
      
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        user:state.user,
    }
}

const mapDispatchToProps ={
    itemOnTableChange
  }
export default connect(mapStateToProps,mapDispatchToProps)(ProductDetails)
