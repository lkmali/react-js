export interface ApplicationConfig {
  REACT_APP_PUBLIC_URL?: string
  REACT_APP_PORT?: number
  REACT_APP_BACKEND_BASE_URL?: string
  REACT_APP_WORKFLOW_BASE_URL?: string
}
export interface ActionType<T> {
  type: string
  payload: T
}
export interface Filter {
  resourceName?: string
  resourceId?: number
  userId?: string
  eventName?: string
  itemPerPage: number
  pageOffset: number
  search?: string
  searchBy?: string
  sortBy?: string
  orderBy?: string
  pageNumber?: string
  cacheKey?: CacheType
  filterBy?: any
  needToSaveCache?: boolean
  isWorkflowTask?: boolean
}

export interface DownloadXlsxRequest {
  formFieldId?: number[]
  userFromId?: number[]
  projectId?: string
  status?: number[]
}

export interface ResourceSharing {
  permission: PermissionType
  email: string
  userFromId: number
}

export type ResourceType = 'project' | 'user' | 'group' | 'project-form' | 'form-data'
export type PermissionType = 'all' | 'view' | 'edit' | 'delete' | 'create' | 'canShare'
export type CacheType =
  | 'project'
  | 'user'
  | 'group'
  | 'project-form'
  | 'form-data'
  | 'task'
  | 'workflow'
