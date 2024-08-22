export const FORM = {
  TABLE_HEADERS: [
    { title: 'Form Name', fieldName: 'name', sorting: true },
    // { title: 'Project Name' },
    { title: 'Form Created By' },
    { title: 'Created On', fieldName: 'createdAt', sorting: true },
    { title: 'Updated On', fieldName: 'updatedAt', sorting: true },
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
