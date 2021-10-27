
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        children: [        
          {
            path:'/ticket/:id',
            name:'ticketDetail',
            component: ()=> import('pages/TicketDetail.vue')
          },
          {
            path:'/add',
            component: ()=> import('pages/AddTicket.vue')
          },
        ]
      }
    ]
  }, {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'resetPassword/:email?', component: () => import('pages/ResetPassword.vue') },
    ]
  },{
    path: '/change/password',
    component:() => import('pages/ChangePassword'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
