'use client'

import FarmMapDisplay from '@/elements/farm/create/farm-map-display'
import { Step1Details } from '@/elements/farm/create/step-1-details'
import { Step2FindFarm } from '@/elements/farm/create/step-2-find-farm'
import { Step3Draw } from '@/elements/farm/create/step-3-draw'
import { Step4Save } from '@/elements/farm/create/step-4-save'

export default function CreateFarmForm() {
  return (
    <div className='flex flex-col gap-4 mt-6'>
      <Step1Details />
      <Step2FindFarm />
      <Step3Draw mapComponent={<FarmMapDisplay />} />
      <Step4Save />
    </div>
  )
}
