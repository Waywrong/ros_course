window.CAPTIONS = window.CAPTIONS || {};
window.CAPTIONS.en = {
 "open": [
  "These are the two terminals we ran in class.",
  "On the left, talker prints a line of hello world every 0.1 s; on the right, listener prints I heard right after it.",
  "How does this line get from the program on the left to the program on the right?",
  "Let's slow it down and watch."
 ],
 "pubsub": [
  "Every ROS program is a node with its own name: talker and listener.",
  "Between them runs a named channel called a topic; here its name is /chatter.",
  "talker publishes to chatter, which means it sends; listener subscribes to chatter, which means it receives.",
  "The data carried on a topic is called a message; its type is String, with a single field named data.",
  "The key point: sender and receiver don't know each other; they only know the topic's name and type."
 ],
 "timer": [
  "Let's look at the talker side first.",
  "A ROS 2 program doesn't write its own while loop; it hands the job to a timer.",
  "Every 0.1 s, when the time is up, ROS calls on_timer once.",
  "on_timer does three things: it creates a message, fills data with hello world and a number, then publishes it.",
  "It goes off ten times a second, so about ten messages go out every second."
 ],
 "q1": [
  "Quick check.",
  "If the timer is changed to 0.5 s, about how many messages go out per second?"
 ],
 "spin": [
  "But who is watching the clock?",
  "The answer is spin, called at the end of the program.",
  "spin is a loop that keeps going round, checking: is the timer due?",
  "Has a new message come in?",
  "If so, it calls the matching function.",
  "A function that ROS calls for you like this is called a callback.",
  "Without spin, the timer never goes off and no callback is ever called."
 ],
 "receive": [
  "When a message reaches listener, it first goes into a waiting line called the queue.",
  "When listener's spin sees something in the queue, it takes it out and calls on_message, which prints I heard followed by hello world and the number.",
  "talker sends one, listener prints one, ten times a second: that's what you saw in the terminals."
 ],
 "drop": [
  "The 10 we wrote when creating the publisher and the subscriber is the length of the queue.",
  "If listener is slow and messages arrive faster than they are taken out, the queue fills up.",
  "Once it is full, the oldest message is dropped, keeping only the newest ten.",
  "For sensor data this is usually just what we want: better to miss a few than to miss the newest."
 ],
 "late": [
  "What if listener starts later?",
  "Messages sent earlier are not delivered to it; the first one it gets was sent after it started.",
  "So the first line isn't necessarily hello world 0.",
  "Either program can start first."
 ],
 "typo": [
  "One last common case: listener misspells the topic name, with one t missing.",
  "Now there are really two channels: talker sends on chatter, while listener waits on another one that looks almost the same.",
  "There's no error message; it just quietly receives nothing.",
  "Run ros2 topic list and you'll see two names that look alike."
 ],
 "q2": [
  "Quick check.",
  "What happens if listener's topic is written as Chatter, with a capital C?"
 ],
 "wrap": [
  "Let's sum up this message's journey.",
  "The timer goes off and spin calls on_timer; on_timer fills in data and publishes to chatter; the message enters listener's queue; listener's spin takes it out and calls on_message, which prints a line."
 ],
 "final1": [
  "Chapter practice.",
  "Think about it: what must be the same for talker and listener to communicate?"
 ],
 "finish": [
  "Well done.",
  "In the next chapter, we'll see how these two programs go through colcon build to become commands that ros2 run can execute."
 ]
};
