'use client'

import { Card, Skeleton } from '@heroui/react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import LoadingComponent from '@/components/ui/loading-component'

const CreateFarmForm = dynamic(
  () =>
    import('@/elements/farm/create/create-farm-form').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => (
      <main className='container mx-auto max-w-5xl p-4 md:p-6'>
        <Card className='w-full gap-3 p-6'>
          <Skeleton isLoaded className='w-3/5 rounded-lg'>
            <div className='h-3 w-1/5 rounded-lg bg-foreground-200' />
          </Skeleton>
          <Skeleton isLoaded className='w-2/5 rounded-lg mt-4'>
            <div className='h-3 w-3/5 rounded-lg bg-foreground-200' />
          </Skeleton>
          <Skeleton isLoaded className='w-4/5 rounded-lg'>
            <div className='h-3 w-4/5 rounded-lg bg-foreground-200' />
          </Skeleton>
          <Skeleton isLoaded className='w-2/5 rounded-lg mt-1'>
            <div className='h-3 w-2/5 rounded-lg bg-foreground-200' />
          </Skeleton>
          <Skeleton isLoaded className='w-4/5 rounded-lg'>
            <div className='h-3 w-3/5 rounded-lg bg-foreground-200' />
          </Skeleton>
        </Card>
      </main>
    ),
  },
)

export default function CreateFarmPage() {
  return (
    <main className='container mx-auto max-w-5xl p-4 md:p-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Paddock Creator</h1>
      <p className='text-muted-foreground'>
        Draw your paddocks, label them, download the GeoJSON, and (optionally)
        email us a copy. We’ll also save it securely on our side.
      </p>

      <Suspense fallback={<LoadingComponent />}>
        <CreateFarmForm />
      </Suspense>
    </main>
  )
}
