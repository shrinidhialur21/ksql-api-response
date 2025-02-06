const { Kafka } = require('kafkajs');
const axios = require('axios');

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['my-cluster-kafka-bootstrap.kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'topic1', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Received message: ${value}`);

      // Prepare the ksqlDB query
      const ksqlQuery = {
        ksql: "SELECT * FROM my_stream EMIT CHANGES LIMIT 1;", // Update this query based on your requirement
        streamsProperties: {}
      };

      try {
        // Make the HTTP request to ksqlDB
        const response = await axios.post('http://4.186.36.38:8088/ksql', ksqlQuery, {
          headers: {
            'Content-Type': 'application/vnd.ksql.v1+json',
          },
        });

        // Log the response from ksqlDB
        console.log('ksqlDB response:', response.data);
      } catch (error) {
        console.error('Error querying ksqlDB:', error.message);
      }
    },
  });
};

run().catch(console.error);
