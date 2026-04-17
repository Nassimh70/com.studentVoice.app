<template>
  <div class="space-y-6">
    <!-- Header -->
         <!-- Info Banner -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Lightbulb class="w-6 h-6 text-purple-600 flex-shrink-0" />
        <div>
          <h3 class="font-semibold text-purple-900">Comment ça marche ?</h3>
          <p class="text-sm text-purple-700 mt-1">
            Proposez vos idées pour améliorer la vie universitaire. Les suggestions les plus votées seront examinées par l'administration.
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <button
        @click="showForm = !showForm"
        class="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-md"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600"
      >
        <Plus class="w-3.5 h-3.5" />
        Nouvelle suggestion
      </button>
    </div>
    

    <!-- Formulaire d'ajout -->
    <div v-if="showForm" class="rounded-2xl p-5" :style="{ background: 'var(--card)', boxShadow: 'var(--shadow-neutral-soft)' }">
      <h3 class="text-sm mb-3" :style="{ color: 'var(--foreground)', fontWeight: '700' }">Nouvelle Suggestion</h3>
      <div class="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
        <input v-model="formData.title" placeholder="Titre de la suggestion*" class="col-span-1 sm:col-span-2" />
        <input v-model="formData.author" placeholder="Votre nom" />
        <CustomSelect
          v-model="formData.category"
          :options="categoryOptions"
          placeholder="Sélectionner une catégorie"
        />
        <textarea v-model="formData.description" placeholder="Description détaillée*" rows="3" class="col-span-2 resize-none"></textarea>
      </div>
      <div class="flex gap-2">
        <button @click="addSuggestion" class="px-4 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95" style="background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%); font-weight: 600">Publier</button>
        <button @click="showForm = false" class="px-4 py-2 rounded-xl text-sm" :style="{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: '600' }">Annuler</button>
      </div>
    </div>



    <!-- Top Suggestions Stats -->
    <div class="bg-white rounded-lg p-6 border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-3xl font-bold text-indigo-600">{{ suggestions.length }}</p>
          <p class="text-sm text-gray-600 mt-1">Suggestions totales</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-purple-600">{{ totalVotes }}</p>
          <p class="text-sm text-gray-600 mt-1">Votes totaux</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">{{ myVotesCount }}</p>
          <p class="text-sm text-gray-600 mt-1">Mes votes</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="suggestion in sortedSuggestions"
        :key="suggestion.id"
        class="rounded-2xl p-5"
        style="background: var(--surface-card); box-shadow: 0 2px 12px var(--shadow-neutral-soft);"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                style="background: oklch(0.95 0.06 150); color: oklch(0.6 0.17 155); font-weight: 600"
              >
                {{ suggestion.category }}
              </span>
            </div>
            <h3 class="text-base mb-1" style="color: var(--foreground); font-weight: 700;">
              {{ suggestion.title }}
            </h3>
            <p class="text-sm leading-relaxed mb-3" style="color: var(--muted-foreground);">
              {{ suggestion.description }}
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5 text-xs" style="color: var(--muted-foreground);">
                <User class="w-3.5 h-3.5" />
                {{ suggestion.author }}
              </div>
              <div class="flex items-center gap-1.5 text-xs" style="color: var(--muted-foreground);">
                <Calendar class="w-3.5 h-3.5" />
                {{ suggestion.date }}
              </div>
            </div>
          </div>
          <button
            @click="handleVote(suggestion.id)"
            class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0"
            :style="{
              background: suggestion.voted ? '#4F5CF5' : '#F3F4FF',
              color: suggestion.voted ? '#FFFFFF' : '#4F5CF5',
            }"
          >
            <ThumbsUp class="w-4 h-4" />
            <span class="text-xs" style="font-weight: 700">{{ suggestion.votes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Lightbulb, ThumbsUp, Plus, User, Calendar } from 'lucide-vue-next'
import CustomSelect from '../../../components/CustomSelect.vue'

const showForm = ref(false)

const categoryOptions = [
  { value: 'Innovation', label: 'Innovation', dot: '#6366f1' },
  { value: 'Infrastructure', label: 'Infrastructure', dot: '#f59e0b' },
  { value: 'Formation', label: 'Formation', dot: '#10b981' },
  { value: 'Vie étudiante', label: 'Vie étudiante', dot: '#ec4899' },
  { value: 'Services', label: 'Services', dot: '#8b5cf6' },
]

const formData = ref({
  title: '',
  description: '',
  author: '',
  category: ''
})

const suggestions = ref([
  { id: 1, title: "Créer une application mobile pour l'université", description: "Une application mobile faciliterait l'accès aux informations et services universitaires", author: 'Ahmed Mansouri', votes: 45, comments: 12, date: '2026-03-28', category: 'Innovation', voted: false },
  { id: 2, title: "Ajouter plus de salles d'étude", description: "Les salles actuelles sont insuffisantes pendant les périodes d'examens", author: 'Fatima Zohra', votes: 38, comments: 8, date: '2026-03-27', category: 'Infrastructure', voted: true },
  { id: 3, title: 'Organiser des ateliers de développement personnel', description: 'Des ateliers sur les soft skills, leadership, et préparation professionnelle', author: 'Youssef Alami', votes: 32, comments: 15, date: '2026-03-26', category: 'Formation', voted: false },
  { id: 4, title: "Améliorer la connexion WiFi dans les amphithéâtres", description: 'La connexion est souvent instable pendant les cours', author: 'Nadia Bennani', votes: 56, comments: 20, date: '2026-03-25', category: 'Infrastructure', voted: true },
])

const addSuggestion = () => {
  if (formData.value.title && formData.value.description && formData.value.category) {
    const today = new Date().toISOString().split('T')[0]
    suggestions.value.push({
      id: Math.max(...suggestions.value.map(s => s.id), 0) + 1,
      title: formData.value.title,
      description: formData.value.description,
      author: formData.value.author || 'Anonyme',
      votes: 0,
      comments: 0,
      date: today,
      category: formData.value.category,
      voted: false
    })
    // Réinitialiser le formulaire
    formData.value = {
      title: '',
      description: '',
      author: '',
      category: ''
    }
    showForm.value = false
  }
}

const handleVote = (id) => {
  const suggestion = suggestions.value.find((s) => s.id === id)
  if (suggestion) {
    suggestion.votes = suggestion.voted ? suggestion.votes - 1 : suggestion.votes + 1
    suggestion.voted = !suggestion.voted
  }
}

const sortedSuggestions = computed(() =>
  [...suggestions.value].sort((a, b) => b.votes - a.votes)
)

const totalVotes = computed(() => suggestions.value.reduce((acc, s) => acc + s.votes, 0))
const myVotesCount = computed(() => suggestions.value.filter((s) => s.voted).length)
</script>