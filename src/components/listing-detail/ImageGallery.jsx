export default function ImageGallery({ images, activeImg, setActiveImg, title }) {
  return (
    <section className="detail-gallery" aria-label="Property gallery">
      <div className="detail-gallery__main">
        <img src={images[activeImg]} alt={title} className="detail-gallery__img" />
      </div>
      <div className="detail-gallery__thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`detail-gallery__thumb ${i === activeImg ? 'detail-gallery__thumb--active' : ''}`}
            onClick={() => setActiveImg(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt={`${title} thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
