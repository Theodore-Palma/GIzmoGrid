import React from 'react'
import './NewsLetter.css'

const NewsLetter = () =>{
    return(
        <div className='newsletter'>
          <h1>Get more products in GizmoGrid!</h1>
          <p>Email us for your inquiries.</p>
          <div>
           <input type="email" placeholder='Your email id'/>
           <button>Subscribe</button>
          </div>

        </div>
    )
}

export default NewsLetter