import { useState } from 'react';
import { Image } from 'react-native';

const FallbackImage = ({ uri, className, resizeMode }) => {
  const [imgSource, setImgSource] = useState({ uri });
  const base_image =
    'https://media.istockphoto.com/id/2041572395/vector/blank-avatar-photo-placeholder-icon-vector-illustration.webp?b=1&s=612x612&w=0&k=20&c=88LuT9lqQ6gHAvy7aQfxnRs_iK6KpnE-8QHDw3YyAUU=';
  return (
    <Image
      source={imgSource}
      className={className}
      resizeMode={resizeMode}
      onError={() => setImgSource(base_image)}
    />
  );
};

export default FallbackImage;
