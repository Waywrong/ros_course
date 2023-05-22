#include <iostream>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>

#define CVUI_IMPLEMENTATION
#include "cvui.h"

#define WINDOW_NAME "Trackbar and columns"

int main(int argc, const char *argv[])
{
  int intValue1 = 30;
  float floatValue1 = 12.;
  cv::Mat frame = cv::Mat(cv::Size(450, 250), CV_8UC3);

  // Size of trackbars
  int width = 400;

  cvui::init(WINDOW_NAME, 20);

  while (true) {
    frame = cv::Scalar(49, 52, 49);

    cvui::beginColumn(frame, 20, 20, -1, -1, 6);
    cvui::text("int trackbar, no customization");
    cvui::trackbar(width, &intValue1, 0, 100);
    cvui::space(5);

    cvui::text("float trackbar, no customization");
    cvui::trackbar(width, &floatValue1, 10.f, 15.f);
    cvui::space(5);

    std::cout<<"intValue1:"<<intValue1<<std::endl;
    std::cout<<"floatValue1:"<<floatValue1<<std::endl;
    if (cvui::button("&Quit")) {
      break;
    }
    cvui::endColumn();

    cvui::update();
    
    cv::imshow(WINDOW_NAME, frame);
  }

  return 0;
}