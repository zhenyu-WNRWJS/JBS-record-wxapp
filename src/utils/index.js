export const formateDayOfWeek = (num) => {
  let day = ''
  switch (!isNaN(num)) {
    case num == 0:
      day = '周日'
      break
    case num == 1:
      day = '周一'
      break
    case num == 2:
      day = '周二'
      break
    case num == 3:
      day = '周三'
      break
    case num == 4:
      day = '周四'
      break
    case num == 5:
      day = '周五'
      break
    case num == 6:
      day = '周六'
      break
    default:
  }
  return day
}