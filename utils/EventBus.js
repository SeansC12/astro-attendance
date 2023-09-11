export default class EventBus {
  constructor() {
    // initialize event list
    this.eventObject = { onAttendanceLogged: {} };
    // id of the callback function list
    this.callbackId = 0;
  }
  // publish event
  publish(eventName, ...args) {
    // Get all the callback functions of the current event
    const callbackObject = this.eventObject[eventName];

    if (!callbackObject)
      return console.warn(eventName + " not found!");

    // // execute each callback function
    for (let id in callbackObject) {
      // pass parameters when executing
      callbackObject[id](...args);
    }
  }
  // Subscribe to events
  subscribe(eventName, callback) {
    // initialize this event
    if (!this.eventObject[eventName]) {
      // Use object storage to improve the efficiency of deletion when logging out the callback function
      this.eventObject[eventName] = {};
    }

    const id = this.callbackId++;

    // store the callback function of the subscriber
    // callbackId needs to be incremented after use for the next callback function
    this.eventObject[eventName][id] = callback;

    // Every time you subscribe to an event, a unique unsubscribe function is generated
    const unSubscribe = () => {
      // clear the callback function of this subscriber
      delete this.eventObject[eventName][id];

      // If this event has no subscribers, also clear the entire event object
      if (
        Object.keys(this.eventObject[eventName]).length ===
        0
      ) {
        delete this.eventObject[eventName];
      }
    };

    return { unSubscribe };
  }
}

// const eventBus = new EventBus();
// export default eventBus;

// // test
// const eventBus = new EventBus();

// // Subscribe to event eventX
// eventBus.subscribe("eventX", (obj, num) => {
//   console.log("Module A", obj, num);
// });
// eventBus.subscribe("eventX", (obj, num) => {
//   console.log("Module B", obj, num);
// });
// const subscriberC = eventBus.subscribe(
//   "eventX",
//   (obj, num) => {
//     console.log("Module C", obj, num);
//   }
// );

// // publish event eventX
// eventBus.publish("eventX", { msg: "EventX published!" }, 1);

// // Module C unsubscribes
// subscriberC.unSubscribe();

// // Publish the event eventX again, module C will no longer receive the message
// eventBus.publish(
//   "eventX",
//   { msg: "EventX published again!" },
//   2
// );

// // output
// // > Module A {msg: 'EventX published!'} 1
// // > Module B {msg: 'EventX published!'} 1
// // > Module C {msg: 'EventX published!'} 1
// // > Module A {msg: 'EventX published again!'} 2
// // > Module B {msg: 'EventX published again!'} 2
