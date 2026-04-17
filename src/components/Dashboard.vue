<template>
  <div class="flex flex-col lg:flex-row gap-6 h-full" style="--blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95">
    <!-- Left Column -->
    <div class="flex-1 flex flex-col gap-6 min-w-0">
      <!-- Stats Cards - 4 columns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Réclamations (blue) -->
        <div
          class="relative rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/30 total-reclamations-bg"
        >
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 rounded-xl bg-white/10">
              <FileText class="w-6 h-6 text-white" />
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">{{ stats[0].change }}</span>
          </div>
          <!-- Content -->
          <div>
            <p class="text-sm font-medium mb-2 text-white/80">{{ stats[0].title }}</p>
            <h3 class="text-3xl font-bold mb-1 text-white">{{ stats[0].value }}</h3>
            <p class="text-xs text-white/60">{{ stats[0].subtitle }}</p>
          </div>
        </div>

        <!-- Réclamations Résolues -->
        <div class="relative rounded-2xl p-6 bg-white border border-gray-200">
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 rounded-xl bg-gray-100">
              <CheckCircle class="w-6 h-6 text-gray-600" />
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">{{ stats[1].change }}</span>
          </div>
          <!-- Content -->
          <div>
            <p class="text-sm font-medium mb-2 text-gray-600">{{ stats[1].title }}</p>
            <h3 class="text-3xl font-bold mb-1 text-gray-900">{{ stats[1].value }}</h3>
            <p class="text-xs text-gray-500">{{ stats[1].subtitle }}</p>
          </div>
        </div>

        <!-- Étudiants Actifs -->
        <div class="relative rounded-2xl p-6 bg-white border border-gray-200">
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 rounded-xl bg-gray-100">
              <Users class="w-6 h-6 text-gray-600" />
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">{{ stats[2].change }}</span>
          </div>
          <!-- Content -->
          <div>
            <p class="text-sm font-medium mb-2 text-gray-600">{{ stats[2].title }}</p>
            <h3 class="text-3xl font-bold mb-1 text-gray-900">{{ stats[2].value }}</h3>
            <p class="text-xs text-gray-500">{{ stats[2].subtitle }}</p>
          </div>
        </div>

        <!-- Tickets Soumis -->
        <div class="relative rounded-2xl p-6 bg-white border border-gray-200">
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 rounded-xl bg-gray-100">
              <Ticket class="w-6 h-6 text-gray-600" />
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">{{ stats[3].change }}</span>
          </div>
          <!-- Content -->
          <div>
            <p class="text-sm font-medium mb-2 text-gray-600">{{ stats[3].title }}</p>
            <h3 class="text-3xl font-bold mb-1 text-gray-900">{{ stats[3].value }}</h3>
            <p class="text-xs text-gray-500">{{ stats[3].subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Bubble / Category Distribution Card -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Répartition par Catégorie</h2>
            <p class="text-sm text-gray-500 mt-1">Réclamations par catégorie</p>
          </div>
        </div>

        <!-- Bubble Chart -->
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- SVG Bubbles -->
          <div class="flex-shrink-0">
            <svg width="240" height="200" viewBox="0 0 240 200">
              <!-- Informatique -->
              <circle cx="130" cy="75" r="55" :fill="getCategoryColor(complaintsByCategory[0].category)" opacity="0.9" />
              <text x="130" y="70" text-anchor="middle" fill="white" font-size="13" font-weight="700">{{ complaintsByCategory[0].count }}</text>
              <text x="130" y="86" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10">{{ complaintsByCategory[0].category }}</text>

              <!-- Mathématiques -->
              <circle cx="65" cy="125" r="50" :fill="getCategoryColor(complaintsByCategory[1].category)" opacity="0.85" />
              <text x="65" y="120" text-anchor="middle" fill="white" font-size="12" font-weight="700">{{ complaintsByCategory[1].count }}</text>
              <text x="65" y="135" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10">{{ complaintsByCategory[1].category }}</text>

              <!-- Sciences -->
              <circle cx="185" cy="135" r="38" :fill="getCategoryColor(complaintsByCategory[2].category)" opacity="0.85" />
              <text x="185" y="130" text-anchor="middle" fill="white" font-size="11" font-weight="700">{{ complaintsByCategory[2].count }}</text>
              <text x="185" y="144" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9">{{ complaintsByCategory[2].category }}</text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="flex flex-col gap-4">
            <div
              v-for="item in complaintsByCategory"
              :key="item.category"
              class="flex items-center gap-3"
            >
              <div class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-900">{{ item.category }}</span>
                <div class="h-1 rounded-full" :style="{ backgroundColor: getCategoryColor(item.category), width: '40px' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6">
      <!-- Status Pie Chart -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Statut des Réclamations</h2>
          <p class="text-sm text-gray-500 mt-1">Suivez les réclamations par statut</p>
        </div>

        <div class="flex flex-col items-center mb-4">
          <div class="px-4 py-2 bg-gray-50 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
            <span class="text-xs text-gray-500 uppercase tracking-widest font-bold">Total</span>
            <span class="text-xl font-black text-blue-600">{{ totalComplaints }}</span>
          </div>
        </div>

        <div class="flex items-center justify-center mb-8 relative h-[220px]">
          <svg width="200" height="200" viewBox="0 0 200 200" class="transform -rotate-90">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: var(--blue-dark); stop-opacity:1" />
                <stop offset="50%" style="stop-color: var(--blue); stop-opacity:1" />
                <stop offset="100%" style="stop-color: var(--blue-deep); stop-opacity:1" />
              </linearGradient>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #c41e1e; stop-opacity:1" />
                <stop offset="50%" style="stop-color: #DC2626; stop-opacity:1" />
                <stop offset="100%" style="stop-color: #a51b1b; stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#e5e7eb" stroke-width="12" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" stroke-width="12" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="#e5e7eb" stroke-width="12" />
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="url(#blueGradient)"
              stroke-width="12"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (complaintsByStatus[0].percentage / 100) * circumference"
              stroke-linecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="url(#redGradient)"
              stroke-width="12"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (complaintsByStatus[1].percentage / 100) * circumference"
              stroke-linecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="55"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="12"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (complaintsByStatus[2].percentage / 100) * circumference"
              stroke-linecap="round"
            />
          </svg>

          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
              +5,33%
            </span>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
            <span class="text-sm text-gray-600">{{ complaintsByStatus[0].status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span class="text-sm text-gray-600">{{ complaintsByStatus[1].status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gray-300"></span>
            <span class="text-sm text-gray-600">{{ complaintsByStatus[2].status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  FileText,
  CheckCircle,
  Users,
  Ticket,
} from 'lucide-vue-next'

const stats = [
  {
    title: 'Total Réclamations',
    value: '1.247',
    subtitle: 'ce mois dernier',
    change: '+6,5%',
    trend: 'up',
    icon: FileText,
    gradient: 'from-indigo-500 to-indigo-600',
    iconBg: 'bg-white/20',
  },
  {
    title: 'Réclamations Résolues',
    value: '892',
    subtitle: 'résolues ce mois',
    change: '+12,4%',
    trend: 'up',
    icon: CheckCircle,
    bg: 'bg-white',
    textColor: 'text-gray-900',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  {
    title: 'Étudiants Actifs',
    value: '4.387',
    subtitle: 'utilisateurs actifs',
    change: '-2,08%',
    trend: 'down',
    icon: Users,
    bg: 'bg-white',
    textColor: 'text-gray-900',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Tickets Soumis',
    value: '2.156',
    subtitle: 'tickets ce mois',
    change: '+12,1%',
    trend: 'up',
    icon: Ticket,
    bg: 'bg-white',
    textColor: 'text-gray-900',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
]

const complaintsByStatus = [
  { status: 'Acceptées', count: 5133, color: 'bg-indigo-600', percentage: 62 },
  { status: 'Refusées', count: 3346, color: 'bg-red-500', percentage: 26 },
  { status: 'En attente', count: 1521, color: 'bg-gray-300', percentage: 12 },
]

const complaintsByCategory = [
  { category: 'Informatique', count: 2487, change: '+1,8%', trend: 'up' },
  { category: 'Mathématiques', count: 1828, change: '+2,3%', trend: 'up' },
  { category: 'Sciences', count: 1463, change: '-1,04%', trend: 'down' },
]

const totalComplaints = computed(() => complaintsByStatus.reduce((sum, item) => sum + item.count, 0))

const getCategoryColor = (category) => {
  const colors = {
    'Informatique': '#1d3f95',
    'Mathématiques': '#1f54d2',
    'Sciences': '#255fe3',
  }
  return colors[category] || '#255fe3'
}

const circumference = 2 * Math.PI * 70

// getPreviousPercentage removed (unused) to reduce dead code
</script>

<style scoped>
.total-reclamations-bg {
  background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%);
}

.legend-resolues {
  background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%);
}
</style>