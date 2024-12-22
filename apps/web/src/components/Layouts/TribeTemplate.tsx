import React, { useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  MessageCircle, 
  Settings, 
  PlusCircle, 
  Globe, 
  Lock, 
  Bell,
  Hash,
  BookOpen,
  Calendar,
  Activity,
  FileText,
  File,
  Image,
  Video,
  X, 
  Upload,
  Heart 
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { Button } from '@/components/ui/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/common/tabs';
import { useBreadcrumb } from '@/components/ui/common/AdvancedBreadcrumbs';
import { useDiscussionStore } from '../../stores/discussionStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/common/dialog";
import { Label } from "@/components/ui/common/label";
import { Input } from "@/components/ui/common/input";
import { Textarea } from "@/components/ui/common/textarea";
import { ScrollArea } from "@/components/ui/common/scroll-area";
import { format, formatDistanceToNow } from 'date-fns';
import ManageTribeModal from '@/components/ui/modals/ManageTribeModal';

// Types for Tribe and related entities
export interface TribeMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: 'Admin' | 'Moderator' | 'Member';
}

export interface TribeChannel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface TribeProps {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  memberCount: number;
  members: TribeMember[];
  channels: TribeChannel[];
  isPrivate: boolean;
  tags: string[];
  children: ReactNode;
}

interface ActivityItem {
  id: string;
  type: 'discussion' | 'comment';
  content: string;
  title?: string;
  discussionId?: string;
  discussionTitle?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  mediaAttachments?: any[];
  likes?: number;
  commentCount?: number;
}

const styles = `
  .highlight-animation {
    animation: highlight 2s ease-in-out;
  }

  @keyframes highlight {
    0% {
      background-color: hsl(var(--primary) / 0.1);
    }
    100% {
      background-color: transparent;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const TribeTemplate: React.FC<TribeProps> = ({
  id,
  name,
  description,
  coverImage,
  memberCount,
  members,
  channels,
  isPrivate,
  tags,
  children
}) => {
  const { addCustomBreadcrumb, removeCustomBreadcrumb } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    mediaAttachments: [] as File[]
  });
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  const { discussions, addDiscussion, getDiscussionsByTribeId } = useDiscussionStore();
  const { likeDiscussion, likeComment } = useDiscussionStore();
  const tribeDiscussions = getDiscussionsByTribeId(id);
  const { notifications, markAsRead, markAllAsRead, getNotificationsByTribe } = useNotificationStore();
  const tribeNotifications = getNotificationsByTribe(id);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'video/mp4', 
        'video/quicktime', 
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const validFiles = Array.from(files).filter(file => {
        return file.size <= maxSize && allowedTypes.includes(file.type);
      });

      setNewDiscussion(prev => ({
        ...prev,
        mediaAttachments: [...prev.mediaAttachments, ...validFiles]
      }));
    }
  };

  const removeMediaAttachment = (index: number) => {
    setNewDiscussion(prev => ({
      ...prev,
      mediaAttachments: prev.mediaAttachments.filter((_, i) => i !== index)
    }));
  };

  const getMediaIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={16} />;
    if (file.type.startsWith('video/')) return <Video size={16} />;
    return <File size={16} />;
  };

  const renderMediaPreview = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      {newDiscussion.mediaAttachments.map((file, index) => (
        <div 
          key={index} 
          className="relative w-20 h-20 rounded-lg overflow-hidden group"
        >
          {file.type.startsWith('image/') ? (
            <img 
              src={URL.createObjectURL(file)} 
              alt={file.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              {getMediaIcon(file)}
            </div>
          )}
          <button
            onClick={() => removeMediaAttachment(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );

  const handleSubmitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDiscussion.title.trim() && newDiscussion.content.trim()) {
      // Create discussion first
      addDiscussion({
        title: newDiscussion.title,
        content: newDiscussion.content,
        authorId: 'current-user-id', // This should come from auth
        authorName: 'Chris June', // This should come from auth
        authorAvatar: 'https://i.pravatar.cc/300?u=chrisjune',
        tribeId: id,
        tags: newDiscussion.tags
      });

      // Upload media if exists
      if (newDiscussion.mediaAttachments.length > 0) {
        const mediaPromises = newDiscussion.mediaAttachments.map(async (file) => {
          // In a real app, this would be an actual file upload to a storage service
          const mediaAttachment = {
            id: crypto.randomUUID(),
            type: file.type.startsWith('image/') ? 'image' 
                 : file.type.startsWith('video/') ? 'video' 
                 : 'document',
            url: URL.createObjectURL(file), // Temporary URL
            name: file.name,
            size: file.size,
            mimeType: file.type
          };
          return mediaAttachment;
        });

        Promise.all(mediaPromises).then((mediaAttachments) => {
          // Add media to the discussion
          // In a real app, this would involve backend upload and URL generation
          // useDiscussionStore().addMediaToDiscussion(newDiscussionId, mediaAttachments);
        });
      }

      // Reset form
      setNewDiscussion({ title: '', content: '', tags: [], mediaAttachments: [] });
      setIsNewDiscussionOpen(false);
      // toast.success('Discussion created successfully');
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark the notification as read
    markAsRead(notification.id);

    // Navigate to the appropriate tab and content based on notification type
    switch (notification.sourceType) {
      case 'discussion':
        setActiveTab('discussions');
        setSelectedDiscussionId(notification.sourceId);
        // Scroll to discussion after tab change
        setTimeout(() => {
          const element = document.getElementById(`discussion-${notification.sourceId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.classList.add('highlight-animation');
            setTimeout(() => element.classList.remove('highlight-animation'), 2000);
          }
        }, 100);
        break;
      case 'comment':
        setActiveTab('discussions');
        const discussion = discussions.find(d => 
          d.comments.some(c => c.id === notification.sourceId)
        );
        if (discussion) {
          setSelectedDiscussionId(discussion.id);
          // Scroll to comment after tab change
          setTimeout(() => {
            const element = document.getElementById(`comment-${notification.sourceId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.classList.add('highlight-animation');
              setTimeout(() => element.classList.remove('highlight-animation'), 2000);
            }
          }, 100);
        }
        break;
      case 'message':
        // Handle direct message navigation (will be implemented with DM feature)
        break;
      case 'event':
        setActiveTab('events');
        // Handle event navigation (will be implemented with Events feature)
        break;
    }
  };

  React.useEffect(() => {
    addCustomBreadcrumb({
      label: name,
      path: `/tribes/${id}`,
      icon: <Users size={16} />
    });

    return () => removeCustomBreadcrumb(name);
  }, [name, id]);

  const renderHeader = () => (
    <header 
      className="feature-card relative overflow-hidden rounded-2xl 
                 bg-gradient-to-b from-background/80 to-background/40 
                 p-8 backdrop-blur-sm border border-border/50 
                 shadow-2xl transition-all duration-300 
                 hover:shadow-primary/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative flex-shrink-0">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage 
              src={coverImage || `https://via.placeholder.com/150?text=${name.charAt(0)}`} 
              alt={name} 
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {isPrivate && (
            <Lock 
              className="absolute bottom-0 right-0 
                         bg-primary text-primary-foreground 
                         rounded-full p-1 w-6 h-6 
                         shadow-md" 
            />
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h1 className="text-3xl font-bold text-foreground mb-2 break-words">
            {name}
          </h1>
          <p className="text-muted-foreground text-balance mb-4">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{memberCount} members</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 
                             bg-primary/10 
                             text-primary 
                             rounded-full 
                             text-xs 
                             transition-colors 
                             hover:bg-primary/20
                             whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0 md:ml-auto">
          <Button
            onClick={() => setIsManageModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage
          </Button>
          <Button 
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Invite</span>
          </Button>
        </div>
      </div>
    </header>
  );

  const getActivityFeed = () => {
    const activities: ActivityItem[] = [];
    
    // Add discussions to activities
    tribeDiscussions.forEach(discussion => {
      activities.push({
        id: discussion.id,
        type: 'discussion',
        content: discussion.content,
        title: discussion.title,
        author: {
          id: discussion.authorId,
          name: discussion.authorName,
          avatar: discussion.authorAvatar
        },
        timestamp: discussion.createdAt,
        mediaAttachments: discussion.mediaAttachments,
        likes: discussion.likes,
        commentCount: discussion.comments.length
      });

      // Add comments to activities
      discussion.comments.forEach(comment => {
        activities.push({
          id: comment.id,
          type: 'comment',
          content: comment.content,
          discussionId: discussion.id,
          discussionTitle: discussion.title,
          author: {
            id: comment.authorId,
            name: comment.authorName,
            avatar: comment.authorAvatar
          },
          timestamp: comment.createdAt,
          likes: comment.likes
        });
      });
    });

    // Sort activities by timestamp, most recent first
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const renderActivityItem = (activity: ActivityItem) => {
    const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

    return (
      <div
        key={activity.id}
        className="p-4 rounded-lg bg-background/80 border border-border/50 hover:border-primary/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <img
            src={activity.author.avatar}
            alt={activity.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.author.name}</span>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
              {activity.type === 'comment' && (
                <>
                  <span className="text-muted-foreground">commented on</span>
                  <button 
                    onClick={() => {
                      setActiveTab('discussions');
                      setSelectedDiscussionId(activity.discussionId || null);
                      const element = document.getElementById(`discussion-${activity.discussionId}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {activity.discussionTitle}
                  </button>
                </>
              )}
            </div>

            {activity.type === 'discussion' && (
              <h4 className="font-medium mt-1">{activity.title}</h4>
            )}

            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {activity.content}
            </p>

            {activity.type === 'discussion' && activity.mediaAttachments && activity.mediaAttachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activity.mediaAttachments.map((media: any, index: number) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    {media.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(media)}
                        alt="Attachment"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-background/50 rounded-lg">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-3">
              <button
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  if (activity.type === 'discussion') {
                    likeDiscussion(activity.id);
                  } else if (activity.discussionId) {
                    likeComment(activity.discussionId, activity.id);
                  }
                }}
              >
                <Heart className={`w-4 h-4 ${(activity.likes ?? 0) > 0 ? 'fill-primary text-primary' : ''}`} />
                {(activity.likes ?? 0) > 0 && <span>{activity.likes}</span>}
              </button>
              
              {activity.type === 'discussion' && (
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => {
                    setActiveTab('discussions');
                    setSelectedDiscussionId(activity.id);
                    const element = document.getElementById(`discussion-${activity.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  {activity.commentCount && activity.commentCount > 0 && <span>{activity.commentCount}</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <div className="mt-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-8 bg-background/50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageCircle size={16} />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar size={16} />
            Events
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => setActiveTab('discussions')}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {getActivityFeed().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No activity yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setActiveTab('discussions')}
                    >
                      Start a Discussion
                    </Button>
                  </div>
                ) : (
                  getActivityFeed().slice(0, 10).map(activity => renderActivityItem(activity))
                )}
              </div>
            </div>

            {/* Tribe Info */}
            <div className="space-y-6">
              {/* Members */}
              <div className="feature-card p-6 rounded-lg bg-background/50 border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Members</h3>
                <div className="space-y-4">
                  {members.slice(0, 5).map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{member.displayName}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {members.length > 5 && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => setActiveTab('members')}
                    >
                      View All Members ({members.length})
                    </Button>
                  )}
                </div>
              </div>

              {/* Channels */}
              <div className="feature-card p-6 rounded-lg bg-background/50 border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Channels</h3>
                <div className="space-y-2">
                  {channels.map(channel => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-background/80 transition-colors cursor-pointer"
                    >
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <span>{channel.name}</span>
                      {channel.isPrivate && (
                        <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <div className="feature-card p-6 rounded-lg bg-background/50 border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Discussions</h3>
              <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle size={16} /> New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>
                    <DialogDescription>
                      Start a new discussion in {name}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitDiscussion}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newDiscussion.title}
                          onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Discussion title..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newDiscussion.content}
                          onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="What would you like to discuss?"
                          className="h-32"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tags">Tags (optional)</Label>
                        <Input
                          id="tags"
                          placeholder="Add tags separated by commas"
                          onChange={(e) => setNewDiscussion(prev => ({
                            ...prev,
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                          }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Media Attachments</Label>
                        <div 
                          className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center 
                                   hover:border-primary/50 transition-colors group"
                        >
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="media-upload"
                          />
                          <label 
                            htmlFor="media-upload" 
                            className="cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Upload className="group-hover:text-primary transition-colors" />
                            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                              Upload Images, Videos, or Documents
                            </span>
                          </label>
                        </div>
                        {renderMediaPreview()}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Discussion</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {tribeDiscussions.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    No discussions yet. Start a new one!
                  </p>
                ) : (
                  tribeDiscussions.map(discussion => (
                    <div
                      key={discussion.id}
                      id={`discussion-${discussion.id}`}
                      className="p-4 rounded-lg bg-background/80 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={discussion.authorAvatar} alt={discussion.authorName} />
                            <AvatarFallback>{discussion.authorName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {discussion.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">
                                {discussion.authorName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageCircle size={14} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {discussion.comments.length}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle like
                            }}
                          >
                            <Heart size={14} className={discussion.likes > 0 ? 'text-red-500' : 'text-muted-foreground'} />
                            <span className="text-sm">{discussion.likes}</span>
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {discussion.content}
                      </p>
                      {discussion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {discussion.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-6 space-y-4">
                        {discussion.comments.map((comment) => (
                          <div
                            key={comment.id}
                            id={`comment-${comment.id}`}
                            className="flex items-start gap-4"
                          >
                            {/* ... comment content ... */}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="feature-card p-6 rounded-lg bg-background/50 border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Events</h3>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} /> Create Event
              </Button>
            </div>
            <div className="space-y-4">
              {/* Placeholder for events list */}
              <p className="text-muted-foreground text-sm">No upcoming events. Create one!</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {tribeNotifications.some(n => !n.read) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead(id)}
                className="text-sm"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {tribeNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              tribeNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    flex items-start gap-4 p-4 rounded-lg transition-colors duration-200 cursor-pointer
                    ${notification.read ? 'bg-background/50' : 'bg-primary/5 hover:bg-primary/10'}
                  `}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img
                    src={notification.sender.avatar}
                    alt={notification.sender.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {notification.sender.displayName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </span>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <h4 className="font-medium text-sm mt-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {notification.type === 'mention' && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Mention
                        </span>
                      )}
                      {notification.type === 'discussion' && (
                        <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                          Discussion
                        </span>
                      )}
                      {notification.type === 'message' && (
                        <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                          Message
                        </span>
                      )}
                      {notification.type === 'event' && (
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                          Event
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{name} | Tribes</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        {renderHeader()}
        {renderContent()}
        <ManageTribeModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          tribeId={id}
          tribeName={name}
          description={description}
          coverImage={coverImage}
          isPrivate={isPrivate}
          tags={tags}
          members={members}
          channels={channels}
        />
      </div>
    </>
  );
};

export default TribeTemplate;