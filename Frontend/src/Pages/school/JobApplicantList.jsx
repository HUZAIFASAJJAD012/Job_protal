import PropTypes from 'prop-types'
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { LogOut, ChevronRight } from 'lucide-react'
import Header from "./Header";

// Rating Component
function Rating() {
  return (
    <RadioGroup className="flex gap-16">
      <div className="flex flex-col items-start gap-2">
        <div className=" flex w-10 h-10 rounded-full border-2 border-gray-300 items-start" />
        <Label className="text-sm">Never Again</Label>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-gray-300" />
        <Label className="text-sm">Can't wait</Label>
      </div>
    </RadioGroup>
  )
}

// JobCard Component
function JobCard({ title, location, rate, givenTo }) {
  return (
    <Card className="p-6 bg-[#F8F8F8] border-0 shadow-none hover:bg-[#F3F3F3] transition-colors min-h-[220px] w-full max-w-[300px]">
      <h3 className="text-xl font-medium mb-1">{title}</h3>
      <p className="text-gray-500 mb-2">{location}</p>
      <p className="text-2xl font-semibold mb-6">{rate}</p>
      <div className="space-y-4">
        <div className="flex gap-2">
          <span className="text-base">Job Given to :</span>
          <span className="text-lg font-semibold">{givenTo}</span>
        </div>
        <button className="text-[#2B7A0B] hover:text-[#236508] flex items-center text-base font-medium">
          Message <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </Card>
  )
}

JobCard.propTypes = {
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  rate: PropTypes.string.isRequired,
  givenTo: PropTypes.string.isRequired
}

// Main Page Component
export default function JobApplicantList() {
  const jobApplications = Array(9).fill({
    title: "French Cover Teacher, New Hampshire",
    location: "London Area",
    rate: "$17/hr",
    givenTo: "Anna Hathaway"
  })

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      {/* Header/Navbar */}
      <Header/>
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-12 py-8 max-w-[1300px]">
        <h1 className="text-2xl font-semibold mb-6 text-center">Recent Jobs Applicants</h1>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8 justify-items-center">
          {jobApplications.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>

        {/* Review Section */}
        <div className="max-w-[1300px] mx-auto">
          <Card className="p-6 bg-[#F8F8F8] border-0 shadow-none">
            <h2 className="text-xl font-semibold mb-4">Review</h2>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Rate out of 10</p>
              <Rating />
            </div>
            <Button className="w-full bg-[#2B7A0B] hover:bg-[#236508] text-white">
              Submit
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
