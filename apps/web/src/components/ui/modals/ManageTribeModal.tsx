import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/common/dialog';
import { Button } from '@/components/ui/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/common/tabs';
import {
  Settings,
  Users,
  MessageSquare,
  Shield,
  Bell,
  Sliders,
  X,
  ImagePlus,
  Globe,
  Lock,
  Hash,
  UserPlus,
  UserMinus,
  AlertTriangle,
  MessageCircle,
  Megaphone,
  Paintbrush,
} from 'lucide-react';
import { useTribeStore } from '@/stores/tribeStore';
import { toast } from 'sonner';

interface ManageTribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tribeId: string;
  tribeName: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
  tags: string[];
  members: Array<{
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    role: 'Admin' | 'Moderator' | 'Member';
  }>;
  channels: Array<{
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
  }>;
}

const ManageTribeModal: React.FC<ManageTribeModalProps> = ({
  isOpen,
  onClose,
  tribeId,
  tribeName,
  description,
  coverImage,
  isPrivate,
  tags,
  members,
  channels,
}) => {
  const [formData, setFormData] = useState({
    name: tribeName,
    description: description,
    tags: tags.join(', '),
    isPrivate: isPrivate,
  });
  const [activeTab, setActiveTab] = useState('general');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const {
    updateTribeSettings,
    updateMemberRole,
    removeMember,
    addMember,
    addChannel,
    updateChannel,
    removeChannel,
  } = useTribeStore();

  const handleSaveChanges = () => {
    // Update general settings
    updateTribeSettings(tribeId, {
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPrivate: formData.isPrivate,
    });

    toast.success('Tribe settings updated successfully');
    onClose();
  };

  const handleRoleChange = (memberId: string, newRole: 'Admin' | 'Moderator' | 'Member') => {
    updateMemberRole(tribeId, memberId, newRole);
    toast.success('Member role updated');
  };

  const handleRemoveMembers = () => {
    selectedMembers.forEach(memberId => {
      removeMember(tribeId, memberId);
    });
    setSelectedMembers([]);
    toast.success('Selected members removed');
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('channelName') as HTMLInputElement;
    const descInput = form.elements.namedItem('channelDescription') as HTMLInputElement;
    const isPrivateInput = form.elements.namedItem('channelPrivate') as HTMLInputElement;

    addChannel(tribeId, {
      name: nameInput.value,
      description: descInput.value,
      isPrivate: isPrivateInput.checked,
    });

    form.reset();
    toast.success('Channel created successfully');
  };

  const handleUpdateChannel = (channelId: string, updates: Partial<{ name: string; description: string; isPrivate: boolean }>) => {
    updateChannel(tribeId, channelId, updates);
    toast.success('Channel updated successfully');
  };

  const handleDeleteChannel = (channelId: string) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      removeChannel(tribeId, channelId);
      toast.success('Channel deleted successfully');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="feature-card fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
                   bg-gradient-to-b from-background/90 to-background/70 
                   backdrop-blur-xl border border-border/50 
                   shadow-2xl transition-all duration-300 
                   hover:shadow-primary/10 
                   sm:max-w-[800px]
                   w-[90vw]
                   max-h-[90vh]
                   rounded-3xl
                   p-8
                   overflow-y-auto"
      >
        <DialogHeader className="flex-shrink-0 mb-6">
          <DialogTitle className="text-3xl font-bold text-gradient tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Manage Tribe
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Configure and customize your tribe settings
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-8 bg-background/50 p-1 rounded-lg">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="space-y-2">
                <label htmlFor="tribeName" className="block text-sm font-medium text-muted-foreground">
                  Tribe Name
                </label>
                <input
                  type="text"
                  id="tribeName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-base w-full min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={coverImage || '/placeholder-cover.jpg'}
                    alt="Tribe cover"
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Change Cover
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Privacy
                </label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={!formData.isPrivate ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, isPrivate: false })}
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Public
                  </Button>
                  <Button
                    type="button"
                    variant={formData.isPrivate ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, isPrivate: true })}
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Private
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-medium text-muted-foreground">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-base w-full"
                  placeholder="Separate tags with commas"
                />
              </div>
            </div>
          </TabsContent>

          {/* Member Management */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Members ({members.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Members
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleRemoveMembers}>
                  <UserMinus className="w-4 h-4" />
                  Remove Members
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member.id]);
                        } else {
                          setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <img src={member.avatar} alt={member.displayName} className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-medium">{member.displayName}</h4>
                      <p className="text-sm text-muted-foreground">@{member.username}</p>
                    </div>
                  </div>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as 'Admin' | 'Moderator' | 'Member')}
                    className="input-base bg-background/50"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Channel Management */}
          <TabsContent value="channels" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Channels ({channels.length})</h3>
              <Button variant="outline" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                New Channel
              </Button>
            </div>
            <div className="space-y-4">
              {channels.map(channel => (
                <div key={channel.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleUpdateChannel(channel.id, { name: 'New Channel Name' })}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteChannel(channel.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Content Moderation */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Content Guidelines</h3>
                  <p className="text-sm text-muted-foreground">Set rules and guidelines for your tribe</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  View Reports
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Post Approval</h4>
                      <p className="text-sm text-muted-foreground">Require approval for new posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Content Filters</h4>
                      <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure how members receive updates</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Send Announcement
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Welcome Message</h4>
                    <p className="text-sm text-muted-foreground">Message sent to new members</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Notification Preferences</h4>
                    <p className="text-sm text-muted-foreground">Default notification settings</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Advanced Settings</h3>
                  <p className="text-sm text-muted-foreground">Additional configuration options</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Paintbrush className="w-4 h-4" />
                  Customize
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Custom Branding</h4>
                    <p className="text-sm text-muted-foreground">Customize tribe appearance</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Export</h4>
                    <p className="text-sm text-muted-foreground">Export tribe data and settings</p>
                  </div>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageTribeModal;
