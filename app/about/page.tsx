"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Home, Users, Building, MapPin, Star, Shield, Clock, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              About <span className="text-primary">Second Home</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're on a mission to make finding student accommodation simple, transparent, and stress-free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="h-12 px-6" asChild>
                <Link href="/listings">Find Accommodation</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Second Home was founded in 2023 by a group of former students who experienced firsthand the challenges
                  of finding good accommodation near their colleges.
                </p>
                <p>
                  After struggling with unreliable brokers, hidden fees, and misleading listings, we decided to create a
                  platform that brings transparency and trust to student accommodation.
                </p>
                <p>
                  What started as a small project to help friends find PGs and flats near Bangalore colleges has now
                  grown into a comprehensive platform serving thousands of students across the city.
                </p>
                <p>
                  Our mission is simple: to help every student find their perfect "second home" - a place that's not
                  just a room to stay in, but a comfortable, safe, and welcoming environment where they can thrive
                  during their college years.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=600"
                  alt="Second Home team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Helping students since 2023</p>
                    <p className="text-xs text-muted-foreground">5000+ accommodations listed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do at Second Home</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Trust & Safety",
                description:
                  "We verify every property and owner to ensure students can make decisions with confidence.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We believe in creating connections and fostering a sense of belonging for students away from home.",
              },
              {
                icon: Award,
                title: "Quality",
                description:
                  "We maintain high standards for all listings and continuously improve our platform based on feedback.",
              },
              {
                icon: Clock,
                title: "Convenience",
                description: "We streamline the accommodation search process to save students time and reduce stress.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">The passionate people behind Second Home</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Founder & CEO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Former engineering student who experienced the challenges of finding good accommodation firsthand.",
              },
              {
                name: "Priya Patel",
                role: "COO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Operations expert with a background in hospitality and a passion for creating exceptional user experiences.",
              },
              {
                name: "Arjun Reddy",
                role: "CTO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Tech enthusiast who built the first version of Second Home during his final year of computer science.",
              },
              {
                name: "Neha Singh",
                role: "Head of Community",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Former student counselor who ensures Second Home meets the real needs of students.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Accommodations", icon: Building },
              { value: "20,000+", label: "Happy Students", icon: Users },
              { value: "50+", label: "Locations", icon: MapPin },
              { value: "4.8/5", label: "Average Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Second Home?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who found their perfect accommodation with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/register-property">List Your Property</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
