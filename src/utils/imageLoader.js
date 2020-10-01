const imageLoader = (src, cb) => {
  const image = new Image();

  image.src = src;
  image.onload = cb;
};

export default imageLoader;
