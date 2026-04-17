<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-end">
      <button
        @click="showAddForm = !showAddForm"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600"
      >
        <Plus class="w-4 h-4" />
        Nouveau Cours
      </button>
    </div>

    <!-- Add Course Form -->
    <div v-if="showAddForm"class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
      <h3 class="text-sm mb-3" :style="{ color: 'var(--foreground)', fontWeight: '700' }">Ajouter un Nouveau Cours</h3>
      <form @submit.prevent="handleAddCourse" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Nom du Cours
            </label>
            <input
              type="text"
              v-model="newCourse.name"
              placeholder="Ex: Mathématiques Avancées"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Code du Cours
            </label>
            <input
              type="text"
              v-model="newCourse.code"
              placeholder="Ex: MATH-301"
              required
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Horaire
          </label>
          <input
            type="text"
            v-model="newCourse.schedule"
            placeholder="Ex: Lun, Mer 9h-11h"
          />
        </div>

        <!-- Chapters Section -->
        <div class="border-t border-gray-100 dark:border-slate-700 pt-4">
          <h4 class="font-bold text-gray-900 dark:text-white mb-3 text-sm">Chapitres du cours</h4>
          <div class="space-y-2 mb-3">
            <div
              v-for="(chapter, index) in newCourse.chapters"
              :key="chapter.id"
              class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <input
                type="text"
                v-model="chapter.title"
                placeholder="Titre du chapitre"
                class="w-full min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="date"
                v-model="chapter.date"
                class="w-full sm:w-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                @click="removeNewChapter(index)"
                class="self-end sm:self-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
              >
                <Trash2 class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addNewChapter"
            class="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all"
          >
            + Ajouter un chapitre
          </button>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            class="px-4 py-2 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95" style="background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%); font-weight: 600">
            Ajouter le cours
          </button>
          <button
            type="button"
            @click="cancelAddCourse"
            class="px-4 py-2 rounded-xl text-sm" :style="{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: '600' }"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Courses List -->
    <div class="space-y-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <!-- Course Header -->
        <div class="p-6 bg-white dark:bg-slate-800">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div :class="['p-3 rounded-xl', getColorClasses(course.color)]">
                  <BookOpen class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ course.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ course.code }}</p>
                </div>
              </div>
              <div class="space-y-1 ml-12">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users class="w-4 h-4" />
                  <span>{{ course.students }} étudiants inscrits</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4" />
                  <span>{{ course.schedule }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="toggleCourse(course.id)"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp v-if="expandedCourse === course.id" class="w-5 h-5 text-gray-600" />
                <ChevronDown v-else class="w-5 h-5 text-gray-600" />
              </button>
              <button
                @click="deleteCourse(course.id)"
                class="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
              <span :class="['text-sm font-bold', getProgressTextColor(course.progress)]">
                {{ course.progress }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                :class="[getProgressColor(course.progress), 'h-3 rounded-full transition-all duration-500']"
                :style="{ width: `${course.progress}%` }"
              />
            </div>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ course.chapters.filter((c) => c.completed).length }} / {{ course.chapters.length }} chapitres complétés
          </p>
        </div>

        <!-- Chapters List -->
        <div v-if="expandedCourse === course.id" class="border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 p-6">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Chapitres du cours</h4>
          <div class="space-y-2">
            <div
              v-for="chapter in course.chapters"
              :key="chapter.id"
              :class="[
                'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border',
                chapter.completed ? 'bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700',
              ]"
              @click="toggleChapter(course.id, chapter.id)"
            >
              <input
                type="checkbox"
                :checked="chapter.completed"
                @click.stop="toggleChapter(course.id, chapter.id)"
                class="w-5 h-5 text-green-600 rounded-lg cursor-pointer accent-green-600"
              />
              <div class="flex-1">
                <p :class="['font-semibold text-sm', chapter.completed ? 'text-green-900 dark:text-green-400' : 'text-gray-900 dark:text-white']">
                  {{ chapter.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ chapter.date }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="chapter.completed"
                  class="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                >
                  Complété
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BookOpen, Users, Calendar, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-vue-next'

const courses = ref([
  {
    id: 1,
    name: 'Mathématiques Avancées',
    code: 'MATH-301',
    students: 45,
    schedule: 'Lun, Mer, Ven 9h-11h',
    color: 'indigo',
    chapters: [
      { id: 1, title: 'Calcul différentiel', completed: true, date: '2026-02-15' },
      { id: 2, title: 'Calcul intégral', completed: true, date: '2026-02-22' },
      { id: 3, title: 'Équations différentielles', completed: true, date: '2026-03-01' },
      { id: 4, title: 'Analyse complexe', completed: false, date: '2026-03-15' },
    ],
  },
  {
    id: 2,
    name: 'Physique Quantique',
    code: 'PHYS-201',
    students: 32,
    schedule: 'Mar, Jeu 14h-16h',
    color: 'blue',
    chapters: [
      { id: 1, title: 'Introduction à la mécanique quantique', completed: true, date: '2026-02-16' },
      { id: 2, title: 'Équation de Schrödinger', completed: false, date: '2026-02-23' },
      { id: 3, title: 'Orbitales atomiques', completed: false, date: '2026-03-02' },
    ],
  },
  {
    id: 3,
    name: 'Informatique - Algorithmes',
    code: 'INFO-401',
    students: 28,
    schedule: 'Lun, Mer 14h-17h',
    color: 'green',
    chapters: [
      { id: 1, title: 'Complexité algorithmique', completed: true, date: '2026-02-17' },
      { id: 2, title: 'Tri et recherche', completed: true, date: '2026-02-24' },
      { id: 3, title: 'Graphes', completed: true, date: '2026-03-03' },
      { id: 4, title: 'Programmation dynamique', completed: true, date: '2026-03-10' },
      { id: 5, title: 'Algorithmes gloutons', completed: false, date: '2026-03-17' },
    ],
  },
  {
    id: 4,
    name: 'Statistiques',
    code: 'STAT-202',
    students: 38,
    schedule: 'Mar, Ven 10h-12h',
    color: 'purple',
    chapters: [
      { id: 1, title: 'Probabilités', completed: true, date: '2026-02-18' },
      { id: 2, title: 'Distributions statistiques', completed: true, date: '2026-02-25' },
      { id: 3, title: 'Tests d\'hypothèse', completed: false, date: '2026-03-04' },
      { id: 4, title: 'Régression linéaire', completed: false, date: '2026-03-11' },
    ],
  },
])

const showAddForm = ref(false)
const expandedCourse = ref(null)

const newCourse = ref({
  name: '',
  code: '',
  schedule: '',
  chapters: [],
})

function handleAddCourse() {
  if (newCourse.value.name && newCourse.value.code) {
    const courseChapters = newCourse.value.chapters.map((ch, index) => ({
      id: Date.now() + index,
      title: ch.title,
      date: ch.date,
      completed: false,
    }))

    courses.value = [
      ...courses.value,
      {
        id: courses.value.length + 1,
        name: newCourse.value.name,
        code: newCourse.value.code,
        students: 0,
        schedule: newCourse.value.schedule,
        color: 'gray',
        chapters: courseChapters,
        progress: 0,
      },
    ]
    cancelAddCourse()
  }
}

function cancelAddCourse() {
  newCourse.value = { name: '', code: '', schedule: '', chapters: [] }
  showAddForm.value = false
}

function addNewChapter() {
  newCourse.value.chapters.push({
    id: Date.now() + Math.random(),
    title: '',
    date: '',
  })
}

function removeNewChapter(index) {
  newCourse.value.chapters.splice(index, 1)
}

function toggleCourse(courseId) {
  expandedCourse.value = expandedCourse.value === courseId ? null : courseId
}

function toggleChapter(courseId, chapterId) {
  const course = courses.value.find((c) => c.id === courseId)
  if (course) {
    const chapter = course.chapters.find((ch) => ch.id === chapterId)
    if (chapter) {
      chapter.completed = !chapter.completed
      updateCourseProgress(courseId)
    }
  }
}

function updateCourseProgress(courseId) {
  const course = courses.value.find((c) => c.id === courseId)
  if (course && course.chapters.length > 0) {
    const completedCount = course.chapters.filter((ch) => ch.completed).length
    course.progress = Math.round((completedCount / course.chapters.length) * 100)
  }
}

function deleteCourse(id) {
  courses.value = courses.value.filter((course) => course.id !== id)
}

function getProgressColor(progress) {
  if (progress >= 80) return 'bg-green-600'
  if (progress >= 60) return 'bg-blue-600'
  if (progress >= 40) return 'bg-orange-600'
  return 'bg-red-600'
}

function getProgressTextColor(progress) {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 60) return 'text-blue-600'
  if (progress >= 40) return 'text-orange-600'
  return 'text-red-600'
}

function getColorClasses(color) {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
  }
  return colors[color] || colors.gray
}
</script>
