import { ref, computed } from 'vue'

const user = ref({
  id: '1',
  name: 'Sarah Benali',
  email: 'sarah.benali@university.ma',
  role: 'student',
  class: 'INFO 3',
  department: 'Informatique',
})

const isDelegate = computed(() => user.value.role === 'delegate')

const canPublish = computed(() => {
  const publishRoles = ['delegate', 'prof', 'admin']
  return publishRoles.includes(user.value.role)
})

const toggleRole = () => {
  user.value = {
    ...user.value,
    role: user.value.role === 'student' ? 'delegate' : 'student',
  }
}

const setUser = (newUser) => {
  user.value = newUser
}

const logout = () => {
  // Clear user data
  user.value = {
    id: null,
    name: null,
    email: null,
    role: null,
    class: null,
    department: null,
  }
  // Redirect to home page
  window.location.href = '/home'
}

export function useAuth() {
  return { user, isDelegate, canPublish, toggleRole, setUser, logout }
}