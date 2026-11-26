# 無人載具技術與應用：ROS 2 Jazzy 課程範例（`ros2` 分支）

2027 Spring 起，課程改用 **ROS 2 Jazzy**（Ubuntu 24.04）。這個分支是上課用的範例程式、安裝腳本和學生文件；主線用 Python（rclpy），W04 另附一組 C++ 對照。

**ROS 1（Noetic／catkin）的舊版**在這個 repo 的 `main` 分支，兩個分支沒有共同的歷史。

## 取得與更新

課程 VM 映像裡已經放好了。自己安裝的人（Mac、自己裝好的 Ubuntu 24.04），請照 [環境檢查表](docs/environment-checklist.md) 的「自己安裝的人：取得程式碼」做：

```bash
sudo apt-get -o DPkg::Lock::Timeout=600 install -y git    # Ubuntu 24.04 桌面版預設沒有 git
git clone -b ros2 https://github.com/Waywrong/ros_course.git ~/ros2_ws/src/ros_course
bash ~/ros2_ws/src/ros_course/setup/setup_jazzy.sh      # 不要加 sudo
```

每週上課前：

```bash
cd ~/ros2_ws/src/ros_course
git branch --show-current     # 要印出 ros2；印出 main 的話先執行 git switch ros2
git pull
cd ~/ros2_ws && colcon build --symlink-install
```

建置完開一個新的終端機。自己的作業不要改在 `ros_course` 裡，請在 `~/ros2_ws/src/` 底下另開套件，否則 `git pull` 會衝突。`git pull` 失敗時的救法見環境檢查表。

## 內容

| 資料夾 | 週次 | 內容 | 對照 ROS 1 版（`main` 分支） |
|---|---|---|---|
| `src/course_interfaces` | W06、W08、期末 | 自訂的 service／action 定義 | `ros_tutorials_service`、`ros_tutorials_action`、`finalExam` 的 srv／action |
| `src/w04_pubsub` | W04 | talker／listener（Python） | `my_work01` |
| `src/w04_pubsub_cpp` | W04 | talker／listener（C++ 對照） | `my_work01` |
| `src/w05_node` | W05 | 一般程式改成 ROS node；訂閱 `cmd` 的 `cmd_listener`（topic 改名 remapping） | `my_work03`、`my_work02` |
| `src/w06_service` | W06 | 加法 service | `ros_tutorials_service` |
| `src/w07_parameter` | W07 | 參數、YAML、launch | `my_work04` |
| `src/w08_action` | W08 | 費氏數列 action（feedback、可取消） | `ros_tutorials_action` |
| `src/w09_launch` | W09 | 一次啟動多個 node；launch 的條件與 include；rosbag 練習 | `my_work01/launch`、`my_work04/launch` |
| `src/final_review` | 期末複習 | 猜數字 service | `finalExam` |
| `setup/setup_jazzy.sh` | W02 | 在 Ubuntu 24.04 上安裝課程環境 | — |
| `docs/environment-checklist.md` | W01 | 環境檢查表 | — |
| `docs/`（其他檔案） | W04 | 動畫講義網站，見下方 | — |

## 動畫講義

**https://waywrong.github.io/ros_course/** ：用動畫說明每週的觀念，有小測驗和練習。目前有 W04 的兩章：「訊息怎麼從 talker 到 listener」、「從 colcon build 到 ros2 run」。旁白是中文；按 C（手機上按播放列的 CC 鈕）依序切換「關 → 中文 → 英文」字幕，選英文時題目也是英文。用手機看請把手機轉成橫向：iPhone 的 Safari 不支援全螢幕。網頁的原始檔在這個分支的 `docs/`。

## 授權

- **程式碼**（`src/`、`setup/`）：MIT，見 [`LICENSE`](LICENSE)。
- **講義、文件與課程網頁**：CC BY-NC-SA 4.0，見 [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)。
- **動畫講義的播放程式**：`docs/lib/` 裡的 `engine.*`、`contents.*`、`units.*`、`volume.*`、`math.js` 改自開源專案 Papermorph（加了繁體中文介面和字幕語言切換），MIT，見 [`docs/lib/LICENSE-papermorph`](docs/lib/LICENSE-papermorph)。其餘網頁檔（包括畫角色和場景的 `robots.js`、`rooms.js`、`screens.js`、`workshop.js`）是課程網頁，照上一條。

---

# Unmanned Vehicle Technology and Applications: ROS 2 Jazzy course examples (`ros2` branch)

From 2027 Spring the course uses **ROS 2 Jazzy** on Ubuntu 24.04. This branch holds the in-class examples, the setup script and student docs. Python (rclpy) is the main line, plus a C++ talker/listener in W04 for comparison.

**The ROS 1 (Noetic/catkin) version** is on this repo's `main` branch. The two branches share no history.

## Getting and updating the code

The course VM image already has it. If you install it yourself (Mac, or your own Ubuntu 24.04), follow "Installing it yourself: get the code" in the [environment checklist](docs/environment-checklist.md):

```bash
sudo apt-get -o DPkg::Lock::Timeout=600 install -y git    # Ubuntu 24.04 desktop has no git by default
git clone -b ros2 https://github.com/Waywrong/ros_course.git ~/ros2_ws/src/ros_course
bash ~/ros2_ws/src/ros_course/setup/setup_jazzy.sh      # no sudo
```

Before each class:

```bash
cd ~/ros2_ws/src/ros_course
git branch --show-current     # must print ros2; if it prints main, run git switch ros2
git pull
cd ~/ros2_ws && colcon build --symlink-install
```

Open a new terminal after building. Keep your homework out of `ros_course`: make your own package under `~/ros2_ws/src/`, or `git pull` will conflict. If `git pull` fails, see the environment checklist.

## Contents

The table above lists each folder, its week, what it covers and its ROS 1 counterpart on the `main` branch.

## Animated lessons

**https://waywrong.github.io/ros_course/**: each week's ideas as short animations, with quick checks and practice. So far, the two W04 chapters: how a message gets from talker to listener, and from colcon build to ros2 run. The narration is in Chinese; press C (on a phone, the CC button in the player bar) to cycle the captions off → Chinese → English; with English, the questions are in English too. On a phone, turn it sideways: Safari on iPhone has no full screen. The site's files are in `docs/` on this branch.

## License

- **Code** (`src/`, `setup/`): MIT, see [`LICENSE`](LICENSE).
- **Slides, docs and the course web pages**: CC BY-NC-SA 4.0, see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).
- **The animated lessons' player**: `engine.*`, `contents.*`, `units.*`, `volume.*` and `math.js` in `docs/lib/` are adapted from the open-source Papermorph project (with a Traditional Chinese interface and caption languages added), MIT, see [`docs/lib/LICENSE-papermorph`](docs/lib/LICENSE-papermorph). The other web files (including `robots.js`, `rooms.js`, `screens.js` and `workshop.js`, which draw the characters and scenes) are course web pages, under the previous item.
