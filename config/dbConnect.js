const mongoose = require('mongoose');

const dbConnect = async () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
  );
  // console.log(DB);
  // const DB = process.env.DATABASE_LOCAL;
  try {
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log('DB connection successful 💯'));
  } catch (error) {
    console.error('Error connecting to the database 💣 ', error.message);
  }
};

module.exports = dbConnect;
