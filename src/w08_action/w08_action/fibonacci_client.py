"""W08 action client：送出 goal，印出每次 feedback 與最後結果；按 Ctrl-C 會先取消 goal 再結束。

用法：ros2 run w08_action fibonacci_client 10
對照 ROS 1 版 ros_tutorials_action/src/action_client.cpp。
"""
import sys
import rclpy
from action_msgs.msg import GoalStatus
from rclpy.action import ActionClient
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from rclpy.signals import SignalHandlerOptions
from rclpy.utilities import remove_ros_args
from course_interfaces.action import Fibonacci


def wait_for(node, future):
    """等 future 完成，傳回它的結果。每 0.5 秒醒來一次，Ctrl-C 才能隨時中斷：
    不給 timeout 的 spin_until_future_complete 會一直卡在底層等事件，server 掛掉時就停不下來。"""
    while not future.done():
        if not rclpy.ok():
            # ROS 已經關閉（例如別處呼叫了 rclpy.shutdown()），結果不會來了。
            # 直接 return 的話呼叫端拿到 None，下一行就是 AttributeError
            raise ExternalShutdownException()
        rclpy.spin_until_future_complete(node, future, timeout_sec=0.5)
    return future.result()


def main():
    args = remove_ros_args(sys.argv)
    order = int(args[1]) if len(args) > 1 else 10
    # 關掉 rclpy 自己的 Ctrl-C 處理：Ctrl-C 會變成 KeyboardInterrupt 交給我們，
    # 這時 ROS 還開著，才來得及通知 server「取消這個 goal」
    # （ros2 action send_goal 也是先取消再結束，只是它用 signal.signal 換掉 SIGINT 的處理）
    rclpy.init(signal_handler_options=SignalHandlerOptions.NO)
    node = Node('action_client')
    client = ActionClient(node, Fibonacci, 'ros_tutorial_action')
    goal_handle = None
    code = 0
    try:
        node.get_logger().info('waiting for action server ...')
        client.wait_for_server()

        def on_feedback(msg):
            node.get_logger().info(f'feedback: {list(msg.feedback.sequence)}')

        send_future = client.send_goal_async(Fibonacci.Goal(order=order), feedback_callback=on_feedback)
        goal_handle = wait_for(node, send_future)
        if not goal_handle.accepted:
            node.get_logger().info('goal rejected')
            code = 1
        else:
            result_future = goal_handle.get_result_async()
            response = wait_for(node, result_future)
            # 看 status 才知道 goal 是算完、被取消，還是失敗；不能只看有沒有收到 result
            if response.status == GoalStatus.STATUS_SUCCEEDED:
                node.get_logger().info(f'result: {list(response.result.sequence)}')
            elif response.status == GoalStatus.STATUS_CANCELED:
                node.get_logger().info(f'goal canceled, partial result: {list(response.result.sequence)}')
                code = 1
            else:
                node.get_logger().info(f'goal ended with status {response.status}')
                code = 1
    except KeyboardInterrupt:
        code = 1
        if goal_handle is not None and goal_handle.accepted:
            node.get_logger().info('Ctrl-C: canceling the goal ...')
            cancel_future = goal_handle.cancel_goal_async()
            rclpy.spin_until_future_complete(node, cancel_future, timeout_sec=3.0)
    except ExternalShutdownException:
        code = 1  # ROS 被關掉，沒等到結果；也沒辦法再通知 server 取消
    finally:
        node.destroy_node()
        rclpy.try_shutdown()
    return code


if __name__ == '__main__':
    sys.exit(main())
