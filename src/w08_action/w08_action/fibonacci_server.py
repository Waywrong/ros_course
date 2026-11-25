"""W08 action server：計算費氏數列，每秒回報一次進度（feedback），可被取消。

action 名稱 ros_tutorial_action，型別 course_interfaces/action/Fibonacci。
對照 ROS 1 版 ros_tutorials_action/src/action_server.cpp（actionlib）。

和 ROS 1 不同的地方（上課值得提一句）：
ROS 1 的 SimpleActionServer 同時只執行一個 goal，新 goal 進來會「搶占」（preempt）舊的。
這裡用多執行緒 executor，兩個 client 同時送 goal 時，兩個會一起執行。
數列長度也不同：order=4 時這裡得到 [0, 1, 1, 2, 3]（5 個，和 ROS 2 官方教學相同），
ROS 1 版的迴圈多跑一次，得到 [0, 1, 1, 2, 3, 5]（6 個）。

試試看（另開終端機）：
  ros2 action list
  ros2 action send_goal --feedback /ros_tutorial_action course_interfaces/action/Fibonacci "{order: 5}"

取消執行中的 goal，有兩種方法：
  1. 用本講的 client：ros2 run w08_action fibonacci_client 30，執行中按 Ctrl-C，它會先取消 goal 再結束。
  2. 呼叫 action 的取消服務。action 底下其實是 3 個 service 和 2 個 topic，名字裡有 _action，
     以底線開頭的名稱是「隱藏」的，要加參數才列得出來：
       ros2 service list --include-hidden-services     （send_goal、cancel_goal、get_result）
       ros2 topic list --include-hidden-topics         （feedback、status）
     取消：
       ros2 service call /ros_tutorial_action/_action/cancel_goal action_msgs/srv/CancelGoal "{}"
     "{}" 表示 goal_id 和時間都是 0，意思是「取消所有 goal」。
注意：在 ros2 action send_goal 按 Ctrl-C，目前的 Jazzy 會印出 Executor is already spinning，
取消不一定送得出去。這是 ros2 命令列工具本身的問題，不是你的程式寫錯。
"""
import time
import rclpy
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.executors import ExternalShutdownException, MultiThreadedExecutor
from rclpy.node import Node
from course_interfaces.action import Fibonacci


class FibonacciServer(Node):
    def __init__(self):
        super().__init__('action_server')
        self.server = ActionServer(
            self, Fibonacci, 'ros_tutorial_action',
            execute_callback=self.execute,
            goal_callback=lambda goal: GoalResponse.ACCEPT,
            cancel_callback=lambda goal_handle: CancelResponse.ACCEPT)
        self.get_logger().info('ready action server!')

    def execute(self, goal_handle):
        order = goal_handle.request.order
        self.get_logger().info(f'goal: order={order}')
        feedback = Fibonacci.Feedback()
        feedback.sequence = [0, 1]
        for i in range(1, order):
            if goal_handle.is_cancel_requested:  # client 要求取消（ROS 1 的 preempt）
                goal_handle.canceled()
                self.get_logger().info('goal canceled')
                return Fibonacci.Result(sequence=feedback.sequence)
            feedback.sequence.append(feedback.sequence[i] + feedback.sequence[i - 1])
            goal_handle.publish_feedback(feedback)  # 回報目前算到哪
            self.get_logger().info(f'feedback: {list(feedback.sequence)}')
            time.sleep(1.0)  # 1 Hz，故意放慢，才看得到 feedback
        goal_handle.succeed()
        return Fibonacci.Result(sequence=feedback.sequence)


def main():
    try:
        rclpy.init()
        node = FibonacciServer()
        # 多執行緒 executor：execute() 在 sleep 時，其他執行緒還能處理「取消」請求，
        # 也能同時執行另一個 client 送來的 goal。
        # 改成單執行緒（rclpy.spin(node)）的話，取消要等整個 goal 算完才會被處理。
        # num_threads 要自己給：預設等於 CPU 核數，課程 VM 只有 1～2 核時，
        # 執行中的 goal 就會把執行緒佔滿，取消請求沒有執行緒可以處理。
        executor = MultiThreadedExecutor(num_threads=4)
        rclpy.spin(node, executor=executor)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
