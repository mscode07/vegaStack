import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageCircle, Heart, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col justify-center items-center">
      
      <section className="container py-24 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Connect with <span className="text-accent">Professionals</span> Worldwide
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Join SocialConnect, the premier platform for professional networking, knowledge sharing, and career
              growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SocialConnect?</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to build meaningful professional relationships
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Professional Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with industry leaders, colleagues, and potential collaborators from around the world.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Meaningful Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share insights, ask questions, and engage in discussions that matter to your career.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Be part of a supportive community that celebrates achievements and supports growth.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Career Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Discover opportunities, showcase your expertise, and accelerate your professional journey.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="bg-accent text-accent-foreground">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Connecting?</h3>
            <p className="text-accent-foreground/80 mb-6 max-w-md mx-auto">
              Join thousands of professionals who are already building their network on SocialConnect.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">Create Your Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
