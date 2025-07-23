import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import React from 'react';
import "../scss/HomePage.scss";

const dummyNewStores = [
  { title: 'New Coffee Store', image: '/images/coffee.jpg' },
  { title: 'MacBook Air Deal', image: '/images/macbook.jpg' },
  { title: 'Headphones Store', image: '/images/headphones.jpg' },
  { title: 'Smart Vacuum', image: '/images/vacuum.jpg' },
];

const dummyPopularStores = [
  { title: 'Tech Heaven', image: '/images/tech.jpg' },
  { title: 'Home Goods', image: '/images/home.jpg' },
  { title: 'Gaming Central', image: '/images/gaming.jpg' },
  { title: 'Fitness Store', image: '/images/fitness.jpg' },
];

export default function HomePage() {
  const [newSliderRef] = useKeenSlider<HTMLDivElement>({ slides: { perView: 3, spacing: 15 } });
  const [popularSliderRef] = useKeenSlider<HTMLDivElement>({ slides: { perView: 3, spacing: 15 } });

  return (
    <div className="home-page">
      <h2>🆕 New Store Posts</h2>
      <div ref={newSliderRef} className="keen-slider">
        {dummyNewStores.map((store, index) => (
          <div className="keen-slider__slide store-card" key={index}>
            <img src={store.image} alt={store.title} />
            <p>{store.title}</p>
          </div>
        ))}
      </div>

      <h2>🔥 Popular Stores</h2>
      <div ref={popularSliderRef} className="keen-slider">
        {dummyPopularStores.map((store, index) => (
          <div className="keen-slider__slide store-card" key={index}>
            <img src={store.image} alt={store.title} />
            <p>{store.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
