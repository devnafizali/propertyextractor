import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs'
// Sample JSON data
const jsonData = JSON.parse(fs.readFileSync('latest.json', 'utf-8'));

// Define CSV writer
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    { id: 'title', title: 'Title' },
    { id: 'price', title: 'Price' },
    { id: 'street', title: 'Street' },
    { id: 'meters', title: 'Meters' },
    { id: 'rooms', title: 'Rooms' },
    { id: 'toilets', title: 'Toilets' },
    { id: 'phone', title: 'Phone' }
  ]
});

// Write JSON data to CSV
csvWriter
  .writeRecords(jsonData)
  .then(() => console.log('CSV file created successfully'))
  .catch(err => console.error('Error writing CSV:', err));
