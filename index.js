const { Kafka } = require('kafkajs');
const axios = require('axios');

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['my-cluster-kafka-bootstrap.kafka:9092'],
  sasl: {
    mechanism: "scram-sha-512",
    username: "my-connect-user",
    password: "eWKhGtJJ16Fo9svPInU8Osw99zEZ44wt",
  },
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
        const response = await axios.post('http://4.186.36.38:8088/info',  {
          // headers: {
          //   'Content-Type': 'application/vnd.ksql.v1+json',
          // },
        });

        // Log the response from ksqlDB
        console.log('ksqlDB response:', response.data);
      } catch (error) {
        console.error('Error querying ksqlDB:', error);
      }
    },
  });
};

run().catch(console.error);
