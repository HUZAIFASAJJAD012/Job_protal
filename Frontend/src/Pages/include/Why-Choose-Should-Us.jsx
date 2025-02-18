
export default function WhyChooseUs() {
  const features = [
    {
      title: "Easy to Find Cover",
      description: "Finding the right cover staff for your school has never been easier. We ensure you get qualified candidates fast, so learning continues uninterrupted.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cop1-21%20233503-OikJBjaGRjpj9KOy1UjuVB4rDWMxrS.png",
    },
    {
      title: "Qualified Professionals, Every Process",
      description: "Our database is packed with experienced educators ready to step in and make an impact from day one.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cop%202-21%20233503-GeBLTPxSbqCiFF5H3arvEIfCBhQJef.png",
    },
    {
      title: "Seamless Recruitment Process",
      description: "From posting vacancies to onboarding, we handle the heavy lifting",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copy%20303-es0WCYr694LXMMXKN5afjikwcShvXY.png",
    },
  ]

  return (
    <section className="py-16 bg-[#F8F9FE] mx-auto" style={{width:"87%"}}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center md:text-left">
          Why You Should Choose Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="object-cover rounded-t-3xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

