import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../Utils/Loading/Loading";
import {useHistory,useParams} from "react-router-dom"


function CreateProduct() {
  const initialState = {
    product_id: "",
    title: "",
    price: 0,
    description:
      "This product is going to create a revolution the market so that it can change a huge in industry",
    content:
      "The people who studying MERN stack will going to have a great future in the IT industry",
    category: "",
    _id:''
  };
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin]=state.userAPI.isAdmin;
  const [token] = state.token;

  const history=useHistory();
  const param=useParams();

  const [products]=state.ProductsAPI.products
  const [onEdit,setOnEdit]=useState(false)
  const [callback,setCallback]=state.ProductsAPI.callback


  useEffect(()=>{
    if(param.id){
      setOnEdit(true)
          products.forEach(product=>{
            if(product._id === param.id) {
              setProduct(product)
              setImages(product.images)
            }
          })
         
         }
          else{
            setOnEdit(false)
              setProduct(initialState)
              setImages(false)
            }
          
    
  },[param.id,products])

  const styleUpload = {
    display: images ? "block" : "none",
  };
   const handleDestroy=async e =>{
      try{
          if(!isAdmin) return alert("You are not an admin")
          setLoading(true)
          await axios.post('/api/destroy',{
            public_id:images.public_id},{
              headers:{
                Authorization:token
              }
            })
            setLoading(false)
            setImages(false)
      }catch(err){
        alert(err.response.data.msg)

      }
   }

  const handleUpload=async e=>{
    e.preventDefault()
    try{
       if(!isAdmin)return alert('You are not an admin')
       const file=e.target.files[0]
       console.log(file)
       if(!file)return alert('File not exist.');
       if(file.size > 1024 *1024){
         return alert("file size is too large")
       }
       if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
         return alert("file format is incorrect")
       }

       let formData = new FormData()
       formData.append('file',file)

       setLoading(true)

       const res=await axios.post('/api/upload',formData,{
         headers:{
           'content-type':'multipart/form-data',
             Authorization:token
          }
       })
         setLoading(false)
         setImages(res.data)
      //  console.log(res);
    }catch(err){
      alert(err.response.data.msg)
    }
  }

  const handleChangeInput=e=>{
    const {name,value} = e.target;
    setProduct({...product,[name]:value})
  }

  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      if(!isAdmin)return alert('You are not an admin')
     if(!images) return alert('Image is required!')
     if(onEdit){
      await axios.put(`/api/products/${product._id}`,{...product,images},{
        headers:{
          Authorization:token
        }
      })
     }else{
      await axios.post('/api/products',{...product,images},{
        headers:{
          Authorization:token
        }
      })
     }
     setCallback(!callback)
    //  setImages(false)
    //  setProduct(initialState)
     history.push("/")
    }catch(err){
      alert(err.response.data.msg)
    }
  }
  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {
          loading ? 
          <div id="file_img" > <Loading/> </div>
          :<div id="file_img" style={styleUpload}>
               <img src={images ? images.url : ''} alt="" />
              <span onClick={handleDestroy}>X</span>
        </div>  
        } 
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required disabled={onEdit}
            onChange={handleChangeInput}
            value={product.product_id}
          />
        </div>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            onChange={handleChangeInput}
            value={product.title}
          />
        </div>
        <div className="row">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            onChange={handleChangeInput}
            value={product.price}
          />
        </div>
        <div className="row">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            rows="5"
            onChange={handleChangeInput}
            value={product.description}
          />
        </div>
        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            rows="7"
            onChange={handleChangeInput}
            value={product.content}
          />
        </div>
        <div className="row">
          <label htmlFor="categories">Categories : </label>
          <select name="category" value={product.category}   onChange={handleChangeInput}>
            <option value="">Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
