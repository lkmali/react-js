export const RestUrlHelper = {
  LOGIN_USER_URL: '/auth/login/basic',

  LOGIN_WITH_GOOGLE: '/google/callback',
  ZOOM_URL: '/zoom/url',
  LOGIN_WITH_ZOOM: '/zoom/callback',
  SET_PASSWORD_URL: '/account/setPassword',

  ADD_USER_URL: '/admin/user',
  VIDEO_UPLOAD_URL: '/recording',
  VIDEO_DETAIL_UPLOAD_URL: '/meeting',

  // userprofile urls
  GET_USER_PROFILE_ADDRESS_URL: '/user/address',
  POST_USER_PROFILE_ADDRESS_URL: '/user/address',
  PATCH_USER_IMAGE_PROFILE_URL: '/user/image/upload-url',
  PATCH_IMAGE_UPLOAD_CONFIRMATION_URL: '/user/image/upload-conformation',
  GET_USER_PROFILE_IMAGE_URL: 'admin/user/image/get-url',
  GET_USER_PROFILE_URL: '/user',
  GET_USER_PROFILE_BY_USERID_URL: '/admin/user',
  GET_RECORDINGDS_URL: '/transcribe',
  GET_USER_LIST_URL: '/admin/user',
  GET_RECORDING_LIST_URL: '/transcribe',
  GET_USER: 'account/user',
  GET_FORM_FIELD_TYPE: '/project-form-field-types',
  GET_GROUPS_LIST_URL: '/admin/organization/group',
  GET_GROUPS_NAME_LIST_URL: '/admin/organization/group-names',
  GET_USERS_INFORMATION: '/admin/user',
  GET_PROJECT_NAME_LIST_URL: '/admin/project-names',

  // Groups urls
  ADD_GROUP_URL: '/admin/organization/group',
  ADD_GROUP_USERS_URL: '/admin/organization/group',
  // GET_GROUPS_BY_ID: "/admin/organization/groups/users",
  GET_GROUPS_USERS_URL: '/admin/organization/group',
  GET_GROUP_FORM_URL: '/admin/organization/group/', // rest url will be construct inside component

  GET_SHARED_RECORDING: '/shared/transcribe',
  GET_ROLE: '/admin/roles',

  GET_ADMIN_RECORDING: '/admin/recording',
  GET_RECORDING: '/recording',
  ANALYTICS: '/usage',
  GET_RECORDING_DETAIL: '/recording',
  UPDATE_SPEAKERS_URL: '/transcribe',

  ADD_COMMENT_URL: '/comment',
  TASKS_URL: '/task',

  DEACTIVATE_USER_URL: '/account/user/deactivate',
  ACTIVATE_USER_URL: '/account/user/activate',

  UPDATE_TRANSCRIPTION_URL: '/transcribe',

  UPDATE_SHARED_DETAILS: '/recording',
  UPDATE_MEETING: '/meeting',

  PASSWORD_RESET_LINK: '/auth/login/email/password/link',
  PASSWORD_RESET: '/account/resetPassword',
  PASSWORD_RESET_BY_EMAIL_LINK: '/auth/login/email/password/set',

  GET_SEARCH_RECORDINDG: '/recording',
  GET_USERS: '/account/users',
  GET_PROJECT_LIST: 'admin/project',
  POST_PROJECT_URL: '/admin/project',

  // form url's
  GET_FORM_BY_ID_URL: '/admin/project-form/',
  GET_FORM_LIST_URL: '/admin/project-form',
  GET_FORM_LIST_URL_BY_PROJECTID: '/admin/project-form-name', // ?projectId=a93a1628-54a2-4d76-aae9-f84c13fcdf79
  POST_FORM_CREATE_URL: '/admin/project-form',
  GET_PROJECT_FORM_IMAGE: '/user-project-form/file-download-url',

  Download_XLSX_FORM_DATA_LIST: '/admin/download/user-project-form',
  USER_PROJECT_FORM: '/admin/user-project-form',

  GUEST_LOGIN: '/auth/login/shared-user/',
  GET_PERMISSION: '/permission',
  SHARED_RESOURCE: '/admin/sharedResource',
  REMOVE_SHARED_RESOURCE: '/admin/sharedResource/remove',
  RESEND_SHARED_RESOURCE_EMAIL: '/admin/sharedResource/resendEmail',

  POST_Task_CREATE_URL: '/admin/task',
  PUT_Task_CREATE_URL: '/admin/task',
  PATCH_Task_URL: '/admin/task',
  GET_Task_CREATE_URL: '/admin/task',
  GET_Url_Task_URL: '/admin/user-task',
  GET_Task_PROJECT_FORMS: '/task',
  POST_Task_TEMPLATE_CREATE_URL: '/admin/task-template',
  GET_Task_TEMPLATE_CREATE_URL: '/admin/task-template',

  GET_User_Event: '/admin/user-event',
  GET_User_Session: '/admin/user/session',
  ADD_WORKFLOW_STAGE: '/admin/workflow/',
  GET_WORKFLOW: '/api/v1/workflow',
}
