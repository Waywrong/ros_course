#include "ros/ros.h"          

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode04");  
  ros::NodeHandle n;     

  double dPeriod = 3;	
  n.getParam("/para_Period", dPeriod);
  int iCnt = 0;

  while (ros::ok())
  { 
    //n.getParam("/para_Period", dPeriod);
    ROS_INFO("myNode04: hi :%d @%4.2f sec",iCnt++,dPeriod); 
    ros::spinOnce();   
    ros::Duration(dPeriod).sleep();
  }
  return 0;
}
