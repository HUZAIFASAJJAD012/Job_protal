import React from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar"
import {Button} from "../../components/ui/button"
import {Badge} from "../../components/ui/badge"
import {LogOut, MapPin} from 'lucide-react'
import Header from "./Header";

export default function SchoolProfile() {
    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
            {/* Header/Navbar */}
            <Header/>
            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* SchoolProfile Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pt-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 -mt-4 -mr-2">
                                <AvatarImage src="/placeholder.svg" alt="Jane Doe"/>
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="relative inline-block">
                                    <h1 className="text-2xl font-semibold">Jane Doe</h1>
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4 absolute -top-1 -right-4"
                                    >
                                        <path
                                            fill="#0095F6"
                                            d="M12 2L14.8 4.8L18.5 4.8L18.5 8.5L21.3 11.3L18.5 14.1L18.5 17.8L14.8 17.8L12 20.6L9.2 17.8L5.5 17.8L5.5 14.1L2.7 11.3L5.5 8.5L5.5 4.8L9.2 4.8L12 2Z"
                                        />
                                        <path
                                            fill="white"
                                            d="M10.2 13.7L7.5 11L8.9 9.6L10.2 10.9L14.8 6.3L16.2 7.7L10.2 13.7Z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin className="h-4 w-4"/>
                                    <span>London, United Kingdom</span>
                                    <span className="text-sm">25 yrs old</span>
                                </div>
                                <div className="mt-1 text-base ">50 jobs completed</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 mt-2 sm:mt-0">
                            <Button variant="outline"
                                    className="text-black hover:bg-gray-50 border border-[#D5E6CC] rounded-lg px-8 py-4">
                                Report Account
                            </Button>
                            <Button className="bg-[#2B7A0B] hover:bg-[#236508] text-white rounded-lg px-8 py-4">
                                Send Request
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Expert Title & Rate */}
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-[28px] font-semibold text-black">Expert French Teacher</h2>
                            <span className="text-[22px] font-bold text-black">$10/hr</span>
                        </div>

                        {/* Description */}
                        <p className="text-[#666666] text-[15px] leading-[1.2] mb-8">
                            Experienced French teacher with 5 years of expertise in inspiring students to learn the
                            French language and culture. Known for creating engaging lesson plans tailored to diverse
                            learning styles. My ability to foster a supportive classroom environment, combined with
                            advanced communication skills and a knack for making language learning interactive, sets me
                            apart. Proficient in integrating technology and innovative teaching methods to enhance
                            student engagement and success.
                        </p>

                        {/* Employment History */}
                        <section className="mb-8">
                            <h3 className="text-2xl font-medium text-black mb-2">Employment History</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[15px] font-semibold text-black">Language Instructor</h4>
                                    <ul className="text-[14px] text-[#666666] mt-1 ">
                                        <li className="flex items-start pl-1">
                                            <span className="mr-2">•</span>
                                            <span>Hampton High School - Hampshire</span>
                                        </li>
                                        <li className="flex items-start pl-1">
                                            <span className="mr-2">•</span>
                                            <span>2021 - 2022</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold text-black">French Teacher</h4>
                                    <ul className="text-[14px] text-[#666666] mt-1   ">
                                        <li className="flex items-start pl-1">
                                            <span className="mr-2">•</span>
                                            <span>London Memorial School - London</span>
                                        </li>
                                        <li className="flex items-start pl-1">
                                            <span className="mr-2">•</span>
                                            <span>2022 - 2024</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Education */}
                        <section className="mb-8">
                            <h3 className="text-2xl font-medium text-black mb-2">Education</h3>
                            <ul className="text-[14px] text-[#666666]   ">
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Bachelor's Degree in French Language and Literature</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>University of Hampton - London</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>2020</span>
                                </li>
                            </ul>
                        </section>

                        {/* Skills */}
                        <section className="mb-8">
                            <h3 className="text-2xl font-medium text-black mb-2">Skills</h3>
                            <ul className="text-[14px] text-[#666666] ">
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Fluent in French (written and spoken)</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Proficient in using educational technology and platforms (e.g., Smartboards, Duolingo Classroom)</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Strong classroom management and organizational skills</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Skilled in curriculum development and student assessment</span>
                                </li>
                                <li className="flex items-start pl-1">
                                    <span className="mr-2">•</span>
                                    <span>Expertise in fostering cultural appreciation and language immersion</span>
                                </li>
                            </ul>
                        </section>

                        {/* Availability */}
                        <div className="flex gap-4 pb-9">
                            <Badge variant="secondary"
                                   className="bg-[#D5E6CC] text-black rounded-full px-4 py-2 text-[14px] font-normal">
                                Available from 23/11/2024
                            </Badge>
                            <Badge variant="secondary"
                                   className="bg-[#D5E6CC] text-black rounded-full px-4 py-2 text-[14px] font-normal">
                                Available to 23/12/2024
                            </Badge>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

