import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Users, MessageCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/common/AnimatedSection';
import { Button } from '@/components/ui/common/Button';
import { Toast } from '@/components/ui/common/Toast';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/seo/SEO';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  direction?: 'left' | 'right' | 'up';
}> = ({ icon, title, description, delay, direction = 'up' }) => (
  <AnimatedSection direction={direction} delay={delay}>
    <div className="feature-card relative overflow-hidden rounded-2xl bg-gradient-to-b from-background/80 to-background/40 p-8 backdrop-blur-sm border border-border/50 shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
      <div className="relative z-10">
        <div className="mb-6 inline-flex rounded-full bg-primary/10 p-3">
          {React.cloneElement(icon as React.ReactElement, {
            size: 24,
            className: "text-primary"
          })}
        </div>
        <h3 className="mb-3 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  </AnimatedSection>
);

const HomePage: React.FC = () => {
  const handleJoinTribes = () => {
    Toast.success('Welcome to Tribes!', 'Start exploring private communities');
  };

  const handleExploreCommunities = () => {
    Toast.info('Browsing Communities', 'Discover amazing private tribes');
  };

  return (
    <>
      <SEO
        title="Welcome to Tribes - Exclusive Private Communities"
        description="Join Tribes, the ultimate platform for creating and discovering exclusive, invite-only communities. Connect with like-minded individuals in a secure, private environment."
        keywords="private communities, exclusive groups, social networking, invite-only platform, tribes, community building"
      />
      <Helmet>
        <title>Tribes - Private Social Platform</title>
        <meta name="description" content="Create and join private, invite-only communities" />
      </Helmet>
      
      <div className="home-page min-h-screen bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <AnimatedSection>
            <header className="text-center mb-16">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now in Beta
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Welcome to Tribes
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Create and join private, invite-only communities
              </p>
            </header>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
              <Button 
                size="lg"
                className="w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-primary/20 transition-all duration-300"
                asChild 
                onClick={handleJoinTribes}
              >
                <Link to="/auth">Join Tribes</Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-secondary/20 transition-all duration-300"
                asChild
                onClick={handleExploreCommunities}
              >
                <Link to="/tribes">Explore Communities</Link>
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Lock />}
              title="Private Communities"
              description="Create walled gardens for your most trusted connections"
              delay={0.3}
              direction="left"
            />
            <FeatureCard
              icon={<Users />}
              title="Invite-Only"
              description="Control who joins and maintains your community's integrity"
              delay={0.4}
            />
            <FeatureCard
              icon={<MessageCircle />}
              title="Secure Messaging"
              description="Communicate privately within your Tribes and Clans"
              delay={0.5}
              direction="right"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
