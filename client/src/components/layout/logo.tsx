import React from 'react';

interface LogoProps {
  size?: number;
  isAdminView?: boolean;
}

export function JourneyNowLogo({ size = 40, isAdminView = false }: LogoProps) {
  const primaryColor = isAdminView ? '#8B5CF6' : '#6366F1';
  const secondaryColor = isAdminView ? '#5045CD' : '#4338CA';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="48" fill="white" stroke={primaryColor} strokeWidth="4" />
      
      {/* Stylized "J" */}
      <path 
        d="M36 20C36 18.8954 36.8954 18 38 18H54C55.1046 18 56 18.8954 56 20V22C56 23.1046 55.1046 24 54 24H44V62C44 68.6274 49.3726 74 56 74H60C66.6274 74 72 68.6274 72 62V56C72 54.8954 72.8954 54 74 54H76C77.1046 54 78 54.8954 78 56V62C78 71.9411 69.9411 80 60 80H56C46.0589 80 38 71.9411 38 62V24H38C36.8954 24 36 23.1046 36 22V20Z" 
        fill={primaryColor}
      />
      
      {/* Decorative Lines */}
      <path 
        d="M30 40H55" 
        stroke={secondaryColor} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M45 65H70" 
        stroke={secondaryColor} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Small Circle */}
      <circle cx="62" cy="40" r="6" fill={secondaryColor} />
    </svg>
  );
}

export default JourneyNowLogo;