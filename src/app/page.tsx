import ToggleTheme from '@/components/ToggleTheme'
import React from 'react'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className=''>
        <h1 className='text-center font-bold text-3xl'>Hello world</h1>
        <p className='text-gray-700 dark:text-gray-300'>
          This is a simple Next.js application with dark mode support.
        </p>
      </div>
      <ToggleTheme />
    </div>
  )
}

export default Home