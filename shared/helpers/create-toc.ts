import { CheerioAPI, load } from 'cheerio'

interface TocItem {
  level: number
  text: string
  id: string
}

const HEADING_LEVEL_TAGS = ['h2', 'h3', 'h4', 'h5']

interface TocData {
  html: string
  content: string
}
const buildListFromHeadings = (
  $: CheerioAPI,
  headings: any[],
  from: number,
  to: number,
): TocItem[] => {
  const result: TocItem[] = []
  for (let i = from; i < to; i++) {
    result.push({
      level: HEADING_LEVEL_TAGS.indexOf(headings[i].tagName.toLowerCase()),
      text: $(headings[i]).text(),
      id: headings[i].attribs.id,
    })
  }
  return result
}

const createContentTOC = (listLevelHeading: any) => {
  const list = listLevelHeading
  let pre = 0
  let html = list
    .map((e: any) => {
      if (e.level < pre) {
        //1<2

        let ols = ''
        let olsCount = e.level

        while (olsCount < pre) {
          olsCount++
          ols += '</ol>'
        }
        pre = e.level
        return `${ols}<li>
					<a href="#${e.id}">${e.text}</a>
					</li>`
      } else if (e.level > pre) {
        //3>2
        pre = e.level
        return `<ol> <li><a href="#${e.id}">${e.text}</a></li>`
      }
      return `<li><a href="#${e.id}">${e.text}</a></li>`
    })
    .join('')

  if (html) {
    html = '<ol>' + html + '</ol>'
  } else {
    html = ''
  }

  /* .repeat(pre + 1); */
  return html
}

function createSlugFromTitle(title: string): string {
  let str = title
  if (str && str.length > 0) {
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' ',
    )
    str = str.replace(/ + /g, ' ')
    str = str.trim()
    str = str.replace(/\s+/g, '_')
  }
  return str
}

function createToc(content_article: string): TocData {
  const data: TocData = { html: '', content: '' }

  const $ = load(content_article)

  let headings = $(HEADING_LEVEL_TAGS.join(','))
  headings.each(function (i, elem) {
    $(this).attr(
      'id',
      createSlugFromTitle($(this).text()).charAt(0).toUpperCase() +
        createSlugFromTitle($(this).text()).slice(1),
    )
  })

  const listLevelHeading = buildListFromHeadings($, headings.get(), 0, headings.length)
  data.html = createContentTOC(listLevelHeading) // Make sure to implement createContentTOC
  data.content = $('body').html() ?? ''
  return data
}

export default createToc
