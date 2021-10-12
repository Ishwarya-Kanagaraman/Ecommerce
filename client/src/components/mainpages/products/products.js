import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../Utils/ProductItem/ProductItem";
import Loading from "../Utils/Loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./LoadMore";

function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.ProductsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = state.ProductsAPI.callback;
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = async (id) => {
    products.forEach((product) => {
      if (product._id === id) {
        product.checked = !product.checked;
      }
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    console.log(id, public_id);
    try {
      setLoading(true);
      const destroyImg = await axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const checkAll=()=>{
      products.forEach(product=>{
          product.checked=!isCheck
      })
      setProducts([...products])
      setIsCheck(!isCheck)
  }

  const deleteAll=()=>{
      products.forEach(product=>{
          if(product.checked){
              deleteProduct(product._id,product.images.public_id)
          }
      })
  }

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <>
    <Filters/>
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll}/>
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore/>
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
