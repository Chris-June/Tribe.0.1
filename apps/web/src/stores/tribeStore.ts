import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface Tribe {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  memberCount: number;
  members: TribeMember[];
  channels: TribeChannel[];
  isPrivate: boolean;
  tags: string[];
}

interface TribeStore {
  tribes: Tribe[];
  addTribe: (tribe: Omit<Tribe, 'id' | 'memberCount' | 'members' | 'channels'>) => void;
  getTribeById: (id: string) => Tribe | undefined;
  updateTribeSettings: (id: string, settings: Partial<Omit<Tribe, 'id' | 'members' | 'channels'>>) => void;
  updateMemberRole: (tribeId: string, memberId: string, newRole: TribeMember['role']) => void;
  removeMember: (tribeId: string, memberId: string) => void;
  addMember: (tribeId: string, member: Omit<TribeMember, 'role'>) => void;
  addChannel: (tribeId: string, channel: Omit<TribeChannel, 'id'>) => void;
  updateChannel: (tribeId: string, channelId: string, updates: Partial<Omit<TribeChannel, 'id'>>) => void;
  removeChannel: (tribeId: string, channelId: string) => void;
}

export const useTribeStore = create<TribeStore>()(
  persist(
    (set, get) => ({
      tribes: [
        {
          id: 'tech-innovators',
          name: 'Tech Innovators',
          description: 'A community for cutting-edge technology enthusiasts',
          coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
          memberCount: 42,
          isPrivate: true,
          tags: ['Technology', 'Innovation'],
          members: [
            {
              id: '1',
              username: 'johndoe',
              displayName: 'John Doe',
              avatar: 'https://i.pravatar.cc/150?u=johndoe',
              role: 'Admin'
            }
          ],
          channels: [
            {
              id: 'general',
              name: 'General Discussion',
              description: 'Main channel for all tech discussions',
              isPrivate: false
            }
          ]
        },
        {
          id: 'creative-writers',
          name: 'Creative Writers',
          description: 'Share and critique your latest writing projects',
          coverImage: 'https://images.unsplash.com/photo-1516961642265-531546e84af2',
          memberCount: 27,
          isPrivate: false,
          tags: ['Writing', 'Creativity'],
          members: [
            {
              id: '2',
              username: 'janedoe',
              displayName: 'Jane Doe',
              avatar: 'https://i.pravatar.cc/150?u=janedoe',
              role: 'Admin'
            }
          ],
          channels: [
            {
              id: 'general',
              name: 'General Discussion',
              description: 'Main channel for writing discussions',
              isPrivate: false
            }
          ]
        }
      ],
      addTribe: (newTribe) => {
        const tribe: Tribe = {
          ...newTribe,
          id: newTribe.name.toLowerCase().replace(/\s+/g, '-'),
          memberCount: 1,
          members: [
            {
              id: Date.now().toString(),
              username: 'current-user',
              displayName: 'Current User',
              avatar: 'https://i.pravatar.cc/150?u=current-user',
              role: 'Admin'
            }
          ],
          channels: [
            {
              id: 'general',
              name: 'General Discussion',
              description: `Main channel for ${newTribe.name}`,
              isPrivate: false
            }
          ]
        };
        set((state) => ({ tribes: [...state.tribes, tribe] }));
      },
      getTribeById: (id) => {
        return get().tribes.find(tribe => tribe.id === id);
      },
      updateTribeSettings: (id, settings) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === id
            ? { ...tribe, ...settings }
            : tribe
        )
      })),
      updateMemberRole: (tribeId, memberId, newRole) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                members: tribe.members.map(member =>
                  member.id === memberId
                    ? { ...member, role: newRole }
                    : member
                )
              }
            : tribe
        )
      })),
      removeMember: (tribeId, memberId) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                members: tribe.members.filter(member => member.id !== memberId),
                memberCount: tribe.memberCount - 1
              }
            : tribe
        )
      })),
      addMember: (tribeId, member) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                members: [...tribe.members, { ...member, role: 'Member' }],
                memberCount: tribe.memberCount + 1
              }
            : tribe
        )
      })),
      addChannel: (tribeId, channel) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                channels: [...tribe.channels, { ...channel, id: crypto.randomUUID() }]
              }
            : tribe
        )
      })),
      updateChannel: (tribeId, channelId, updates) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                channels: tribe.channels.map(channel =>
                  channel.id === channelId
                    ? { ...channel, ...updates }
                    : channel
                )
              }
            : tribe
        )
      })),
      removeChannel: (tribeId, channelId) => set(state => ({
        tribes: state.tribes.map(tribe =>
          tribe.id === tribeId
            ? {
                ...tribe,
                channels: tribe.channels.filter(channel => channel.id !== channelId)
              }
            : tribe
        )
      })),
    }),
    {
      name: 'tribe-storage'
    }
  )
);
