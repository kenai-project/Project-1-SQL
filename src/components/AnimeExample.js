import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const AnimeExample = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    animate({
      targets: boxRef.current,
      translateX: 250,
      rotate: '1turn',
      backgroundColor: '#FF6347',
      duration: 2000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });
  }, []);

  return (
    <div>
      <h2>Anime.js Animation Example</h2>
      <div
        ref={boxRef}
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#00BFFF',
          margin: '20px auto'
        }}
      />
    </div>
  );
};

export default AnimeExample;
