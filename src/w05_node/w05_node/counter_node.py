"""W05 把 plain_counter.py 改成 ROS node。

改了三件事：
1. rclpy.init() 與 Node：程式變成 ROS 系統裡一個有名字的 node（ros2 node list 看得到）
2. while + time.sleep 改成 create_timer：迴圈交給 rclpy.spin() 管
3. print 改成 get_logger().info：訊息帶時間與 node 名稱，也會進 /rosout

對照 ROS 1 版 my_work03/src/myNode01.cpp。
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node


class Counter(Node):
    def __init__(self):
        super().__init__('counter_node')
        self.count = 0
        self.get_logger().info('counter_node: hi')
        self.timer = self.create_timer(1.0, self.on_timer)  # 每 1 秒

    def on_timer(self):
        self.get_logger().info(f'count = {self.count}')
        self.count += 1


def main():
    try:
        rclpy.init()
        node = Counter()
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
