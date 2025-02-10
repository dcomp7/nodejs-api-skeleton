import Bee from "bee-queue";
import redisConfig from "../config/redis.js";
import * as jobs from "../app/jobs";

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  logError(message, error) {
    // Implement your custom logging logic here
    console.log(message, error);
  }

  init() {
    Object.values(jobs).forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    Object.values(this.queues).forEach((queue) => {
      const { bee, handle } = queue;

      bee.on("failed", this.handleFailure).process(handle);
      //this.logError(`Queue ${queue.name}: FAILED`, err);
    });
  }

  handleFailure(job) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`);
  }
}

export default new Queue();
