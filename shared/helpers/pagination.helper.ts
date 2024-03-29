/**
 *	CREATE ARRAY OF PAGINATION LINKS
 * @param {*} total
 * @param {*} limit
 * @param {*} url
 * @returns LINKS ARRAY
 */
export const PaginationBuilder = (total: number = 0, limit: number = 0, url: string = '') => {
  const pagination = []

  const URL = url.match(/\?/) ? url : url + "?";
  
  for (let i = 1; i <= myMathRound(total / limit); i++) {
    pagination.push(URL.replace(/&page=\d*|page=\d*/, '') + '&page=' + i)
  }

  return pagination
}

const myMathRound = (num: number) => num + (num - parseInt(`${num}`) > 0 ? 1 : 0)
