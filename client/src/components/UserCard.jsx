import React from 'react'
import { dummyUserData } from '../assets/assets'

const UserCard = ({user}) => {
    const currentUser = dummyUserData


    const handlefollow=async () => {
        
    }

    const handleConnectionRequest=async () => {
        
    }


  return (
    <div key={user._id} className=''>
    <div className=''>
<UserAvatar user={user} size={48} />       
 <p className=''>{user.full_name}</p>
        {user.username && <p>@{user.username}</p>}
    </div>
    </div>
  )
}

export default UserCard