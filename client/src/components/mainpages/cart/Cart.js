import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from "../../../GlobalState"
import {Link}  from "react-router-dom";
import axios from "axios"

import "./Cart.css"

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [total, setTotal] = useState(0)
    const [token] = state.token
    
    useEffect(()=>{
        const getTotal = () => {
            const total = cart.reduce((prev, item)=>{
                return prev + (item.price * item.quantity)
            },0)
            setTotal(total)
        }
        getTotal()
    }, [cart])

    const addToCart = async () => {
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization : token}
        })
    }

    const increment = (id) => {
        cart.forEach(item => {
            if(item._id === id){
                item.quantity += 1
            } 
        })
        setCart([...cart])
        addToCart()
    }

    const decrement = (id) => {
        cart.forEach(item => {
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity -=1
            }
        })
        setCart([...cart])
        addToCart()
    }

    const removeProduct = (id) =>{
        if(window.confirm("Do you want to delete this Product")){
            cart.forEach((item, index)=>{
                if(item._id === id){
                    cart.splice(index,1)
                }
            })
       setCart([...cart])
       addToCart()
        }
    }

    if(cart.length === 0) 
        return <h2 style={{textAlign:'center' , fontSize:"5rem"}}>Cart Empty</h2>

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart">
                        <img src={product.images.url} alt="" className="img_container"/>
                        <div className="box-detial">
                            
                            <h2>{product.title}</h2>
                                
                            <h5>${product.price * product.quantity}</h5>
                            <p><h4 style={{textDecoration:'underline', color:'whitesmoke'}}>Content: </h4>{product.content}</p><br/><br/>
                            <p><h4 style={{textDecoration:'underline', color:'whitesmoke'}}>Description: </h4>{product.description}</p><br/><br/>

                            <div className="amount">
                                <button onClick={()=>decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={()=>increment(product._id)}> + </button>
                            </div>

                            <div className="delete" onClick={()=>removeProduct(product._id)}>
                                Delete
                            </div>

                            <p>Sold: {product.sold}</p><br/><br/>
                            <Link to="/cart" className="cart">BUY NOW</Link>
                        </div>
                    </div>
                ))
            }
            <div className="total">
                <h4>Total: $ {total}</h4>
                <Link to="#">Payment</Link>
            </div>
        </div>
    )
}

export default Cart
