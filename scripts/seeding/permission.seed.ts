import mongoose from 'mongoose'
import { MONGODB_URI } from '../../config/database.config'
import PERMISSION_MODEL from '../../models/permission.model'

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
console.log(MONGODB_URI)

const desc = `<div><table align=\\"center\\" border=\\"0\\" cellpadding=\\"0\\" cellspacing=\\"0\\" style=\\"width:500px;\\">\\n\\t<tbody>\\n\\t\\t<tr>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><a href=\\"https://winemart.vn/ruou-jim-beam/\\"><strong>JIM BEAM</strong></a></td>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><a href=\\"https://winemart.vn/ruou-grants/\\"><strong>GRANT'S</strong></a></td>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><strong><a href=\\"https://winemart.vn/ruou-glenlive/t\\">GLENLIVET</a></strong></td>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><strong><a href=\\"https://winemart.vn/whisky-khac/\\">WHISKY KHÁC</a></strong></td>\\n\\t\\t</tr>\\n\\t</tbody>\\n</table>\\n\\n<p>Từ \\"whisky\\" xuất phát từ thuật ngữ Uisce Beatha - có nghĩa là 'nước của sự sống' trong tiếng Gaelic của người Ireland và Scotland.</p>\\n\\n<blockquote>\\n<p><strong>Vậy ta nên gọi Whisky hay Whiskey?</strong></p>\\n</blockquote>\\n\\n<p>Hãy cùng theo dòng lịch sử để tìm hiểu tại sao lại có hai tên gọi như vậy.</p>\\n\\n<h2><strong>Năm thứ 700 trước công nguyên&nbsp;Uisce Beatha - Whisky thuở sơ khai</strong></h2>\\n\\n<p>Lịch sử về rượu Whisky đã có từ rất lâu nhưng từ năm thứ 700 trước Công nguyên, người ta tin rằng các tu sĩ người Ireland đã mang kỹ thuật chưng cất nước hoa tới Ireland. Sau chuyến du hành, những người tu sĩ này đã nghiên cứu để tạo ra loại thức uống có mùi thơm. Và họ đã cho ra đời sản phẩm chưng cất đầu tiên được gọi là Uisce Beatha.</p>\\n\\n<p>&nbsp;</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"whisky-nam-700-truoc-cong-nguyen\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/whisky-nam-700-truoc-cong-nguyen-4201.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<h2><strong>Rượu Whisky có từ khi nào? (1405 – 1541)</strong></h2>\\n\\n<p>Sự ghi nhận đầu tiên về rượu Whisky bắt nguồn từ năm 1405. Irish Whiskey đã bắt đầu thu hút được sự yêu thích của những người Anh, bao gồm “Nữ hoàng Elizabeth I”. Nữ hoàng đã mua cổ phiếu của nhãn hiệu Whiskey này và giao cho cho tòa án giữ loại tài sản này vào năm 1541 (Tòa án là nơi mà có những người hỗ trợ đắc lực cho Nữ hoàng). Dưới quyền cai trị của Nữ hoàng Elizabeth I, <strong>rượu Whiskey</strong> được các nhà văn người Anh coi trọng hơn là các loại rượu mạnh khác.</p>\\n\\n<p>Vào thời điểm này, chưng cất rượu whisky đã dần trở nên phổ biến trong cuộc sống hàng ngày của những người Ireland. Đây là một ngành tiểu thủ công nghiệp phát triển nhất với hàng trăm nhà máy chưng cất nhỏ tại nhà trên khắp cả nước.</p>\\n\\n<p style=\\"text-align: center;\\"><iframe frameborder=\\"0\\" height=\\"533\\" name=\\"Rượu Whisky\\" scrolling=\\"no\\" src=\\"https://www.youtube.com/embed/Qlk9pWVzwnI\\" width=\\"1115\\"></iframe></p>\\n\\n<p>Mặc dù người Ireland làm rượu Whisky đã được vài trăm năm nhưng chưa có sự công nhận chính thức bằng các loại văn bản hay giấy tờ. Đọc đến đây, chắc hẳn bạn sẽ tò mò ngành rượu Irish Whisky sẽ ra sao? Đọc tiếp bài viết để biết sự kiện làm thay đổi bộ mặt của ngành rượu này.</p>\\n\\n<h2><strong>Sự kiện làm thay đổi ngành rượu Irish Whiskey</strong></h2>\\n\\n<p>Kể từ sự kiện “the Spanish fleet at Kinsale” trận chiến Kinsale nổi tiếng, khi người Anh tàn phá nền văn hóa của tầng lớp quý tộc Gaelic ở Ireland đến sự kiện “the Flight of Earls” chuyến bay “đẫm máu” của Bá tước được khởi hành từ Ireland.</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"tran-chien-Kinsale\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/tran-chien-kinsale-3875.jpg\\" style=\\"width: 600px; height: 600px;\\">&nbsp;</p>\\n\\n<p>Sự kiện quan trọng nhất, đánh dấu sự thay đổi của ngành công nghiệp này đó là năm 1608. Bộ mặt của ngành công nghiệp chưng cất rượu whiskey đã được thay đổi từ đây. Tại Vương Quốc Anh, giấy phép đầu tiên được cấp cho nhà máy chưng cất Bushmills của Thomas Phillips ở Antrim. Sau Thomas Phillips, rất nhiều nhà máy chưng cất khác đã được cấp giấy phép. Giấy phép này như một thông báo cho biết rằng rượu Irish Whiskey là một trong những thành viên hợp pháp của tổ chức Thương mại thế giới.</p>\\n\\n<p>Mặc dù cho đến năm 1770, số lượng nhà máy chưng cất rượu trên đảo Ireland đã tăng lên hơn 1200 nhưng số lượng nhà máy có giấy phép thì rất ít. Điều này cũng không ảnh hưởng lớn tới ngành rượu Whisky cho tới khi có sự can thiệp của chính phủ.</p>\\n\\n<h2><strong>Chính phủ ban hành thuế đối với rượu Whisky</strong></h2>\\n\\n<p>Năm 1820, chính phủ đã đưa ra rất nhiều loại thuế đối với rượu whisky. Một trong những loại thuế Một trong những thuế nặng được đánh vào nguyên liệu là “malted barley” hay “malt” (Malt là sản phẩm của quá trình ngâm ủ các hạt lúa (lúa đại mạch, lúa tiểu mạch, lúa mì, lúa gạo…) để nảy mầm đến một mức độ nhất định rồi đem sấy khô, cắt rễ làm sạch).</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"thue-ruou-whisky\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/thue-ruou-whisky-7534.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<p>Trong số các nhà máy chưng cất rượu, chỉ có khoảng 20 nhà máy chưng cất hợp pháp tuân thủ luật thuế. Còn lại, một số lượng lớn các nhà sản suất rượu Whisky khác vẫn hoạt động bất hợp pháp, lách luật không đóng thuế. Chính vì luật thuế này, đã tạo ra một phong cách rượu Whisky mới đó là Poitin Whisky.</p>\\n\\n<p>Để tránh bị đánh thuế nặng, người Ireland đã quyết định tạo ra một loại rượu whisky bằng cách không sử dụng hoàn toàn “malt” như trước đây mà chỉ sử dụng một phần “malt” trong quá trình sản xuất. Sự sáng tạo này đã tạo ra một loại whisky có hương vị độc đáo và dễ chịu đồng thời tránh phải trả nhiều tiền thuế. Đây là một thành công lớn trong lịch sử rượu Whisky.</p>\\n\\n<p>Đến năm 1830, luật thuế đã được nới lỏng hơn. Số nhà máy chưng cất của Ireland tuân thủ luật thuế đã tăng lên khoảng 90. Rượu Irish whisky được xuất khẩu và càng ngày càng trở nên phổ biến trên thế giới. Đặc biệt là ở Pháp, rượu Irish whisky trở thành loại rượu mạnh phổ biến hơn cả rượu vang. Tại sao?</p>\\n\\n<h2><strong>Rượu Irish whisky phổ biến ở Pháp vào thế kỉ 18</strong></h2>\\n\\n<p>Vào giữa thế kỉ 18, khi một loại côn trùng bé nhỏ có tên là Phylloxera đã phá hủy rất nhiều vườn nho làm vang ở Pháp. Hơn 70% số cây nho ở Pháp đã chết. Ngành rượu vang rơi vào tình trạng suy thoái trong một khoảng thời gian dài. Chính vì vậy, rượu Irish whisky đã được lên ngôi trong thời gian này.</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"irish-whisky-the-ky-18\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/irish-whisky-the-ky-18-1858.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<p>Huy hoàng chưa được bao lâu thì Irish whiskey phải cạnh tranh với một loại rượu khác để tồn tại trên thị trường. Irish whiskey sẽ ra sao?</p>\\n\\n<h2><strong>Bước ngoặt của Irish whiskey </strong></h2>\\n\\n<p>Bước ngoặt mà Irish whiskey phải đối mặt đó là sự phát triển của whisky pha trộn. Đây là loại whisky như nào? Thật là tò mò.</p>\\n\\n<p>Năm 1828, phát minh của Perrier đã truyền cảm hứng cho một người Scotland tên là Robert Stein, để tạo ra thiết bị chưng cất rượu. Thiết kế đã được cải thiện và được cấp bằng sáng chế cho người Ireland tên là Aeneas Coffey. Thiết bị sáng tạo này đã cho ra đời một cách thức mới làm rượu Whiskey có nồng độ mạnh hơn và tiết kiệm thời gian chưng cất hơn.</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"buoc-ngoac-cua-irish-whisky\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/buoc-ngoac-cua-irish-whisky-8867.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<p>Máy chưng cất “Column Still” hay còn gọi là “Coffey still” theo tên ông Coffey đã được cấp bằng sáng chế về việc đã tạo ra được một loại rượu mạnh bằng ngũ cốc rẻ hơn nhưng có ít hương vị hơn trước. Người Ireland đã dần dần chấp nhận sử dụng phương pháp chưng cất bằng thiết bị “Coffey still” vào sản xuất rượu mạnh. Nhưng bên cạnh đó, nhiều nhà sản xuất vẫn tiếp tục sử dụng các “pot” – nồi nhỏ, một phương pháp chưng cất tốn thời gian và công sức những giữ được các hương vị hoàn hảo nhất.</p>\\n\\n<p>Sau khi thiết bị “Coffey still” được ra đời một thời gian, rượu được làm ra từ thiết bị này với hương vị nhẹ nhàng hơn không nhận được nhiều sự hoan nghênh tại Ireland nên Coffey đã đến Scotland. Tại đây, rượu mạnh với hương vị nhẹ nhàng được mọi người ưa chuộng.</p>\\n\\n<h2><strong>Tại sao Whisky lại được gọi là Whiskey?</strong></h2>\\n\\n<p>Một ngày nọ, khi doanh số xuất khẩu rượu Whiskey của người Ireland thấp hơn nhiều so với rượu Scotch Whisky pha trộn. những người Ireland đã rất tức giận vì điều này. Tình hình càng trở nên tồi tệ hơn khi một số nhà máy chưng cất ở Dublin đã hợp lực buộc nhà xuất bản sách phải xuất bản cuốn “Truths about Whisky”.</p>\\n\\n<p>Cuốn sách kêu gọi mọi người tẩy chay rượu Whisky pha trộn. Và kể từ lúc đó, người Ireland đã sử dụng một chữ “e” trong cách đánh vần của họ để phân biệt rượu với rượu Whisky của người Scotland. Rượu Whisky của người Ireland đã chính thức có tên là Irish Whiskey vào năm 1979.</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"whiskey-irish-whisky\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/whiskey-irish-whisky-4478.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<p>Chưa dừng lại tại đó, vào năm 1909, Ủy ban Hoàng Gia Anh đã ra quyết định lịch sử về rượu whisky và các loại rượu mạnh. Rượu được làm từ các loại ngũ cốc đều có thể được gọi là Whisky với điều kiện nó được trưởng thành đủ lâu theo thời gian mà nhà sản xuất quy định.</p>\\n\\n<p>Các nhà máy chưng cất rượu Irish Whiskey đã phải trải qua một thời kỳ khó khăn để chống lại các nhà sản xuất Scotch Whisky. Sau quãng thời gian thăng trầm của sự phát triển rượu Whiskey, ngày nay rượu Irish Whiskey đang trên đà quay trở lại con đường hoàng kim.</p>\\n\\n<p style=\\"text-align: center;\\"><img alt=\\"whisky-hay-whiskey\\" loading=\\"lazy\\" src=\\"https://bewinemart.ducanhzed.com/uploads/images/whisky-hay-whiskey-3716.jpg\\" style=\\"width: 600px; height: 600px;\\"></p>\\n\\n<h2><span style=\\"font-size:14px;\\"><strong>Giá tham khảo các loại rượu Whisky / Whiskey tại thị trường</strong></span></h2>\\n\\n<table border=\\"1\\" cellpadding=\\"1\\" cellspacing=\\"1\\" style=\\"width: 500px;\\">\\n\\t<tbody>\\n\\t\\t<tr>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><strong>Loại rượu Whisky / Whiskey</strong></td>\\n\\t\\t\\t<td style=\\"text-align: center;\\"><strong>Giá tham khảo</strong></td>\\n\\t\\t</tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td>Rượu Whisky Scotland</td>\\n\\t\\t\\t<td>350.000 VNĐ – 160.000.000 VNĐ</td>\\n\\t\\t</tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td>Rượu Whisky Ireland</td>\\n\\t\\t\\t<td>250.000 VNĐ – 6.000.000 VNĐ</td>\\n\\t\\t</tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td>Rượu Whiskey Mỹ</td>\\n\\t\\t\\t<td>950.000 VNĐ – 1.200.000 VNĐ</td>\\n\\t\\t</tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td>Single Malt Whisky</td>\\n\\t\\t\\t<td>550.000 VNĐ - 115.000.000 VNĐ</td>\\n\\t\\t</tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td>Blended Whisky</td>\\n\\t\\t\\t<td>250.000 VNĐ - 65.000.000 VNĐ</td>\\n\\t\\t</tr>\\n\\t</tbody>\\n</table>\\n\\n<p>&nbsp;</p>\\n</div>`
// Sample data to seed the database
const permissionsData: any = [
  {
    root: {
      endpoint: '/cms/posts',
      name: 'Post permission',
      description: 'Post permission',
      operation: 'all',
    },
    permissions: [
      {
        endpoint: '/cms/posts',
        name: 'View Post',
        description: desc,
        operation: 'read',
      },
      {
        endpoint: '/cms/posts',
        name: 'Create Post',
        description: desc,
        operation: 'write',
      },
      {
        endpoint: '/cms/posts',
        name: 'Edit Post',
        description: desc,
        operation: 'update',
      },
      {
        endpoint: '/cms/posts',
        name: 'Delete Post',
        description: desc,
        operation: 'delete',
      },
      {
        endpoint: '/cms/posts',
        name: 'Publish Post',
        description: desc,
        operation: 'publish',
      },
    ],
  },
  {
    root: {
      endpoint: '/cms/post-categories',
      name: 'Post Category Permission',
      description: 'Post Category Permission',
      operation: 0,
    },
    permissions: [
      {
        endpoint: '/cms/post-categories',
        name: 'View Post Category',
        description: 'Permission to view post categories',
        operation: 5,
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Create Post Category',
        description: 'Permission to create post category',
        operation: 4,
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Edit Post Category',
        description: 'Permission to edit post categories',
        operation: 3,
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Delete Post Category',
        description: 'Permission to delete post categories',
        operation: 2,
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Publish Post Category',
        description: 'Permission to publish post categories',
        operation: 1,
      },
    ],
  },
]

// Function to seed the database
const seedDatabase = async (): Promise<void> => {
  try {
    // Remove existing data
    await PERMISSION_MODEL.deleteMany()
    for (let i = 0; i <= 1000; i++) {
      for (const permission of permissionsData) {
        const root = await PERMISSION_MODEL.create(permission.root)

        for (const item of permission.permissions) {
          await PERMISSION_MODEL.create({
            ...item,
            root: root._id,
          })
        }
      }
    }
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect()
  }
}

// Call the seedDatabase function to start seeding
seedDatabase()
