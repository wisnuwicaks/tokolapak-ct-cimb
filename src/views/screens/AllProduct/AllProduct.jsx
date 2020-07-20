import React from "react";
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
class AllProduct extends React.Component{
    state = {
        productData : []
    }

    
    componentDidMount(){
        this.getProductData()
    }

    getProductData = () => {
        Axios.get(`${API_URL}/products`)
          .then((res) => {
            this.setState({ productData: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      };

      renderProducts = () =>{
        const {productData}=this.state
        // console.log(this.state.bestSellerData)
        return productData.map((val) => {
            return <>
              <div key={`best-seller${val.id}`}>
                <Link to={`/product/${val.id}`}>
                   <ProductCard data={val} className="m-2" />;
                </Link>
              </div>
        </>
        })
      }
    render(){
        return (
        <div className="container">
                {/* BEST SELLER SECTION */}
            <h2 className="text-center font-weight-bolder mt-5">All Product Available</h2>
            <div className="row d-flex flex-wrap justify-content-center">
                {this.renderProducts()}
            </div>
        </div>
        )
    }
}

export default AllProduct