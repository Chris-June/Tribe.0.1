import React from 'react';
import TribeTemplate, { TribeMember, TribeChannel } from '@/components/Layouts/TribeTemplate';

const CreativeWritersTribePage: React.FC = () => {
  const tribeDetails = {
    id: 'creative-writers',
    name: 'Creative Writers',
    description: 'A collaborative community for sharing, critiquing, and inspiring creative writing',
    coverImage: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1436&q=80',
    memberCount: 27,
    isPrivate: false,
    tags: ['Writing', 'Creativity', 'Poetry', 'Fiction', 'Storytelling'],
    members: [
      {
        id: '1',
        username: 'sarahjones',
        displayName: 'Sarah Jones',
        avatar: 'https://i.pravatar.cc/150?u=sarahjones',
        role: 'Admin'
      },
      {
        id: '2',
        username: 'michaelchen',
        displayName: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?u=michaelchen',
        role: 'Moderator'
      },
      {
        id: '3',
        username: 'emilywrites',
        displayName: 'Emily Rodriguez',
        avatar: 'https://i.pravatar.cc/150?u=emilywrites',
        role: 'Member'
      }
    ] as TribeMember[],
    channels: [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'Main channel for all writing discussions',
        isPrivate: false
      },
      {
        id: 'poetry',
        name: 'Poetry Corner',
        description: 'Share and critique poetry',
        isPrivate: false
      },
      {
        id: 'novel-workshop',
        name: 'Novel Workshop',
        description: 'Collaborative space for novel writing',
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
              About Creative Writers
            </h2>
            <p className="text-muted-foreground text-balance">
              Creative Writers is a vibrant community dedicated to the art of storytelling. 
              We provide a supportive environment for writers of all levels to share their 
              work, receive constructive feedback, and grow their creative skills.
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
              Recent Writing Prompts
            </h2>
            <div className="space-y-4">
              <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Unexpected Journey
                </h3>
                <p className="text-muted-foreground text-sm">
                  Write a short story about a character who takes an unexpected journey.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg hover:bg-background/70 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Dialogue Challenge
                </h3>
                <p className="text-muted-foreground text-sm">
                  Create a compelling dialogue that reveals character without exposition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TribeTemplate>
  );
};

export default CreativeWritersTribePage;
