---
title: "Nuvoton NUC980 BuildRoot 學習紀錄"
date: 2025-09-14
categories: [embedded-Linux, buildroot, nuc980]
tags: [Nuvoton, NUC980, BuildRoot, Linux, BSP]
---

本文記錄在 Nuvoton NUC980 上使用 BuildRoot 建置/學習的歷程，包括環境、步驟、遇到的問題與解法，以及參考資源。目標是能快速從零建立可在 NUC980 上啟動的根檔系統（rootfs）與簡單的測試映像。

## 目的

- 熟悉 BuildRoot 的基本流程與配置方法。
- 了解 Nuvoton NUC980 的 BSP (Board Support Package) 與交叉編譯流程。
- 建置一個最小可用的 Linux rootfs 並在開發板上啟動。

## 開發與建置環境

- 主機：Ubuntu 20.04 (Nuvoton官方提供預建構好 虛擬機VMWARE)
- BuildRoot2024：官方虛擬機已經包含 BuildRoot2024 環境。
- 交叉工具鏈：BuildRoot 會自動下載/產生交叉工具鏈。
- 目標板：Nuvoton NUC980_iot 系列開發板（確保 Bootloader 與序列埠可用）

## 大致步驟

1. 取得 Nuvoton VMware 虛擬機 (NUC980 / MA35D1共用)
   - 從 Nuvoton 官方網站下載並安裝 VMware 虛擬機
   - 下載連結：https://www.nuvoton.com/resource-download.jsp?tp_GUID=SW182022101516122042

2. 下載 VMware_pro 免費版
   - 下載連結：官方網站 https://www.vmware.com/
   - 因為工具會持續進版，這邊不介紹怎麼下載與安裝，請自行搜尋相關教學。
   - 
3. 使用 VMware 開啟 Nuvoton 提供的虛擬機映像檔，並啟動虛擬機。
    - 預設帳號密碼：user / user
    - 登入後，確認網路連線正常。
4. 進入 buildroot_2024 目錄，並檢查有哪些 config 可用（例如 `nuc980_iot_defconfig`）。
   ```bash
   cd ~/buildroot_2024/configs
   ls | grep nuc980
   ```
5. 選擇適合的 defconfig，並開始建置
   ```bash
   make distclean
   make nuc980_iot_defconfig

   ```
6. buildroot 會自動下載所需的套件與工具鏈，這可能需要一段時間，耐心等待。
   ```bash
   make
   ```
7. 編譯完之後，將會看到五個主要image檔案：
   - `Image`：Linux 核心映像使用在Run 在DDR
   - `uImage`：Linux 核心映像使用在uboot開機時使用
   - `dtb`：Device Tree Blob, 敘述硬體資訊的二進位檔
   - `uboot.bin`：U-Boot Bootloader 映像
   - `u-boot-spl.bin`：Uboot第二階段 Bootloader 映像
   - Images,uImage,dbt 會放在 `output/images/` 目錄下。
   - u-boot.bin 會放在 `output/build/uboot-customer` 目錄下。
   - u-boot-spl.bin 會放在 `output/build/uboot-master/spl` 目錄下。

## 手動更改 BuildRoot 配置
- 若需要修改 BuildRoot 配置，可以使用 `make menuconfig` 進行圖形化配置。
- 修改完成後，重新執行 `make` 進行建置。

## Linux 5.10 RootFS Build Guide

1. 進入 BuildRoot 目錄
   ```bash
   cd ~/buildroot_2024
   ```

2. 設定目標平台為 NUC980
   ```bash
   make nuc980_iot_defconfig
   ```

3. 進入 menuconfig 設定 RootFS
   ```bash
   make menuconfig
   ```
   - Filesystem images  --->
    a.   enable ubifs root filesystem
    b.   disable initial RAM filesysem
     - 取消 internal RAM filesystem、internal RAM linked to linux kernel
     - 啟用 UBIFS, erase block size: (0x20000), bubble-page size: 2048B

4. 設定 SPI Flash: Quad mode system booting or data storage, using W25N01GVZEIG SPINAND (128 MB)
   
   - ubifs root file system:
     - logical erase block size :(0x1f000)
     - minimum I/O unit size: (0x800)
     - maximum logical erase block count: (800)
     - Additional mkfs.ubifs options: (-F)
![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image.png)

5. Uboot 設定
    - Enable booting from NAND flash
   ```bash
   # make uboot-menuconfig
    Boot media  --->
             [*] Enable booting from NAND flash
             [*] Enable booting from SPI flash
    ```
6. linux kernel 設定

   ```bash
   # make linux-menuconfig
    General setup  --->
            [ ] Disable Initial RAM filesystem
            [ ] Support initial ramdisk/ramfs compressed using gzip 
            [ ] Boot config support

    Device Drivers  ---> 
    Memory Technology Device (MTD) support  --->     
            Partition parsers  --->
            [*]   command line partition parser
            [*]   open firmware partition parser
    Memory Technology Device (MTD) support  --->     
       [*]   enable UBI - Unsorted block images --->
            (4096) UBI wear-leveling 
            (20)  Maximum expected bad eraseblock count
            [*]   UBI Fastmap (Experimental feature)

                         
    File systems  --->
       <*> Miscellaneous filesystems  --->
           <*> UBIFS file system support
           [*]   UBI block device support


![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image-3.png)
![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image-2.png)
![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image-1.png)


1. Linux device tree (nuc980-iot_v1.0.dts) flash0 partition:
four partitions: uboot, dtb, kernel, and rootfs. Here, reg = <0x180000 0x20000>, where 0x180000 is the address and 0x20000 is the size (in bytes).

Users can divide it according to their own needs. Please note that the maximum size of the NAND flash is 128 MB, so do not exceed this limit.
![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image-4.png)

7. env.txt

```txt
baudrate=115200
bootdelay=1
stderr=serial
stdin=serial
stdout=serial
loadkernel=nand read 7fc0 200000 800000
loaddtb=nand read 0xA00000 0x1C0000 0x20000
bootcmd=run loadkernel;run loaddtb;bootm 0x07fc0 - 0xA00000
bootargs=noinitrd ubi.mtd=2 root=ubi0:rootfs rootfstype=ubifs rw rootwait=1 console=ttyS0 rdinit=/sbin/init mem=64M
```
8. 編譯
   ```bash
   make linux-rebuild && make
   ```

9. 燒錄
    ![alt text](/assets/images/posts/2025-09-14-nuc980-buildroot/image-5.png)

## 常見問題與解法

- make menuconfig 錯誤 `make menuconfig' requires the ncurses libraries.`
  - 確認 ncurses 套件已安裝：`sudo apt-get install libncurses-dev`
  - 重新執行 make menuconfig
- env.txt 設定錯誤導致無法啟動
  - 確認 env.txt 中的 bootargs 與 bootcmd 設定正確，特別是 rootfs 與 console 參數。
  - env.txt 的換行需要使用 CRLF (Windows) 格式，否則可能導致啟動失敗 (uImage CRC Error)。
- NUC980 boot 開機流程
  1. Internal Boot ROM (IBR) 讀取 SPI Flash 的 U-Boot SPL (Secondary Program Loader)
  2. SPL 初始化基本硬體並載入完整的 U-Boot 映像
  3. U-Boot 讀取 env.txt 設定
  4. U-Boot 讀取 Linux 核心映像 (uImage) 與 Device Tree Blob (dtb)
  5. U-Boot 傳遞控制權給 Linux 核心，並啟動系統
  6. Linux 核心掛載 rootfs 並啟動 init 程序
   
- VMware 直接拖拉檔案即可複製回 windows 主機

- 安裝 vscode
  - 下載連結：https://code.visualstudio.com/
  - 安裝指令：`sudo dpkg -i code_1.81.1-1695216607_amd64.deb`
  - 若有相依性問題，執行：`sudo apt-get install -f`
  
## 參考與資源

- BuildRoot 官方文件：https://buildroot.org/
- Nuvoton 官方網站與論壇（查找 NUC980 BSP、u-boot 範例）
- 開源社群範例：搜尋 `nuc980 buildroot`、`nuvoton nuc980 u-boot` 等關鍵字

## 後記

這篇為初步學習紀錄，未來可以補上具體的 defconfig、patch 範例、以及燒錄與驗證流程的詳細步驟（含範例命令與日誌片段），方便日後重現或分享給其他開發者。
