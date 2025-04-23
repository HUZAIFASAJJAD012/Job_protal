import { BlogCard } from "./include/Blog-Card"


const blogPosts = [
  {
    id: 1,
    title: "Top Qualities to Look for in Temporary Cover Staff",
    description: "Learn what makes a great substitute teacher and how to find the best candidates for your school.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-njhn21%20233633-r3MmxMrTduIsfZUpY4iTzTPOfXyWBC.png",
    link: "#",
  },
  {
    id: 2,
    title: "How to Streamline Your School's Recruitment Process",
    description: "Discover the tools and strategies to efficiently find, interview, and hire the best educators.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202jknbh024-12-21%20233633-2DbhJMN6addrDTdk0enMW7U0iiajDB.png",
    link: "#",
  },
  {
    id: 3,
    title: "The Hidden Costs of Last-Minute Teacher Absences",
    description: "Understand the impact of teacher shortages on learning outcomes and school budgets.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-nhjg12-21%20233633-SOmVJHPUX1XSGlDIKGrwN7OWn9ovqr.png",
    link: "#",
  },
  {
    id: 4,
    title: "Why Schools Need Recruitment Platforms for Reliable Cover",
    description: "Explore how digital recruitment tools are transforming education staffing.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-2dfghj1%20233633-75NU2ISPfLci9YYZAce7BBY7VJW08j.png",
    link: "#",
  },
]

export default function Blog() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

