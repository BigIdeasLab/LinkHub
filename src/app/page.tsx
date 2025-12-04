import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2, BarChart3, Palette, Share2 } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="rounded-lg border border-border bg-card p-6 text-center space-y-3">
    <div className="mx-auto w-fit rounded-lg bg-primary/10 p-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-sm text-foreground/70">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    <p className="text-foreground/80 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
      <div>
        <p className="font-semibold text-sm">{author}</p>
        <p className="text-xs text-foreground/60">{role}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background -z-10" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="space-y-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Trusted by 500k+ creators worldwide
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              One link for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                everything you create
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto">
              Turn your bio into a powerful hub for your audience. Consolidate
              all your important links, media, and calls-to-action in one
              beautiful, customizable landing page.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Examples
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-12 rounded-xl border border-border bg-gradient-to-b from-card to-background p-8 shadow-lg">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto opacity-20" />
                  <p className="text-foreground/40 text-sm">
                    Beautiful profile preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Powerful features for creators
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Everything you need to transform your bio link into a conversion
                engine
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Link2}
                title="Consolidate All Links"
                description="Bring together all your important destinations – Instagram, YouTube, TikTok, website, email, and more – in one beautiful hub."
              />
              <FeatureCard
                icon={Palette}
                title="Match Your Brand"
                description="Customize colors, fonts, layouts, and styles to perfectly match your unique brand identity and aesthetic."
              />
              <FeatureCard
                icon={BarChart3}
                title="Track Analytics"
                description="See exactly who's visiting, which links get clicks, and get actionable insights to optimize your bio."
              />
              <FeatureCard
                icon={Share2}
                title="Easy to Share"
                description="Generate QR codes, short URLs, and share across all your platforms with just one click."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 sm:py-32 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Loved by creators everywhere
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                See what creators are saying about LinkHub
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="LinkHub transformed how I share my work. I went from losing followers to scattered links, to keeping them all in one beautiful place. My click-through rate doubled!"
                author="Sarah Chen"
                role="Content Creator"
              />
              <TestimonialCard
                quote="As a small business owner, this is exactly what I needed. I can track which products get interest and optimize my offerings. Game changer."
                author="Marcus Johnson"
                role="Founder, Johnson Co."
              />
              <TestimonialCard
                quote="The customization options are incredible. My LinkHub page matches my brand perfectly, and my followers actually use it now."
                author="Emma Rodriguez"
                role="Digital Artist"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                500k+
              </p>
              <p className="text-sm text-foreground/70">Active Creators</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                50M+
              </p>
              <p className="text-sm text-foreground/70">Links Created</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                10B+
              </p>
              <p className="text-sm text-foreground/70">Monthly Clicks</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                99.9%
              </p>
              <p className="text-sm text-foreground/70">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-32 border-t border-border">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 sm:p-12 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to get started?
            </h2>
            <p className="text-lg text-foreground/70">
              Join thousands of creators who've already transformed their bio
              link. It takes less than 3 minutes to create your LinkHub.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Create Your LinkHub <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
