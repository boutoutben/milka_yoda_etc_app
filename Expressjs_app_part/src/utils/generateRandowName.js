function generateRandomName() {
    const randomPart = Math.random().toString(36).substring(2, 8); // 6-char string
    return `Article_${randomPart}.jsx`;
  }

module.exports = {generateRandomName}