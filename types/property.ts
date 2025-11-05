export interface PropertyListing {
  _id: string
  title: string
  location: string
  rating: number
  reviews: number
  price: number
  image: string
  amenities: string[]
  type: string
  distance: {
    college: number
    hospital: number
    busStop: number
    metro: number
  }
}
