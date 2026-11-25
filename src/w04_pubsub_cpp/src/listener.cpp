// W04 listener（C++ 對照版）：和 w04_pubsub/listener.py 做一樣的事
// 對照 ROS 1 版 my_work01/src/listener.cpp
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Listener : public rclcpp::Node
{
public:
  Listener() : Node("listener")
  {
    // ROS 1：n.subscribe("chatter", 1000, chatterCallback)
    sub_ = create_subscription<std_msgs::msg::String>(
      "chatter", 10,
      [this](const std_msgs::msg::String & msg) {
        RCLCPP_INFO(get_logger(), "I heard: [%s]", msg.data.c_str());
      });
  }

private:
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sub_;
};

int main(int argc, char ** argv)
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Listener>());  // ROS 1 的 ros::spin()
  rclcpp::shutdown();
  return 0;
}
