import {useState,useEffect} from 'react'
import axios from "axios";
function UserAPI(token) {
    const [isLogged,setIsLogged]=useState(false)
    const [isAdmin,setIsAdmin]=useState(false)
     const [cart,setCart]=useState([])
     const [history,setHistory]=useState([])
    //  const [callback,setCallback]=useState(false)

    useEffect(()=>{
        if(token){
           const getUser=async()=>{
               try{
                const res=await axios.get("/user/infor",{

                    headers:{
                        Authorization:token
                    }
                }) 
                setIsLogged(true);
                res.data.role===1 ?  setIsAdmin(true):setIsAdmin(false)
                setCart(res.data.cart)
                console.log(res) 
               }catch(err){
                   alert(err.response.data.msg)
                console.log(err)
               }
           }
           getUser(); 
        }
    },[token])

    useEffect(()=>{
        if(token){
            const getHistory = async()=>{
                if(isAdmin){
                    const res=await axios.get('/api/payment',{
                        headers:{Authorization:token}
                    })
                    setHistory(res.data)
                }
                else{
                    const res=await axios.get('/user/history',{
                        headers:{Authorization:token}
                    })
                    setHistory(res.data)
                }
               
            }
            getHistory()
        }
    },[token,isAdmin])

    const addCart=async(product)=>{
         if(!isLogged) return alert("please Login to continue buying")

         const check = cart.every(item=>{
             return item._id!==product._id
         })
          console.log(check)
         if(check){
             setCart([...cart,{...product,quantity:1}])
             await axios.patch('/user/addCart',{cart:[...cart,{...product,quantity:1}]},{
                 headers:{
                     Authorization:token
                 }
             })
         }else{
             alert("this product has already been added to cart.")
         }
    }
    return {
       isLogged: [isLogged,setIsLogged],
       isAdmin: [isAdmin,setIsAdmin],
       cart: [cart,setCart],
       addCart:addCart,
       history:[history,setHistory],
    //    callback:[callback,setCallback]
       
    }
}

export default UserAPI
