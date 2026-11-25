cmake_minimum_required(VERSION 3.8)
project(w04_pubsub_cpp)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)

# 和 Python 版同一組 node：talker_cpp / listener_cpp
add_executable(talker_cpp src/talker.cpp)
ament_target_dependencies(talker_cpp rclcpp std_msgs)
add_executable(listener_cpp src/listener.cpp)
ament_target_dependencies(listener_cpp rclcpp std_msgs)

install(TARGETS talker_cpp listener_cpp DESTINATION lib/${PROJECT_NAME})

ament_package()
