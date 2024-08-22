export const FORM_DATA = {
  TABLE_HEADERS: [
    { title: 'Form Title', fieldName: 'title', sorting: true },
    { title: 'Form Name' },
    { title: 'Project Name' },
    { title: 'Form Filled By' },
    { title: 'Created On', fieldName: 'createdAt', sorting: true },
    { title: 'Updated On', fieldName: 'updatedAt', sorting: true },
    {
      title: 'Status',
      fieldName: 'status',
      filterOption: [
        { label: 'Draft', value: 1 },
        { label: 'Submitted', value: 2 },
        { label: 'Verified', value: 3 },
        {
          label: 'Rejected',
          value: 4,
        },
        { label: 'Pending', value: 5 },
      ],
      sorting: true,
    },
    { title: 'Actions' },
  ],
  FILTER_OPTIONS: {
    search: '',
    sortBy: 'title',
    orderBy: 'ASC',
    pageOffset: 0,
    itemPerPage: 10,
  },
}
