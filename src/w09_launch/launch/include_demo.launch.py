"""W09：launch 的條件（if）與 include（在 launch 裡啟動另一個 launch 檔）。

對照 ROS 1 版 my_work04/launch/my_work04.launch：
  <arg name="arg1" value="true" />    <node pkg="my_work04" type="myNode04" ... if="$(arg arg1)"/>
  <arg name="arg2" value="false" />   <include file="$(find my_work01)/launch/tt.launch" if="$(arg arg2)"/>
（ROS 1 版 include 的 tt.launch 其實不存在，只是 arg2 是 false 才沒出錯。這裡改成 include 本講的 talk.launch.py。）

和 ROS 1 不同、值得注意的兩點：
- ROS 1 的 <arg value="..."> 是常數，命令列不能改（給 arg1:=false 會出現 cannot override arg 的錯誤）；
  能從命令列改的是 <arg default="...">。ROS 2 的 DeclareLaunchArgument(default_value=...) 對應的是 default=，
  所以這裡的 start_node:=false 可以直接改。
- ROS 1 的 $(find 套件) 找到的是原始碼目錄；ROS 2 的 FindPackageShare 找到的是安裝後的 install/<套件>/share/<套件>。
  所以新增或改名 launch 檔之後，要確認 setup.py 的 data_files 有把它裝進去，並重新 colcon build，才找得到。
  （XML 格式的 launch 檔寫成 $(find-pkg-share 套件)。）

用法：
  ros2 launch w09_launch include_demo.launch.py --show-args                      # 列出可以設定的參數
  ros2 launch w09_launch include_demo.launch.py                                  # 只有 node04_if
  ros2 launch w09_launch include_demo.launch.py with_talk:=true                  # 再加上 talk.launch.py 的三個 node
  ros2 launch w09_launch include_demo.launch.py with_talk:=true period:=1        # period 會轉傳給 talk.launch.py
  ros2 launch w09_launch include_demo.launch.py start_node:=false with_talk:=true
"""
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    start_node = LaunchConfiguration('start_node')
    with_talk = LaunchConfiguration('with_talk')
    period = LaunchConfiguration('period')
    return LaunchDescription([
        DeclareLaunchArgument('start_node', default_value='true',
                              description='要不要啟動 node04_if（ROS 1 版的 arg1）'),
        DeclareLaunchArgument('with_talk', default_value='false',
                              description='要不要 include talk.launch.py（ROS 1 版的 arg2）'),
        # 自己也宣告 period，再轉傳給 talk.launch.py。寫死成 '0.5' 的話，命令列的 period:=1 會被默默蓋掉
        DeclareLaunchArgument('period', default_value='0.5',
                              description='轉傳給 talk.launch.py 的 my_node04 週期（秒）'),
        # condition=IfCondition(...)：參數是 true 才啟動，等於 ROS 1 的 if="$(arg arg1)"
        # （相反的 UnlessCondition 等於 ROS 1 的 unless=）
        # name='node04_if'：talk.launch.py 裡也有一個 my_node04，改名才不會有兩個同名的 node
        Node(package='w07_parameter', executable='my_node04', name='node04_if', output='screen',
             parameters=[{'period': 1.0}], condition=IfCondition(start_node)),
        # IncludeLaunchDescription：在這裡啟動另一個 launch 檔，等於 ROS 1 的 <include file=.../>
        # FindPackageShare('w09_launch') 等於 ROS 1 的 $(find w09_launch)
        # launch_arguments：傳參數給被 include 的 launch 檔，等於 ROS 1 <include> 裡的 <arg>
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(
                PathJoinSubstitution([FindPackageShare('w09_launch'), 'launch', 'talk.launch.py'])),
            launch_arguments={'period': period}.items(),
            condition=IfCondition(with_talk)),
    ])
