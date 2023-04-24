#include "ros/ros.h"          

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode05srv");  
  ros::NodeHandle n;     

  ROS_INFO("myNode05srv: hi"); 
  ros::spin(); 
  
  return 0;
}

