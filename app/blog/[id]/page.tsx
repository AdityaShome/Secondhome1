import { CardFooter } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin } from "lucide-react"

// Sample blog posts data
const blogPosts = {
  "1": {
    id: "1",
    title: "How to Find the Perfect PG Accommodation Near Your College",
    content: `
      <p>Finding the right PG accommodation as a student can be a daunting task, especially if you're moving to a new city. Your accommodation will be your home away from home for the next few years, so it's important to make the right choice. Here are some tips to help you find the perfect PG that feels like home:</p>
      
      <h2>1. Location is Key</h2>
      <p>The proximity to your college should be your primary consideration. Look for accommodations that are within walking distance or have good public transport connectivity to your college. This will save you time and money on commuting.</p>
      
      <h2>2. Budget Considerations</h2>
      <p>Determine your budget before starting your search. Remember to factor in additional costs like security deposit, maintenance charges, and utility bills. Be realistic about what you can afford on a monthly basis.</p>
      
      <h2>3. Facilities and Amenities</h2>
      <p>Make a list of must-have amenities based on your lifestyle and preferences. Common amenities to consider include:</p>
      <ul>
        <li>Wi-Fi connectivity</li>
        <li>Meals provided (frequency and quality)</li>
        <li>Laundry services</li>
        <li>Power backup</li>
        <li>Security measures</li>
        <li>Attached bathroom or shared</li>
        <li>Furniture and appliances provided</li>
        <li>Common areas for studying and socializing</li>
      </ul>
      
      <h2>4. Visit Before Deciding</h2>
      <p>Always visit the PG in person before making a decision. This gives you a chance to assess the cleanliness, meet other residents, check the condition of facilities, and get a feel for the neighborhood.</p>
      
      <h2>5. Check the House Rules</h2>
      <p>Every PG has its own set of rules regarding visitors, curfew times, noise levels, etc. Make sure you're comfortable with these rules before committing.</p>
      
      <h2>6. Talk to Current Residents</h2>
      <p>If possible, speak with current residents to get honest feedback about the PG, the owner/manager, and the overall living experience.</p>
      
      <h2>7. Check Reviews Online</h2>
      <p>Look for reviews and ratings online to get a better understanding of the PG's reputation. Platforms like Second Home provide verified reviews from actual residents.</p>
      
      <h2>8. Understand the Agreement Terms</h2>
      <p>Read the rental agreement carefully before signing. Pay attention to the notice period, deposit refund policy, and any hidden charges.</p>
      
      <h2>9. Consider the Neighborhood</h2>
      <p>Evaluate the neighborhood for safety, convenience, and accessibility to essential services like grocery stores, medical facilities, and ATMs.</p>
      
      <h2>10. Trust Your Instincts</h2>
      <p>Finally, trust your gut feeling. If something doesn't feel right about a place, it's better to keep looking rather than regret your decision later.</p>
      
      <p>Finding the perfect PG accommodation takes time and effort, but it's worth it for your comfort and peace of mind during your college years. Use platforms like Second Home to streamline your search and find verified accommodations that meet your requirements.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "April 2, 2025",
    author: "Rahul Sharma",
    category: "Accommodation Tips",
    tags: ["PG Accommodation", "Student Housing", "College Life", "Rental Tips"],
  },
  // Add more blog posts as needed
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts[params.id]

  if (!post) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center text-white hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              <span>{post.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-[400px]">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
          <div className="p-8">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="mt-12 pt-6 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Tags:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-medium">Share this post:</span>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=400&width=600" alt="Related post" fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">5 Things to Check Before Booking a Mess Subscription</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/blog/2">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=400&width=600" alt="Related post" fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Budget-Friendly Decorating Ideas for Your Student Accommodation
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/blog/3">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
