import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
    return(
        <div className='offers'>
            <div className="offers-left">
                <h1>PREMIUM</h1>
                <h1>GADGETS</h1>
                <p>Rare Products</p>
                <button>Right here!</button>
            </div>
            <div className="offers-right">
                <img src={exclusive_image} alt=""/>
            </div>

        </div>
    )
}

export default Offers