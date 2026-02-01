import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Healthcare Blood Donation Service API',
            version: '1.0.0',
            description: 'Comprehensive API for managing blood donations, user profiles, and administrative workflows. Includes secure JWT authentication, Role-Based Access Control (RBAC), and Redis-backed batch processing for efficient admin operations.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.{ts,js}')],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    try {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle: 'Blood Donation API Docs'
        }));
    } catch (error) {
        console.error('Error mounting Swagger UI:', error);
    }
};
