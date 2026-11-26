# 環境檢查表（第 1 週發下；用自己筆電的人第 2 週上課前完成，用教室電腦的人第 2 週在教室完成）

課程用 **ROS 2 Jazzy**，作業系統是 **Ubuntu 24.04**，一律在虛擬機（VM）裡執行。

> 標「待確認」的地方，要等 2026-12 VM 實測或第一堂課在教室確認後才填上。

## A. 學校電腦（Windows 11 + VMware Workstation）

1. **取得 VM 映像**：兩種方式並行。
   - **提前下載（建議）**：開學前老師會公布 Google Drive 網址。自備筆電的人直接下載到筆電；用教室電腦的人，先在家下載到自己的隨身碟，上課時再複製到下面第 2 點的那一槽。不要等到上課當天：全班同時下載會很慢，雲端硬碟對熱門檔案也有下載配額。
   - **隨身碟要格式化成 exFAT**：FAT32 放不下超過 4 GB 的檔案，VM 映像會複製失敗；NTFS 在 Mac 上只能讀、不能寫。exFAT 在 Windows 和 Mac 上都能讀寫。
   - **現場複製**：來不及下載的同學，上課時用老師帶的隨身碟複製。
2. **放在不會被還原的磁碟**：教室電腦裝有還原卡，重開機會清掉大部分的磁碟。VM 一律放在老師指定、不會被還原的那一槽（上課時說明）。
   作業請另存到 git 或隨身碟。
3. **開啟 VM**：VMware → 開啟虛擬機 → 選擇 `.vmx`。
   第一次開機時，VMware 會問這台 VM 是「移動」還是「複製」來的，**請選「我已複製」（I Copied It）**。
   這樣每台 VM 會有不同的網路卡位址，全班才不會互相衝突。
4. **VM 設定**：記憶體 4 GB、處理器 2 核以上（第 3–9 週夠用；第 12–14 週的 Gazebo／Nav2 需要多少待確認）。
5. **3D 加速**：映像預設是**關閉**，不要自己打開（教室電腦沒有獨立顯卡）。第一堂課會在教室確認一次。
   如果某個程式的視窗是黑的（例如 RViz、Gazebo），在開那個程式的終端機執行 `export LIBGL_ALWAYS_SOFTWARE=1`，再開一次程式，改用軟體繪圖。這行只對**同一個終端機**有效；每次都需要的話，把它加到 `~/.bashrc` 最後一行。如果開機後整個畫面都是黑的，請老師協助。
6. **帳號密碼**：上課時公布。
7. **課程程式碼**：VM 裡已經放好，在 `~/ros2_ws/src/ros_course`。每週上課前照下方「每週上課前：更新程式碼」做。自己的作業不要改在 `ros_course` 裡，請在 `~/ros2_ws/src/` 底下另開套件，否則 `git pull` 會衝突。

## B. 自己的筆電

| 你的電腦 | 做法 |
|---|---|
| Windows（Intel／AMD） | 安裝 VMware Workstation Pro（17 或更新版，個人使用免費。新版改用年份命名，例如 25H2；下載需要 Broadcom 帳號），然後照 A 的步驟做 |
| Mac（Apple Silicon，M 系列晶片） | 不能用 A 的映像（架構不同），請看下方「Mac（Apple Silicon）」 |
| Mac（Intel） | 安裝 VMware Fusion，照 A 的步驟做 |
| 已經裝好 Ubuntu 24.04 | 照下方「自己安裝的人：取得程式碼」做（執行 `setup_jazzy.sh` 時**不要加 sudo**） |

硬碟要留 15 GB 以上的空間（粗估，實測後更新）。

### Mac（Apple Silicon）

> 以下步驟還沒在 Apple Silicon 上完整實測，12 月實測後更新。Mac 沒有現成的映像，請照下面的步驟自己安裝。

1. **虛擬機軟體**：建議用 **VMware Fusion**（個人使用免費，操作和教室的 VMware 一樣；要登入 Broadcom 帳號才能下載）。UTM（免費）也可以，**建立 VM 時要選「Virtualize」，不要選「Emulate」**，選 Emulate 會用軟體模擬 x86，慢到沒辦法上課。Parallels 要付費。
2. **作業系統映像**：一定要下載 **ARM64（arm64）** 版的 Ubuntu 24.04。ubuntu.com 下載頁預設給的是 x86（amd64）版，用不了。到官方目錄下載（約 4 GB）：
   <https://cdimage.ubuntu.com/releases/noble/release/>
   選檔名結尾是 **`-desktop-arm64.iso`**、版本號最大的那個（例如 `ubuntu-24.04.5-desktop-arm64.iso`），不要選 Raspberry Pi 用的 `.img.xz`。下載後用同一頁的 `SHA256SUMS` 核對：在 Mac 的「終端機」執行 `shasum -a 256 檔名`（較新的 macOS 也可以用 `sha256sum 檔名`），結果要和 `SHA256SUMS` 裡那一行相同。
3. **VM 設定**：記憶體 4 GB、處理器 2 核以上、硬碟 30 GB 以上。
4. **如果裝的是 Server 版（沒有桌面）**：先執行 `sudo apt-get -o DPkg::Lock::Timeout=600 install -y ubuntu-desktop-minimal` 再重開機，否則烏龜視窗開不出來。
5. 開機後照下方「自己安裝的人：取得程式碼」做（執行 `setup_jazzy.sh` 時**不要加 sudo**），再做下面 C 的檢查。
6. **第 12–14 週的 Gazebo**：Mac 的 VM 3D 效能有限，Gazebo 可能很慢或開不起來。這幾週可以改用不需要 Gazebo 的輕量模擬（Nav2 loopback simulator），上課時會說明。

### 自己安裝的人：取得程式碼

不是用老師的 VM 映像的人（Mac、自己裝好的 Ubuntu 24.04），先取得課程程式碼，再執行安裝腳本：

```bash
sudo apt-get -o DPkg::Lock::Timeout=600 install -y git    # 剛開機時系統可能正在自動更新，這樣會等它完成
git clone -b ros2 https://github.com/Waywrong/ros_course.git ~/ros2_ws/src/ros_course
bash ~/ros2_ws/src/ros_course/setup/setup_jazzy.sh      # 不要加 sudo，需要時腳本會自己問密碼
```

裝好之後**開一個新的終端機**，再做下面 C 的檢查。之後每週照「每週上課前：更新程式碼」做。

## 每週上課前：更新程式碼

```bash
cd ~/ros2_ws/src/ros_course
git branch --show-current     # 要印出 ros2。印出 main 表示 clone 時少了 -b ros2（那是 ROS 1 的舊版），先執行 git switch ros2
git pull
cd ~/ros2_ws && colcon build --symlink-install
```

建置完要**開一個新的終端機**，新一週的套件才找得到；否則 `ros2 run` 會出現 `Package not found`。

**`git pull` 失敗時**（例如你改過 `ros_course` 裡的檔案）：先把想留下的檔案複製到別的資料夾，再執行下面兩行，換成老師最新的版本。**這會丟掉你在 `ros_course` 裡的所有修改。**

```bash
cd ~/ros2_ws/src/ros_course
git fetch origin && git reset --hard origin/ros2
```

## C. 開機後的檢查（全部打勾才算完成；烏龜那兩項第 3 週上課時再做也可以）

- [ ] 開一個終端機，執行 `ros2 --help` 有出現說明
- [ ] `ros2 run turtlesim turtlesim_node` 有出現烏龜視窗
- [ ] 另開一個終端機，執行 `ros2 run turtlesim turtle_teleop_key`，用方向鍵可以讓烏龜移動
- [ ] 設定 `ROS_DOMAIN_ID`，用**老師發給你的號碼**（1–99，每人不同）：
  ```bash
  echo 'export ROS_DOMAIN_ID=37' >> ~/.bashrc   # 37 換成老師發給你的號碼
  source ~/.bashrc
  echo $ROS_DOMAIN_ID
  ```

**為什麼要設 `ROS_DOMAIN_ID`**：ROS 2 的程式會自動找到同一個網路上的其他 ROS 2 程式。VM 預設的網路模式（NAT）裡，同學之間其實互相看不到；但有幾週要切換成「橋接」模式，讓 VM 直接連上教室網路，例如連到別台電腦或網頁控制。到那時候，大家如果用同一個號碼，就可能控制到同學的機器人。所以從第一週起，每個人就用不同的號碼。

號碼由老師依名單發，不用學號末兩碼：選修課跨系跨年級，末兩碼很容易重複，而且末兩碼是 `00` 的話等於沒設（0 就是預設值）。

---

# Environment checklist (handed out in week 1; on your own laptop, done before week 2; on a classroom PC, done in class in week 2)

The course uses **ROS 2 Jazzy** on **Ubuntu 24.04**, always inside a virtual machine.

> Items marked "to be confirmed" are filled in after the December 2026 VM test or a check in the classroom in the first class.

## A. Classroom PCs (Windows 11 + VMware Workstation)
1. **Getting the VM image**: two ways, in parallel.
   - **Download in advance (recommended)**: before the semester the instructor posts a Google Drive link. If you have a laptop, download it there; if you use a classroom PC, download it at home to your own USB stick and copy it to the drive in item 2 in class. Don't wait for class day: a whole class downloading at once is slow, and cloud drives cap downloads of popular files.
   - **Format the USB stick as exFAT**: FAT32 can't hold files over 4 GB, so copying the VM image fails, and macOS can read NTFS but not write it. exFAT works for reading and writing on both Windows and Mac.
   - **Copy in class**: if you couldn't download it, copy it from the instructor's USB sticks in class.
2. **Use a drive that isn't restored**: the classroom PCs have restore cards that wipe most drives on reboot. Always keep the VM on the drive the instructor names, which is not restored (explained in class). Keep homework in git or on a USB stick.
3. **Open the VM**: VMware → Open a Virtual Machine → the `.vmx`. On first boot VMware asks whether the VM was moved or copied: **choose "I Copied It"**, so each VM gets its own network address and the class doesn't collide.
4. **VM settings**: at least 4 GB RAM and 2 cores (enough for weeks 3–9; what weeks 12–14 need for Gazebo/Nav2 is to be confirmed).
5. **3D acceleration**: the image has it **off**; don't turn it on (the classroom PCs have no discrete GPU). It is checked once in the first class. If a program's window is black (for example RViz or Gazebo), run `export LIBGL_ALWAYS_SOFTWARE=1` in the terminal you start it from, then start it again (software rendering). It only applies to **that terminal**; if you always need it, add it as the last line of `~/.bashrc`. If the whole screen is black after boot, ask the instructor.
6. **Username and password**: announced in class.
7. **Course code**: already in the VM at `~/ros2_ws/src/ros_course`. Before each class, follow "Before each class: update the code" below. Don't edit your homework inside `ros_course`; make your own package under `~/ros2_ws/src/`, or `git pull` will conflict.

## B. Your own laptop

| Laptop | What to do |
|---|---|
| Windows (Intel/AMD) | Install VMware Workstation Pro (17 or newer, free for personal use; newer versions are named by year, e.g. 25H2; the download needs a Broadcom account), then follow A |
| Mac (Apple Silicon) | The image in A won't run (different architecture); see "Mac (Apple Silicon)" below |
| Mac (Intel) | Install VMware Fusion, then follow A |
| Ubuntu 24.04 already installed | Follow "Installing it yourself: get the code" below (run `setup_jazzy.sh` **without sudo**) |

Keep at least 15 GB of disk free (estimate, updated after testing).

### Mac (Apple Silicon)
> Not yet fully tested on Apple Silicon; updated after the December test. There is no ready-made image for Macs, so install it yourself with the steps below.
1. **VM software**: **VMware Fusion** is recommended (free for personal use, same workflow as the classroom VMware; the download needs a Broadcom account). UTM (free) also works: **choose "Virtualize", not "Emulate"**; Emulate runs x86 in software and is too slow for class. Parallels is paid.
2. **OS image**: download the **ARM64 (arm64)** Ubuntu 24.04 image. The default download on ubuntu.com is x86 (amd64) and won't work. Get it from the official directory (about 4 GB): <https://cdimage.ubuntu.com/releases/noble/release/>. Pick the file ending in **`-desktop-arm64.iso`** with the highest version (for example `ubuntu-24.04.5-desktop-arm64.iso`), not the Raspberry Pi `.img.xz`. Check it against `SHA256SUMS` on the same page: run `shasum -a 256 <file>` in the Mac's Terminal (newer macOS also has `sha256sum <file>`) and compare with that file's line in `SHA256SUMS`.
3. **VM settings**: at least 4 GB RAM, 2 cores and 30 GB disk.
4. **If you installed the Server edition (no desktop)**: run `sudo apt-get -o DPkg::Lock::Timeout=600 install -y ubuntu-desktop-minimal` and reboot first, or the turtle window can't open.
5. After booting, follow "Installing it yourself: get the code" below (run `setup_jazzy.sh` **without sudo**), then do the checks in C.
6. **Gazebo in weeks 12–14**: 3D in a Mac VM is limited, so Gazebo may be slow or fail to start. Those weeks can use the lightweight Nav2 loopback simulator instead, explained in class.

### Installing it yourself: get the code

If you don't use the instructor's VM image (Macs, or your own Ubuntu 24.04), get the course code first, then run the setup script:

```bash
sudo apt-get -o DPkg::Lock::Timeout=600 install -y git    # right after boot the system may be updating itself; this waits for it
git clone -b ros2 https://github.com/Waywrong/ros_course.git ~/ros2_ws/src/ros_course
bash ~/ros2_ws/src/ros_course/setup/setup_jazzy.sh      # no sudo; the script asks for your password when it needs it
```

When it finishes, **open a new terminal** and do the checks in C. After that, follow "Before each class: update the code" every week.

## Before each class: update the code

```bash
cd ~/ros2_ws/src/ros_course
git branch --show-current     # must print ros2. If it prints main, the clone missed -b ros2 (that's the old ROS 1 version): run git switch ros2
git pull
cd ~/ros2_ws && colcon build --symlink-install
```

After building, **open a new terminal** so the new week's packages are found; otherwise `ros2 run` says `Package not found`.

**If `git pull` fails** (for example, you edited files inside `ros_course`): copy anything you want to keep to another folder, then run the two lines below to switch to the instructor's latest version. **This discards all your changes inside `ros_course`.**

```bash
cd ~/ros2_ws/src/ros_course
git fetch origin && git reset --hard origin/ros2
```

## C. Checks after booting (all must pass; the two turtle checks can wait until the week 3 class)
- [ ] `ros2 --help` prints help
- [ ] `ros2 run turtlesim turtlesim_node` opens the turtle window
- [ ] In a second terminal, `ros2 run turtlesim turtle_teleop_key` moves the turtle with the arrow keys
- [ ] Set `ROS_DOMAIN_ID` to **the number the instructor gives you** (1–99, unique per student):
  ```bash
  echo 'export ROS_DOMAIN_ID=37' >> ~/.bashrc   # replace 37 with the number the instructor gave you
  source ~/.bashrc
  echo $ROS_DOMAIN_ID
  ```

**Why `ROS_DOMAIN_ID`**: ROS 2 programs find other ROS 2 programs on the same network automatically. In the VM's default network mode (NAT), classmates can't actually see each other. But in some weeks the VM is switched to "bridged" mode so it joins the classroom network directly (for example, to reach another computer or for web control). Then a shared number could let you drive a classmate's robot, so everyone uses a different number from week 1.

The instructor assigns the numbers from the class list instead of using the last two digits of the student ID: in a cross-department elective those collide easily, and `00` would mean "not set" (0 is the default).
