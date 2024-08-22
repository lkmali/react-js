export const FORM = {
  TABLE_HEADERS: [
    { title: 'Task Name', fieldName: 'name' },
    { title: 'Project Name' },
    { title: 'Task Assigned To' },
    { title: 'Task Start Date', fieldName: 'createdAt', sorting: true },
    { title: 'Task End Date ', sorting: false },
    { title: 'Created On', fieldName: 'createdAt', sorting: true },
    { title: 'Updated On', fieldName: 'updatedAt', sorting: true },

    {
      title: 'User Task Status',
      fieldName: 'status',
      filterOption: [
        { label: 'InActive', value: 0 },
        { label: 'Draft', value: 1 },
        { label: 'Submitted', value: 2 },
        { label: 'Verified', value: 3 },
        {
          label: 'Rejected',
          value: 4,
        },
        { label: 'Pending', value: 5 },
        { label: 'ParleyRejected', value: 6 },
        { label: 'Completed', value: 7 },
      ],
      sorting: true,
    },
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
