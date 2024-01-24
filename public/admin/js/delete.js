deleteButtons()
function deleteButtons() {
  const delbuttons = document.querySelectorAll('[name="delete"].btn')

  const DeleteOnConfirmHandler = (method, action) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      // if server has been responded and status is OK
      if (xhr.readyState == 4 && xhr.status == 200) {
        const resp = JSON.parse(xhr.responseText)

        if (resp.error) {
          Swal.fire({
            icon: 'error',
            title: 'Xóa thất bại',
            text: resp.message + ' - Thông báo sẽ tự tắt trong 10s',
            timer: 10000,
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Xóa thành công',
            text: 'Thông báo sẽ tự xóa trong 2s',
            timer: 2000,
          })

          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
    }
    xhr.open(method, action, true)
    xhr.send()
  }

  // execution button
  function deleteButtonClickHandler(e) {
    const method = this.getAttribute('method')
    const action = this.getAttribute('action')

    Swal.fire({
      title: 'Bạn có chắc chắn không ?',
      text: 'Hành động của bạn sẽ không thể phục hồi!',
      icon: 'warning',
      showCancelButton: true,
      /* confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33', */
      confirmButtonText: 'Chắc chắn!',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteOnConfirmHandler(method, action)
      }
    })
  }

  //events
  if (delbuttons) {
    delbuttons.forEach((button) => button.addEventListener('click', deleteButtonClickHandler))
  }
}
