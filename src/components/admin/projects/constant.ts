export const PROJECT = {
  TABLE_HEADERS: [
    { title: 'Project Name', fieldName: 'name', sorting: true },
    { title: 'Project Description' },
    { title: 'Project Created By' },
    { title: 'Project Owner' },
    { title: 'Project Created Date', fieldName: 'createdAt', sorting: true },
    { title: 'Updated Date', fieldName: 'updatedAt', sorting: true },
    { title: 'Status' },
    { title: 'Actions' },
  ],
  FILTER_OPTIONS: {
    search: '',
    sortBy: 'name',
    orderBy: 'ASC',
    pageOffset: 0,
    itemPerPage: 10,
  },
}
