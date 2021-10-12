import React,{useState,useEffect,useContext} from 'react'
import {useParams,Link} from "react-router-dom";
import ProductItem from "../Utils/ProductItem/ProductItem"
// import BtnRender from '../Utils/ProductItem/BtnRender';
import {GlobalState} from "../../../GlobalState";
export default function DetailProduct() {
    const params=useParams();
    const state=useContext(GlobalState);
    const addCart=state.userAPI.addCart;
    // console.log(state)
    // console.log(state.ProductsAPI.products);
    const [products]=state.ProductsAPI.products;
    const [detailProduct,setDetailProduct]=useState([])

    useEffect(()=>{
        console.log('re render')
          if(params.id){
              products.forEach(product=>{
                 if(product._id===params.id){
                     setDetailProduct(product)
                 }
              })
          }
    },[params.id,products])
    // console.log(params)
    // console.log(detailProduct)
    if(detailProduct.length===0) return null;
    return (
        <>
        <div className="detail">
            <img src={detailProduct.images.url } alt=""/>
            <div className="box-detail">
                <div className="row">
                     <h2>{detailProduct.title}</h2>
                     <h6>{detailProduct.product_id}</h6>
                </div>
                <span>${detailProduct.price}</span>
                <p>{detailProduct.description}</p>
                <p>{detailProduct.content}</p>
                <p>Sold:{detailProduct.sold}</p>
                <Link onClick={()=>addCart(detailProduct)} to="/cart" className="cart">Buy Now</Link>
            </div>
        </div>
        <div>
             <h2>Related products</h2> 
             <div className="products">
                {
                    products.map(product=>{
                        return product.category===detailProduct.category
                        ?  <ProductItem key={product._id} product={product}/> : null
                    })
                }
             </div>
        </div>
        </>
    )
}
