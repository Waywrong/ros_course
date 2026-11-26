"""W04 talker：每秒 10 次在 chatter topic 送出 "hello world N"。

對照 ROS 1 版 my_work01/src/talk.cpp：
- ros::init + NodeHandle      → rclpy.init() + 繼承 Node 的類別
- n.advertise<String>(...)    → self.create_publisher(String, ...)
- while (ros::ok()) + Rate    → self.create_timer(0.1, callback)，由 rclpy.spin() 驅動
- ROS_INFO                    → self.get_logger().info
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from std_msgs.msg import String


class Talker(Node):
    def __init__(self):
        super().__init__('talker')  # node 名稱為 talker
        # 建立 publisher：topic 名稱 chatter，型別 std_msgs/msg/String
        # 10 是 queue 深度（QoS）：送太快、對方來不及收時，最多保留 10 則
        self.pub = self.create_publisher(String, 'chatter', 10)
        self.count = 0
        # ROS 2 不寫 while 迴圈，改用 timer：每 0.1 秒（10 Hz）呼叫一次 on_timer
        self.timer = self.create_timer(0.1, self.on_timer)

    def on_timer(self):
        msg = String()  # 建立暫存的 message，填好資料再送出
        msg.data = f'hello world {self.count}'
        self.get_logger().info(msg.data)
        self.pub.publish(msg)
        self.count += 1


def main():
    try:
        rclpy.init()
        node = Talker()
        rclpy.spin(node)  # 進入迴圈，持續處理 timer 與 callback，直到 Ctrl-C
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
