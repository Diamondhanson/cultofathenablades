'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './product.module.css';

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState<Record<number, boolean>>({});
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [''];

  return (
    <div className={styles.gallery}>
      <div className={`${styles.mainImage} ${!loaded ? styles.shimmer : ''}`}>
        <Image
          src={safeImages[selectedIndex]}
          alt={`${name} - Image ${selectedIndex + 1}`}
          width={800}
          height={800}
          quality={85}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onLoadingComplete={() => setLoaded(true)}
        />
      </div>
      <div className={styles.thumbnails}>
        {safeImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`${styles.thumbnail} ${!thumbLoaded[index] ? styles.shimmer : ''}`}
            aria-label={`Show image ${index + 1}`}
            style={{
              border: index === selectedIndex ? '2px solid #d4af37' : '2px solid transparent',
              padding: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Image
              src={img}
              alt={`${name} view ${index + 1}`}
              width={150}
              height={150}
              quality={75}
              loading="lazy"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onLoadingComplete={() => setThumbLoaded((s) => ({ ...s, [index]: true }))}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
