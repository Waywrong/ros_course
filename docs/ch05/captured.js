// Generated: do not edit. Terminal output captured in a ros:jazzy container from the course's examples
// (src/w04_pubsub), and the course's files (the package's own and setup/setup_jazzy.sh), copied verbatim.
'use strict';
const CAPTURED = {
 "lsBefore": [
  "$ ls",
  "src"
 ],
 "lsAfter": [
  "$ ls",
  "build",
  "install",
  "log",
  "src"
 ],
 "srcTree": [
  "$ find src/w04_pubsub -not -path \"*/__pycache__*\" | sort",
  "src/w04_pubsub",
  "src/w04_pubsub/package.xml",
  "src/w04_pubsub/resource",
  "src/w04_pubsub/resource/w04_pubsub",
  "src/w04_pubsub/setup.cfg",
  "src/w04_pubsub/setup.py",
  "src/w04_pubsub/w04_pubsub",
  "src/w04_pubsub/w04_pubsub/__init__.py",
  "src/w04_pubsub/w04_pubsub/listener.py",
  "src/w04_pubsub/w04_pubsub/talker.py"
 ],
 "colcon": [
  "$ colcon build --symlink-install --packages-select w04_pubsub",
  "Starting >>> w04_pubsub",
  "Finished <<< w04_pubsub [0.64s]",
  "",
  "Summary: 1 package finished [0.70s]"
 ],
 "installLib": [
  "$ ls install/w04_pubsub/lib/w04_pubsub",
  "listener",
  "talker"
 ],
 "marker": [
  "$ ls install/w04_pubsub/share/ament_index/resource_index/packages",
  "w04_pubsub"
 ],
 "talkerScript": [
  "$ cat install/w04_pubsub/lib/w04_pubsub/talker",
  "#!/usr/bin/python3",
  "# EASY-INSTALL-ENTRY-SCRIPT: 'w04-pubsub','console_scripts','talker'",
  "import re",
  "import sys",
  "",
  "# for compatibility with easy_install; see #2198",
  "__requires__ = 'w04-pubsub'",
  "",
  "try:",
  "    from importlib.metadata import distribution",
  "except ImportError:",
  "    try:",
  "        from importlib_metadata import distribution",
  "    except ImportError:",
  "        from pkg_resources import load_entry_point",
  "",
  "",
  "def importlib_load_entry_point(spec, group, name):",
  "    dist_name, _, _ = spec.partition('==')",
  "    matches = (",
  "        entry_point",
  "        for entry_point in distribution(dist_name).entry_points",
  "        if entry_point.group == group and entry_point.name == name",
  "    )",
  "    return next(matches).load()",
  "",
  "",
  "globals().setdefault('load_entry_point', importlib_load_entry_point)",
  "",
  "",
  "if __name__ == '__main__':",
  "    sys.argv[0] = re.sub(r'(-script\\.pyw?|\\.exe)?$', '', sys.argv[0])",
  "    sys.exit(load_entry_point('w04-pubsub', 'console_scripts', 'talker')())"
 ],
 "eggLink": [
  "$ cat install/w04_pubsub/lib/python3.12/site-packages/w04-pubsub.egg-link",
  "/home/ubuntu/ros2_ws/build/w04_pubsub",
  "."
 ],
 "buildLink": [
  "$ ls -l build/w04_pubsub/w04_pubsub",
  "lrwxrwxrwx 1 ubuntu ubuntu 46 Nov 26 06:55 build/w04_pubsub/w04_pubsub -> /home/ubuntu/ros2_ws/src/w04_pubsub/w04_pubsub"
 ],
 "prefixBefore": [
  "$ echo $AMENT_PREFIX_PATH",
  "/opt/ros/jazzy"
 ],
 "prefixAfter": [
  "$ echo $AMENT_PREFIX_PATH",
  "/home/ubuntu/ros2_ws/install/w04_pubsub:/opt/ros/jazzy"
 ],
 "pkgPrefix": [
  "$ ros2 pkg prefix w04_pubsub",
  "/home/ubuntu/ros2_ws/install/w04_pubsub"
 ],
 "pkgExecutables": [
  "$ ros2 pkg executables w04_pubsub",
  "w04_pubsub listener",
  "w04_pubsub talker"
 ],
 "runBeforeBuild": [
  "$ ros2 run w04_pubsub talker",
  "Package 'w04_pubsub' not found"
 ],
 "runBeforeSource": [
  "$ ros2 run w04_pubsub talker",
  "Package 'w04_pubsub' not found"
 ],
 "runNoExec": [
  "$ ros2 run w04_pubsub talker2",
  "No executable found"
 ],
 "runTalker": [
  "$ timeout -s INT 1.5 ros2 run w04_pubsub talker",
  "[INFO] [1795676158.863164386] [talker]: hello world 0",
  "[INFO] [1795676158.949632886] [talker]: hello world 1",
  "[INFO] [1795676159.052345303] [talker]: hello world 2",
  "[INFO] [1795676159.150077886] [talker]: hello world 3",
  "[INFO] [1795676159.250466845] [talker]: hello world 4",
  "[INFO] [1795676159.350057803] [talker]: hello world 5",
  "[INFO] [1795676159.451602512] [talker]: hello world 6",
  "[INFO] [1795676159.549574928] [talker]: hello world 7",
  "[INFO] [1795676159.649018470] [talker]: hello world 8",
  "[INFO] [1795676159.752289220] [talker]: hello world 9",
  "[INFO] [1795676159.850967262] [talker]: hello world 10"
 ],
 "sourceCmd": "$ source install/setup.bash"
};
const FILES = {
 "setup.py": [
  "from setuptools import setup",
  "",
  "package_name = 'w04_pubsub'",
  "",
  "setup(",
  "    name=package_name,",
  "    version='0.1.0',",
  "    packages=[package_name],",
  "    data_files=[",
  "        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),",
  "        ('share/' + package_name, ['package.xml']),",
  "    ],",
  "    install_requires=['setuptools'],",
  "    zip_safe=True,",
  "    maintainer='course',",
  "    maintainer_email='noreply@example.com',",
  "    description='W04 第一個 publisher / subscriber（Python）',",
  "    license='MIT',",
  "    entry_points={",
  "        'console_scripts': [",
  "            'talker = w04_pubsub.talker:main',",
  "            'listener = w04_pubsub.listener:main',",
  "        ],",
  "    },",
  ")"
 ],
 "setup.cfg": [
  "[develop]",
  "script_dir=$base/lib/w04_pubsub",
  "[install]",
  "install_scripts=$base/lib/w04_pubsub"
 ],
 "package.xml": [
  "<?xml version=\"1.0\"?>",
  "<?xml-model href=\"http://download.ros.org/schema/package_format3.xsd\" schematypens=\"http://www.w3.org/2001/XMLSchema\"?>",
  "<package format=\"3\">",
  "  <name>w04_pubsub</name>",
  "  <version>0.1.0</version>",
  "  <description>W04 第一個 publisher / subscriber（Python）</description>",
  "  <maintainer email=\"noreply@example.com\">course</maintainer>",
  "  <license>MIT</license>",
  "",
  "  <exec_depend>rclpy</exec_depend>",
  "  <exec_depend>std_msgs</exec_depend>",
  "",
  "  <export>",
  "    <build_type>ament_python</build_type>",
  "  </export>",
  "</package>"
 ],
 "talker.py": [
  "\"\"\"W04 talker：每秒 10 次在 chatter topic 送出 \"hello world N\"。",
  "",
  "對照 ROS 1 版 my_work01/src/talk.cpp：",
  "- ros::init + NodeHandle      → rclpy.init() + 繼承 Node 的類別",
  "- n.advertise<String>(...)    → self.create_publisher(String, ...)",
  "- while (ros::ok()) + Rate    → self.create_timer(0.1, callback)，由 rclpy.spin() 驅動",
  "- ROS_INFO                    → self.get_logger().info",
  "\"\"\"",
  "import rclpy",
  "from rclpy.executors import ExternalShutdownException",
  "from rclpy.node import Node",
  "from std_msgs.msg import String",
  "",
  "",
  "class Talker(Node):",
  "    def __init__(self):",
  "        super().__init__('talker')  # node 名稱為 talker",
  "        # 建立 publisher：topic 名稱 chatter，型別 std_msgs/msg/String",
  "        # 10 是 queue 深度（QoS）：送太快、對方來不及收時，最多保留 10 則",
  "        self.pub = self.create_publisher(String, 'chatter', 10)",
  "        self.count = 0",
  "        # ROS 2 不寫 while 迴圈，改用 timer：每 0.1 秒（10 Hz）呼叫一次 on_timer",
  "        self.timer = self.create_timer(0.1, self.on_timer)",
  "",
  "    def on_timer(self):",
  "        msg = String()  # 建立暫存的 message，填好資料再送出",
  "        msg.data = f'hello world {self.count}'",
  "        self.get_logger().info(msg.data)",
  "        self.pub.publish(msg)",
  "        self.count += 1",
  "",
  "",
  "def main():",
  "    try:",
  "        rclpy.init()",
  "        node = Talker()",
  "        rclpy.spin(node)  # 進入迴圈，持續處理 timer 與 callback，直到 Ctrl-C",
  "        node.destroy_node()",
  "    except (KeyboardInterrupt, ExternalShutdownException):",
  "        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息",
  "    finally:",
  "        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS",
  "",
  "",
  "if __name__ == '__main__':",
  "    main()"
 ],
 "listener.py": [
  "\"\"\"W04 listener：訂閱 chatter topic，收到就印出來。",
  "",
  "對照 ROS 1 版 my_work01/src/listener.cpp：",
  "- n.subscribe(\"chatter\", 1000, chatterCallback) → self.create_subscription(String, 'chatter', callback, 10)",
  "- ros::spin()                                   → rclpy.spin(node)",
  "\"\"\"",
  "import rclpy",
  "from rclpy.executors import ExternalShutdownException",
  "from rclpy.node import Node",
  "from std_msgs.msg import String",
  "",
  "",
  "class Listener(Node):",
  "    def __init__(self):",
  "        super().__init__('listener')  # node 名稱為 listener",
  "        # 收到 chatter 上的 message 時，呼叫 self.on_message",
  "        self.sub = self.create_subscription(String, 'chatter', self.on_message, 10)",
  "",
  "    def on_message(self, msg):",
  "        # msg.data 就是 talker 填進去的字串",
  "        self.get_logger().info(f'I heard: [{msg.data}]')",
  "",
  "",
  "def main():",
  "    try:",
  "        rclpy.init()",
  "        node = Listener()",
  "        rclpy.spin(node)",
  "        node.destroy_node()",
  "    except (KeyboardInterrupt, ExternalShutdownException):",
  "        pass  # Ctrl-C 或系統關閉時正常結束，不印錯誤訊息",
  "    finally:",
  "        rclpy.try_shutdown()  # 放在 finally：不管怎麼離開都會關閉 ROS",
  "",
  "",
  "if __name__ == '__main__':",
  "    main()"
 ],
 "marker": {
  "path": "resource/w04_pubsub",
  "bytes": 0
 },
 "bashrc": "[ -f ~/ros2_ws/install/setup.bash ] && source ~/ros2_ws/install/setup.bash"
};
