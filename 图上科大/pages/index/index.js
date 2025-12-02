Page({
  data: {
    levels: [1, 2, 3, 4, 5, 6, 7]
  },

  goToLevel(e) {
    const level = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: `/pages/${level}/game`
    });
  },

});
