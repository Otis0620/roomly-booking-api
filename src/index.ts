import { AppDataSource } from '../typeorm.config';
import app from './app';

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log('Express server has started on port 3000');
    });
  })
  .catch((error) => console.error('Error initializing data source:', error));
