import React from 'react'
import { Link } from 'react-router-dom'

const UserDetail = (props) => {
    const {user} = props.location.state
    return(
        <React.Fragment>
            
            <div className='header'>
                <Link to='/'>
                    <div className='back_arrow'></div>
                </Link>
                <div> Data Peace </div>
            </div>
            
            <div className="user_detail_wrapper">
                <div className='username'>{`${user.first_name} ${user.last_name}`}</div>
                <div className='user_detail'> 
                    <div>Company</div><div className='value'>{user.company_name}</div>
                </div>
                <div className='user_detail'> 
                    <div>City</div><div className='value'>{user.city}</div>
                </div>
                <div className='user_detail'> 
                    <div>State</div><div className='value'>{user.state}</div>
                </div>
                <div className='user_detail'> 
                    <div>ZIP</div><div className='value'>{user.zip}</div>
                </div>
                <div className='user_detail'> 
                    <div>Email</div><div className='value'>{user.email}</div>
                </div>
                <div className='user_detail'> 
                    <div>Web</div><div className='value'>{user.web}</div>
                </div>
                <div className='user_detail'> 
                    <div>Age</div><div className='value'>{user.age}</div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default UserDetail