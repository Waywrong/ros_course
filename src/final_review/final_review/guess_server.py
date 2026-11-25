"""期末考前複習：猜數字 service server。

用法：ros2 run final_review guess_server 10 20     （答案在 10～20 之間隨機產生）
服務名稱 guess_num_srv，型別 course_interfaces/srv/SrvGuessNum（int64 a --- string result）。
對照 ROS 1 版 finalExam/src/myExam01_srv.cpp。
注意：ROS 1 版用 rand() 但沒有先 srand()，每次執行答案都一樣；這裡用 random 模組，每次不同。
"""
import random
import sys
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from course_interfaces.srv import SrvGuessNum


class GuessServer(Node):
    def __init__(self, lb, ub):
        super().__init__('guess_server')
        self.secret = random.randint(lb, ub)  # 包含 lb 與 ub
        self.count = 0
        self.srv = self.create_service(SrvGuessNum, 'guess_num_srv', self.on_guess)
        self.get_logger().info(f'ready srv server! range {lb}..{ub}')

    def on_guess(self, request, response):
        if request.a < self.secret:
            verdict = 'too low.'
        elif request.a > self.secret:
            verdict = 'too high.'
        else:
            verdict = 'Awesome.'
        response.result = f'{self.count})Input:{request.a} {verdict}'
        self.get_logger().info(f'sending back response: {response.result}')
        self.count += 1
        return response


def main():
    args = rclpy.utilities.remove_ros_args(sys.argv)
    if len(args) != 3:
        print('Usage: ros2 run final_review guess_server [Lower_Bound] [Upper_Bound]')
        return 1
    lb, ub = int(args[1]), int(args[2])
    try:
        rclpy.init()
        node = GuessServer(lb, ub)
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS
    return 0


if __name__ == '__main__':
    sys.exit(main())
