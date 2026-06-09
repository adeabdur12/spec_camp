<template>
  <div class="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

    <div class="w-full max-w-sm bg-surface-container-lowest p-8 rounded-2xl shadow-2xl border border-outline-variant/10 relative z-10">
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <img src="/logo/logo.svg" alt="SPEC CAMP" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-black text-on-surface font-headline tracking-tight mb-1">SPEC CAMP</h1>
        <p class="text-on-surface-variant font-medium uppercase tracking-widest text-[9px]">Management Expedition System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-3">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@speccamp.com"
            class="w-full px-4 py-3 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-3">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPass ? 'text' : 'password'" 
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm pr-10"
              required
            />
            <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-lg">{{ showPass ? 'visibility' : 'visibility_off' }}</span>
            </button>
          </div>
        </div>

        <div v-if="error" class="bg-error-container text-on-error-container p-3 rounded-xl text-xs font-bold text-center animate-shake">
          {{ error }}
        </div>

        <button 
          :disabled="loading"
          class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
        >
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authService.login(email.value, password.value)
    if (res.success) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const perms = res.data.user.permissions || []
      const permRoutes = {
        view_dashboard: 'admin-dashboard',
        view_booking: 'bookings',
        view_package: 'paket-event',
        view_inventory: 'inventory',
        view_service: 'services',
        view_customer: 'customers',
        view_report: 'reports',
        manage_user: 'users',
        manage_role: 'roles',
        manage_settings: 'settings'
      }
      const firstRoute = perms
        .map(p => permRoutes[p])
        .filter(Boolean)[0] || 'admin-dashboard'
      router.push({ name: firstRoute })
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa email dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
