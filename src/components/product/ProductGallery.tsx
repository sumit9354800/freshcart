import { useState } from 'react';
import { cn } from '../../lib/utils';

export interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image */}
      <div className="relative aspect-square w-full rounded-2xl border border-stone-200/80 bg-stone-50 overflow-hidden shadow-xs">
        <img
          src={galleryImages[selectedIdx]}
          alt={`${productName} view ${selectedIdx + 1}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={idx}
                type="button"
                id={`gallery-thumb-${idx}`}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-stone-50 cursor-pointer',
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-stone-200/80 hover:border-stone-300 opacity-70 hover:opacity-100'
                )}
                aria-label={`Select photo ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
