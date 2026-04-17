<template>
  <div class="relative" ref="wrapper">
    <!-- Bouton cloche -->
    <button
      @click="togglePanel"
      class="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-var(--hover) "
    >
      <Bell class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
      ></span>
    </button>

    <!-- Panneau notifications -->
    <Transition name="notif">
      <div
        v-if="isOpen"
        class="fixed top-16 left-3 right-3 w-auto max-w-[calc(100vw-1.5rem)] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl z-50 overflow-hidden sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-80 sm:max-w-none"
      >
        <!-- En-tête -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Notifications
            <span
              v-if="unreadCount > 0"
              class="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
            >{{ unreadCount }}</span>
          </h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Tout marquer lu
          </button>
        </div>

        <!-- Liste des notifications -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="notifications.length === 0" class="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
            Aucune notification
          </div>
          <div
            v-for="notif in notifications"
            :key="notif.id"
            @click="markRead(notif.id)"
            class="flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/20': notif.unread }"
          >
            <!-- Icône -->
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              :class="notif.iconBg">
              <component :is="notif.icon" class="w-4 h-4" :class="notif.iconColor" />
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-medium" :class="notif.typeColor">{{ notif.type }}</span>
                <span v-if="notif.unread" class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              </div>
              <p class="text-xs text-gray-700 dark:text-gray-300 mt-0.5 truncate">{{ notif.message }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ notif.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Bell, FileText, CheckCircle, Ticket, AlertTriangle, User } from 'lucide-vue-next'

// ─── État ───────────────────────────────────────────────
const isOpen = ref(false)
const wrapper = ref(null)

// ─── Données (remplace par un appel API réel) ──────────
const notifications = ref([
  {
    id: 1,
    type: 'Réclamation',
    message: 'Nouvelle réclamation soumise par Amira B.',
    time: 'Il y a 2 min',
    unread: true,
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    typeColor: 'text-blue-600',
  },
  {
    id: 2,
    type: 'Résolu',
    message: 'La réclamation #1034 a été résolue avec succès.',
    time: 'Il y a 15 min',
    unread: true,
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    typeColor: 'text-green-600',
  },
  {
    id: 3,
    type: 'Ticket',
    message: 'Nouveau ticket ouvert : Accès bibliothèque refusé.',
    time: 'Il y a 1h',
    unread: true,
    icon: Ticket,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    typeColor: 'text-amber-600',
  },
  {
    id: 4,
    type: 'Urgent',
    message: 'Réclamation urgente en attente de réponse.',
    time: 'Il y a 3h',
    unread: false,
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    typeColor: 'text-red-600',
  },
  {
    id: 5,
    type: 'Délégué',
    message: 'Karim M. a rejoint en tant que nouveau délégué.',
    time: 'Il y a 5h',
    unread: false,
    icon: User,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    typeColor: 'text-purple-600',
  },
])

// ─── Computed ──────────────────────────────────────────
const unreadCount = computed(() =>
  notifications.value.filter(n => n.unread).length
)

// ─── Actions ───────────────────────────────────────────
function togglePanel() {
  isOpen.value = !isOpen.value
}

function markRead(id) {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.unread = false
}

function markAllRead() {
  notifications.value.forEach(n => (n.unread = false))
}

// ─── Fermer en cliquant à l'extérieur ─────────────────
function handleOutsideClick(e) {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
/* Animation d'entrée/sortie du panneau */
.notif-enter-active,
.notif-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>