import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const RecentMessages = ({ messages }) => {
  return (
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
      <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>
      <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <Link 
              key={index} 
              to={`/chat/${msg.chatId}`} 
              className='p-2 hover:bg-slate-100 rounded-md'
            >
              <p className='font-medium'>{msg.senderName}</p>
              <p className='text-slate-600 truncate'>{msg.text}</p>
            </Link>
          ))
        ) : (
          <p className='text-slate-500 italic'>No recent messages</p>
        )}
      </div>
    </div>
  )
}

export default RecentMessages