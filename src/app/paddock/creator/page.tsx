'use client'

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
    loading: () => <LoadingComponent />,
  },
)

export default function PaddockCreatorPage() {
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
