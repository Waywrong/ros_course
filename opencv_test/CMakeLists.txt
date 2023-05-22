cmake_minimum_required(VERSION 2.8)
project( DisplayImage )
find_package( OpenCV REQUIRED )

add_executable( cv_test1 cv_test1.cpp )
target_link_libraries( cv_test1 ${OpenCV_LIBS} )

add_executable( cv_test2 cv_test2.cpp )
target_link_libraries( cv_test2 ${OpenCV_LIBS} )

add_executable( cv_ui01 cv_ui01.cpp )
target_link_libraries( cv_ui01 ${OpenCV_LIBS} )

add_executable( cv_ui02 cv_ui02.cpp )
target_link_libraries( cv_ui02 ${OpenCV_LIBS} )
