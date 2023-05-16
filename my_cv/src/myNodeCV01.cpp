#include "ros/ros.h"    
#include <opencv2/opencv.hpp>      
#include "opencv2/highgui/highgui_c.h"
#include "turtlesim/Pose.h"
using namespace std;
using namespace cv;

Mat Mat_Src;
std::vector<cv::Point> vTrajectory;
int g_rows;
int g_cols;

void MyCircle( Mat img, Point center )
{
  int iRadius = 3;
  int iThickness = 1;
  circle( img,
      center,
      iRadius,
      Scalar( 20, 20, 220 ),
      iThickness,
      CV_AA,0 );
}

void img_Draw(void)
{
  float fScale = 40;
  if(vTrajectory.size()>1)
  {
    for(auto it:vTrajectory)
    {
      Point2f pp(it.x*fScale, g_rows-it.y*fScale);
      MyCircle(Mat_Src,pp);
    }
  }
  imshow("GUI", Mat_Src);
  cvWaitKey(30);
}

void cb_get_pose(const turtlesim::Pose& msg) 
{
  Point2f _pose(msg.x, msg.y);
  static Point2f _pose_k_1(0,0);
  if(_pose!=_pose_k_1)
  {
    vTrajectory.push_back(_pose);
    _pose_k_1 = _pose;
  }
  ROS_INFO("x = %f, y = %f, theta = %f [%d]", msg.x, msg.y, msg.theta, vTrajectory.size());
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "myNodeCV01");  
  ros::NodeHandle n;     
  ros::Subscriber sub_turtle_pose = n.subscribe("/turtle1/pose", 10, cb_get_pose);
  cvNamedWindow("GUI",0);
  Mat_Src = imread("/home/user/catkin_ws/src/my_cv/src/Mascaloona.jpg");
  g_rows = Mat_Src.rows;
  g_cols = Mat_Src.cols;

  ROS_INFO("myNodeCV01: hi"); 
  ros::Rate r(30); 
  while(ros::ok())
  {
    img_Draw();
    r.sleep();
    ros::spinOnce();
  } 
  return 0;
}