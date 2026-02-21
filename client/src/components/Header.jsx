import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

export default function Header() {

  const { userData } = useContext(AppContent)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'>
      <div className="relative mb-6">
        <img src={assets.header_img} alt="" className='w-40 h-40 rounded-full shadow-2xl animate-float border-4 border-white' />
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
          <img src={assets.hand_wave} alt="" className='w-8 aspect-square' />
        </div>
      </div>

      <h1 className='text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3'>
        Hey <span className="text-gradient">{userData ? userData.name : 'Developer'}</span>!
      </h1>

      <h2 className='text-4xl sm:text-6xl font-black mb-6 tracking-tight leading-tight'>
        Welcome to <br /> <span className="text-gradient">Lanka Auth</span>
      </h2>

      <p className='mb-10 max-w-lg text-slate-600 text-lg leading-relaxed'>
        Experience the next generation of security with Lanka Auth.
        Fast, reliable, and beautifully designed for your peace of mind.
      </p>

      <button className='btn-premium text-lg'>
        Start Product Tour
      </button>
    </div>
  )
}
