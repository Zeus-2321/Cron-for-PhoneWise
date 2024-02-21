const express = require('express');
const app = express();
const port = 5000 || process.env.PORT;
const axios = require('axios');
const Phone = require('./models/Phone');
const apiUrl = 'https://phone-specs-api.vercel.app';
const mongoose = require('mongoose');
const cron = require('node-cron');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.get('/run-job', async (req, res) => {
  try {
    await fetchAndSavePhones();
    res.send('Job Completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function fetchAndSavePhones() {
  try {
    // Fetch list of brands
    const brandsResponse = await axios.get(`${apiUrl}/brands`);

    // Fetch phones for each brand
    for (const brand of brandsResponse.data.data) {
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const phonesResponse = await axios.get(`${apiUrl}/brands/${brand.brand_slug}?page=${currentPage}`);

        // Save phones and phone specs to MongoDB
        for (const phone of phonesResponse.data.data.phones) {
          const existingPhone = await Phone.findOne({ slug: phone.slug });

          if (!existingPhone) {
            // Save phone to database
            const newPhone = new Phone(phone);
            await newPhone.save();
            console.log(`Saved phone: ${phone.slug}`);
          } else {
            console.log(`Phone already exists: ${phone.slug}`);
          }
        }
        currentPage++;
        totalPages = phonesResponse.data.data.last_page;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Schedule the job to run every week on Sunday at 00:00
cron.schedule('0 0 * * 0', fetchAndSavePhones);

console.log('Job scheduled to run every week');
