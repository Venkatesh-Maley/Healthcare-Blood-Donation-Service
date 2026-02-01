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
                url: '/',
                description: 'Default Server',
            }
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
    // Vercel compatible paths: Use relative and absolute to be safe
    apis: [
        path.join(process.cwd(), 'src/routes/*.ts'),
        path.join(process.cwd(), 'dist/routes/*.js'),
        './src/routes/*.ts',
        './dist/routes/*.js',
        './routes/*.js',
        'src/routes/*.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    try {
        // Essential for Vercel: Use CDN assets for Swagger UI
        const CSS_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui.css";
        const JS_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui-bundle.js";
        const PRESET_JS_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui-standalone-preset.js";

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle: 'Blood Donation API Docs',
            customCssUrl: CSS_URL,
            customJs: [JS_URL, PRESET_JS_URL],
            customCss: '.swagger-ui .topbar { display: none }'
        }));
    } catch (error) {
        console.error('Error mounting Swagger UI:', error);
    }
};
