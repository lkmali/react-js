export const FORM = {
  TABLE_HEADERS: [
    { title: 'Task Template name', fieldName: 'name' },
    // { title: 'Project Name' },
    { title: 'Task Template Created By' },
    { title: 'Created On', fieldName: 'createdAt', sorting: true },
    { title: 'Updated On', fieldName: 'updatedAt', sorting: true },
    { title: 'Task Publish Status' },
    // { title: 'Task End Date ', sorting: false },

    { title: 'Status' },
    // {
    //   title: 'User Task Status',
    //   fieldName: 'status',
    //   filterOption: [
    //     { label: 'Draft', value: 1 },
    //     { label: 'Submitted', value: 2 },
    //     { label: 'Verified', value: 3 },
    //     {
    //       label: 'Rejected',
    //       value: 4,
    //     },
    //     { label: 'Pending', value: 5 },
    //   ],
    //   sorting: true,
    // },
    { title: 'Actions' },
  ],
  FILTER_OPTIONS: {
    search: '',
    sortBy: 'createdAt',
    orderBy: 'ASC',
    pageOffset: 0,
    itemPerPage: 10,
    pageNumber: 1,
  },
}
