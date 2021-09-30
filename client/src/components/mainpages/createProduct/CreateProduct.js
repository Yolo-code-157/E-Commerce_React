import React, {useState, useContext} from 'react'
import axios from "axios"
import {GlobalState} from "../../../GlobalState"
import Loading from "../utils/Loading/Loading"
import "./createProject.css"

const initialState = {
    product_id:'',
    title:'',
    price:0,
    description:'write description here',
    content:'Product content here',
    category:'',
    _id: ''
}

function CreateProduct() {
    const [product, setProduct] = useState(initialState)
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const styleUpload = {
        display: images ? 'block' : 'none'
    }

    const handleUpload = async (e) =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You are not an Admin")
            const file = e.target.files[0]
            if(!file) return   alert("File not exist")
            if(file.size > 1024 * 1024) return alert("Size is too large")
            if(file.type !== "image/jpeg" && file.type !== "image/png") return alert("file type not supported")
    
            let formData = new FormData();
            formData.append('file', file)
    
            setLoading(true)
            const res = await  axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data' , Authorization : token }
            })
            setLoading(false)
            setImages(res.data)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async (e) => {
        try {
            if(!isAdmin) return alert('You are not an admin');
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id},{
                headers: {Authorization : token}
            })
            setLoading(false)
            setImages(false)
    
        } catch (err) {
            alert(err.response.data.msg)
        }
    } 

    const handleChangeInput = e => {
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert("you are not Admin")
            if(!images) return alert("no image found")
            
            await axios.post('/api/products', {...product, images}, {
                headers: {Authorization : token}
            })
           
            setImages(false)
            setProduct(initialState)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="create_product">
            <div className="upload"><br/><br/>
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><br/><br/><br/><br/><Loading/> </div>
                
                : <div id="file_img" style={styleUpload}>
                    <img src={images ? images.url : ''} alt=""/>
                    <span onClick={handleDestroy}>X</span>
                </div>
                }
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Product_id</label>
                    <input type="text" name="product_id" id="product_id" 
                    required value={product.product_id} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="Title">Title</label>
                    <input type="text" name="title" id="title" 
                    required value={product.title} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="text" name="price" id="price" 
                    required value={product.price} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" 
                    required value={product.description} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <input type="text" name="content" id="content" 
                    required value={product.content} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category"
                      value={product.category} onChange={handleChangeInput}>
                          <option value="">Please Select a category</option>
                          {
                              categories.map(category=>(
                                  <option  key={category._id} value={category._id}>
                                      {category.name}
                                  </option>
                              ))
                          }
                      </select>
                </div>
                <br/>
                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}

export default CreateProduct
