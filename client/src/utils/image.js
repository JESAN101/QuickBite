export const getImageUrl = (image) =>
  image && image.startsWith("http")
    ? image
    : `http://localhost:5000/uploads/${image}`;
