const express = require('express');
const swaggerUI = require('swagger-ui-express');

const { errorHandler } = require('./middlewares/error');
const { ApiError } = require('./utils/resp_handling');
const v1Routes = require('./routes/v1');
const openapiSpecification = require('./swagger-options');

const app = express();
const router = express.Router();

app.use(express.json());

router.use('/api', v1Routes);
router.use('/api/v1', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use(router);

// Place as last middleware
// Send custom 404 for any unknown request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

app.use(errorHandler);

module.exports = app;
