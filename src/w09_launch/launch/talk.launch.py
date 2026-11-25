"""W09：一次啟動 talker 與 listener，再加上 my_node04（帶參數）。

對照 ROS 1 版 my_work01/launch/talk.launch。
用法：ros2 launch w09_launch talk.launch.py period:=0.5     （period:=1 這樣的整數也可以）

rosbag 練習（另開終端機，launch 執行中）：
  ros2 bag record /chatter -o chatter_bag          # Ctrl-C 停止錄製
  ros2 bag info chatter_bag
  （關掉 launch 後）ros2 run w04_pubsub listener  ＋  ros2 bag play chatter_bag

按 Ctrl-C 關掉 launch 時，偶爾會看到這段訊息，可以忽略：
  Exception ignored in: <function Future.__del__ ...>
  ...
  AttributeError: 'Task' object has no attribute '_exception'
這是 Ctrl-C 剛好打斷 rclpy 內部建立物件時，程式結束前印出的訊息（rclpy 本身的小問題）。
node 其實已經正常結束：看最後是不是 process has finished cleanly。
"""
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    period = LaunchConfiguration('period')
    return LaunchDescription([
        DeclareLaunchArgument('period', default_value='2.0', description='my_node04 的週期（秒）'),
        # name=：在 launch 裡幫 node 改名（和 ROS 1 版 talk.launch 的 name="talk01" 一樣），
        # 用 ros2 node list 會看到 /talk01、/listener01
        Node(package='w04_pubsub', executable='talker', name='talk01', output='screen'),
        Node(package='w04_pubsub', executable='listener', name='listener01', output='screen'),
        Node(package='w07_parameter', executable='my_node04', output='screen',
             parameters=[{'period': period}]),
    ])
