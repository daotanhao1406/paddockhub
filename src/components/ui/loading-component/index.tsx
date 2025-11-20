'use client'
import '@/components/ui/loading-component/index.css'
export default function LoadingComponent() {
  return (
    <div className='loading'>
      <div className='preloader'>
        <span className='line line-1'></span>
        <span className='line line-2'></span>
        <span className='line line-3'></span>
        <span className='line line-4'></span>
        <span className='line line-5'></span>
        <span className='line line-6'></span>
        <span className='line line-7'></span>
        <span className='line line-8'></span>
        <span className='line line-9'></span>
        <div>Loading</div>
      </div>
    </div>
  )
}
