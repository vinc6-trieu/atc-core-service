let skip = parseInt(document.querySelector('#skip')?.value || 0)
let limit = 10
let isOver = false

function addRemoveEvent() {
  const removeButtons = document.querySelectorAll('.doc-remove-button')
  if (removeButtons) removeButtons.forEach((e) => (e.onclick = removeDoc))
}

function addSelectionEvent() {
  const imageSelections = document.querySelectorAll('.doc-selection')
  if (imageSelections) imageSelections.forEach((e) => (e.onclick = copySrcToClipBoard))
}

function copySrcToClipBoard(event) {
  event.stopPropagation()

  window.id = this.dataset.id
  window.src = this.dataset.src
  window.name = this.dataset.name

  window.close()
}

function removeDoc(event) {
  event.stopPropagation()
  const id = this.dataset.id
  const that = this

  let ok = window.confirm('Bạn có chắc chắn muốn xoá')
  if (ok) {
    const xhr = new XMLHttpRequest()
    xhr.onload = (e) => {
      console.log(JSON.parse(xhr.responseText))
      that.parentElement.remove()
    }
    xhr.open('DELETE', '/admin/docs/' + id)
    xhr.send()
  }
}

function sendDocToServer(files) {
  const fd = new FormData()

  const xhr = new XMLHttpRequest()
  for (var file in this.files) {
    fd.append('docs', this.files[file])
  }

  xhr.onload = (e) => {
    // console.log("sentF");
    if (e.currentTarget.status >= 300) return alert('Có lỗi xảy ra')
    const { docs = [] } = JSON.parse(e.currentTarget.responseText).data
    prependNewDocuments('#docs-container', docs.map((e) => createNewDoc(e)).join(''))
    addSelectionEvent()
    addRemoveEvent()
  }

  xhr.open('POST', '/admin/documents')
  xhr.send(fd)
}

function loadNewDocOnScrollEnd(e) {
  const scrollEnded = window.innerHeight + window.scrollY >= document.body.offsetHeight
  if (scrollEnded && !isOver) {
    // console.log('ended')
    const odlHeight = window.scrollY
    getNewsDoc(() => window.scrollTo(0, odlHeight))
  }
}

async function getNewsDoc(callback = () => {}) {
  const response = await fetch(`/admin/docs?skip=${skip}&limit=${limit}`)
  let result = await response.json()
  const docs = result.data

  if (docs.length == 0) {
    isOver = true
  }
  skip += docs.length
  appendNewDocuments('#docs-container', docs.map((e) => createNewDoc(e)).join(''))

  addSelectionEvent()
  addRemoveEvent()

  return callback()
}

function appendNewDocuments(id = '#docs-container', docsHTML) {
  const docsContainer = document.querySelector(id)
  if (docsContainer) {
    docsContainer.innerHTML += docsHTML
  } else {
    console.log('Doc container not found')
  }
}

function prependNewDocuments(id = '#docs-container', docsHTML) {
  const docsContainer = document.querySelector(id)
  if (docsContainer) {
    docsContainer.innerHTML = docsHTML + docsContainer.innerHTML
  } else {
    console.log('Doc container not found')
  }
}

function createNewDoc(e = { src: '/docs/noimage.jpg', name: 'noimage', _id: 'id' }) {
  return `<div
        class="col-lg-2 col-md-2 col-2 doc-container position-relative doc-selection"
        data-id="${e._id}"
        data-name="${e.name}"
        data-src="/${e.type + '-icon.png'}"
    >
        <a href="#" class="mb-4 h-100 position-relative">
        <img class="selection" src="/${e.type + '-icon.png'}" alt="" />
            <div
                class="info position-absolute bottom-0 bg-light w-100 text-center text-primary"
                style="font-weight: 600; padding: 5px 10px;"
            >
                ${e.name.slice(0, 30)}${e.name.length > 30 ? '...' : ''}
            </div>
        </a>
        <div class="doc-selection-label position-absolute">Chọn file</div>
        <div class="doc-remove-button position-absolute" data-id="${e._id}">X</div>
    </div>`
}

addSelectionEvent()
addRemoveEvent()
document.querySelector('input[type="file"]#doc-upload').addEventListener('change', sendDocToServer)
window.onscroll = loadNewDocOnScrollEnd
