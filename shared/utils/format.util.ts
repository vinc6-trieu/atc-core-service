import moment from 'moment'

export function FORMAT_ID_FN(id = '') {
  return '......' + id.slice(id.length - 6)
}

export function DATE_FORMAT_FN(date: string, format = 'DD/MM/YYYY HH:mm') {
  return moment.tz(date, 'Asia/Ho_Chi_Minh', format).format('YYYY-MM-DD')
}
