const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Only listen if we're not on Vercel (for local development)
if (process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

