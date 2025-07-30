const fs = require('fs');
const path = require('path');

const base64 = `
/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB
AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADASIAAhEBAxEB
/8QAFwABAQEBAAAAAAAAAAAAAAAAAAYHCf/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/
2gAMAwEAAhADEAAAAcv/xAAUEAEAAAAAAAAAAAAAAAAAAAAg/9oACAEBAAEFAr//xAAU
EQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/AX//xAAUEQEAAAAAAAAAAAAAAAAAAAAg
/9oACAECAQE/AX//xAAUEAEAAAAAAAAAAAAAAAAAAAAg/9oACAEBAAY/An//xAAUEAEA
AAAAAAAAAAAAAAAAAAAAg/9oACAEBAAE/Iv/Z
`.replace(/\s+/g, ''); // strip newlines and spaces

const buffer = Buffer.from(base64, 'base64');

const outputPath = path.join(__dirname, 'cypress', 'fixtures', 'fake.jpg');
fs.writeFileSync(outputPath, buffer);

console.log('✅ Created a valid fake.jpg in cypress/fixtures/');