import React from 'react'
import PricingCard from './Pricing-Card'

const jobSeekerFeatures = [
  'Apply for unlimited jobs.',
  'Flexible job selection.',
  'Quick Application Process',
  'Track Application Status',
  'Instant notifications for matching opportunities.'
]

const schoolFeatures = [
  'Post unlimited cover jobs.',
  'Track JobModel Status',
  'Access a pool of verified teachers.',
  'Instant match suggestions.',
  'Instant notifications for matching opportunities.'
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-4 min-h-screen" style={{backgroundColor:"#005502"}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Pricing</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <PricingCard
            title="JobModel Seekers"
            description="Find cover teaching jobs easily."
            price="15"
            unit="Per JobModel"
            features={jobSeekerFeatures}
          />

          <PricingCard
            title="Schools"
            description="Find reliable cover teachers quickly."
            price="399"
            unit="Per Month"
            features={schoolFeatures}
          />
        </div>
      </div>
    </section>
  )
}

