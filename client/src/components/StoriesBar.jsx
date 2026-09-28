import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { API_BASE } from '../helper'
import { getImageUrl } from '../helper'
import UserAvatar from './UserAvatar'
 
const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)
 
    const fetchstories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setStories(data);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }
 
    useEffect(() => {
        fetchstories()
    }, [])
 
    // Adjust if your story.user uses different field names
    const getStoryName = (story) =>
        story.user?.full_name || story.user?.username || story.user?.name || 'User'
 
  return (
    <div className='w-full min-w-0 h-42 bg-white rounded-2xl border border-slate-100 shadow-sm p-3'>
 
     <div className='flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1'>
        {/* add stories card */}
        <div
            onClick={() => setShowModal(true)}
            className='group snap-start shrink-0 w-28 h-36 rounded-2xl cursor-pointer border border-indigo-100
            bg-gradient-to-b from-indigo-50 to-purple-100/70 shadow-sm hover:shadow-md hover:-translate-y-0.5
            active:scale-95 transition-all duration-200 flex flex-col items-center justify-center gap-3 p-3'
        >
            <div className='size-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md
            flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                <Plus className='w-6 h-6 text-white' />
            </div>
            <p className='text-xs font-medium text-indigo-700 text-center'>Create Story</p>
        </div>
 
        {/* stories card */}
        {
            stories.map((story) => (
                <div
                    key={story._id}
                    onClick={() => setViewStory(story)}
                    className='group relative snap-start shrink-0 w-28 h-36 rounded-2xl overflow-hidden cursor-pointer
                    shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200
                    bg-gradient-to-b from-indigo-500 to-purple-600'
                    style={story.media_type === 'text' ? { backgroundColor: story.background_color } : undefined}
                >
                    {/* media */}
                    {story.media_type !== 'text' && (
                        <div className='absolute inset-0 bg-slate-900'>
                            {story.media_type === 'image' ? (
                                <img
                                    src={story.media_url}
                                    alt=''
                                    className='h-full w-full object-cover group-hover:scale-110 transition duration-500'
                                />
                            ) : (
                                <video
                                    src={story.media_url}
                                    className='h-full w-full object-cover group-hover:scale-110 transition duration-500'
                                />
                            )}
                        </div>
                    )}
 
                    {/* gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20' />
 
                    {/* avatar with story ring */}
                    <div className='absolute top-2.5 left-2.5 z-10 p-[2px] rounded-full bg-gradient-to-tr from-indigo-400 via-purple-500 to-fuchsia-400'>
                        <div className='rounded-full ring-2 ring-white'>
                            <UserAvatar user={story.user} size={32} className='shadow' />
                        </div>
                    </div>
 
                    {/* text story content */}
                    {story.media_type === 'text' && story.content && (
                        <p className='absolute inset-x-3 top-1/2 -translate-y-1/2 text-white/90 text-sm text-center line-clamp-3 z-10'>
                            {story.content}
                        </p>
                    )}
 
                    {/* username + time */}
                    <div className='absolute bottom-2 inset-x-2.5 z-10'>
                        <p className='text-white text-xs font-semibold truncate'>{getStoryName(story)}</p>
                        <p className='text-white/70 text-[10px]'>{moment(story.createdAt).fromNow()}</p>
                    </div>
                </div>
            ))
        }
     </div>
 
     {/* add story modal */}
     { showModal && <StoryModal setShowModal={setShowModal} fetchstories={fetchstories}/> }
     {/* view story  */}
     {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
     )}
    </div>
  )
}
 
export default StoriesBar