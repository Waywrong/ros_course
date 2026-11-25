"""期末考前複習：猜數字 client，從鍵盤輸入數字，送給 guess_num_srv，猜中為止。

用法：ros2 run final_review guess_client
ROS 1 版沒有對應的 client（ROS 1 用 rosservice call 猜）。
也可以不寫 client，直接用指令猜：
  ros2 service call /guess_num_srv course_interfaces/srv/SrvGuessNum "{a: 15}"
"""
import rclpy
from rclpy.node import Node
from course_interfaces.srv import SrvGuessNum


def main():
    rclpy.init()
    node = Node('guess_client')
    client = node.create_client(SrvGuessNum, 'guess_num_srv')
    while not client.wait_for_service(timeout_sec=1.0):
        node.get_logger().info('waiting for guess_num_srv ...')
    try:
        while True:
            text = input('guess a number: ')
            if not text.strip().lstrip('-').isdigit():
                print('please type an integer')
                continue
            future = client.call_async(SrvGuessNum.Request(a=int(text)))
            rclpy.spin_until_future_complete(node, future)
            result = future.result().result
            print(result)
            if 'Awesome' in result:
                break
    except (KeyboardInterrupt, EOFError):
        pass
    node.destroy_node()
    rclpy.try_shutdown()


if __name__ == '__main__':
    main()
