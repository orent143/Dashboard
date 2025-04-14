import { createRouter, createWebHistory } from 'vue-router'; 

// Admin Views
import AdminDashboard from '@/views/Home.vue';
import Users from '@/views/Users.vue';
import Reports from '@/views/Reports.vue';
import Settings from '@/views/Settings.vue';

const routes = [
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/settings', name: 'Settings', component: Settings },

  // Redirect unknown paths to admin dashboard
  { path: '/:pathMatch(.*)*', redirect: '/admin-dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🚫 No guards, no login check
export default router;
