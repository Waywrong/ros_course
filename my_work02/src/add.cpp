#include <iostream>
#include "ros/ros.h"          // 加入ROS公用程序
#include "std_msgs/String.h"  // 所要publish的message header，在此是std_msgs package底下的String.msg
#include <sstream>

using namespace std;

void cmdCallback(const std_msgs::String::ConstPtr& msg)
{
  ROS_INFO("add heard: [%s]", msg->data.c_str());
}

int main(int argc, char **argv)
{
	ros::init(argc, argv, "adder");
	ros::NodeHandle n;
	cout<< "add node start" << endl;

	ros::Subscriber sub = n.subscribe("cmd", 1000, cmdCallback); 
	ros::spin();

	return 0;
}