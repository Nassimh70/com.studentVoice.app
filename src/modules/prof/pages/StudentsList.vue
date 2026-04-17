<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 mt-1">{{ students.length }} étudiants au total</p>
      </div>
      <button 
        @click="showAddForm = !showAddForm"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600">
        <Plus class="w-4 h-4" />
        Ajouter Étudiant
      </button>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

    <!-- Add Student Form -->
    <div v-if="showAddForm" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
      <h3 class="text-sm mb-3" :style="{ color: 'var(--foreground)', fontWeight: '700' }">Ajouter un Nouvel Étudiant</h3>
      <form @submit.prevent="handleAddStudent" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label  class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Nom complet
            </label>
            <input
              type="text"
              v-model="newStudent.name"
              placeholder="Ex: Sophie Martin"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              v-model="newStudent.email"
              placeholder="Ex: sophie@email.com"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              v-model="newStudent.phone"
              placeholder="Ex: +33 6 12 34 56 78"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Cours
            </label>
            <CustomSelect
              v-model="newStudent.course"
              :options="courseOptions"
              placeholder="Sélectionner un cours"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <button
            type="submit"
            class="px-4 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95" style="background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%); font-weight: 600">
            Ajouter l'étudiant
          </button>
          <button
            type="button"
            @click="showAddForm = false"
            class="px-4 py-2 rounded-xl text-sm" :style="{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: '600' }">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Rechercher un étudiant..."
            class="pl-12"
          />
        </div>

        <!-- Course Filter -->
        <div class="flex items-center gap-2">
          <div class="min-w-[200px]">
            <CustomSelect
              v-model="selectedCourse"
              :options="courseFilterOptions"
              placeholder="Tous les cours"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Étudiant</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Cours</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Moyenne</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="font-semibold text-indigo-600">
                      {{ student.name.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ student.name }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Mail class="w-4 h-4" />
                    <span>{{ student.email }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Phone class="w-4 h-4" />
                    <span>{{ student.phone }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ student.course }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                    getAverageColor(student.average)
                  ]"
                >
                  {{ student.average.toFixed(1) }}/20
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  {{ student.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button 
                  @click="deleteStudent(student.id)"
                  class="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-gray-300 transition-colors"
                  style="background: linear-gradient(135deg, #c41e1e 0%, #DC2626 50%, #a51b1b 100%)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredStudents.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucun étudiant trouvé</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Mail, Phone, Plus } from 'lucide-vue-next'
import { useStudents } from '../../../composables/useStudents'
import CustomSelect from '../../../components/CustomSelect.vue'

const { students, addStudent, deleteStudent: removeStudent } = useStudents()

const searchTerm = ref('')
const selectedCourse = ref('all')
const showAddForm = ref(false)
const errorMessage = ref('')
const newStudent = ref({
  name: '',
  email: '',
  phone: '',
  course: '',
})

const courseOptions = [
  { value: 'Mathématiques', label: 'Mathématiques', dot: '#818cf8' },
  { value: 'Physique', label: 'Physique', dot: '#f59e0b' },
  { value: 'Informatique', label: 'Informatique', dot: '#4f5cf5' },
]

const courseFilterOptions = [
  { value: 'all', label: 'Tous les cours' },
  { value: 'Mathématiques', label: 'Mathématiques', dot: '#818cf8' },
  { value: 'Physique', label: 'Physique', dot: '#f59e0b' },
  { value: 'Informatique', label: 'Informatique', dot: '#4f5cf5' },
]

const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCourse =
      selectedCourse.value === 'all' || student.course === selectedCourse.value
    return matchesSearch && matchesCourse
  })
})

function handleAddStudent() {
  if (newStudent.value.name && newStudent.value.email && newStudent.value.phone && newStudent.value.course) {
    addStudent(newStudent.value)
    newStudent.value = { name: '', email: '', phone: '', course: '' }
    showAddForm.value = false
    errorMessage.value = ''
  }
}

function deleteStudent(id) {
  removeStudent(id)
  errorMessage.value = ''
}

function getAverageColor(average) {
  if (average >= 16) return 'text-green-600 bg-green-100'
  if (average >= 14) return 'text-blue-600 bg-blue-100';
  if (average >= 12) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}
</script>
