import React from 'react'

export default function PricingCard({
  title,
  description,
  price,
  unit,
  features
}) {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="mb-6">
        <div className="text-4xl font-bold mb-1">{price}QR</div>
        <div className="text-gray-600">Unit: {unit}</div>
      </div>

      <button className="w-full bg-[#2B7A0B] text-white py-2 rounded-md hover:bg-[#236508] transition-colors mb-7">
        Sign Up Now
      </button>
      <div className="w-full h-px bg-gray-200 mb-3"></div>

      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 mr-2.5"></span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

