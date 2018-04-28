const SpeedTest = require('speedtest-net');
const Schedule = require('node-schedule');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const URL = 'mongodb://localhost:27017';

Schedule.scheduleJob('59 * * * * *', () => {
  const test = SpeedTest({ maxTime: 5000 });

  test.on('data', (data) => {
    MongoClient.connect(URL, (err, client) => {
      assert.equal(null, err);
      const db = client.db('speedtest');
      const collection = db.collection('tests');

      collection.insert(data);

      client.close();
    });
  });

  test.on('error', (err) => {
    console.error(err);
  });
});
