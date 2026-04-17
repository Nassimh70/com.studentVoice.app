<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-end">
      <div>
        <button
          @click="showAddForm = !showAddForm"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600">
          <Plus class="w-4 h-4" />
          Ajouter TD/TP
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Évaluations Saisies</p>
        <p class="text-3xl font-bold text-gray-900">
          {{ grades.length }}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Notes Validées (>= 10)</p>
        <p class="text-3xl font-bold text-gray-900">
          {{ grades.filter((g) => ((g.tdTpGrade + g.examGrade) / 2) >= 10).length }}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Moyenne Générale</p>
        <p class="text-3xl font-bold text-gray-900">
          {{ (grades.reduce((acc, g) => acc + ((g.tdTpGrade + g.examGrade) / 2), 0) / grades.length).toFixed(1) }}/20
        </p>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Total Notes</p>
        <p class="text-3xl font-bold text-gray-900">{{ grades.length }}</p>
      </div>
    </div>

    <!-- Add Grade Form -->
    <div v-if="showAddForm" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
      <h3 class="text-sm mb-4" :style="{ color: 'var(--foreground)', fontWeight: '700' }">Ajouter TD/TP + Examen</h3>
      <form @submit.prevent="handleAddGrade" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Étudiant</label>
            <CustomSelect
              v-model="newGrade.student"
              :options="studentOptions"
              placeholder="Sélectionner un étudiant"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Cours</label>
            <CustomSelect
              v-model="newGrade.course"
              :options="gradesCourseOptions"
              placeholder="Sélectionner un cours"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Note TD/TP (sur 20)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="20"
              v-model="newGrade.tdTpGrade"
              placeholder="0.0"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Note Examen (sur 20)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="20"
              v-model="newGrade.examGrade"
              placeholder="0.0"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>
        <div class="flex justify-start gap-3 pt-2">
          <button
            type="button"
            @click="showAddForm = false"
            class="px-5 py-2.5 rounded-xl text-sm transition-all hover:bg-gray-100" :style="{ color: 'var(--muted-foreground)', fontWeight: '600' }"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-8 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20" 
            style="background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%); font-weight: 700">
            Enregistrer les notes
          </button>
        </div>
      </form>
    </div>

    <!-- Grades Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Étudiant</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Cours</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">TD/TP</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Examen</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody >
            <tr
              v-for="grade in grades"
              :key="grade.id"
              class="hover:bg-gray-50 dark:hover:bg-[var(--hover)]"
            >
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900">{{ grade.student }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ grade.course }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold',
                    getGradeColor(grade.tdTpGrade, 20)
                  ]"
                >
                  {{ grade.tdTpGrade }}/20
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold',
                    getGradeColor(grade.examGrade, 20)
                  ]"
                >
                  {{ grade.examGrade }}/20
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">
                  {{ formatDate(grade.date) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, User, GraduationCap } from 'lucide-vue-next'
import { useStudents } from '../../../composables/useStudents'
import CustomSelect from '../../../components/CustomSelect.vue'

const { students } = useStudents()

const grades = ref([
  {
    id: 1,
    student: 'Ahmed Idrissi',
    course: 'Mathématiques',
    tdTpGrade: 16.5,
    examGrade: 14.0,
    date: '2026-03-20',
  },
  {
    id: 2,
    student: 'Fatima Bennani',
    course: 'Physique',
    tdTpGrade: 14.0,
    examGrade: 15.5,
    date: '2026-03-18',
  },
  {
    id: 3,
    student: 'Karim Alami',
    course: 'Informatique',
    tdTpGrade: 18.0,
    examGrade: 17.0,
    date: '2026-03-25',
  },
])

const showAddForm = ref(false)
const newGrade = ref({
  student: '',
  course: '',
  tdTpGrade: '',
  examGrade: '',
})

// Dynamic student options from composable
const studentOptions = computed(() =>
  students.value.map(s => ({ 
    value: s.name, 
    label: s.name,
    icon: User
  }))
)

const gradesCourseOptions = [
  { value: 'Mathématiques', label: 'Mathématiques', icon: GraduationCap, dot: '#818cf8' },
  { value: 'Physique', label: 'Physique', icon: GraduationCap, dot: '#f59e0b' },
  { value: 'Informatique', label: 'Informatique', icon: GraduationCap, dot: '#4f5cf5' },
]

function handleAddGrade() {
  if (
    newGrade.value.student &&
    newGrade.value.course &&
    newGrade.value.tdTpGrade &&
    newGrade.value.examGrade
  ) {
    grades.value = [
      {
        id: grades.value.length + 1,
        student: newGrade.value.student,
        course: newGrade.value.course,
        tdTpGrade: parseFloat(newGrade.value.tdTpGrade),
        examGrade: parseFloat(newGrade.value.examGrade),
        date: new Date().toISOString().split('T')[0],
      },
      ...grades.value,
    ]
    newGrade.value = { student: '', course: '', tdTpGrade: '', examGrade: '' }
    showAddForm.value = false
  }
}

function getGradeColor(grade, maxGrade) {
  const percentage = (grade / maxGrade) * 100
  if (percentage >= 80) return 'text-green-600 bg-green-100'
  if (percentage >= 70) return 'text-blue-600 bg-blue-100'
  if (percentage >= 60) return 'text-orange-600 bg-orange-100'
  return 'text-red-600 bg-red-100'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>
