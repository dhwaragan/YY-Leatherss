import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { supabase as supabaseClient } from '../supabase';

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  value, onChange, bucket = 'yy-images', folder = 'uploads', label = 'Images'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const newUrls: string[] = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
           setError('Please select image files only.');
           continue;
        }
        if (file.size > 5 * 1024 * 1024) {
           setError('Max file size is 5 MB.');
           continue;
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        if (!supabaseClient) throw new Error('Supabase not configured');
        const { error: uploadError } = await supabaseClient.storage.from(bucket).upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);
        if (publicUrl) newUrls.push(publicUrl);
      }
      onChange([...value, ...newUrls]);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newArr = [...value];
    newArr.splice(index, 1);
    onChange(newArr);
  };

  return (
    <div className="mb-4">
      {label && <label className="block font-semibold mb-1 text-neutral-700">{label}</label>}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
           <div key={i} className="relative w-24 h-24 border rounded overflow-hidden shadow-sm group">
             <img src={url} alt="upload preview" className="w-full h-full object-cover" />
             <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <X className="w-3 h-3 text-red-500" />
             </button>
           </div>
        ))}
        <div 
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center p-2 text-center transition-colors ${uploading ? 'bg-neutral-100 cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-neutral-50 hover:border-gold border-neutral-300'}`}
        >
           {uploading ? (
             <div className="flex flex-col items-center gap-1"><Loader2 className="w-5 h-5 animate-spin text-gold" /><span className="text-[10px] text-neutral-500">Uploading</span></div>
           ) : (
             <div className="flex flex-col items-center gap-1 text-neutral-500"><Plus className="w-5 h-5 text-neutral-400" /><span className="text-[10px] leading-tight">Add<br />Images</span></div>
           )}
        </div>
      </div>
      <input type="file" multiple ref={inputRef} onChange={handleFile} accept="image/*" className="hidden" />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
