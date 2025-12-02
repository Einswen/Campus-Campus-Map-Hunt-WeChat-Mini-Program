const currentLevel = 1;

Page({
  data: {
    panoramaImage: 'https://tuxunkeda-1319226966.cos.ap-chengdu.myqcloud.com/0-2.jpg',
    mapImage: 'https://tuxunkeda-1319226966.cos.ap-chengdu.myqcloud.com/0-1.jpg',
    correctPosition: { x: 0.51, y: 0.51 },
    scale: 100,
    hints: [
      "离图书馆很近哦",
      "这里有木栈道",
      "旁边还有篮球场"
    ],
    userSelection: null,
    currentHintIndex: 0,
    isAnswered: false,
    distanceInfo: "点击地图标记全景图中的位置",
    hintCount: 3,
    showResult: false,
    resultTitle: "",
    resultDistance: 0,
    resultAccuracy: 0,
    resultColor: "#333",
    showMap: false,
    hasSubmitted: false,
    timer: null,
    timeLeft: 30,
    showTimeoutModal: false,
    leftArrowOpacity: 0,
    rightArrowOpacity: 0,
    arrowInterval: null,
    showArrows: true, 
    showMapTip: false,
    mapTipText: "在地图上点击来选点",
    initialScrollLeft: 0,
    scrollLeft: 0,
    scrollResetting: false,
    showGuideR: false,
  },

  onLoad() {
    const query = wx.createSelectorQuery().in(this);
  
    // 获取一张全景图的真实宽度
    query.select('.panorama-img').boundingClientRect((rect) => {
      if (!rect) return;
  
      const imageWidth = rect.width;
  
      this.setData({
        imageWidth,
        scrollLeft: 5000// 定位到中间图（A2）
      });
    }).exec();
  
    // 地图预加载
    wx.downloadFile({
      url: this.data.mapImage,
      success: () => console.log('图片预加载成功'),
      fail: (err) => console.error('图片预加载失败', err)
    });
  
    // 倒计时启动
    this.startCountdown();
  
    // 左右箭头淡入淡出动画
    let opacity = 0;
    let fadingIn = true;
    const interval = setInterval(() => {
      if (fadingIn) {
        opacity += 0.05;
        if (opacity >= 1) {
          opacity = 1;
          fadingIn = false;
        }
      } else {
        opacity -= 0.05;
        if (opacity <= 0) {
          opacity = 0;
          fadingIn = true;
        }
      }
      this.setData({
        leftArrowOpacity: opacity,
        rightArrowOpacity: opacity
      });
    }, 50);
  
    // 保存动画计时器（如果你想 later clearInterval）
    this.setData({ arrowInterval: interval });
  
    // 自动隐藏箭头提示（5秒）
    setTimeout(() => {
      this.setData({ showArrows: false });
      clearInterval(this.data.arrowInterval);
    }, 5000);
  },  

 
  
  
  

  onUnload() {
    clearInterval(this.data.timer);
  },

  startCountdown() {
    this.setData({ timeLeft: 30 });
    const timer = setInterval(() => {
      const newTime = this.data.timeLeft - 1;
      this.setData({ timeLeft: newTime });
      if (newTime <= 0) {
        clearInterval(this.data.timer);
        this.setData({ showTimeoutModal: true });
      }
    }, 1000);
    this.setData({ timer });
  },

  restartGame() {
    clearInterval(this.data.timer);
    wx.redirectTo({
      url: `/pages/${currentLevel}/game`
    });
  },

  openMap() {
    this.setData({ showMap: true, showMapTip: true }, () => {
      this.drawMap();
  
      setTimeout(() => {
        this.setData({ showMapTip: false });
      }, 5000);
    });
  },
  

  closeMap() {
    this.setData({ showMap: false });
  },

  submitSelection() {
    if (!this.data.userSelection) {
      wx.showToast({
        title: '请先点击地图选点',
        icon: 'none'
      });
      return;
    }

    this.setData({ hasSubmitted: true, showMap: false });
    wx.showToast({
      title: '位置已提交',
      icon: 'success'
    });

    this.checkAnswer();
  },

  drawMap() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#mapCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0]?.node;
        if (!canvas) return;
  
        const ctx = canvas.getContext('2d');
        const width = res[0].width;
        const height = res[0].height;
  
        const dpr = wx.getSystemInfoSync().pixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr); // 关键：让 1px = 1css像素
  
        const img = canvas.createImage();
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
  
          const imgWidth = img.width;
          const imgHeight = img.height;
          const scale = Math.max(width / imgWidth, height / imgHeight);
          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;
          const offsetX = (width - drawWidth) / 2;
          const offsetY = (height - drawHeight) / 2;
  
          // 存储绘图信息，用于点击坐标换算
          this._drawInfo = {
            offsetX, offsetY, drawWidth, drawHeight
          };
  
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, drawWidth, drawHeight);
  
          if (this.data.userSelection) {
            const selX = this.data.userSelection.x;
            const selY = this.data.userSelection.y;
            const cx = offsetX + selX * drawWidth;
            const cy = offsetY + selY * drawHeight;
  
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
          }
        };
  
        img.src = this.data.mapImage;
      });
  },

  
  onMapTap(e) {
    if (this.data.isAnswered || !this._drawInfo) return;
  
    const { offsetX, offsetY, drawWidth, drawHeight } = this._drawInfo;
  
    const query = wx.createSelectorQuery().in(this);
    query.select('#mapCanvas').boundingClientRect(rect => {
      if (!rect) return;
  
      // 先求出点击相对canvas左上角的坐标（单位是css像素）
      const tapX = e.detail.x - rect.left;
      const tapY = e.detail.y - rect.top;
  
      // 再算相对绘图区域的比例坐标
      const x = (tapX - offsetX) / drawWidth;
      const y = (tapY - offsetY) / drawHeight;
  
      const clampedX = Math.min(Math.max(x, 0), 1);
      const clampedY = Math.min(Math.max(y, 0), 1);
  
      this.setData({
        userSelection: { x: clampedX, y: clampedY },
        distanceInfo: `已选择位置: X ${Math.floor(clampedX * 100)}%, Y ${Math.floor(clampedY * 100)}%`
      }, () => this.drawMap());
    }).exec();
  },
  
  

  showHint() {
    if (this.data.currentHintIndex < this.data.hints.length) {
      wx.showModal({
        title: `提示 ${this.data.currentHintIndex + 1}`,
        content: this.data.hints[this.data.currentHintIndex],
        showCancel: false,
        success: () => {
          this.setData({
            currentHintIndex: this.data.currentHintIndex + 1,
            hintCount: this.data.hints.length - (this.data.currentHintIndex + 1)
          });
        }
      });
    } else {
      wx.showToast({
        title: '没有更多提示了！',
        icon: 'none'
      });
    }
  },

  checkAnswer() {
    if (!this.data.userSelection) {
      wx.showToast({
        title: '请先选择位置！',
        icon: 'none'
      });
      return;
    }

    clearInterval(this.data.timer);
    this.setData({ isAnswered: true });

    const dx = this.data.userSelection.x - this.data.correctPosition.x;
    const dy = this.data.userSelection.y - this.data.correctPosition.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const actualDistance = Math.floor(pixelDistance * this.data.scale * 12);
    const maxDistance = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);
    const accuracy = Math.max(0, 100 - Math.floor((pixelDistance / maxDistance) * 100));

    let title = "";
    if (accuracy > 90) {
      title = "完美！位置准确";
    } else if (accuracy > 60) {
      title = "不错！接近目标";
    } else {
      title = "再接再厉";
    }

    wx.showModal({
      title: title,
      content: `距离误差：${actualDistance} 米\n准确度：${accuracy}%`,
      showCancel: false,
      confirmText: '下一题',
      success: (res) => {
        if (res.confirm) {
          this.nextQuestion();
        }
      }
    });
  },

  nextQuestion() {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 7) {
      wx.redirectTo({
        url: `/pages/${nextLevel}/game`
      });
    } else {
      wx.showToast({
        title: '已完成所有关卡',
        icon: 'success'
      });
    }
  }
});