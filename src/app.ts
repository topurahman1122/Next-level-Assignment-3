/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './app/routes/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

//Initilize Express App
const app: Application = express();

//Middleware
app.use(cors());
app.use(express.json()); //Parser
app.use(express.urlencoded({ extended: true })); //Parser

//Application Routes
app.use('/api/v1', routes);

//Testing Route
app.get('/', async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

//Global Error handler
app.use(globalErrorHandler);

//Handle Unknown Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API NOT FOUND',
      },
    ],
  });
  next();
});

export default app;
