"""W05 一般程式：每秒印一次計數，和 ROS 無關。

下一個檔案 counter_node.py 會把它改成 ROS node，比較兩者差在哪裡。
ROS 1 版沒有對應的檔案（ROS 1 講義的 Class-5 直接從 C++ 程式改起）。
"""
import time


def main():
    count = 0
    while True:
        print(f'plain counter: {count}')
        count += 1
        time.sleep(1.0)


if __name__ == '__main__':
    main()
