import React from 'react'

const EmptyState = () => {
  return (
    <div className='flex w-full flex-col items-center justify-center rounded-lg border border-zinc-200/80 bg-white/80 py-16 shadow-xl shadow-zinc-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60'>
        <img src="/empty-state.svg" alt="No Projects" className='w-48 mb-4' />
        <h2 className='text-xl font-semibold text-zinc-700 dark:text-zinc-200'>No Projects Found</h2>
        <p className='text-zinc-500 mt-2 dark:text-zinc-400'>Create a new project to get started.</p>
    </div>
  )
}

export default EmptyState
