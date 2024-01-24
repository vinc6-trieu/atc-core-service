export enum ERoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EDITOR = 'editor',
}

export enum ERoleStatus {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

export enum EPermissionOperation {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
}
