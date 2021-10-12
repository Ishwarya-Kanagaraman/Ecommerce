import React,{useContext,useState} from 'react'
import {GlobalState} from "../../GlobalState"
import Menu from "./icon/menu.svg"
import Close from "./icon/close.svg"
import Cart from "./icon/cart.svg"
import {Link} from "react-router-dom"
import axios from 'axios'
export default function Header() {
    const state=useContext(GlobalState);
    // console.log(state.userAPI.isLogged);
    const [isLogged]=state.userAPI.isLogged;
    const [isAdmin]=state.userAPI.isAdmin;
    const [cart]=state.userAPI.cart;
    const [ menu,setMenu]=useState(false)

    const logoutUser = async ()=>{
        await axios.get('/user/logout');
         localStorage.removeItem('firstLogin')
        window.location.href="/";
    }

    const adminRouter=()=>{
        return (
            <>
            <li>
                <Link to="/create_product">Create Products</Link>
                
            </li>
            <li><Link to="/category">Categories</Link></li>
            </>
        )
    }
    const loggedRouter=()=>{
        return (
            <>
            <li>
                <Link to="/history">History</Link>
              
            </li>
            <li>  <Link to="/" onClick={logoutUser}>LogOut</Link></li>
            </>
        )
    }
  
    const styleMenu={
          left:menu ? 0 : "-100%"
    }
    // console.log(state);
    return (
        <header>
              <div className="menu" onClick={()=>setMenu(!menu)}>
                  <img src={Menu} width="30"alt=""/>
              </div>
              <div className="logo">
                  <h1>
                      <Link to="/">{isAdmin? 'Admin':'Uma Shop'}</Link>
                  </h1>
              </div>
              <ul style={styleMenu}>
                  <li><Link to="/">{isAdmin ?'Products' : 'Shop'}</Link></li>

                  {isAdmin && adminRouter() }
                  {
                      isLogged ? loggedRouter(): 
                        <li>
                          <Link to="/login">Login ✥ Register</Link>
                        </li>

                  }
                  <li onClick={()=>setMenu(!menu)}>
                    <img src={Close} alt="" className="menu" width="30"/>          
                  </li>
              </ul>
              {
                  isAdmin ? ' '
                  :  <div className="cart-icon">
                  <span>{cart.length}</span>
                    <Link to="/cart">
                    <img src={Cart} width="30" alt=""/></Link>
              </div>
              }
              
        </header>
    )
}
