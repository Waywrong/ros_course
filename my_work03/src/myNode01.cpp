#include "ros/ros.h"          

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode01");  
  ros::NodeHandle n;     

  ros::Rate loop_rate(10);   // 10Hz
  ROS_INFO("myNode01: hi");	
  while (ros::ok())
  {  
    ros::spinOnce();   
    loop_rate.sleep();  
  }
  return 0;
}
