const convertExpiresInToMs = (expiresIn) => {
    const unit = expiresIn.slice(-1); // 's', 'm', 'h', or 'd'
    const value = parseInt(expiresIn.slice(0, -1), 10);
  
    if (isNaN(value)) return 0;  // <--- Add this line
  
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

export default convertExpiresInToMs