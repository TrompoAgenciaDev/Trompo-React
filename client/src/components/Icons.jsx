import React from 'react';

import LogoAmarillo from '/assets/logo-amarillo.png';
import LogoBlack from '/assets/logo-black.png';

const svgIcons = import.meta.glob('/assets/icons/*.svg', {
  eager: true,
  import: 'ReactComponent'
});

const icons = {
  facebook: svgIcons['/assets/icons/facebook.svg'],
  instagram: svgIcons['/assets/icons/instagram.svg'],
  linkedin: svgIcons['/assets/icons/linkedin.svg'],
  youtube: svgIcons['/assets/icons/youtube.svg'],
  logoAmarillo: LogoAmarillo,
  logoBlack: LogoBlack
};

function Icons({ iconName }) {
  const iconSrc = icons[iconName];

  if (!iconSrc) return null;

  if (iconName === 'burguer') {
    return (
      <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2129 0.621536C9.18453 0.621536 0.212891 9.59318 0.212891 20.6215C0.212891 31.6499 9.18453 40.6215 20.2129 40.6215C31.2412 40.6215 40.2129 31.6499 40.2129 20.6215C40.2129 9.59318 31.2412 0.621536 20.2129 0.621536ZM28.5462 28.9549H11.8795C10.9579 28.9549 10.2129 28.2083 10.2129 27.2883C10.2129 26.3683 10.9579 25.6216 11.8795 25.6216H28.5462C29.4678 25.6216 30.2128 26.3683 30.2128 27.2883C30.2129 28.2082 29.4679 28.9549 28.5462 28.9549ZM28.5462 22.2882H11.8795C10.9579 22.2882 10.2129 21.5415 10.2129 20.6215C10.2129 19.7015 10.9579 18.9549 11.8795 18.9549H28.5462C29.4678 18.9549 30.2128 19.7015 30.2128 20.6215C30.2128 21.5415 29.4679 22.2882 28.5462 22.2882ZM28.5462 15.6215H11.8795C10.9579 15.6215 10.2129 14.8749 10.2129 13.9549C10.2129 13.0349 10.9579 12.2883 11.8795 12.2883H28.5462C29.4678 12.2883 30.2128 13.0349 30.2128 13.9549C30.2128 14.8749 29.4679 15.6215 28.5462 15.6215Z" fill="black"/>
      </svg>
    );
  }

  if (iconName === 'logoAmarillo' || iconName === 'logoBlack') {
    return <img src={iconSrc} alt={iconName} />;
  }
  const IconComponent = iconSrc;
  return <IconComponent />;
}

export default Icons;
