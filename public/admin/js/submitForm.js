document.addEventListener('DOMContentLoaded', async (ev) => {
  const selectInput = document.querySelector('.select-search-input')

  if (selectInput) $('.select-search-input').select2()

  // ============= FORM CREATE - UPLOAD HANDLERS
  // variables
  let formArr = document.querySelectorAll('.form-horizontal')

  let contentEditors = document.querySelectorAll('.content-editor')
  let openPopupButtonArr = document.querySelectorAll('.open-modal')
  let titleContentInput = document.querySelector('[name="title"].title-content')
  let slugContentInput = document.querySelector('[name="slug"].slug-content')

  let editor = []
  if (contentEditors)
    contentEditors.forEach((item, index) => {
      editor[index] = CKEDITOR.replace(`${item.id}`, {
        height: 500,
        entities: false,
        allowedContent: true,
        entities_additional: '',
        entities_greek: false,
        entities_latin: false,
        filebrowserUploadUrl: '/cms-api/v1/images/ckeditor',
        filebrowserBrowseUrl: '/cms/images/upload-ckeditor',
      })
    })
  // functions
  function createSlugFromTitle(alias) {
    let str = alias
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
      str = str.replace(/\s+/g, '-')
    }
    return str
  }

  function formSubmitHandler(event) {
    event.preventDefault()

    Swal.fire(' Đang tải ... ')

    let fd = new FormData(this)
    let that = this

    let contentEditors = this.querySelectorAll('.content-editor')
    if (contentEditors) {
      contentEditors.forEach((item, index) => {
        fd.set(
          item.getAttribute('name'),
          editor[index].getData() /* .replace(/(\<div.+?\>|\<\/div\>)/g, '') */,
        )
      })
    }

    // parse all the input, textarea tags value to an object, name is form data (fd)
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      // console.log(xhr.responseText)
      // if server has been responded and status is OK
      if (xhr.readyState == 4) {
        const result = JSON.parse(xhr.responseText)
        let data = result.data

        if (!result.error && data) {
          Swal.fire({
            title: 'Đăng thành công',
            icon: 'success',
          }).then((value) => {
            /* window.location.reload() */
          })
          // variables
          let categoriesList = document.querySelector('select[name="category"]')
          // functions
          let createCategoryOption = ({ _id, name }) => {
            return `<option value="${_id}">${name}</option>`
          }

          //events
          if (data._id && data.name && categoriesList) {
            categoriesList.innerHTML += createCategoryOption(data)
          }

          setTimeout(() => {
            if (that.dataset.callbackurl && that.dataset.callbackurl !== 'false') {
              console.log(that.dataset.callbackurl, typeof that.dataset.callbackurl)
              return (window.location.href = that.dataset.callbackurl)
            }
            return window.location.reload()
          }, 1000)
        } else {
          let messError =
            result?.message ||
            'Hãy điền đầy đủ thông tin bắt buộc hoặc bạn không có quyền làm việc này  !'
          Swal.fire('Đăng thất bại', messError, 'warning')
        }
      }
    }

    xhr.open(this.getAttribute('method'), this.getAttribute('action'), true) // current URL
    xhr.send(fd) // send as req.body to the router
  }

  //events
  if (formArr) formArr.forEach((form) => form.addEventListener('submit', formSubmitHandler))

  if (openPopupButtonArr)
    openPopupButtonArr.forEach((button) => {
      console.log(button)
      button.addEventListener('click', openModalPopup)
    })

  if (titleContentInput && slugContentInput) {
    titleContentInput.addEventListener('change', () => {
      let slug = titleContentInput.value
      slug.toLowerCase()
      slugContentInput.value = createSlugFromTitle(slug).replace(/ú|ù|ũ|ủ|ụ/g, 'u')
    })
  }
})

document.querySelectorAll('.button-create-empty').forEach((button) => {
  button.onclick = createPost
})

document.querySelectorAll('.button-remove').forEach((button) => {
  button.onclick = removeApi
})

document.querySelectorAll('.button-post').forEach((button) => {
  button.onclick = postApi
})

document.querySelectorAll('.button-update').forEach((button) => {
  button.onclick = updateApi
})

function createPost(e) {
  e.preventDefault()
  const xhr = new XMLHttpRequest()
  xhr.onload = (e) => {
    console.log(e.responseText)
    if (xhr.status < 300) {
      const docID = JSON.parse(xhr.responseText).data._id
      const variantID = JSON.parse(xhr.responseText).data.variantID

      if (variantID)
        window.location.href = `/cms/${this.dataset.type?.trim()}/${docID}?lang=vi&variantID=${variantID}`
      else window.location.href = `/cms/${this.dataset.type?.trim()}/${docID}?lang=vi`
    } else {
      alert('Khởi tạo thất bại')
    }
  }
  xhr.open('POST', this.dataset.action)
  xhr.send()
}

function removeApi(e) {
  const { id, url } = this.dataset
  if (id && url) {
    const ok = window.confirm('Bạn có chắc chắn muốn xoá ?')
    if (ok) {
      const xhr = new XMLHttpRequest()
      xhr.onload = (e) => {
        if (xhr.status < 300) {
          const result = JSON.parse(xhr.responseText)
          console.log(result.error, result.message)
          // const postID = JSON.parse(xhr.responseText).data._id;
          window.location.reload()
        } else {
          alert('Xoá bài viết thất bại')
        }
      }

      xhr.open('DELETE', url)
      xhr.send()
    }
  }
}

function postApi(e) {
  const { id, url } = this.dataset
  if (id && url) {
    const ok = window.confirm('Bạn có chắc chắn?')
    if (ok) {
      const xhr = new XMLHttpRequest()
      xhr.onload = (e) => {
        if (xhr.status < 300) {
          const result = JSON.parse(xhr.responseText)
          console.log(result.error, result.message)
          // const postID = JSON.parse(xhr.responseText).data._id;
          window.location.reload()
        } else {
          alert('Thất bại')
        }
      }

      xhr.open('POST', url)
      xhr.send()
    }
  }
}

function updateApi(e) {
  const { id, url } = this.dataset
  if (id && url) {
    const xhr = new XMLHttpRequest()
    xhr.onload = (e) => {
      if (xhr.status < 300) {
        const result = JSON.parse(xhr.responseText)
        console.log(result.error, result.message)
        // const postID = JSON.parse(xhr.responseText).data._id;
        window.location.reload()
      } else {
        alert('Cập nhật thất bại')
      }
    }

    xhr.open('PUT', url)
    xhr.send()
  }
}
