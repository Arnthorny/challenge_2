const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Free Mentors API',
      description: 'API documentation for Free Mentors Service',
      version: '1.0.0',
    },
    components: {
      schemas: {
        GenericErrorObj: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'error message',
            },
            status: {
              type: 'integer',
            },
          },
        },
        TokenResponseObj: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
            message: {
              type: 'string',
              example: 'example message',
            },
          },
        },
        BasicMessageObj: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'example message',
            },
          },
        },
        TokenResponseObjNoMsg: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
          },
        },
        UserLoginReqBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 4,
            },
          },
        },
        UserSignupReqBody: {
          type: 'object',
          required: [
            'firstName',
            'lastName',
            'email',
            'password',
            'address',
            'bio',
            'occupation',
            'expertise',
          ],
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'must be unique',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 4,
            },
            address: {
              type: 'string',
            },
            bio: {
              type: 'string',
            },
            occupation: {
              type: 'string',
            },
            expertise: {
              type: 'string',
            },
          },
        },
        MentorSchema: {
          type: 'object',
          properties: {
            mentorId: {
              type: 'integer',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            address: {
              type: 'string',
            },
            bio: {
              type: 'string',
            },
            occupation: {
              type: 'string',
            },
            expertise: {
              type: 'string',
            },
          },
        },
        SessionReqBody: {
          type: 'object',
          properties: {
            mentorId: {
              type: 'integer',
            },
            questions: {
              type: 'string',
            },
          },
        },
        SessionReviewBody: {
          type: 'object',
          properties: {
            score: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
            },
            remark: {
              type: 'string',
            },
          },
        },
        SessionReviewRespSchema: {
          type: 'object',
          properties: {
            mentorId: {
              type: 'integer',
            },
            sessionId: {
              type: 'integer',
            },
            menteeId: {
              type: 'integer',
            },
            remark: {
              type: 'string',
            },
            menteeFullName: {
              type: 'string',
            },
            score: {
              type: 'integer',
            },
          },
        },
        SessionRespSchema: {
          type: 'object',
          properties: {
            mentorId: {
              type: 'integer',
            },
            sessionId: {
              type: 'integer',
            },
            menteeId: {
              type: 'integer',
            },
            menteeEmail: {
              type: 'string',
            },
            questions: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected'],
            },
          },
        },
      },
    },
    servers: [
      {
        url: process.env.SERVER_URI || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
};

// swaggerJsdoc(swaggerDocOptions)
const OASdoc = swaggerJsdoc({
  apis: ['./src/routes/v1/*.route.js'], // files containing annotations as above
  ...options,
});
module.exports = OASdoc;
