import React from 'react';
import './Popular.css'
import data_product from '../Assets/data'
import Item from '../Items/Item'

const Popular = () => {
    return(
        <div className='popular'>
            <h1>HIGH SELLING PRODUCTS</h1>
            <hr/>
            <div className="popular-item">
            {Array.from(new Set(data_product.map(item => item.id))) // Ensure uniqueness by product ID
    .map(id => data_product.find(item => item.id === id)) // Get unique items by ID
    .slice(0, 8) // Limit the number of items shown (e.g., only show the first 8 items)
    .map((item, i) => (
        <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
        />
    ))}

            </div>

        </div>

    )
}

export default Popular