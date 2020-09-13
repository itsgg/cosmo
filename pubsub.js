const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.on("message", this.handleMessage);
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}, Message: ${message}`);
  }
}

const testps = new PubSub();

setTimeout(() => testps.publisher.publish(CHANNELS.TEST, "Foooooo"), 3000);
