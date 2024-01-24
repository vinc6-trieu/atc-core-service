import { ERoles } from '../shared/enums/roles.enum'

export const ROLE_NAMES = {
  [ERoles.ADMIN]: 'Quản trị viên',
  [ERoles.EDITOR]: 'Người chỉnh sửa nội dung',
  [ERoles.MANAGER]: 'Quản lí',
  [ERoles.SUPER_ADMIN]: 'Quản trị viên toàn quyền',
}
