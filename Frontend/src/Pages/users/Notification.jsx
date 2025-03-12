import {Card} from "../../components/ui/card"
import {Button} from "../../components/ui/button"
import Header from "../users/Header";

function NotificationCard({title, duration, rate, imageUrl}) {
    return (
        <Card className="p-3 mb-4 border-0 shadow-sm bg-[#f7fcfc]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 overflow-hidden rounded-full">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-21%20234547-10D5DLrL80fLYA5En2D0XV5JInFFWv.png"
                            alt="School building"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium text-base pb-2">{title}</h3>
                        <div className="text-xs text-muted-foreground">{duration}</div>
                        <div className="font-semibold text-[18px] ">{rate}</div>
                    </div>
                </div>
                <Button className="bg-[#2b7a0b] hover:bg-[#236508] text-white px-11 h-10">
                    Accept Job
                </Button>
            </div>
        </Card>
    )
}

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            title: "French Teacher at St. Petersburhg",
            duration: "6 days Cover",
            rate: "$15/hr",
            imageUrl: "/placeholder.svg?height=48&width=48",
        },
        {
            id: 2,
            title: "French Teacher at St. Petersburhg",
            duration: "6 days Cover",
            rate: "$15/hr",
            imageUrl: "/placeholder.svg?height=48&width=48",
        },
        {
            id: 3,
            title: "French Teacher at St. Petersburhg",
            duration: "6 days Cover",
            rate: "$15/hr",
            imageUrl: "/placeholder.svg?height=48&width=48",
        },
        {
            id: 4,
            title: "French Teacher at St. Petersburhg",
            duration: "6 days Cover",
            rate: "$15/hr",
            imageUrl: "/placeholder.svg?height=48&width=48",
        },
    ]

    return (
        <>
            <Header/>
            <div className="w-full min-h-screen bg-[#FAFAFA]">
                <div className="w-full max-w-5xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">Notifications</h1>
                    <div>
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                title={notification.title}
                                duration={notification.duration}
                                rate={notification.rate}
                                imageUrl={notification.imageUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>

    )
}

