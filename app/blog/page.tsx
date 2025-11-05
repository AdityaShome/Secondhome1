import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample blog posts
const blogPosts = [
  {
    id: "1",
    title: "How to Find the Perfect PG Accommodation Near Your College",
    excerpt:
      "Finding the right PG accommodation can be challenging. Here are some tips to help you find the perfect place that feels like home.",
    image: "/placeholder.svg?height=400&width=600",
    date: "April 2, 2025",
    author: "Rahul Sharma",
    category: "Accommodation Tips",
  },
  {
    id: "2",
    title: "5 Things to Check Before Booking a Mess Subscription",
    excerpt:
      "Mess food is an essential part of student life. Learn what to look for before committing to a mess subscription.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 28, 2025",
    author: "Priya Patel",
    category: "Food & Nutrition",
  },
  {
    id: "3",
    title: "Budget-Friendly Decorating Ideas for Your Student Accommodation",
    excerpt: "Make your student accommodation feel like home with these budget-friendly decorating ideas.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 20, 2025",
    author: "Ananya Singh",
    category: "Lifestyle",
  },
  {
    id: "4",
    title: "Understanding Rental Agreements: What Students Should Know",
    excerpt:
      "Rental agreements can be confusing. Here's a guide to help students understand what they're signing up for.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 15, 2025",
    author: "Arjun Reddy",
    category: "Legal Advice",
  },
  {
    id: "5",
    title: "Top College Areas in Bangalore for Student Accommodation",
    excerpt:
      "Discover the best areas in Bangalore for student accommodation based on proximity to colleges, amenities, and transport.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 10, 2025",
    author: "Neha Singh",
    category: "City Guide",
  },
  {
    id: "6",
    title: "How to Manage Your Monthly Budget as a Student",
    excerpt: "Managing finances is a crucial skill for students. Learn how to create and stick to a monthly budget.",
    image: "/placeholder.svg?height=400&width=600",
    date: "March 5, 2025",
    author: "Vikram Mehta",
    category: "Finance",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Second Home Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tips, guides, and insights to help you find and enjoy your perfect second home
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm">By {post.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
