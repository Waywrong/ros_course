#include "ros/ros.h" 
#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#define CVUI_IMPLEMENTATION
#include "cvui.h"
#define WINDOW_NAME "Button"

cv::Mat frame;
std::string btn_name = "OFF";
bool bBtn = false;
void img_Draw(void)
{
    frame = cv::Scalar(49, 52, 49);
    cvui::text(frame, 150, 50, "Button example");
    if (cvui::button(frame, 360, 80, btn_name)) {
      std::cout << "Regular button clicked!" << std::endl;
      bBtn=!bBtn;
      btn_name = bBtn? "ON":"OFF";
    }
    cvui::update();
    cv::imshow(WINDOW_NAME, frame);
    cv::waitKey(30);
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNode_ui01");  
  ros::NodeHandle n;
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
