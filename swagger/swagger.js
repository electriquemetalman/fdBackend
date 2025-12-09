import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Food Delivery API',
        version: '1.0.0',
        description: 'API documentation for the Food Delivery Backend services',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'local server',
      },
    ],
  },
  
  //swagger anotations will be written in the route files
    apis: [
        './routes/*.js',
        './swagger/definitions.js',
        './swagger/components.js'
    ], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;