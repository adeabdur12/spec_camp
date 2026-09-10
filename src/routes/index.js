import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import TermsAndConditions from '../views/TermsAndConditions.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import AdminDashboard from '../views/admin/Dashboard/Index.vue'
import Inventory from '../views/admin/Inventory/Index.vue'
import Bookings from '../views/admin/Bookings/Index.vue'
import Customers from '../views/admin/Customers/Index.vue'
import Settings from '../views/admin/Settings/Index.vue'
import Users from '../views/admin/Users/Index.vue'
import Roles from '../views/admin/Roles/Index.vue'
import PackageEvents from '../views/admin/PackageEvents/Index.vue'
import Services from '../views/admin/Services/Index.vue'
import AdminLogin from '../views/Auth/Login.vue'
import BookingPage from '../views/BookingPage.vue'
import SearchBooking from '../views/SearchBooking.vue'
import FoodMenu from '../views/FoodMenu.vue'
import Reports from '../views/admin/Reports/Index.vue'
import CRM from '../views/admin/CRM/Index.vue'
import Referrals from '../views/admin/Referrals/Index.vue'
import ReferralDetail from '../views/admin/Referrals/Detail.vue'
import SaungSpec from '../views/admin/SaungSpec/Index.vue'
import AffiliateAuth from '../views/affiliate/AffiliateAuth.vue'
import AffiliateDashboard from '../views/affiliate/AffiliateDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingPage
  },
  {
    path: '/search-booking',
    name: 'search-booking',
    component: SearchBooking
  },
  {
    path: '/menu',
    name: 'menu',
    component: FoodMenu
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/terms-and-conditions',
    name: 'terms',
    component: TermsAndConditions
  },
  {
    path: '/privacy-policy',
    name: 'privacy',
    component: PrivacyPolicy
  },
  {
    path: '/affiliate',
    name: 'affiliate',
    component: AffiliateAuth,
    meta: { requiresAffiliateGuest: true }
  },
  {
    path: '/affiliate/dashboard',
    name: 'affiliate-dashboard',
    component: AffiliateDashboard,
    meta: { requiresAffiliateAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: AdminLogin,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, permission: 'view_dashboard' }
  },
  {
    path: '/admin/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true, permission: 'manage_user' }
  },
  {
    path: '/admin/roles',
    name: 'roles',
    component: Roles,
    meta: { requiresAuth: true, permission: 'manage_role' }
  },
  {
    path: '/admin/paket-event',
    name: 'paket-event',
    component: PackageEvents,
    meta: { requiresAuth: true, permission: 'view_package' }
  },
  {
    path: '/admin/services',
    name: 'services',
    component: Services,
    meta: { requiresAuth: true, permission: 'view_service' }
  },
  {
    path: '/admin/saung-spec',
    name: 'saung-spec',
    component: SaungSpec,
    meta: { requiresAuth: true, permission: 'view_saung_spec' }
  },
  {
    path: '/admin/inventory',
    name: 'inventory',
    component: Inventory,
    meta: { requiresAuth: true, permission: 'view_inventory' }
  },
  {
    path: '/admin/bookings',
    name: 'bookings',
    component: Bookings,
    meta: { requiresAuth: true, permission: 'view_booking' }
  },
  {
    path: '/admin/customers',
    name: 'customers',
    component: Customers,
    meta: { requiresAuth: true, permission: 'view_customer' }
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true, permission: 'manage_settings' }
  },
  {
    path: '/admin/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true, permission: 'view_report' }
  },
  {
    path: '/admin/crm',
    name: 'crm',
    component: CRM,
    meta: { requiresAuth: true, permission: 'view_lead' }
  },
  {
    path: '/admin/referrals',
    name: 'referrals',
    component: Referrals,
    meta: { requiresAuth: true, permission: 'view_referral' }
  },
  {
    path: '/admin/referrals/:id',
    name: 'referral-detail',
    component: ReferralDetail,
    meta: { requiresAuth: true, permission: 'view_referral' }
  },
  {
    path: '/admin/whatsapp-bot',
    component: () => import('../views/admin/WhatsappBot/Index.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/whatsapp-bot/settings'
      },
      {
        path: 'settings',
        name: 'whatsapp-bot-settings',
        component: () => import('../views/admin/WhatsappBot/components/SettingsTab.vue')
      },
      {
        path: 'history',
        name: 'whatsapp-bot-history',
        component: () => import('../views/admin/WhatsappBot/components/HistoryTab.vue')
      }
    ],
    meta: { requiresAuth: true, permission: 'manage_settings' }
  },
  {
    path: '/settings',
    redirect: '/admin/settings'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const affToken = localStorage.getItem('aff_token')

  if (to.meta.requiresAffiliateAuth && !affToken) {
    return next({ name: 'affiliate' })
  }

  if (to.meta.requiresAffiliateGuest && affToken) {
    return next({ name: 'affiliate-dashboard' })
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'admin-dashboard' })
  }

  if (to.meta.permission && isAuthenticated && to.meta.permission !== 'view_dashboard') {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role?.toLowerCase() === 'admin') return next()
      const perms = user.permissions || []
      if (!perms.includes(to.meta.permission)) {
        return next({ name: 'admin-dashboard' })
      }
    } catch {
      return next({ name: 'login' })
    }
  }

  next()
})

export default router
