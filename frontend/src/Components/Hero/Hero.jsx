import React from 'react';
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
    return (
        <div className='hero'>
            <div className="hero-left">

                <h2>NEW ARRIVALS</h2>
                <div>
                    <div className="hero-hand-icon">
                        <p>New</p>
                        <img src={hand_icon} alt=""/>
                    </div>
                    <p>Gadgets Arrival!</p>
                    <p>HOT ENTRY!</p>
                </div>

                <div claasName="hero-latest-button">
                    <h2>Latest Release</h2>
                    <img src={arrow_icon} alt=""/>
                </div>

            </div>

            <div className="hero-right">
                <img src={hero_image} alt=""/>
            </div>

        </div>
    )
}

export default Hero;
