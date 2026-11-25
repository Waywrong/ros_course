#!/usr/bin/env bash
# 無人載具技術與應用（ROS 2）：在乾淨的 Ubuntu 24.04 上安裝課程環境。
# Build the course environment on a clean Ubuntu 24.04 (VM image or a student's own install).
#
#   bash setup_jazzy.sh            # 安裝（用自己的帳號執行，不要加 sudo；過程中會問密碼）
#   bash setup_jazzy.sh --check    # 只檢查套件能不能裝（模擬安裝，含相依性），不安裝
#
# 可重複執行：已裝好的部分會跳過。
set -euo pipefail

CHECK_ONLY=0
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=1

# 課程用到的套件（依週次）
PKGS=(
  ros-jazzy-desktop              # W03 起：ROS 2 本體、RViz、turtlesim、rqt
  ros-dev-tools                  # W04：colcon、rosdep 等建置工具
  ros-jazzy-rosbag2-storage-mcap # W09：rosbag（Jazzy 預設存成 mcap）
  ros-jazzy-ros-gz               # W12：Gazebo（Harmonic）與 ROS 2 的橋接
  ros-jazzy-turtlebot3-gazebo    # W12：TurtleBot3 模擬
  ros-jazzy-turtlebot3-teleop    # W12：鍵盤控制
  ros-jazzy-slam-toolbox         # W13：SLAM
  ros-jazzy-navigation2          # W14：Nav2
  ros-jazzy-nav2-bringup         # W14
  ros-jazzy-nav2-loopback-sim    # W14：不需要 Gazebo 的輕量模擬（給沒有顯卡的電腦）
  ros-jazzy-rosbridge-suite      # W15：網頁控制
  ros-jazzy-cv-bridge            # W16：OpenCV ↔ ROS 影像
  python3-opencv                 # W16
)
# ROS 2 套件來源的安裝包，釘在固定版本：全班在學校同一個對外 IP 後面時，
# 不必每個人都去問 GitHub API（未登入每小時只能 60 次）。下載失敗才退回查最新版。
ROS_APT_SOURCE_VERSION=1.3.0
MIN_FREE_GB=15   # 粗估值，2026-12 VM 實測後更新
# 剛開機時 Ubuntu 的自動更新常佔住 dpkg：最多等 10 分鐘，而不是直接失敗
APT=(apt-get -o DPkg::Lock::Timeout=600)

if [[ $CHECK_ONLY -eq 1 ]]; then
  missing=0
  for p in "${PKGS[@]}"; do
    if apt-cache show "$p" >/dev/null 2>&1; then echo "OK      $p"; else echo "MISSING $p"; missing=1; fi
  done
  [[ $missing -eq 0 ]] || exit 1
  # 模擬安裝：連相依套件一起解，確認整組在這個架構上裝得起來（不會真的安裝）
  if "${APT[@]}" install -s "${PKGS[@]}" >/tmp/setup_check_sim.log 2>&1; then
    echo "OK      simulated install of all packages ($(dpkg --print-architecture))"
  else
    echo "FAIL    simulated install:"; tail -20 /tmp/setup_check_sim.log; exit 1
  fi
  exit 0
fi

# --- 安裝前檢查 ---
if [[ $EUID -eq 0 ]]; then
  echo "請不要用 sudo 或 root 執行這個腳本：設定會裝到 /root，你自己的帳號什麼都沒有。" >&2
  echo "請直接執行：bash $0（不要加 sudo，需要時會自動問你的密碼）" >&2
  exit 1
fi
. /etc/os-release
if [[ "${VERSION_CODENAME:-}" != "noble" ]]; then
  echo "這個腳本只支援 Ubuntu 24.04 (noble)，目前是 ${PRETTY_NAME:-unknown}" >&2
  exit 1
fi
if [[ -f /etc/apt/sources.list.d/ros2.list ]] && ! dpkg -s ros2-apt-source >/dev/null 2>&1; then
  # 舊的安裝方式留下的設定，和新的 ros2-apt-source 會衝突（apt update 報 Signed-By 衝突）
  echo "偵測到舊的 ROS 2 套件來源設定 /etc/apt/sources.list.d/ros2.list。" >&2
  echo "請先移除後再執行一次：" >&2
  echo "  sudo rm /etc/apt/sources.list.d/ros2.list /usr/share/keyrings/ros-archive-keyring.gpg" >&2
  exit 1
fi
free_gb=$(df -Pk / | awk 'NR==2 {print int($4/1024/1024)}')
if (( free_gb < MIN_FREE_GB )); then
  echo "硬碟剩餘空間 ${free_gb} GB，建議至少 ${MIN_FREE_GB} GB。請先清出空間（或把 VM 的硬碟加大）。" >&2
  exit 1
fi

echo "== 1/4 語系與基本工具"
sudo "${APT[@]}" update
sudo "${APT[@]}" install -y locales curl software-properties-common
# ROS 2 需要 UTF-8 語系。已經是 UTF-8（包括中文 zh_TW.UTF-8）就不動，避免把介面改成英文
if [[ "$(locale charmap 2>/dev/null)" != "UTF-8" ]]; then
  sudo locale-gen en_US.UTF-8
  sudo update-locale LANG=en_US.UTF-8
  export LANG=en_US.UTF-8
fi
# -n：只加來源、不在這裡更新；下一步的 apt-get update 有等待 dpkg 鎖的設定
sudo add-apt-repository -y -n universe

echo "== 2/4 加入 ROS 2 套件來源"
if ! dpkg -s ros2-apt-source >/dev/null 2>&1; then
  url="https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.noble_all.deb"
  if ! curl -fL -o /tmp/ros2-apt-source.deb "$url"; then
    echo "固定版本下載失敗，改查最新版..." >&2
    ver=$(curl -fsSL https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest \
          | grep -F '"tag_name"' | awk -F'"' '{print $4}')
    curl -fL -o /tmp/ros2-apt-source.deb \
      "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ver}/ros2-apt-source_${ver}.noble_all.deb"
  fi
  sudo "${APT[@]}" install -y /tmp/ros2-apt-source.deb
fi
sudo "${APT[@]}" update

echo "== 3/4 安裝課程套件（第一次約需 20–40 分鐘）"
sudo "${APT[@]}" install -y "${PKGS[@]}"
if [[ ! -f /etc/ros/rosdep/sources.list.d/20-default.list ]]; then
  sudo rosdep init
fi
rosdep update

echo "== 4/4 設定 ~/.bashrc"
add_line() { grep -qxF "$1" ~/.bashrc || echo "$1" >> ~/.bashrc; }
add_line '# --- ROS 2 course ---'
add_line 'source /opt/ros/jazzy/setup.bash'
add_line 'export TURTLEBOT3_MODEL=burger'
add_line '[ -f ~/ros2_ws/install/setup.bash ] && source ~/ros2_ws/install/setup.bash'
# ROS_DOMAIN_ID 用老師發的號碼（1–99），見 docs/environment-checklist.md
add_line '# export ROS_DOMAIN_ID=<老師發的號碼>   # 上課時一定要設'
mkdir -p ~/ros2_ws/src

echo "完成。請開一個新的終端機，執行：ros2 run turtlesim turtlesim_node"
