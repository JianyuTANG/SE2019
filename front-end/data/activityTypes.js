const activityTypes =
    [
      { text: '大型活动', value: 0 },
      { text: '就业机会', value: 1 },
      { text: '实习岗位', value: 2 },
      { text: '讲座沙龙', value: 3 },
      { text: '参观参访', value: 4 },
      { text: '转让交易', value: 5 }
    ]

const showActivityTypes = activityTypes.concat({
  text: '全部', value: -1
})

export {
  activityTypes,
  showActivityTypes
}
