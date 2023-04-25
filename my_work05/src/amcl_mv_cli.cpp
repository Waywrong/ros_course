#include <ros/ros.h>                              // ROS Default Header File
#include <actionlib/client/simple_action_client.h>// action Library Header File
#include <actionlib/client/terminal_state.h>      // Action Goal Status Header File
//#include <my_work05/FibonacciAction.h> // FibonacciAction Action File Header
#include <move_base_msgs/MoveBaseAction.h>
int main (int argc, char **argv)          // Node Main Function
{
  ros::init(argc, argv, "goal_cli"); // Node Name Initialization
  //actionlib::SimpleActionClient<my_work05::FibonacciAction> ac("ros_tutorial_action", true);
  actionlib::SimpleActionClient<move_base_msgs::MoveBaseAction> ac("move_base", true);
  ROS_INFO("Waiting for action server to start.");
  ac.waitForServer(); //wait for the action server to start, will wait for infinite time
  ROS_INFO("Action server started, sending goal.");
  
  move_base_msgs::MoveBaseGoal goal;
  goal.target_pose.header.frame_id = "map";
  goal.target_pose.header.stamp = ros::Time::now();
  
  goal.target_pose.pose.position.x = -2.0;
  goal.target_pose.pose.position.y = 0.5;
  goal.target_pose.pose.orientation.w = 1.0;
  ac.sendGoal(goal);

  bool finished_before_timeout = ac.waitForResult(ros::Duration(30.0));
  if (finished_before_timeout)
  {
    // Receive action target status value and display on screen
    actionlib::SimpleClientGoalState state = ac.getState();
    ROS_INFO("Action finished: %s",state.toString().c_str());
  }
  else
    ROS_INFO("Action did not finish before the time out.");
  return 0;
}
