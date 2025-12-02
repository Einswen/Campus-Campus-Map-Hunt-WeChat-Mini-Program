# Campus-Campus-Map-Hunt-WeChat-Mini-Program
这是一个基于微信小程序的校园图寻小程序，用户通过观看全景图然后在地图中选择点位

# 图上科大 (Tuxiang SUST) 小程序 README

## 项目介绍 (Project Introduction)

"图上科大"是一款基于校园场景的位置识别小程序，用户需要根据展示的全景图，在校园地图上标记出对应的位置。小程序包含多个关卡，每个关卡对应校园内的不同地点，通过提示和计时功能增加游戏的趣味性和挑战性。

"Tuxiang SUST" is a location recognition mini-program based on campus scenes. Users need to mark the corresponding position on the campus map according to the displayed panoramic image. The mini-program includes multiple levels, each corresponding to different locations on the campus, with hints and timing functions to increase the fun and challenge of the game.

## 主要功能 (Main Features)

- 多关卡设计：包含7个关卡，每个关卡对应不同的校园地点
- 全景图展示：每个关卡展示特定地点的全景图片
- 地图标记：用户可在校园地图上点击标记位置
- 提示系统：每个关卡提供3条提示信息，帮助用户判断位置
- 计时功能：每关限时30秒，增加游戏紧迫感
- 结果评估：提交位置后，系统会计算距离误差和准确度并给出评价

- Multi-level design: 7 levels, each corresponding to a different campus location
- Panoramic image display: Each level shows a panoramic image of a specific location
- Map marking: Users can click on the campus map to mark positions
- Hint system: Each level provides 3 hints to help users judge the location
- Timing function: 30 seconds limit per level to increase the sense of urgency
- Result evaluation: After submitting the position, the system calculates distance error and accuracy and gives evaluation

## 联网内容说明 (Network Content Explanation)

本小程序包含需要联网加载的内容，主要包括：

1. 全景图资源：所有关卡的全景图片均存储在远程服务器（腾讯云COS），小程序运行时会自动下载加载
2. 地图图片：校园地图图片同样存储在远程服务器，使用时需联网获取
3. 数据交互：用户操作过程中无需上传个人数据，所有游戏数据均在本地处理

The mini-program contains content that needs to be loaded online, mainly including:

1. Panoramic image resources: All panoramic images of the levels are stored on a remote server (Tencent Cloud COS), and the mini-program will automatically download and load them during operation
2. Map images: Campus map images are also stored on remote servers and need to be obtained online when used
3. Data interaction: No personal data needs to be uploaded during user operations, and all game data is processed locally

## 使用说明 (Usage Instructions)

1. 进入小程序后，在关卡选择页面点击想要挑战的关卡
2. 查看展示的全景图，点击"打开地图"按钮
3. 在地图上点击你认为对应的位置
4. 确认位置后点击提交，查看结果评价
5. 可通过点击"提示"按钮获取线索（最多3条）
6. 完成当前关卡后，点击"下一题"进入下一关

1. After entering the mini-program, click the level you want to challenge on the level selection page
2. View the displayed panoramic image and click the "Open Map" button
3. Click the position you think corresponds on the map
4. Click submit after confirming the position to view the result evaluation
5. You can get clues by clicking the "Hint" button (up to 3 clues)
6. After completing the current level, click "Next Question" to enter the next level

## 技术架构 (Technical Architecture)

- 开发框架：微信小程序原生框架
- 图片存储：腾讯云对象存储(COS)
- 主要技术：Canvas绘图、定时器、页面路由、数据绑定

- Development framework: WeChat Mini Program native framework
- Image storage: Tencent Cloud Object Storage (COS)
- Main technologies: Canvas drawing, timer, page routing, data binding

## 注意事项 (Notes)

- 请确保网络畅通，以保证图片资源正常加载
- 部分功能可能需要微信小程序基础库的支持，请保持微信客户端为最新版本

- Please ensure network connectivity to ensure normal loading of image resources
- Some functions may require support from the WeChat Mini Program base library, please keep the WeChat client up to date
