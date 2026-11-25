cmake_minimum_required(VERSION 3.8)
project(course_interfaces)

find_package(ament_cmake REQUIRED)
find_package(rosidl_default_generators REQUIRED)

# 這三個檔案定義課程用到的 service / action（W06、W08、期末）
rosidl_generate_interfaces(${PROJECT_NAME}
  "srv/SrvTutorial.srv"
  "srv/SrvGuessNum.srv"
  "action/Fibonacci.action"
)

ament_package()
