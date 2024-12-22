import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '@/components/seo/SEO';
import TribeTemplate from '@/components/Layouts/TribeTemplate';
import { useTribeStore } from '@/stores/tribeStore';

const DynamicTribePage: React.FC = () => {
  const { tribeId } = useParams<{ tribeId: string }>();
  const { getTribeById } = useTribeStore();
  
  if (!tribeId) {
    return <Navigate to="/tribes" replace />;
  }

  const tribe = getTribeById(tribeId);
  
  if (!tribe) {
    return <Navigate to="/tribes" replace />;
  }

  return (
    <>
      <SEO
        title={`Tribe Details - ${tribeId}`}
        description="Explore the details of this exclusive tribe. Connect with members, participate in discussions, and engage in a private, focused community."
        keywords="tribe details, private community, member interaction, exclusive group, community engagement"
      />
      
      <TribeTemplate {...tribe}>
        <div className="space-y-6">
          <section 
            className="feature-card relative overflow-hidden rounded-2xl 
                       bg-gradient-to-b from-background/80 to-background/40 
                       p-8 backdrop-blur-sm border border-border/50 
                       shadow-2xl transition-all duration-300 
                       hover:shadow-primary/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gradient mb-4">
                About {tribe.name}
              </h2>
              <p className="text-muted-foreground text-balance">
                {tribe.description}
              </p>
            </div>
          </section>

          <section 
            className="feature-card relative overflow-hidden rounded-2xl 
                       bg-gradient-to-b from-background/80 to-background/40 
                       p-8 backdrop-blur-sm border border-border/50 
                       shadow-2xl transition-all duration-300 
                       hover:shadow-primary/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gradient mb-4">
                Recent Activity
              </h2>
              <p className="text-muted-foreground">
                No recent activity yet. Be the first to start a discussion!
              </p>
            </div>
          </section>
        </div>
      </TribeTemplate>
    </>
  );
};

export default DynamicTribePage;
