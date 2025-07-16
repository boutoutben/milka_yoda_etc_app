const convertExpiresInToMs = (expiresIn) => {
  const str = String(expiresIn); // Force la conversion en string
  const unit = str.slice(-1);
  const value = parseInt(str.slice(0, -1), 10);

  if (isNaN(value)) return 0;

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      console.warn("Unknown time unit:", unit);
      return 0;
  }
};
export default convertExpiresInToMs