<template>
  <div class="flex flex-col gap-4">
    <!-- Role Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div v-for="[role, cfg] in Object.entries(roleConfig)" :key="role"
        class="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700"
        style="box-shadow: 0 2px 12px rgba(0,0,0,0.06)" @click="roleFilter = role">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: cfg.bg }">
          <component :is="cfg.icon" class="w-4 h-4" :style="{ color: cfg.color }" />
        </div>
        <div>
          <p class="text-xl font-bold leading-none text-slate-800 dark:text-white">{{users.filter(u => u.role ===
            role).length }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ role }}s</p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700 gap-3">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Utilisateurs du Système</h3>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="search" placeholder="Rechercher..." class="pl-10" />
          </div>
          <div class="w-full sm:w-auto min-w-[180px]">
            <CustomSelect v-model="roleFilter" :options="roleFilterOptions" placeholder="Tous les rôles" />
          </div>
        </div>
      </div>

      <div class="space-y-3 p-4">
        <div v-for="u in filtered" :key="u.id"
          class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                :style="{ background: avatarColors[(users.indexOf(u)) % 5], fontWeight: 700 }">
                {{ u.nom.charAt(0) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ u.nom }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ u.email }}</p>
              </div>
            </div>
            <div class="flex-1 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 sm:justify-end">
              <div>
                <p class="text-xs text-gray-500">Rôle</p>
                <div class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                  :style="{ background: roleConfig[u.role].bg, color: roleConfig[u.role].color }">
                  <component :is="roleConfig[u.role].icon" class="w-3 h-3" />
                  <span class="hidden sm:inline">{{ u.role }}</span>
                </div>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Filière</p>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ u.filiere }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Réclamations</p>
                <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ u.reclamations }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Statut</p>
                <span class="mt-1 inline-block text-xs px-2 py-1 rounded-full font-bold"
                  :style="{ background: u.status === 'Actif' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(158, 163, 176, 0.1)', color: u.status === 'Actif' ? '#16A34A' : '#9EA3B0' }">
                  {{ u.status }}
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
import { ref, computed } from 'vue';
import { Users, UserCheck, BookOpen, GraduationCap, Search } from 'lucide-vue-next';
import CustomSelect from '../../../components/CustomSelect.vue'

const avatarColors = ['#4F5CF5', '#818CF8', '#10B981', '#F59E0B', '#EF4444'];

const roleConfig = {
  'Admin': { bg: '#FEE2E2', color: '#DC2626', icon: Users },
  'Professeur': { bg: '#FEF9C3', color: '#CA8A04', icon: BookOpen },
  'Délégué': { bg: '#EEF2FF', color: '#4F5CF5', icon: UserCheck },
  'Étudiant': { bg: '#DCFCE7', color: '#16A34A', icon: GraduationCap },
};

const users = [
  { id: 1, nom: 'Ahmed Karim', email: 'a.karim@univ.dz', role: 'Admin', filiere: 'Direction', status: 'Actif', reclamations: 0 },
  { id: 2, nom: 'Dr. Meriem Hamdani', email: 'm.hamdani@univ.dz', role: 'Professeur', filiere: 'Informatique', status: 'Actif', reclamations: 12 },
  { id: 3, nom: 'Dr. Rachid Benali', email: 'r.benali@univ.dz', role: 'Professeur', filiere: 'Mathématiques', status: 'Actif', reclamations: 8 },
  { id: 4, nom: 'Karim Bouali', email: 'k.bouali@univ.dz', role: 'Délégué', filiere: 'Informatique', status: 'Actif', reclamations: 42 },
  { id: 5, nom: 'Leila Mansouri', email: 'l.mansouri@univ.dz', role: 'Délégué', filiere: 'Mathématiques', status: 'Actif', reclamations: 38 },
  { id: 6, nom: 'Mohamed Amine', email: 'm.amine@etud.univ.dz', role: 'Étudiant', filiere: 'Informatique', status: 'Actif', reclamations: 3 },
  { id: 7, nom: 'Sara Benali', email: 's.benali@etud.univ.dz', role: 'Étudiant', filiere: 'Mathématiques', status: 'Actif', reclamations: 1 },
  { id: 8, nom: 'Yacine Djamel', email: 'y.djamel@etud.univ.dz', role: 'Étudiant', filiere: 'Physique', status: 'Inactif', reclamations: 2 },
];

const search = ref('');
const roleFilter = ref('Tous');

const roleFilterOptions = computed(() => [
  { value: 'Tous', label: 'Tous les rôles' },
  ...Object.keys(roleConfig).map(r => ({
    value: r,
    label: r,
    dot: roleConfig[r].color,
  }))
]);

const filtered = computed(() =>
  users.filter(u => {
    const matchSearch = u.nom.toLowerCase().includes(search.value.toLowerCase()) || u.email.toLowerCase().includes(search.value.toLowerCase());
    const matchRole = roleFilter.value === 'Tous' || u.role === roleFilter.value;
    return matchSearch && matchRole;
  })
);
</script>
