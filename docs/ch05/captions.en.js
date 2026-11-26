window.CAPTIONS = window.CAPTIONS || {};
window.CAPTIONS.en = {
 "open": [
  "In the last chapter, we typed one line of ros2 run, and talker started sending messages.",
  "But how does that one command find the talker program?",
  "If you have ever seen \"package not found\", this chapter shows where it comes from."
 ],
 "src": [
  "First, the workspace.",
  "At the start it holds just one folder, called src, where the programs you write live.",
  "Each package has its own folder, and three things in it matter most.",
  "package.xml gives the package's name and the packages it uses.",
  "setup.py says how this package is installed.",
  "And a folder with the same name as the package holds programs such as talker.py."
 ],
 "build": [
  "Next, at the top of the workspace, run colcon build.",
  "When it is done, three folders have appeared beside it: build holds the intermediate files, log the records, and install the finished product.",
  "In a moment you'll see that ros2 run only looks in install."
 ],
 "entry": [
  "What is in the finished product?",
  "Open setup.py and you'll find a section called console_scripts.",
  "It says: the executable named talker should call main in talker.py.",
  "colcon build follows this line and makes a small program called talker in install.",
  "Running it means running talker's main.",
  "listener is the same, with a line of its own."
 ],
 "q1": [
  "Quick check.",
  "When the talker executable runs, which function is called?"
 ],
 "source": [
  "The product is ready.",
  "But the terminal you have open doesn't know where it is yet.",
  "Run ros2 run now, and it says it can't find this package.",
  "Run source install/setup.bash, and it adds this workspace's install to a list called AMENT_PREFIX_PATH.",
  "Before source, the list holds only ROS itself; after source, your install is on it too."
 ],
 "newterm": [
  "On the course virtual machine, every new terminal runs source once by itself.",
  "So the terminal that goes wrong is usually one opened before the build: when it opened, install didn't exist yet.",
  "Run source in it yourself, or open a new terminal, and that's it."
 ],
 "find": [
  "Now let's see how ros2 run finds a program.",
  "It takes two steps.",
  "Step one: it goes down the list, install by install, looking for a package with this name.",
  "Every package leaves a name tag in install: that empty file in the resource folder.",
  "Step two: once it has found the package, it looks in its lib folder for an executable called talker, and if it finds it, runs it."
 ],
 "errors": [
  "So the two common error messages match these two steps exactly.",
  "Package not found means step one failed.",
  "Maybe this terminal hasn't run source yet, or there has been no build yet.",
  "No executable found means step two failed.",
  "Maybe setup.py doesn't have this name, or setup.py was changed without building again."
 ],
 "symlink": [
  "Last, when we ran the build, we added --symlink-install.",
  "It makes the programs in install shortcuts that link back to src.",
  "So after you change talker.py, you don't need to build again: the next run uses the new version.",
  "But for a new program, or a change to setup.py or package.xml, you still have to build again."
 ],
 "q2": [
  "Quick check.",
  "You add a line to setup.py for a new program called counter and run it without building again. What do you see?"
 ],
 "wrap": [
  "To sum up.",
  "The programs live in src; colcon build puts the product in install; source adds install to the list; ros2 run finds the package first, then the executable."
 ],
 "final1": [
  "Chapter practice.",
  "When you see an error message, first think about which step didn't find something."
 ],
 "finish": [
  "Well done: that's the end of week four's two chapters.",
  "Next week, we'll rename nodes and topics, and get two computers talking to each other."
 ]
};
