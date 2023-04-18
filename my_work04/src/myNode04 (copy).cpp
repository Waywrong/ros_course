#include "ros/ros.h"          

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode04");  
  ros::NodeHandle n;     

  double dPeriod = 3;	
  int iCnt = 0;
  while (ros::ok())
  { 
    ROS_INFO("myNode04: hi :%d",iCnt++); 
    ros::spinOnce();   
    ros::Duration(dPeriod).sleep();
  }
  return 0;
}
