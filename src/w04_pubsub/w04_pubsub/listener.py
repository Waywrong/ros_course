"""W04 listener：訂閱 chatter topic，收到就印出來。

對照 ROS 1 版 my_work01/src/listener.cpp：
- n.subscribe("chatter", 1000, chatterCallback) → self.create_subscription(String, 'chatter', callback, 10)
- ros::spin()                                   → rclpy.spin(node)
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from std_msgs.msg import String


class Listener(Node):
    def __init__(self):
        super().__init__('listener')  # node 名稱為 listener
        # 收到 chatter 上的 message 時，呼叫 self.on_message
        self.sub = self.create_subscription(String, 'chatter', self.on_message, 10)

    def on_message(self, msg):
        # msg.data 就是 talker 填進去的字串
        self.get_logger().info(f'I heard: [{msg.data}]')


def main():
    try:
        rclpy.init()
        node = Listener()
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
