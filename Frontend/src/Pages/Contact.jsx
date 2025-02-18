import React, {useContext} from 'react'
import {Mail, Phone, MapPin, ChevronRight} from 'lucide-react'
import {Store} from "../Utils/Store"
import {Link} from "react-router-dom";

export default function ContactSection() {
    const {state} = useContext(Store)
    const {ContactInfo} = state
    return (
        <>

            <section className="py-16 px-4 max-w-7xl mx-auto" style={{marginTop: "50px"}}>
                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        {/* Header */}
                        <div>
                            <span className="text-sm font-medium text-gray-600">Connect</span>
                            <h1 className="text-[42px] font-extrabold mt-2 mb-3">Contact Us</h1>
                            <p className="text-gray-600 text-lg">We're here to help you with any questions.</p>
                        </div>

                        {/* Contact Methods */}
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <Mail className="w-6 h-6 mb-4"/>
                                <h3 className="text-xl font-extrabold mb-1">Email</h3>
                                <p className="text-gray-600 text-sm mb-1">Reach us anytime.</p>
                                <Link to={`mailto:${ContactInfo.contact_email}`}
                                      className="text-[#2B7A0B] hover:underline">
                                    {ContactInfo.contact_email}
                                </Link>
                            </div>

                            {/* Phone */}
                            <div>
                                <Phone className="w-6 h-6 mb-4"/>
                                <h3 className="text-xl font-extrabold mb-1">Phone</h3>
                                <p className="text-gray-600 text-sm mb-1">Call us for assistance.</p>
                                <Link to={`tel:${ContactInfo.contact_email}`}
                                      className="text-[#2B7A0B] hover:underline">
                                    {ContactInfo.contact_phone}
                                </Link>
                            </div>

                            {/* Office */}
                            <div>
                                <MapPin className="w-6 h-6 mb-4"/>
                                <h3 className="text-xl font-extrabold mb-1">Office</h3>
                                <p className="text-gray-600 mb-1">                                    {ContactInfo.address}
                                </p>
                                <button className="text-[#2B7A0B] hover:underline inline-flex items-center">
                                    Get Directions
                                    <ChevronRight className="w-4 h-4 ml-1"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative h-[600px] rounded-2xl overflow-hidden" style={{marginTop:"158px"}}>
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-21%20234547-10D5DLrL80fLYA5En2D0XV5JInFFWv.png"
                            alt="Contact support"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

