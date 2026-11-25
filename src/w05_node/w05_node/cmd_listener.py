"""W05 訂閱 cmd topic 的 node（cmd_listener），用來示範 topic 改名（remapping）。

對照 ROS 1 版 my_work02/src/add.cpp（執行檔 add、node 名稱 adder）。
ROS 2 版改名成 cmd_listener：W06 的 add_server／add_client 是做加法的 service，這個 node 沒有做加法，同名容易搞混。

上課流程：
  ros2 run w05_node cmd_listener                           # 訂閱 cmd，印出 cmd_listener start 後等訊息
  ros2 run w04_pubsub talker                               # talker 送到 chatter，cmd_listener 什麼都沒印
  ros2 topic info /cmd                                     # Publisher count: 0：沒有人送到 cmd
  （rqt_graph 也看得到兩邊的 topic 名稱不一樣，但在沒有顯卡的 VM 上開得比較慢）
  ros2 run w04_pubsub talker --ros-args -r chatter:=cmd    # 執行時把 chatter 改名成 cmd
  ros2 topic info /cmd                                     # 這次 Publisher count: 1
cmd_listener 這時會印出：
  [INFO] [...] [cmd_listener]: heard: [hello world 0]
  [INFO] [...] [cmd_listener]: heard: [hello world 1]
（第一個數字不一定是 0：兩邊連上之前 talker 已經送出的訊息收不到。）
ROS 1 的寫法是 rosrun my_work01 talk /chatter:=/cmd；ROS 2 要寫在 --ros-args 後面，用 -r（--remap）。
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from std_msgs.msg import String


class CmdListener(Node):
    def __init__(self):
        super().__init__('cmd_listener')
        # 訂閱 cmd topic，收到訊息就呼叫 on_cmd（ROS 1 版的 queue 是 1000，這裡 10 就夠）
        self.sub = self.create_subscription(String, 'cmd', self.on_cmd, 10)
        self.get_logger().info('cmd_listener start')

    def on_cmd(self, msg):
        self.get_logger().info(f'heard: [{msg.data}]')


def main():
    try:
        rclpy.init()
        node = CmdListener()
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
