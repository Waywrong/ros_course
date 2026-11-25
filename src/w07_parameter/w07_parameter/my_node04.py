"""W07 parameter：用參數 period 控制多久印一次。

ROS 1 的參數放在全域的 parameter server（n.getParam("/para_Period")）；
ROS 2 的參數「屬於某個 node」，要先 declare 才能用。

試試看：
  ros2 run w07_parameter my_node04                                # 預設 3 秒
  ros2 run w07_parameter my_node04 --ros-args -p period:=1        # 啟動時指定（整數、小數都可以）
  ros2 param list /my_node04
  ros2 param describe /my_node04 period
  ros2 param set /my_node04 period 0.5                            # 執行中修改，馬上生效
  ros2 param set /my_node04 period -1                             # 不合理的值會被拒絕
  ros2 launch w07_parameter my_node04.launch.py                   # 從 YAML 檔讀
對照 ROS 1 版 my_work04/src/myNode04.cpp。
"""
import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from rclpy.parameter import Parameter
from rcl_interfaces.msg import ParameterDescriptor, SetParametersResult

DEFAULT_PERIOD = 3.0


def valid_period(value):
    """period 必須是數字（整數或小數）而且 > 0。"""
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0


class MyNode04(Node):
    def __init__(self):
        super().__init__('my_node04')
        # 宣告參數與預設值。dynamic_typing=True：學生打 period:=1（整數）或 1.0（小數）都接受，
        # 否則 ROS 2 會因為「預設值是小數、輸入是整數」而拒絕
        self.declare_parameter('period', DEFAULT_PERIOD, ParameterDescriptor(
            description='每隔幾秒印一次（必須 > 0）', dynamic_typing=True))
        period = self.get_parameter('period').value
        if not valid_period(period):
            self.get_logger().error(f'period={period!r} 不合理，改用預設值 {DEFAULT_PERIOD}')
            period = DEFAULT_PERIOD
            # 參數本身也改回預設值，ros2 param get 看到的才會和實際一樣
            self.set_parameters([Parameter('period', value=DEFAULT_PERIOD)])
        self.period = float(period)
        self.count = 0
        self.timer = self.create_timer(self.period, self.on_timer)
        # 參數被 ros2 param set 修改時分兩步：
        # 1. on_set：先檢查，不合理就拒絕（這時值還沒改）
        # 2. post_set：值已經改好，才去換 timer
        self.add_on_set_parameters_callback(self.check_params)
        self.add_post_set_parameters_callback(self.apply_params)

    def on_timer(self):
        self.get_logger().info(f'my_node04: hi :{self.count} @{self.period:4.2f} sec')
        self.count += 1

    def check_params(self, params):
        for p in params:
            if p.name == 'period' and not valid_period(p.value):
                return SetParametersResult(successful=False, reason='period must be a number > 0')
        return SetParametersResult(successful=True)

    def apply_params(self, params):
        for p in params:
            if p.name == 'period':
                self.period = float(p.value)
                self.destroy_timer(self.timer)  # 把舊的 timer 拿掉，換一個新週期的
                self.timer = self.create_timer(self.period, self.on_timer)


def main():
    try:
        rclpy.init()
        node = MyNode04()
        rclpy.spin(node)
        node.destroy_node()
    except (KeyboardInterrupt, ExternalShutdownException):
        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息
    finally:
        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS


if __name__ == '__main__':
    main()
