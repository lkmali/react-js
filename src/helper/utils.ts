import { isNil } from 'lodash'
import ReactGA from 'react-ga4'
import { storageActions } from '../actions'
import restActions from '../actions/rest'
import {
  CacheType,
  DownloadXlsxRequest,
  Filter,
  PermissionType,
  ResourceSharing,
  ResourceType,
} from '../typings'
import { RestUrlHelper } from './restUrl'
export function getToken(): string | null {
  return storageActions.getItem('token')
}
export function getAuthorizationHeaders() {
  return {
    Authorization: `Bearer ${storageActions.getItem('token')}`,
  }
}

/** *
 * Updating child sequence for all the fields with parent seqnece and child sequence
 * like parent-sequence 1 and child is 1(sequence: 1.1).**/
export function normalizeChild(fields: any) {
  fields = fields.sort(function (a: any, b: any) {
    const isAsc = true
    const x = a.sequence.split('.').map(Number)
    const y = b.sequence.split('.').map(Number)
    for (let i = 0; i < 7; i++) {
      if (x[i] > y[i]) return isAsc ? 1 : -1
      if (x[i] < y[i]) return isAsc ? -1 : 1
      if (!isNaN(x[i]) && isNaN(y[i])) return isAsc ? 1 : -1
      if (isNaN(x[i]) && !isNaN(y[i])) return isAsc ? -1 : 1
    }
    return 0
  })
  fields.forEach((filedData: any) => {
    if (filedData.children && filedData.children.length) {
      // filedData.children = filedData.children.map((x) => {
      //   return { ...x, sequence: `${filedData.sequence}.${x.sequence}` }
      // })
      normalizeChild(filedData.children)
    }
  })
}

export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()
}

export function reactGAEvent(category: string, action: string, label: string) {
  ReactGA.event({ category, action, label })
}

export function getQueryParameter(filter: Filter): string {
  let parameter = `?limit=${filter.itemPerPage}&skip=${filter.pageOffset}`
  if (filter.sortBy) {
    parameter = `${parameter}&sortBy=${filter.sortBy}`
  }

  if (filter.pageNumber) {
    parameter = `${parameter}&pageNumber=${filter.pageNumber}`
  }
  if (filter.orderBy) {
    parameter = `${parameter}&orderBy=${filter.orderBy}`
  }

  if (filter.search) {
    parameter = `${parameter}&search=${filter.search}`
  }
  if (filter.searchBy) {
    parameter = `${parameter}&searchBy=${filter.searchBy}`
  }
  if (filter.resourceName) {
    parameter = `${parameter}&resourceName=${filter.resourceName}`
  }
  if (filter.resourceId) {
    parameter = `${parameter}&resourceId=${filter.resourceId}`
  }
  if (filter.eventName) {
    parameter = `${parameter}&eventName=${filter.eventName}`
  }
  if (filter.userId) {
    parameter = `${parameter}&userId=${filter.userId}`
  }
  if (filter.cacheKey) {
    parameter = `${parameter}&cacheKey=${filter.cacheKey}`
  }
  if (filter.needToSaveCache) {
    parameter = `${parameter}&needToSaveCache=${filter.needToSaveCache.toString()}`
  }
  if (typeof filter.isWorkflowTask !== 'undefined') {
    parameter = `${parameter}&isWorkflowTask=${filter.isWorkflowTask}`
  }

  if (filter.filterBy) {
    filter.filterBy.forEach((filterObj: { [s: string]: unknown } | ArrayLike<unknown>) => {
      const [fieldName, value] = Object.entries(filterObj)[0]
      parameter = `${parameter}&${fieldName}=${value}`
    })
  }
  return parameter
}

export function setCacheFilter(url: string, totalCount: number, data: any[]): void {
  const url1 = new URL(url)
  const searchParams = url1.searchParams
  if (
    isNil(searchParams.get('cacheKey')) ||
    isNil(searchParams.get('needToSaveCache') !== 'true')
  ) {
    return
  }

  const filter = {} as any
  const filterKey = [
    'limit',
    'skip',
    'pageOffset',
    'itemPerPage',
    'sortBy',
    'orderBy',
    'search',
    'searchBy',
    'resourceName',
    'resourceId',
    'eventName',
    'userId',
    'cacheKey',
    'needToSaveCache',
    'pageNumber',
    'isWorkflowTask',
  ]

  for (const key of filterKey) {
    if (!isNil(searchParams.get(key))) {
      filter[key] = searchParams.get(key)
    }
  }
  if (!isNil(filter['limit'])) {
    filter['itemPerPage'] = filter['limit']
  }
  if (!isNil(filter['skip'])) {
    filter['pageOffset'] = filter['skip']
  }

  if (data.length === 0 && totalCount > 0 && filter['pageOffset'] > 0) {
    const pageOffset = filter['pageOffset'] ?? 1
    filter['pageOffset'] = pageOffset - 1
    filter['skip'] = pageOffset - 1
  }

  localStorage.setItem(`filter:${searchParams.get('cacheKey')}`, JSON.stringify(filter))
}

export function getCacheFilter(filter: Filter, type: CacheType): Filter {
  const savedPage = localStorage.getItem(`filter:${type}`)
  if (!isNil(savedPage)) {
    const data = JSON.parse(savedPage)
    if (!isNil(data.pageNumber)) {
      data.pageNumber = Number(data.pageNumber)
      data.pageOffset = Number(data.pageOffset)
      data.itemPerPage = Number(data.itemPerPage)
    }
    return data
  } else {
    return filter
  }
}

const month: { [key: number]: string } = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

export function getFormattedTime(time: string) {
  const timeArr = time.split(':')
  let hours = Number(timeArr[0])
  let min: number | string = Number(timeArr[1])
  const suffix = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  min = min < 10 ? (min > 0 ? '0' + min : min) : min
  if (isNaN(hours)) {
    const date = new Date(time)
    const minutes = date.getMinutes()
    return (
      date.getHours() + ':' + (minutes < 10 ? (minutes > 0 ? '0' + minutes : minutes) : minutes)
    )
  }
  return hours + ':' + min + ' ' + suffix
}

export function getFormattedDate(date: string) {
  const newDate = new Date(date)
  const formattedDate =
    month[newDate.getMonth()] + ' ' + newDate.getDate() + ', ' + newDate.getFullYear()
  return formattedDate
}

/**
 * Check @param password equals to @param confirmPassword
 */
export function isMatched(password: string, confirmPassword: string) {
  return password === confirmPassword
}

/**
 * Check for a valid @param password
 * A valid password contains atleast one, one special character, and should of alteast of size 6
 */
export function validatePassword(password: string) {
  /**
   * (/^(?=.*[0-9])=>should contains atleast one digit between 0-9
   * (?=.*[!@#$%^&*])=>should contains alteast one special symbols
   * [a-zA-Z0-9!@#$%^&*]{6,}=>should contains atleast 8 from mentioned character
   */
  if (!password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/g))
    return false
  return true
}

export function validateEmail(email: string) {
  if ((email && !email.match(/\S+@\S+\.\S+/)) || !email) {
    return false
  }
  return true
}

export function validateName(name: string) {
  if (!name) return false
  else {
    return !name.replace(/^[a-zA-Z][a-zA-Z ]+/g, '')
  }
}

export function getUploadImageRequest(file: File) {
  const myHeaders = new Headers()
  return {
    method: 'PUT',
    headers: myHeaders,
    body: file,
    redirect: 'follow',
  }
}
export function ellipsis(text: any, length: number) {
  if (text == null || text === undefined) {
    return null
  }
  return text.length > length ? `${text.slice(0, length)} ...` : text
}

export async function downloadXlsx(body: DownloadXlsxRequest, fileName: string) {
  try {
    const response = await restActions.POST(RestUrlHelper.Download_XLSX_FORM_DATA_LIST, body, {
      ...getAuthorizationHeaders(),
      responseType: 'arraybuffer',
    })
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}_${Date.now()}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    return { success: true }
  } catch (exception) {
    return { success: false, exception }
  }
}

export async function SharedResourceData(body: ResourceSharing[], resourceType: ResourceType) {
  try {
    await restActions.POST(`${RestUrlHelper.SHARED_RESOURCE}/${resourceType}`, body, {
      ...getAuthorizationHeaders(),
    })
    return { success: true }
  } catch (exception) {
    return { success: false, exception }
  }
}

export async function getPermission() {
  try {
    const response = await restActions.GET(RestUrlHelper.GET_PERMISSION)
    storageActions.storeItem('permission', JSON.stringify(response.data ?? {}))
  } catch (exception) {
    storageActions.storeItem('permission', JSON.stringify({}))
  }
}

export function getCachePermission() {
  try {
    const data = storageActions.getItem('permission') ?? ''
    return JSON.parse(data)
  } catch (exception) {
    return {}
  }
}

export function canAccessByUser(resource: ResourceType, permissionType: PermissionType[]): boolean {
  const permission = getCachePermission()
  let flag = false
  const actions = permission[resource] ?? []
  for (const role of permissionType) flag = flag || actions.indexOf(role) >= 0

  if (actions.indexOf('all') >= 0) {
    flag = flag || true
  }
  return flag
}

export function removeTrailingSlash(str: string) {
  return str.endsWith('/') ? str.slice(0, -1) : str
}
export function getSharedResourceBody(emails: string[], ids: number[]): ResourceSharing[] {
  const data = [] as ResourceSharing[]
  for (const email of emails) {
    for (const userFromId of ids) {
      data.push({
        email,
        userFromId,
        permission: 'view',
      })
    }
  }
  return data
}
