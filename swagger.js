const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs Sequelize',
      version: '1.0.0',
      description: 'APIs Test | BizflyCloud',
    },
  },
  apis: ['./routes/*.js', './docs/*.js'], // Đảm bảo đường dẫn này bao gồm tất cả các tệp chứa định nghĩa API
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
