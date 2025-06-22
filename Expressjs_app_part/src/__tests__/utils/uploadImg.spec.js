const path = require('path');
const { destination, filename } = require('../../utils/uploadImg');


describe('multer config', () => {
  it('should return "uploads/" as destination', (done) => {
    destination({}, {}, (err, result) => {
      expect(result).toBe('uploads/');
      done();
    });
  });

  it('should generate a valid filename', (done) => {
    const mockFile = {
      fieldname: 'avatar',
      originalname: 'photo.jpg',
    };

    filename({}, mockFile, (err, result) => {
      expect(result).toMatch(/^avatar-\d+-\d+\.jpg$/);
      done();
    });
  });
});