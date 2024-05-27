cmake_minimum_required(VERSION 3.0.2)
project(finalExam)

find_package(catkin REQUIRED COMPONENTS
  message_generation
  roscpp
  rospy
  std_msgs
)

add_service_files(FILES SrvGuessNum.srv)
generate_messages(DEPENDENCIES std_msgs)

catkin_package(
#  INCLUDE_DIRS include
#  LIBRARIES finalExam
#  CATKIN_DEPENDS message_generation roscpp rospy std_msgs
#  DEPENDS system_lib
)

include_directories(
# include
  ${catkin_INCLUDE_DIRS}
)

add_executable(myExam01_srv src/myExam01_srv.cpp)
add_dependencies(myExam01_srv ${${PROJECT_NAME}_EXPORTED_TARGETS} ${catkin_EXPORTED_TARGETS})
target_link_libraries(myExam01_srv ${catkin_LIBRARIES})
