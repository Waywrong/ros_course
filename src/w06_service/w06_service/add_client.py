"""W06 service client：把命令列的兩個整數送給 server，印出結果。

用法：ros2 run w06_service add_client 2 3
      ros2 run w06_service add_client 2 3 --ros-args -r __node:=my_client   # 也可以加 ROS 參數
對照 ROS 1 版 ros_tutorials_service/src/service_client.cpp。
"""
import sys
import rclpy
from rclpy.node import Node
from rclpy.utilities import remove_ros_args
from course_interfaces.srv import SrvTutorial


def main():
    # 先拿掉 --ros-args 之後的 ROS 參數，剩下的才是我們自己的 a、b
    args = remove_ros_args(sys.argv)
    if len(args) != 3:
        print('Usage: ros2 run w06_service add_client <a> <b>')
        return 1
    rclpy.init()  # 不帶參數：rclpy 自己會讀 sys.argv 裡的 --ros-args
    try:
        node = Node('service_client')
        client = node.create_client(SrvTutorial, 'ros_tutorial_srv')
        # 等 server 出現（server 還沒開時會一直等）
        while not client.wait_for_service(timeout_sec=1.0):
            node.get_logger().info('waiting for ros_tutorial_srv ...')
        request = SrvTutorial.Request()
        request.a = int(args[1])
        request.b = int(args[2])
        future = client.call_async(request)  # 送出請求，不會卡住
        rclpy.spin_until_future_complete(node, future)  # 等到回覆
        node.get_logger().info(f'result: {future.result().result}')
        node.destroy_node()
    except KeyboardInterrupt:
        pass
    finally:
        rclpy.try_shutdown()
    return 0


if __name__ == '__main__':
    sys.exit(main())
