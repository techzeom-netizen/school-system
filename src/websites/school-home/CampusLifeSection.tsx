const galleryItems = [
  {
    caption: 'Main school building',
    image:
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1400',
    size: 'large',
    tone: 'navy',
  },
  {
    caption: 'Science lab',
    image:
      'https://images.pexels.com/photos/8471859/pexels-photo-8471859.jpeg?auto=compress&cs=tinysrgb&w=1200',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Library',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Annual day',
    image:
      'https://images.unsplash.com/photo-1782567530577-98d75b4bcb88?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Sports day',
    image:
      'https://images.unsplash.com/photo-1700914299961-d8f91559d85d?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Assembly',
    image:
      'https://images.unsplash.com/photo-1649008726820-d90aeb70c32e?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Art room',
    image:
      'https://images.unsplash.com/photo-1761403942462-04b8b97f1fe9?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Playground',
    image:
      'https://images.unsplash.com/photo-1763561553595-a60112a2977e?auto=format&fit=crop&q=60&w=1400',
    size: 'large',
    tone: 'gold',
  },
  {
    caption: 'Smart class',
    image:
      'https://images.unsplash.com/photo-1643199121319-b3b5695e4acb?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Computer lab',
    image:
      'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
];

const CampusLifeSection = () => (
  <section
    id="life-at-school"
    className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
    data-reveal
  >
    <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
      Campus life
    </p>
    <h2 className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
      Life at KD Public School
    </h2>
    <p className="mt-5 text-base leading-7 text-slate-600">
      A glimpse of learning, creativity and community across our campus.
    </p>
    <style>{`
      .school-gallery-grid { grid-auto-rows: 170px; }
      @media (max-width: 639px) { .school-gallery-grid { grid-auto-rows: 130px; } }
    `}</style>
    <div className="school-gallery-grid mt-10 grid grid-flow-dense grid-cols-2 gap-2 lg:grid-cols-4">
      {galleryItems.map(item => (
        <figure
          key={item.caption}
          className={`relative m-0 min-h-0 overflow-hidden ${
            item.size === 'large' ? 'col-span-2 row-span-2' : ''
          }`}
          style={{
            backgroundColor: item.tone === 'navy' ? '#071f3d' : '#7a1724',
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,.07) 14px 16px)',
          }}
        >
          <img
            src={item.image}
            alt={item.caption}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
            aria-hidden="true"
          />
          <figcaption className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white drop-shadow-md sm:bottom-4 sm:left-4 sm:text-lg">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export default CampusLifeSection;
