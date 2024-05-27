#include "ros/ros.h"  
#include <string>
#include <cstdlib> 
#include <iostream> 
#include "finalExam/SrvGuessNum.h"

using namespace std; 

int g_iSecret;
int g_guessCNT = 0;
int lb = 10, ub = 20;//Upper_Bound to Lower_Bound

bool guess_num(finalExam::SrvGuessNum::Request &req,
                 finalExam::SrvGuessNum::Response &res)
{
	std::stringstream ssResult;		
	if(req.a < g_iSecret)
		ssResult << g_guessCNT << ")Input:" << req.a << " too low.";
	if(req.a > g_iSecret)
		ssResult << g_guessCNT << ")Input:" << req.a << " too high.";
	if(req.a == g_iSecret)
		ssResult << g_guessCNT << ")Input:" << req.a << " Awesome.";
  res.result = ssResult.str();

  ROS_INFO("sending back response: %s", res.result.c_str());
  g_guessCNT++;
  return true;
}

int main(int argc, char **argv)              
{
  ros::init(argc, argv, "guess_server");   
  ros::NodeHandle nh;   

  if (argc != 3 )
  {
    std::cout<<"Usage: " << argv[0] << " [Lower_Bound] [Upper_Bound]" << std::endl;
    return -1;
  }
  else
  {
  	lb = strtol(argv[1], NULL, 10);
  	ub = strtol(argv[2], NULL, 10);
  }

  //random num
  g_iSecret = (rand() % (ub - lb + 1)) + lb;

  ros::ServiceServer guess_service_server = nh.advertiseService("guess_num_srv", guess_num);
  ROS_INFO("ready srv server!");

  ros::spin();    

  return 0;
}