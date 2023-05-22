#include "ros/ros.h" 
#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#define CVUI_IMPLEMENTATION
#include "cvui.h"
#include <geometry_msgs/Twist.h>
#define WINDOW_NAME "Button"

cv::Mat frame;
ros::Publisher cmdpub;

void my_cmd_vel(float _linear, float _angular)
{
    geometry_msgs::Twist twist;
    geometry_msgs::Vector3 linear;
    linear.x=_linear;
    linear.y=0;
    linear.z=0;
    geometry_msgs::Vector3 angular;
    angular.x=0;
    angular.y=0;
    angular.z=_angular;
    twist.linear=linear;
    twist.angular=angular;
    cmdpub.publish(twist);
}
void img_Draw(void)
{
    frame = cv::Scalar(49, 52, 49);
    cvui::text(frame, 150, 50, "Button example");
    if (cvui::button(frame, 360, 80, "up")) {
      std::cout << "up button clicked!" << std::endl;
      my_cmd_vel(1,0);
    }
    cvui::update();
    cv::imshow(WINDOW_NAME, frame);
    cv::waitKey(30);
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode_ui01");  
  ros::NodeHandle n;
  cmdpub = n.advertise<geometry_msgs::Twist>("/turtle1/cmd_vel", 10); 
  frame = cv::Mat(300, 600, CV_8UC3);
  cvui::init(WINDOW_NAME);
  ros::Rate r(30); 
  while(ros::ok())
  {
    img_Draw();
    r.sleep();
    ros::spinOnce();
  }   
  return 0;
}
