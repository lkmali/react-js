export const GROUP = {
  TABLE_HEADERS: [
    { title: 'Group Name', fieldName: 'name', sorting: true },
    { title: 'Description' },
    { title: 'Created By' },
    { title: 'Created Date', fieldName: 'createdAt', sorting: true },
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
