const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
require('./models/User');
const User = mongoose.model('User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    console.log('connected');
    const user = await User.create({ name: 'directtest', email: 'directtest@example.com', password: 'Pass123!', role: 'Member' });
    console.log('created', user);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
