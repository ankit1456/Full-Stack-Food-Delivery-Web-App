import app from './app';
import { Config } from './config';

const startServer = () => {
  const { PORT } = Config;

  try {
    app.listen(PORT, () =>
      // eslint-disable-next-line no-console
      console.log(`Server running on url http://localhost:${PORT}`)
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
};

startServer();
