import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/common/dialog';
import { Button } from '@/components/ui/common/Button';
import { 
  PlusCircle, 
  ImagePlus, 
  X, 
  Globe, 
  Lock, 
  Users, 
  Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CreateTribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTribe: (tribe: { 
    name: string; 
    description: string; 
    tags: string[]; 
    coverImage?: File;
    isPrivate: boolean;
  }) => void;
}

const CreateTribeModal: React.FC<CreateTribeModalProps> = ({
  isOpen,
  onClose,
  onCreateTribe,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    coverImage: undefined as File | undefined,
    isPrivate: false
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (file.size <= maxSize && allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, coverImage: file }));
        setCoverImagePreview(URL.createObjectURL(file));
      } else {
        toast.error('Invalid file', {
          description: 'Please upload a valid image (JPEG, PNG, GIF) under 10MB.'
        });
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: undefined }));
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Tribe Name Required', {
        description: 'Please provide a name for your tribe.'
      });
      return;
    }

    onCreateTribe({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    
    // Reset form
    setFormData({ name: '', description: '', tags: '', coverImage: undefined, isPrivate: false });
    setCoverImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="feature-card fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
                   bg-gradient-to-b from-background/90 to-background/70 
                   backdrop-blur-xl border border-border/50 
                   shadow-2xl transition-all duration-300 
                   hover:shadow-primary/10 
                   sm:max-w-[500px]
                   w-[90vw]
                   max-h-[90vh]
                   rounded-3xl
                   p-8
                   overflow-y-auto"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 h-full flex flex-col"
        >
          <DialogHeader className="mb-6 text-center flex-shrink-0">
            <DialogTitle className="text-3xl font-bold text-gradient tracking-tight">
              Create New Tribe
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Build a community that inspires and connects
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2">
            {/* Cover Image Upload */}
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/gif"
                className="hidden" 
                id="cover-image-upload" 
              />
              <label 
                htmlFor="cover-image-upload" 
                className={`
                  block h-48 rounded-2xl cursor-pointer 
                  border-2 border-dashed transition-all duration-300
                  ${coverImagePreview 
                    ? 'border-transparent' 
                    : 'border-primary/30 hover:border-primary/50'}
                  relative overflow-hidden
                `}
              >
                {coverImagePreview ? (
                  <>
                    <img 
                      src={coverImagePreview} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus size={48} className="mb-2" />
                    <span>Upload Tribe Cover Image</span>
                  </div>
                )}
              </label>
            </div>

            {/* Tribe Name */}
            <div className="space-y-2">
              <label 
                htmlFor="tribeName" 
                className="block text-sm font-medium text-muted-foreground"
              >
                Tribe Name
              </label>
              <input
                type="text"
                id="tribeName"
                className="input-base 
                          w-full 
                          focus:shadow-primary/20 
                          focus:border-primary/50 
                          transition-shadow duration-300
                          placeholder:text-muted-foreground/50"
                placeholder="Enter a unique and inspiring tribe name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            {/* Tribe Description */}
            <div className="space-y-2">
              <label 
                htmlFor="tribeDescription" 
                className="block text-sm font-medium text-muted-foreground"
              >
                Tribe Description
              </label>
              <textarea
                id="tribeDescription"
                className="input-base min-h-[120px] 
                          w-full
                          focus:shadow-primary/20 
                          focus:border-primary/50 
                          transition-shadow duration-300
                          placeholder:text-muted-foreground/50"
                placeholder="Share your tribe's mission, values, and what makes it special"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            {/* Tribe Tags */}
            <div className="space-y-2">
              <label 
                htmlFor="tribeTags" 
                className="block text-sm font-medium text-muted-foreground"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tribeTags"
                className="input-base 
                          w-full
                          focus:shadow-primary/20 
                          focus:border-primary/50 
                          transition-shadow duration-300
                          placeholder:text-muted-foreground/50"
                placeholder="e.g. Technology, Innovation, Writing"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>

            {/* Privacy Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Tribe Visibility
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${!formData.isPrivate 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-background text-muted-foreground border border-border hover:bg-accent'}
                  `}
                >
                  <Globe size={16} />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${formData.isPrivate 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-background text-muted-foreground border border-border hover:bg-accent'}
                  `}
                >
                  <Lock size={16} />
                  Private
                </button>
              </div>
            </div>
          </form>

          <div className="relative z-10 mt-6 pt-6 border-t border-border/50 flex gap-4">
            <Button 
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 hover:bg-background/80"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={(e) => handleSubmit(e as React.FormEvent)}
              className="flex-1 flex items-center justify-center space-x-2 
                       shadow-lg hover:shadow-primary/30 
                       transition-shadow duration-300
                       group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Create Tribe
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTribeModal;
