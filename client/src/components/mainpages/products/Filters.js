import React, {useContext, useState} from 'react'
import {GlobalState}from "../../../GlobalState"
function Filters() {
       const state=useContext(GlobalState);
       const [products,setProducts] = state.ProductsAPI.products;
       const [categories]=state.categoriesAPI.categories;
       const [category, setCategory] = state.ProductsAPI.category;
       const [sort, setSort] = state.ProductsAPI.sort;
       const [search, setSearch] = state.ProductsAPI.search;

    const handleCategory=(e)=>{
        setCategory(e.target.value)
        setSearch(' ')
    }


    return (
        <div className="filter_menu">
            <div className="row">
                <span>Filters:</span>
                <select name="category" value={category} onChange={handleCategory}>
                    <option value="">All Products</option>
                    {
                        categories.map(category=>(
                            <option value={"category=" + category._id} key={category._id}>
                                 {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            <input type="text" value={search} placeholder="Enter your search!"
            onChange={e=>setSearch(e.target.value.toLowerCase())}/>

            <div className="row sort">
                <span>Sort By:</span>
                <select  value={sort} onChange={e=>setSort(e.target.value)}>
                    <option value="">Newest</option>
                    <option value="sort=oldest">Oldest</option>
                    <option value="sort=-sold">Best Sales</option>
                    <option value="sort=-price">Price : High to Low</option>
                    <option value="sort=price">Price : Low to High</option>
                    
                </select>
            </div>
        </div>
    )
}

export default Filters
