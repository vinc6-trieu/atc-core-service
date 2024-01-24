let skip = parseInt(document.querySelector('#skip')?.value || 20)
let limit = 10
let isOver = false

function addRemoveEvent() {
  const removeButtons = document.querySelectorAll('.image-remove-button')
  if (removeButtons) removeButtons.forEach((e) => (e.onclick = removeImage))
}

function addEditEvent() {
  $('#modal-update-image button.close').click(function () {
    $('#modal-update-image').modal('hide')
  })

  const removeButtons = document.querySelectorAll('.image-edit-button')
  if (removeButtons) removeButtons.forEach((e) => (e.onclick = openModalUpdateImage))
}

function addSelectionEvent() {
  const imageSelections = document.querySelectorAll('.img-selection')
  console.log('imageSelections', imageSelections)
  if (imageSelections) imageSelections.forEach((e) => (e.onclick = returnFileUrl))
  // if (imageSelections) imageSelections.forEach((e) => (e.onclick = copySrcToClipBoard));
}

// function copySrcToClipBoard(event) {
// 	event.stopPropagation();
// 	console.log(this.dataset)
// 	window.id = this.dataset.id;
// 	window.src = this.dataset.src;

// 	window.close();
// }

function openModalUpdateImage(event) {
  event.stopPropagation()
  const id = this.dataset.id
  const alt = this.dataset.alt
  const name = this.dataset.name

  const modelId = document.querySelector('#modelId')
  const modelName = document.querySelector('#modelName')
  const modelAlt = document.querySelector('#modelAlt')
  const modelkeySearch = document.querySelector('#modelKeySearch')

  modelId.value = id
  modelName.value = name
  modelAlt.value = alt

  $('#modal-update-image').modal('show')
}

function removeImage(event) {
  event.stopPropagation()
  const id = this.dataset.id
  const that = this

  let ok = window.confirm('Bạn có chắc chắn muốn xoá')
  if (ok) {
    const xhr = new XMLHttpRequest()
    xhr.onload = (e) => {
      that.parentElement.remove()
    }
    xhr.open('DELETE', '/cms-api/v1/images/' + id)
    xhr.send()
  }
}

function sendImageToServer(files) {
  const fd = new FormData()

  const xhr = new XMLHttpRequest()
  for (var file in this.files) {
    fd.append('images', this.files[file])
  }

  xhr.onload = (e) => {
    console.log('sentF')
    if (e.currentTarget.status >= 300) return alert('Có lỗi xảy ra')
    const { images = [] } = JSON.parse(e.currentTarget.responseText).data
    prependNewImages('#images-container', images.map((e) => createNewImage(e)).join(''))
    addSelectionEvent()
    addRemoveEvent()
  }

  xhr.open('POST', '/cms-api/v1/images')
  xhr.send(fd)
}

function loadNewImageOnScrollEnd(e) {
  const scrollEnded = window.innerHeight + window.scrollY >= document.body.offsetHeight
  if (scrollEnded && !isOver) {
    console.log('ended')
    const odlHeight = window.scrollY
    getNewsImage(() => window.scrollTo(0, odlHeight))
  }
}

async function getNewsImage(callback = () => {}) {
  const response = await fetch(`/cms-api/v1/images?skip=${skip}&limit=${limit}`)
  let result = await response.json()
  const images = result.data

  if (images.length == 0) {
    isOver = true
  }
  skip += images.length
  appendNewImages('#images-container', images.map((e) => createNewImage(e)).join(''))

  addSelectionEvent()
  addEditEvent()
  addRemoveEvent()

  return callback()
}

function appendNewImages(id = '#images-container', imagesHTML) {
  const imagesContainer = document.querySelector(id)
  if (imagesContainer) {
    imagesContainer.innerHTML += imagesHTML
  } else {
    console.log('Image container not found')
  }
}

function prependNewImages(id = '#images-container', imagesHTML) {
  const imagesContainer = document.querySelector(id)
  if (imagesContainer) {
    imagesContainer.innerHTML = imagesHTML + imagesContainer.innerHTML
  } else {
    console.log('Image container not found')
  }
}

function createNewImage(image = { src: '/images/noimage.jpg', name: 'noimage', _id: 'id' }) {
  return `<div
        class="col-lg-3 col-md-3 col-3 image-container position-relative img-selection"
        data-id="${image._id}"
        data-src="${image.src}"
    >
        <a href="#" class="mb-4 h-100 position-relative">
            <img class="img-fluid selection" src="${image.src}" alt="${image.alt}" />
        </a>
        <div class="image-selection-label position-absolute">Chọn ảnh</div>
        <div
            class="image-remove-button position-absolute"
            data-id="${image._id}"
        >
            X
        </div>
        <div class="image-edit-button position-absolute" data-id="${image._id}"
        data-name="${image.name}" data-alt="${image.alt}" data-toggle="modal"
		data-target="#modal-update-image"><i class="fa fa-pencil-square-o"></i></div>
    </div>`
}

// Helper function to get parameters from the query string.
function getUrlParam(paramName) {
  var reParam = new RegExp('(?:[?&]|&)' + paramName + '=([^&]+)', 'i')
  var match = window.location.search.match(reParam)

  return match && match.length > 1 ? match[1] : null
}

// Simulate user action of selecting a file to be returned to CKEditor.
function returnFileUrl() {
  var funcNum = getUrlParam('CKEditorFuncNum')
  fileUrl = this.dataset.src || '/noimage.jpg'
  window.opener.CKEDITOR.tools.callFunction(funcNum, fileUrl)
  window.close()
}

addSelectionEvent()
addEditEvent()
addRemoveEvent()
document
  .querySelector('input[type="file"]#image-upload')
  .addEventListener('change', sendImageToServer)
window.onscroll = loadNewImageOnScrollEnd
