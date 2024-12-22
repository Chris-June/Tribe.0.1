import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from './notificationStore';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  tribeId: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  mediaAttachments: MediaAttachment[];
}

interface DiscussionStore {
  discussions: Discussion[];
  addDiscussion: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'mediaAttachments'>) => void;
  addComment: (discussionId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  addMediaToDiscussion: (discussionId: string, media: MediaAttachment[]) => void;
  getDiscussionsByTribeId: (tribeId: string) => Discussion[];
  likeDiscussion: (discussionId: string) => void;
  likeComment: (discussionId: string, commentId: string) => void;
}

const extractMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(match => match.slice(1)) : [];
};

export const useDiscussionStore = create<DiscussionStore>()(
  persist(
    (set, get) => ({
      discussions: [],
      
      addDiscussion: (discussion) => {
        const notificationStore = useNotificationStore.getState();
        const mentions = extractMentions(discussion.content);
        
        // Generate new discussion with required fields
        const newDiscussion: Discussion = {
          ...discussion,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0,
          comments: [],
          mediaAttachments: []
        };

        set((state) => ({
          discussions: [
            newDiscussion,
            ...state.discussions
          ]
        }));

        // Create notifications for mentions after discussion is created
        mentions.forEach(username => {
          notificationStore.addNotification({
            type: 'mention',
            title: 'You were mentioned in a discussion',
            content: newDiscussion.content,
            tribeId: newDiscussion.tribeId || '',
            sourceId: newDiscussion.id,
            sourceType: 'discussion',
            sender: {
              id: newDiscussion.authorId,
              displayName: newDiscussion.authorName,
              avatar: newDiscussion.authorAvatar
            },
            recipient: {
              id: username,
              displayName: username
            }
          });
        });

        // Create notification for new discussion
        notificationStore.addNotification({
          type: 'discussion',
          title: 'New discussion in your tribe',
          content: newDiscussion.content,
          tribeId: newDiscussion.tribeId || '',
          sourceId: newDiscussion.id,
          sourceType: 'discussion',
          sender: {
            id: newDiscussion.authorId,
            displayName: newDiscussion.authorName,
            avatar: newDiscussion.authorAvatar
          },
          recipient: {
            id: 'tribe-members',
            displayName: 'All Members'
          }
        });
      },

      addComment: (discussionId, comment) => {
        const newComment = {
          ...comment,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          likes: 0
        };
        
        set(state => {
          const mentions = extractMentions(comment.content);
          const notificationStore = useNotificationStore.getState();
          
          return {
            discussions: state.discussions.map((discussion) =>
              discussion.id === discussionId
                ? {
                    ...discussion,
                    comments: [
                      ...discussion.comments,
                      newComment
                    ]
                  }
                : discussion
            )
          };
        });

        // Create notifications for mentions in comments
        const mentions = extractMentions(comment.content);
        mentions.forEach(username => {
          const discussion = get().discussions.find(d => d.id === discussionId);
          if (!discussion) return; // Exit early if discussion not found
          
          useNotificationStore.getState().addNotification({
            type: 'mention',
            title: 'You were mentioned in a comment',
            content: comment.content,
            tribeId: discussion.tribeId || '',
            sourceId: newComment.id,
            sourceType: 'comment',
            sender: {
              id: comment.authorId,
              displayName: comment.authorName,
              avatar: comment.authorAvatar
            },
            recipient: {
              id: username,
              displayName: username
            }
          });
        });

        // Notify discussion author of new comment
        const discussion = get().discussions.find(d => d.id === discussionId);
        if (discussion && discussion.authorId !== comment.authorId) {
          useNotificationStore.getState().addNotification({
            type: 'discussion',
            title: 'New comment on your discussion',
            content: comment.content,
            tribeId: discussion.tribeId || '',
            sourceId: newComment.id,
            sourceType: 'comment',
            sender: {
              id: comment.authorId,
              displayName: comment.authorName,
              avatar: comment.authorAvatar
            },
            recipient: {
              id: discussion.authorId,
              displayName: discussion.authorName
            }
          });
        }
      },

      addMediaToDiscussion: (discussionId, media) => set((state) => ({
        discussions: state.discussions.map(discussion =>
          discussion.id === discussionId
            ? {
                ...discussion,
                mediaAttachments: [
                  ...discussion.mediaAttachments,
                  ...media
                ],
                updatedAt: new Date().toISOString()
              }
            : discussion
        )
      })),

      getDiscussionsByTribeId: (tribeId) => {
        return get().discussions.filter(discussion => discussion.tribeId === tribeId);
      },

      likeDiscussion: (discussionId) => set((state) => ({
        discussions: state.discussions.map(discussion =>
          discussion.id === discussionId
            ? { ...discussion, likes: discussion.likes + 1 }
            : discussion
        )
      })),

      likeComment: (discussionId, commentId) => set((state) => ({
        discussions: state.discussions.map(discussion =>
          discussion.id === discussionId
            ? {
                ...discussion,
                comments: discussion.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
                )
              }
            : discussion
        )
      }))
    }),
    {
      name: 'discussion-storage'
    }
  )
);
