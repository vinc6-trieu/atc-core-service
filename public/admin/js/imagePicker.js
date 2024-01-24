addRestoreEvent()

function openNewTab({
  url = '/cms/images/gallery',
  windowName = '',
  win = window,
  w = 1080,
  h = 640,
  callback = () => {},
}) {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2

  const config = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  const newWindow = win.open(url, windowName, config)
  return callback(newWindow)
}

function openGallery(image, inputID = '') {
  const windowGalleryHandler = (windowGallery = window.open('/')) => {
    windowGallery.addEventListener('unload', function (e) {
      if (windowGallery.src && windowGallery.id) {
        image.src = windowGallery.src || image.src

        const ImageID = image.parentElement.querySelector(inputID)
        ImageID.value = windowGallery.id || ImageID.value
      }
    })
  }
  openNewTab({ url: '/cms/images/gallery', callback: windowGalleryHandler })
}

function openFileLibrary(file, inputID = '', labelID = '#file-name') {
  const windowGalleryHandler = (windowGallery = window.open('/')) => {
    windowGallery.addEventListener('unload', function (e) {
      console.log(windowGallery.src, windowGallery.id)
      file.src = windowGallery.src || file.src
      file.parentElement.querySelector(inputID).value = windowGallery.id || null
      if (labelID) file.parentElement.querySelector(labelID).innerHTML = windowGallery.name
    })
  }
  openNewTab({
    url: '/admin/documents-library',
    callback: windowGalleryHandler,
  })
}

function addRestoreEvent() {
  document.querySelectorAll('.restore-image-button').forEach((e) => (e.onclick = restoreImage))
  function restoreImage(e) {
    const img = this.parentElement.querySelector('img')
    if (img) img.src = '/noimage.jpg'

    const input = this.parentElement.querySelector(`input[type="hidden"]`)
    if (input) input.value = ''
  }
}
