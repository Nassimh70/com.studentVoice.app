<template>
  <div class="space-y-6">
    <!-- Tickets Section -->
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          v-if="isDelegate"
          @click="showForm = !showForm"
 class="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-md"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600">
          <Plus class="w-3.5 h-3.5" />
          Nouveau ticket
        </button>
        <div
          v-else
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed border border-gray-200 dark:border-slate-700"
        >
          <Lock class="w-5 h-5" />
          <span class="text-sm">Réservé aux délégués</span>
        </div>
      </div>

<!-- Formulaire d'ajout Tickets-->
      <div v-if="isDelegate && showForm" class="rounded-2xl p-5" :style="{ background: 'var(--card)', boxShadow: 'var(--shadow-neutral-soft)' }">
        <h3 class="text-sm mb-3" :style="{ color: 'var(--foreground)', fontWeight: '700' }">Nouveau Ticket</h3>
        <div class="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
          <input v-model="formData.ticketSubject" placeholder="Sujet du ticket*" class="col-span-1 sm:col-span-2" />
          <input v-model="formData.ticketCategory" placeholder="Catégorie" />
          <CustomSelect
            v-model="formData.ticketPriority"
            :options="priorityOptions"
            placeholder="Sélectionner une priorité"
          />
          <textarea v-model="formData.ticketDescription" placeholder="Description détaillée*" rows="3" class="col-span-2 resize-none"></textarea>
      </div>
      <div class="flex gap-2">
        <button @click="addTicket" class="px-4 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95" style="background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%); font-weight: 600">Créer</button>
        <button @click="showForm = false" class="px-4 py-2 rounded-xl text-sm" :style="{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: '600' }">Annuler</button>
      </div>
      </div>

      <!-- Info for students -->
      <div v-if="!isDelegate" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <Lock class="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <h3 class="font-semibold text-orange-900">Fonctionnalité Délégué</h3>
            <p class="text-sm text-orange-700 mt-1">
              Seuls les délégués peuvent créer des tickets. Vous pouvez consulter les tickets existants.
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Tickets -->
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(stat, index) in ticketStats" :key="index" class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div :class="['inline-flex p-2 rounded-lg mb-2', stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Filters Tickets -->
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              v-model="searchTermTicket"
              class="pl-10"
            />
          </div>
          <div class="w-full sm:w-56">
            <CustomSelect
              v-model="filterStatusTicket"
              :options="statusFilterOptions"
              placeholder="Tous les statuts"
            />
          </div>
        </div>
      </div>

      <!-- Tickets List -->
      <div class="space-y-4">
        <div
          v-for="ticket in filteredTicketsData"
          :key="ticket.id"
          class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <TicketIcon class="w-5 h-5 text-indigo-600" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ ticket.subject }}</h3>
                <span :class="['px-2 py-0.5 rounded text-xs font-medium', priorityBadges[ticket.priority]]">
                  {{ ticket.priority === 'high' ? 'Urgent' : ticket.priority === 'medium' ? 'Moyen' : 'Faible' }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ ticket.description }}</p>
              <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                <span class="px-2.5 py-0.5 bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium border border-gray-200 dark:border-slate-700">
                  {{ ticket.category }}
                </span>
                <span>•</span>
                <span>Créé le {{ ticket.createdAt }}</span>
                <span>•</span>
                <span>Ticket #{{ ticket.id }}</span>
              </div>
            </div>
            <span :class="['px-3 py-1.5 rounded-full text-sm font-medium border', statusColors[ticket.status]]">
              {{ ticket.status }}
            </span>
          </div>

          <div class="flex items-center gap-2 pt-4 border-t border-gray-100">

            <button
              v-if="ticket.status !== 'Résolu' && ticket.status !== 'Fermé'"
              @click="openCommentForm(ticket)"
              class="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-gray-500 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:active:scale-95"
            >
              <MessageCircleMore class="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
              Commenter
            </button>
            <div class="flex-1"></div>
            <span class="text-xs text-gray-300 font-medium">#{{ ticket.id }}</span>
          </div>
        </div>
      </div>


    <!-- Modal Détails du Ticket -->
    <Transition name="modal">
      <div v-if="selectedTicket && showDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showDetails = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col modal-content border border-gray-100 dark:border-slate-700">

          <!-- Header — clean white -->
          <div class="px-7 pt-6 pb-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span class="text-xs font-bold text-gray-400 tracking-wide">#{{ selectedTicket.id }}</span>
                  <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusColors[selectedTicket.status]]">
                    {{ selectedTicket.status }}
                  </span>
                  <div :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', priorityBadges[selectedTicket.priority]]">
                    <component :is="priorityConfig[selectedTicket.priority].icon" :size="12" :stroke-width="2.5" />
                    {{ priorityConfig[selectedTicket.priority].label }}
                  </div>
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-snug">{{ selectedTicket.subject }}</h2>
              </div>
              <button @click="showDetails = false" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
                <X class="w-5 h-5" />
              </button>
            </div>
            <!-- Metadata chips -->
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-xs text-gray-500 dark:text-gray-400 font-medium border border-gray-100 dark:border-slate-700">
                <TicketIcon class="w-3.5 h-3.5" />
                {{ selectedTicket.category }}
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-xs text-gray-500 dark:text-gray-400 font-medium border border-gray-100 dark:border-slate-700">
                <Clock class="w-3.5 h-3.5" />
                {{ selectedTicket.createdAt }}
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-xs text-gray-500 dark:text-gray-400 font-medium border border-gray-100 dark:border-slate-700">
                <MessageCircleMore class="w-3.5 h-3.5" />
                {{ selectedTicket.comments ? selectedTicket.comments.length : 0 }} commentaire{{ selectedTicket.comments && selectedTicket.comments.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-gray-100 mx-7"></div>

          <!-- Scrollable Content -->
          <div class="overflow-y-auto flex-1 px-7 py-5 space-y-5 modal-scroll">

            <!-- Description -->
            <div class="relative pl-4">
              <div class="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-indigo-400/40"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ selectedTicket.description }}</p>
            </div>

            <!-- Comments Thread -->
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Fil de discussion</h4>

              <div v-if="!selectedTicket.comments || selectedTicket.comments.length === 0" class="flex flex-col items-center py-10">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                  <MessageCircleMore class="w-7 h-7 text-gray-300" />
                </div>
                <p class="text-sm text-gray-400 font-medium">Pas encore de commentaires</p>
                <p class="text-xs text-gray-300 mt-1">Soyez le premier à commenter</p>
              </div>

              <div v-else class="space-y-1">
                <div
                  v-for="(comment, idx) in selectedTicket.comments"
                  :key="comment.id"
                  class="flex gap-3 group"
                >
                  <!-- Avatar -->
                  <div class="flex flex-col items-center flex-shrink-0">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      :style="{ background: commentAvatarColor(comment.author) }"
                    >
                      {{ comment.author.charAt(0) }}
                    </div>
                    <div v-if="idx < selectedTicket.comments.length - 1" class="w-0.5 flex-1 bg-gray-100 mt-1"></div>
                  </div>
                  <!-- Bubble -->
                  <div class="flex-1 pb-4">
                    <div class="flex items-baseline gap-2 mb-1">
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ comment.author }}</span>
                      <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ comment.date }}</span>
                    </div>
                    <div class="bg-gray-50 dark:bg-slate-900/50 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                      {{ comment.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Comment Input Bar -->
          <div v-if="selectedTicket.status !== 'Résolu' && selectedTicket.status !== 'Fermé'" class="border-t border-gray-100 dark:border-slate-700 px-7 py-4 bg-gray-50/50 dark:bg-slate-900/50">
            <div class="flex items-end gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                V
              </div>
              <div class="flex-1 flex items-end gap-2">
                <textarea
                  v-model="newComment"
                  placeholder="Écrire un commentaire..."
                  rows="1"
                  class="flex-1 resize-none"
                  @input="autoResize"
                  ref="commentInput"
                  style="min-height: 42px; max-height: 120px;"
                ></textarea>
                <button
                  @click="addComment"
                  :disabled="!newComment.trim()"
                  class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  :class="newComment.trim()
                    ? 'bg-blue-500 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 active:scale-90'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
                >
                  <Send class="w-4 h-4 " />
                </button>
              </div>
            </div>
          </div>

          <!-- Closed ticket footer -->
          <div v-else class="border-t border-gray-100 px-7 py-3 bg-gray-50/50 text-center">
            <span class="text-xs text-gray-400 font-medium">Ce ticket est {{ selectedTicket.status.toLowerCase() }} — commentaires désactivés</span>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Ticket as TicketIcon, Plus, Search, Clock, AlertCircle, AlertTriangle, CheckCircle, MessageCircleMore, Lock, Eye, X, Send } from 'lucide-vue-next'
import { useAuth } from '../../../composables/useAuth'
import CustomSelect from '../../../components/Shared/CustomSelect.vue'

const { isDelegate } = useAuth()

// Tickets State
const showForm = ref(false)
const searchTermTicket = ref('')
const filterStatusTicket = ref('all')
const selectedTicket = ref(null)
const showDetails = ref(false)
const newComment = ref('')

// Form Data
const formData = ref({
  ticketSubject: '',
  ticketDescription: '',
  ticketCategory: '',
  ticketPriority: ''
})

const priorityConfig = {
  high:   { icon: AlertCircle,   label: 'Urgent' },
  medium: { icon: AlertTriangle, label: 'Moyen'  },
  low:    { icon: CheckCircle,   label: 'Faible' },
}

// Select Options
const priorityOptions = [
  { value: 'low', label: 'Faible', icon: CheckCircle, dot: '#6b7280' },
  { value: 'medium', label: 'Moyenne', icon: AlertTriangle, dot: '#f59e0b' },
  { value: 'high', label: 'Urgente', icon: AlertCircle, dot: '#ef4444' },
]

const statusFilterOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'Ouvert', label: 'Ouvert', dot: '#3b82f6' },
  { value: 'En cours', label: 'En cours', dot: '#f97316' },
  { value: 'Résolu', label: 'Résolu', dot: '#22c55e' },
  { value: 'Fermé', label: 'Fermé', dot: '#6b7280' },
]

// Tickets Data
const tickets = ref([
  { 
    id: 1, 
    subject: "Problème d'accès au compte", 
    description: "Je ne peux pas me connecter à mon compte étudiant depuis ce matin. J'obtiens un message d'erreur 'Authentification échouée', mais mon mot de passe est correct.", 
    status: 'En cours', 
    priority: 'high', 
    createdAt: '2026-03-30', 
    category: 'Technique',
    comments: [
      { id: 1, author: 'Support', text: 'Nous avons reçu votre demande. Nous vérifions votre compte.', date: '2026-03-30 10:30' }
    ]
  },
  { 
    id: 2, 
    subject: "Demande de relevé de notes", 
    description: "J'ai besoin d'un relevé de notes du semestre précédent pour une banque d'études.", 
    status: 'Ouvert', 
    priority: 'medium', 
    createdAt: '2026-03-29', 
    category: 'Administratif',
    comments: []
  },
  { 
    id: 3, 
    subject: "Question sur le projet final", 
    description: "Clarification sur les exigences du projet de fin d'année", 
    status: 'Résolu', 
    priority: 'low', 
    createdAt: '2026-03-28', 
    category: 'Académique',
    comments: [
      { id: 1, author: 'Professeur', text: 'Le projet doit inclure une présentation et un rapport écrit', date: '2026-03-28 14:15' },
      { id: 2, author: 'Support', text: 'Merci, ticket résolu!', date: '2026-03-28 15:00' }
    ]
  },
])

// Ticket Functions
const addTicket = () => {
  if (formData.value.ticketSubject && formData.value.ticketDescription && formData.value.ticketCategory && formData.value.ticketPriority) {
    const today = new Date().toISOString().split('T')[0]
    tickets.value.push({
      id: Math.max(...tickets.value.map(t => t.id), 0) + 1,
      subject: formData.value.ticketSubject,
      description: formData.value.ticketDescription,
      category: formData.value.ticketCategory,
      priority: formData.value.ticketPriority,
      status: 'Ouvert',
      createdAt: today,
      comments: []
    })
    formData.value.ticketSubject = ''
    formData.value.ticketDescription = ''
    formData.value.ticketCategory = ''
    formData.value.ticketPriority = ''
    showForm.value = false
  }
}

const openDetails = (ticket) => {
  selectedTicket.value = ticket
  showDetails.value = true
}

const openCommentForm = (ticket) => {
  selectedTicket.value = ticket
  showDetails.value = true
  newComment.value = ''
}

const addComment = () => {
  if (newComment.value.trim() && selectedTicket.value) {
    if (!selectedTicket.value.comments) {
      selectedTicket.value.comments = []
    }
    const today = new Date()
    const dateStr = today.toLocaleDateString('fr-FR') + ' ' + today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    
    selectedTicket.value.comments.push({
      id: (selectedTicket.value.comments.length || 0) + 1,
      author: 'Vous',
      text: newComment.value,
      date: dateStr
    })
    newComment.value = ''
  }
}

// Comment avatar colors — deterministic per author name
const avatarPalette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']
const commentAvatarColor = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarPalette[Math.abs(hash) % avatarPalette.length]
}

// Auto-resize textarea
const commentInput = ref(null)
const autoResize = (e) => {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// Stats Computed
const ticketStats = computed(() => [
  { label: 'Ouverts', value: tickets.value.filter((t) => t.status === 'Ouvert').length, icon: TicketIcon, color: 'bg-blue-100 text-blue-600' },
  { label: 'En cours', value: tickets.value.filter((t) => t.status === 'En cours').length, icon: Clock, color: 'bg-orange-100 text-orange-600' },
  { label: 'Résolus', value: tickets.value.filter((t) => t.status === 'Résolu').length, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
])

// Status Colors
const statusColors = {
  // Tickets
  'Ouvert': 'bg-blue-100 text-blue-700 border-blue-200',
  'En cours': 'bg-orange-100 text-orange-700 border-orange-200',
  'Résolu': 'bg-green-100 text-green-700 border-green-200',
  'Fermé': 'bg-gray-100 text-gray-700 border-gray-200',
}

const priorityBadges = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700',
}

// Filtered Results
const filteredTicketsData = computed(() =>
  tickets.value.filter((ticket) => {
    const matchesStatus = filterStatusTicket.value === 'all' || ticket.status === filterStatusTicket.value
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTermTicket.value.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTermTicket.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
)
</script>


<style scoped>
/* Animation du modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animation du contenu du modal */
.modal-content {
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Slim scrollbar for modal */
.modal-scroll::-webkit-scrollbar {
  width: 4px;
}
.modal-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
