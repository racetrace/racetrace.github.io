import "./ScrollingBackground.css";

const imageUrls = Array.from(
  { length: 10 },
  (_, index) => `/static/parkrun/image_${index}.jpg`
);

// eslint-disable-next-line react/prop-types
const ScrollingBackground = ({className}) => {
  const isDarkMode = false;// window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const imgClassName = `w-[256px] h-[256px] lg:h-[350px] lg:w-[350px]`;
  return (
    <div className={`w-full overflow-hidden z-0 ${className}`}>
      {/* Scrolling background */}
      <div className={`top-0 left-0 flex lg:space-x-4 space-x-2 animate-scroll`}>
        {imageUrls.map((url, index) => (
          <div key={index} className={`flex-shrink-0 {imgClassName}`}>
            <img
              src={url}
              alt={`parkrun trace`}
              style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
              className={`object-cover ${imgClassName}`}
            />
          </div>
        ))}
        {/* Duplicate the images for seamless scrolling
        {imageUrls.map((url, index) => (
          <div key={`copy-${index}`} className={`flex-shrink-0 {imgClassName}`}>
            <img
              src={url}
              alt={`parkrun trace`}
              style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
              className={`object-cover ${imgClassName}`}
            />
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default ScrollingBackground;
