export enum ERoles {
  SUPER_ADMIN = 0,
  MANAGER = 1,
  EDITOR = 2,
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
