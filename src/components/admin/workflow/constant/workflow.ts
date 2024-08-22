export const workflowName = {
  TABLE_HEADERS: [
    { title: 'work flow Name', fieldName: 'workflowName', sorting: true },
    { title: 'Created By', fieldName: 'createdByEmail', sorting: true },
    { title: 'Created On', fieldName: 'createdOn', sorting: true },
    { title: 'Updated On', fieldName: 'modifiedOn', sorting: true },
    { title: 'Status', fieldName: 'status', sorting: true },
    { title: 'Actions' },
  ],
  FILTER_OPTIONS: {
    search: '',
    sortBy: 'name',
    // orderBy: 'ASC',
    pageOffset: 0,
    itemPerPage: 10,
  },
  TASK_FILTER_OPTIONS: {
    search: '',
    orderBy: 'ASC',
    pageOffset: 0,
    itemPerPage: 10,
    // searchBy: 'taskName',
  },
}
