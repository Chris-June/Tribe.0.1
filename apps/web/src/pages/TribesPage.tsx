import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlusCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateTribeModal from '@/components/ui/modals/CreateTribeModal';
import { useTribeStore } from '@/stores/tribeStore';
import { SEO } from '@/components/seo/SEO';

interface Tribe {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags?: string[];
}

const TribesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tribes, addTribe } = useTribeStore();

  const handleCreateTribe = (newTribe: { name: string; description: string; tags: string[] }) => {
    addTribe({
      ...newTribe,
      isPrivate: false,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <SEO
        title="Discover Tribes - Join Exclusive Communities"
        description="Browse and join a variety of private, invite-only tribes. Find communities that match your interests, passions, and professional goals."
        keywords="tribe discovery, private communities, interest groups, professional networks, exclusive social platforms"
      />
      
      <Helmet>
        <title>Tribes - Discover Communities</title>
        <meta name="description" content="Explore and create private, invite-only communities" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-5xl font-heading text-gradient mb-4">
            Your Tribes
          </h1>
          <p className="text-muted-foreground text-xl text-balance">
            Discover, join, and create communities that inspire and empower you.
          </p>
        </header>
        
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tribes.map((tribe: Tribe) => (
            <div 
              key={tribe.id} 
              className="feature-card relative overflow-hidden rounded-2xl 
                         bg-gradient-to-b from-background/80 to-background/40 
                         p-8 backdrop-blur-sm border border-border/50 
                         shadow-2xl transition-all duration-300 
                         hover:shadow-primary/5 
                         hover:-translate-y-1 
                         group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {tribe.name}
                  </h3>
                  <Users className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <p className="text-muted-foreground mb-4 text-balance">
                  {tribe.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tribe.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 
                                   bg-primary/10 
                                   text-primary 
                                   rounded-full 
                                   text-xs 
                                   transition-colors 
                                   hover:bg-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tribe.memberCount} members</span>
                  </div>
                </div>
                
                <Link 
                  to={`/tribes/${tribe.id}`} 
                  className="btn-primary w-full 
                             transition-all duration-300 
                             shadow-lg hover:shadow-primary/20 
                             group-hover:translate-y-[-2px]"
                >
                  View Tribe
                </Link>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="feature-card relative overflow-hidden rounded-2xl 
                       bg-gradient-to-b from-background/80 to-background/40 
                       p-8 backdrop-blur-sm border border-border/50 
                       shadow-2xl transition-all duration-300 
                       hover:shadow-primary/5 
                       hover:-translate-y-1 
                       flex items-center justify-center 
                       hover:bg-primary/10 
                       group cursor-pointer
                       aspect-[3/4]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
            
            <div className="relative z-10 text-center">
              <PlusCircle 
                className="mx-auto mb-4 w-12 h-12 
                           text-primary group-hover:scale-110 
                           transition-transform"
              />
              <h4 className="text-xl font-semibold 
                             text-muted-foreground 
                             group-hover:text-primary 
                             transition-colors">
                Create New Tribe
              </h4>
            </div>
          </button>
        </section>

        <CreateTribeModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTribe={handleCreateTribe}
        />
      </div>
    </>
  );
};

export default TribesPage;
