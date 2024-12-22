import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO } from '@/components/seo/SEO';
import { 
  Edit, 
  Camera, 
  Users, 
  Globe, 
  Mail, 
  Linkedin, 
  Twitter, 
  Instagram,
  Github,
  Settings, 
  Award, 
  Zap, 
  BookOpen, 
  MessageCircle,
  PlusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Shadcn UI Components
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/common/card";
import { Button } from '@/components/ui/common/Button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/common/dialog";
import { Input } from "@/components/ui/common/input";
import { Label } from "@/components/ui/common/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/common/tabs";
import { Badge } from "@/components/ui/common/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { Separator } from "@/components/ui/common/separator";
import { ScrollArea } from "@/components/ui/common/scroll-area";

import { useBreadcrumb } from '@/components/ui/common/AdvancedBreadcrumbs';
import { AnimatedSection } from '@/components/ui/common/AnimatedSection';
import { toast } from "sonner";
import { useTribeStore, type Tribe } from '@/stores/tribeStore';
import { useNavigate } from 'react-router-dom';

// Enhanced User Profile Interface
interface UserProfile {
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
  tribes: Array<{
    id: string;
    name: string;
    role: string;
    joinedDate: string;
    description: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    date: string;
  }>;
  skills: string[];
}

const ProfilePage: React.FC = () => {
  const { addCustomBreadcrumb, removeCustomBreadcrumb } = useBreadcrumb();
  const { tribes: userTribes } = useTribeStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [profile, setProfile] = useState<UserProfile>({
    username: 'chrisjune',
    displayName: 'Chris June',
    email: 'chris.june@intellisync.ca',
    avatar: 'https://i.pravatar.cc/300?u=chrisjune',
    bio: 'Passionate technologist and community builder. Creating meaningful connections one tribe at a time.',
    location: 'Chatham-Kent, ON, Canada',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe'
    },
    tribes: userTribes.map(tribe => ({
      id: tribe.id,
      name: tribe.name,
      role: tribe.members.find(m => m.username === 'chrisjune')?.role || 'Member',
      joinedDate: 'Jan 2023', // This should come from your backend in a real app
      description: tribe.description
    })),
    achievements: [
      {
        title: 'Community Leader',
        description: 'Founded and grew a thriving tech community',
        icon: <Zap size={24} />,
        date: '2022'
      },
      {
        title: 'Open Source Contributor',
        description: 'Multiple contributions to major open-source projects',
        icon: <BookOpen size={24} />,
        date: '2023'
      }
    ],
    skills: [
      'React', 'TypeScript', 'Product Management', 
      'Community Building', 'Public Speaking'
    ]
  });

  React.useEffect(() => {
    addCustomBreadcrumb({
      label: profile.displayName,
      path: `/profile/${profile.username}`,
      icon: <Users size={16} />
    });

    return () => removeCustomBreadcrumb(profile.displayName);
  }, [profile.displayName, profile.username]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile Updated', {
      description: 'Your profile has been successfully updated.'
    });
  };

  const renderSocialLinks = () => (
    <div className="flex space-x-4 mt-4 justify-center">
      {profile.socialLinks.linkedin && (
        <a 
          href={profile.socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Linkedin className="text-blue-600" />
        </a>
      )}
      {profile.socialLinks.twitter && (
        <a 
          href={profile.socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Twitter className="text-blue-400" />
        </a>
      )}
      {profile.socialLinks.github && (
        <a 
          href={profile.socialLinks.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <Github className="text-gray-800 dark:text-gray-200" />
        </a>
      )}
    </div>
  );

  const renderProfileContent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div 
          className="feature-card relative overflow-hidden rounded-2xl 
                     bg-gradient-to-b from-background/80 to-background/40 
                     p-8 backdrop-blur-sm border border-border/50 
                     shadow-2xl transition-all duration-300 
                     hover:shadow-primary/5 
                     hover:-translate-y-1 
                     col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
          <div className="relative z-10 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <button 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground 
                           rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {profile.displayName}
            </h2>
            <p className="text-muted-foreground mb-4">
              @{profile.username}
            </p>
            
            <p className="text-muted-foreground text-balance mb-4">
              {profile.bio}
            </p>
            
            {renderSocialLinks()}
            
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-primary 
                           flex items-center 
                           shadow-lg hover:shadow-primary/20 
                           transition-all duration-300"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </button>
              <button 
                className="btn-secondary 
                           flex items-center 
                           shadow-lg hover:shadow-secondary/20 
                           transition-all duration-300"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </button>
            </div>
          </div>
        </div>

        {/* Skills and Achievements */}
        <div 
          className="feature-card relative overflow-hidden rounded-2xl 
                     bg-gradient-to-b from-background/80 to-background/40 
                     p-8 backdrop-blur-sm border border-border/50 
                     shadow-2xl transition-all duration-300 
                     hover:shadow-primary/5 
                     hover:-translate-y-1 
                     col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gradient mb-6 text-center">
              Skills & Achievements
            </h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 text-muted-foreground">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 
                               bg-primary/10 
                               text-primary 
                               rounded-full 
                               text-sm 
                               transition-colors 
                               hover:bg-primary/20
                               group"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          skills: prev.skills.filter(s => s !== skill)
                        }));
                        toast.success('Skill removed');
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button 
                  onClick={() => setIsSkillDialogOpen(true)}
                  className="px-3 py-1 
                             bg-primary/10 
                             text-primary 
                             rounded-full 
                             text-sm 
                             flex items-center 
                             hover:bg-primary/20 
                             transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-muted-foreground">
                Achievements
              </h4>
              <div className="space-y-4">
                {profile.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between
                               bg-background/50 
                               p-4 
                               rounded-lg 
                               shadow-sm 
                               hover:bg-background/70 
                               transition-colors
                               group"
                  >
                    <div className="flex items-center flex-1">
                      <div className="mr-4 text-primary">
                        {achievement.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">
                          {achievement.title}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          {achievement.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {achievement.date}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          achievements: prev.achievements.filter((_, i) => i !== index)
                        }));
                        toast.success('Achievement removed');
                      }}
                      className="ml-4 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setIsAchievementDialogOpen(true)}
                  className="w-full 
                             flex items-center 
                             justify-center 
                             p-4 
                             bg-primary/10 
                             text-primary 
                             rounded-lg 
                             hover:bg-primary/20 
                             transition-colors 
                             group"
                >
                  <PlusCircle className="mr-2" /> Add Achievement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tribes */}
        <div 
          className="feature-card relative overflow-hidden rounded-2xl 
                     bg-gradient-to-b from-background/80 to-background/40 
                     p-8 backdrop-blur-sm border border-border/50 
                     shadow-2xl transition-all duration-300 
                     hover:shadow-primary/5 
                     hover:-translate-y-1 
                     col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gradient mb-6 text-center">
              My Tribes
            </h3>
            
            <div className="space-y-4">
              {profile.tribes.map(tribe => (
                <div 
                  key={tribe.id} 
                  className="bg-background/50 
                             p-4 
                             rounded-lg 
                             shadow-sm 
                             hover:bg-background/70 
                             transition-colors 
                             group 
                             cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tribe.name}
                    </h4>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                      {tribe.role}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm text-balance mb-2">
                    {tribe.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Joined {tribe.joinedDate}
                    </span>
                    <button 
                      className="text-sm text-primary hover:underline transition-colors"
                      onClick={() => navigate(`/tribes/${tribe.id}`)}
                    >
                      View Tribe
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                className="w-full 
                           flex items-center 
                           justify-center 
                           p-4 
                           bg-primary/10 
                           text-primary 
                           rounded-lg 
                           hover:bg-primary/20 
                           transition-colors 
                           group"
              >
                <PlusCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Join New Tribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleProfileUpdate}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Display Name
              </Label>
              <Input 
                id="displayName" 
                value={profile.displayName} 
                onChange={(e) => setProfile({...profile, displayName: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input 
                id="bio" 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  {/* Add Skill Dialog */}
  <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogDescription>
          Add a new skill to your profile
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (newSkill.trim()) {
          setProfile(prev => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()]
          }));
          setNewSkill('');
          setIsSkillDialogOpen(false);
          toast.success('Skill added');
        }
      }}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="skill">Skill</Label>
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add Skill</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  {/* Add Achievement Dialog */}
  <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Achievement</DialogTitle>
        <DialogDescription>
          Add a new achievement to your profile
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (newAchievement.title.trim() && newAchievement.description.trim()) {
          setProfile(prev => ({
            ...prev,
            achievements: [...prev.achievements, {
              ...newAchievement,
              icon: <Award size={24} />
            }]
          }));
          setNewAchievement({ title: '', description: '', date: '' });
          setIsAchievementDialogOpen(false);
          toast.success('Achievement added');
        }
      }}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter achievement title..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter achievement description..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={newAchievement.date}
              onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
              placeholder="Enter achievement date..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add Achievement</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  return (
    <>
      <SEO
        title="Your Profile - Tribes"
        description="Manage your personal profile, showcase your skills, achievements, and connect with exclusive communities on Tribes."
        keywords="user profile, personal branding, skills showcase, achievements, professional networking"
      />
      <Helmet>
        <title>{profile.displayName} - Profile</title>
        <meta name="description" content={`Profile of ${profile.displayName}`} />
      </Helmet>
      
      {renderProfileContent()}
      {renderProfileEdit()}
    </>
  );
};

export default ProfilePage;
