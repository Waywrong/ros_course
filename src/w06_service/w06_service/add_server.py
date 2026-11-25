"""W06 service server：收到 a、b，回傳 a + b。

服務名稱 ros_tutorial_srv，型別 course_interfaces/srv/SrvTutorial（int64 a, int64 b --- int64 result）。
對照 ROS 1 版 ros_tutorials_service/src/service_server.cpp。

試試看（另開一個終端機）：
  ros2 service list
  ros2 service call /ros_tutorial_srv course_interfaces/srv/SrvTutorial "{a: 2, b: 3}"
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from course_interfaces.srv import SrvTutorial


class AddServer(Node):
    def __init__(self):
        super().__init__('service_server')
        self.srv = self.create_service(SrvTutorial, 'ros_tutorial_srv', self.on_request)
        self.get_logger().info('ready srv server!')

    def on_request(self, request, response):
        response.result = request.a + request.b
        self.get_logger().info(f'request: a={request.a}, b={request.b} -> result={response.result}')
        return response  # ROS 1 是回傳 true；ROS 2 回傳填好的 response


def main():
    try:
        rclpy.init()
        node = AddServer()
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
