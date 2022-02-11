
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
            component: ()=> import('src/pages/tickets/TicketDetail.vue')
          },
          {
            path:'/add',
            component: ()=> import('src/pages/tickets/AddTicket.vue')
          },
          {
            path:'/edit/:id',
            component: ()=> import('src/pages/tickets/EditTicket.vue')
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
  },

  
  //Settings Section
  {
    path:'/settings',
    component: ()=> import('pages/settings/Settings.vue'),
    children:[
      { path: '/change/password', component:() => import('pages/settings/ChangePassword')},
      { 
        path:'/technician/profile',
        component: ()=>import('pages/technician/Profile.vue'),
        children:[
          { path: '/technician/profile/edit', component: () => import('pages/technician/EditProfile.vue') },
        ]
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
