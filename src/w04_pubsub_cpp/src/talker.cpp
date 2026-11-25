// W04 talker（C++ 對照版）：和 w04_pubsub/talker.py 做一樣的事
// 對照 ROS 1 版 my_work01/src/talk.cpp
#include <chrono>
#include <string>
#include "rclcpp/rclcpp.hpp"     // ROS 1 的 ros/ros.h
#include "std_msgs/msg/string.hpp"  // ROS 1 的 std_msgs/String.h

using namespace std::chrono_literals;

class Talker : public rclcpp::Node
{
public:
  Talker() : Node("talker")  // node 名稱為 talker
  {
    // ROS 1：n.advertise<std_msgs::String>("chatter", 1000)
    pub_ = create_publisher<std_msgs::msg::String>("chatter", 10);
    // ROS 1 的 while(ros::ok()) + Rate(10) 改成 100 ms 的 timer
    timer_ = create_wall_timer(100ms, [this]() {
      std_msgs::msg::String msg;
      msg.data = "hello world " + std::to_string(count_++);
      RCLCPP_INFO(get_logger(), "%s", msg.data.c_str());  // ROS 1 的 ROS_INFO
      pub_->publish(msg);
    });
  }

private:
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr pub_;
  rclcpp::TimerBase::SharedPtr timer_;
  int count_ = 0;
};

int main(int argc, char ** argv)
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Talker>());
  rclcpp::shutdown();
  return 0;
}
