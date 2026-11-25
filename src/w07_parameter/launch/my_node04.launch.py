"""W07：用 launch 檔啟動 my_node04，並從 config/params.yaml 讀參數。

對照 ROS 1 版 my_work04/launch/my_work04.launch（<param name="para_Period" .../>）。
"""
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch_ros.actions import Node


def generate_launch_description():
    params = os.path.join(get_package_share_directory('w07_parameter'), 'config', 'params.yaml')
    return LaunchDescription([
        Node(package='w07_parameter', executable='my_node04', name='my_node04',
             parameters=[params], output='screen'),
    ])
