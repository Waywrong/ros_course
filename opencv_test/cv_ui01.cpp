#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#define CVUI_IMPLEMENTATION
#include "cvui.h"
#define WINDOW_NAME "Button"

int main(int argc, const char *argv[])
{
  cv::Mat frame = cv::Mat(300, 600, CV_8UC3);
  cvui::init(WINDOW_NAME);
  std::string btn_name = "OFF";
  bool bBtn = false;
  while (true) {
    frame = cv::Scalar(49, 52, 49);
    cvui::text(frame, 150, 50, "Button example");
    if (cvui::button(frame, 360, 80, btn_name)) {
      std::cout << "Regular button clicked!" << std::endl;
      bBtn=!bBtn;
      btn_name = bBtn? "ON":"OFF";
    }
    cvui::update();
    cv::imshow(WINDOW_NAME, frame);
    // Check if ESC key was pressed
    if (cv::waitKey(20) == 27) {
      break;
    }
  }
  return 0;
}
