import React from 'react';
import TribeTemplate, { TribeMember, TribeChannel } from '@/components/Layouts/TribeTemplate';

const TechInnovatorsTribePage: React.FC = () => {
  const tribeDetails = {
    id: 'tech-innovators',
    name: 'Tech Innovators',
    description: 'A community for cutting-edge technology enthusiasts pushing the boundaries of innovation',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    memberCount: 42,
    isPrivate: true,
    tags: ['Technology', 'Innovation', 'Startups', 'AI', 'Software Development'],
    members: [
      {
        id: '1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?u=johndoe',
        role: 'Admin'
      },
      {
        id: '2',
        username: 'janedoe',
        displayName: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?u=janedoe',
        role: 'Moderator'
      },
      {
        id: '3',
        username: 'alexsmith',
        displayName: 'Alex Smith',
        avatar: 'https://i.pravatar.cc/150?u=alexsmith',
        role: 'Member'
      }
    ] as TribeMember[],
    channels: [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'Main channel for all tech discussions',
        isPrivate: false
      },
      {
        id: 'ai-ml',
        name: 'AI & Machine Learning',
        description: 'Deep dive into AI and machine learning technologies',
        isPrivate: false
      },
      {
        id: 'startup-ideas',
        name: 'Startup Ideas',
        description: 'Share and discuss innovative startup concepts',
        isPrivate: true
      }
    ] as TribeChannel[]
  };

  return (
    <TribeTemplate {...tribeDetails}>
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
              About Tech Innovators
            </h2>
            <p className="text-muted-foreground text-balance">
              Tech Innovators is a vibrant community of forward-thinking technologists 
              who are passionate about exploring and creating cutting-edge technologies. 
              Our mission is to foster innovation, share knowledge, and collaborate on 
              groundbreaking projects that push the boundaries of what's possible.
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
              Recent Discussions
            </h2>
            <div className="space-y-4">
              <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Latest AI Breakthroughs
                </h3>
                <p className="text-muted-foreground text-sm">
                  Discussing recent advancements in generative AI and their potential impacts.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Startup Funding Trends
                </h3>
                <p className="text-muted-foreground text-sm">
                  Exploring current investment landscapes in tech startups.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TribeTemplate>
  );
};

export default TechInnovatorsTribePage;
