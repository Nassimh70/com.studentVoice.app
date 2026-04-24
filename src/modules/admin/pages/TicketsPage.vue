<template>
  <div class="flex flex-col gap-4">
    <!-- Summary Chips -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="chip in chips"
        :key="chip.label"
        @click="filter = chip.filter"
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all text-xs sm:text-sm"
        :style="{
          background: filter === chip.filter ? chip.gradient : chip.bg,
          color: filter === chip.filter ? '#fff' : chip.color,
          fontWeight: 600,
          boxShadow: filter === chip.filter ? chip.shadow : 'none',
        }"
      >
        <span style="font-weight: 700">{{ chip.value }}</span>
        <span class="hidden sm:inline">{{ chip.label }}</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
      <div class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 dark:border-slate-700">
        <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
          Tikets soumis par les étudiants
        </h3>
      </div>

      <div class="space-y-2 sm:space-y-3 p-3 sm:p-4">
        <div
          v-for="(r, i) in filtered"
          :key="r.id"
          class="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-3 sm:p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <div class="mb-2 sm:mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div class="min-w-0 flex-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ r.date }} • {{ r.id }}</p>
              <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{{ r.objet }}</h3>
            </div>
            <span
              class="text-xs px-2 py-1 sm:px-2.5 sm:py-1 rounded-full flex-shrink-0"
              :style="{ background: statusConfig[r.status].bg, color: statusConfig[r.status].color, fontWeight: 600 }"
            >
              {{ r.status }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm sm:grid-cols-3 lg:grid-cols-4 mb-2 sm:mb-3">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                :style="{ background: avatarColors[i % 4], fontWeight: 700 }"
              >
                {{ r.etudiant.charAt(0) }}
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">Étudiant</p>
                <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ r.etudiant }}</p>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Filière</p>
              <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ r.filiere }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Délégué</p>
              <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ r.delegue }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              @click="openDetail(r)"
              class="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >Voir d.</button>
            <button
              v-if="r.status === 'En attente'"
              @click="handleAction(r.id, 'Acceptée')"
              class="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >✓</button>
            <button
              v-if="r.status === 'En attente'"
              @click="openDetail(r)"
              class="rounded-lg bg-red-50 dark:bg-red-900/30 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900/50"
            >✗</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
<Transition name="modal">
  <div
    v-if="showModal && selected"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    @click.self="showModal = false; selected = null"
  >
    <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl flex flex-col border border-gray-100 dark:border-slate-700 overflow-hidden">

      <!-- Header -->
      <div class="px-6 pt-5 pb-4">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <p class="text-xs text-gray-400 mb-1">{{ selected.id }}</p>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selected.objet }}</h3>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap"
            :class="{
              'bg-blue-50 text-blue-700 border-blue-200': selected.status === 'En attente',
              'bg-green-50 text-green-700 border-green-200': selected.status === 'Acceptée',
              'bg-red-50 text-red-700 border-red-200': selected.status === 'Refusée',
            }"
          >{{ selected.status }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="chip">{{ selected.etudiant }}</span>
          <span class="chip">{{ selected.filiere }}</span>
          <span class="chip">{{ selected.delegue }}</span>
          <span class="chip">{{ selected.date }}</span>
        </div>
      </div>

      <div class="h-px bg-gray-100 dark:bg-slate-700 mx-6" />

      <!-- Body -->
      <div class="px-6 py-4 flex flex-col gap-4 overflow-y-auto max-h-[50vh]">

        <!-- Description -->
        <div class="border-l-2 border-indigo-400/50 pl-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed rounded-none">
          {{ selected.description }}
        </div>

        <!-- Fil de discussion -->
        <div v-if="selected.commentaires?.length">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Fil de discussion</p>
          <div v-for="(c, i) in selected.commentaires" :key="c.id" class="flex gap-3">
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                :style="{ background: avatarColor(c.auteur) }">
                {{ c.auteur.charAt(0) }}
              </div>
              <div v-if="i < selected.commentaires.length - 1" class="w-px flex-1 bg-gray-100 dark:bg-slate-700 mt-1" />
            </div>
            <div class="flex-1 pb-3">
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ c.auteur }}</span>
                <span class="text-xs text-gray-400">{{ c.date }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ c.texte }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer : En attente → actions, sinon fermer -->
      <div class="border-t border-gray-100 dark:border-slate-700 px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50">
        <template v-if="selected.status === 'En attente'">
          <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Motif de décision</p>
          <textarea
            v-model="motif"
            placeholder="Expliquez brièvement la raison de votre décision..."
            class="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20"
            style="min-height: 70px"
          />
          <div class="flex gap-2 mt-3">
            <button @click="handleAction(selected.id, 'Acceptée')"
              class="flex-1 py-2 rounded-xl text-white text-sm font-semibold bg-green-600 hover:bg-green-700 active:scale-95 transition-all">
              ✓ Accepter
            </button>
            <button @click="handleAction(selected.id, 'Refusée')"
              class="flex-1 py-2 rounded-xl text-white text-sm font-semibold bg-red-600 hover:bg-red-700 active:scale-95 transition-all">
              ✗ Refuser
            </button>
          </div>
        </template>
        <button v-else @click="showModal = false; selected = null"
          class="w-full py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 transition-colors">
          Fermer
        </button>
      </div>

    </div>
  </div>
</Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CheckCircle, XCircle, Clock } from 'lucide-vue-next';

const avatarColors = ['#4F5CF5', '#818CF8', '#10B981', '#F59E0B'];

const statusConfig = {
  'En attente': { bg: '#FEF9C3', color: '#CA8A04', icon: Clock },
  'Acceptée': { bg: '#DCFCE7', color: '#16A34A', icon: CheckCircle },
  'Refusée': { bg: '#FEE2E2', color: '#DC2626', icon: XCircle },
};

const reclamations = ref([
  { id: 'RCL-001', etudiant: 'Mohamed Amine', filiere: 'Informatique', objet: 'Note incorrecte en Algorithmique', date: '28 Mar 2026', status: 'En attente', description: "La note attribuée ne correspond pas à ma copie d'examen.", delegue: 'Karim B.' },
  { id: 'RCL-002', etudiant: 'Sara Benali', filiere: 'Mathématiques', objet: 'Absence injustifiée marquée', date: '27 Mar 2026', status: 'Acceptée', description: 'Présence en cours mais marquée absente par erreur.', delegue: 'Leila M.' },
  { id: 'RCL-003', etudiant: 'Yacine Djamel', filiere: 'Physique', objet: 'Problème de notation TP', date: '26 Mar 2026', status: 'Refusée', description: 'Erreur de calcul dans la note du TP de physique.', delegue: 'Karim B.' },
  { id: 'RCL-004', etudiant: 'Imane Cherif', filiere: 'Sciences', objet: 'Délai rattrapage non respecté', date: '25 Mar 2026', status: 'En attente', description: "Le délai d'inscription au rattrapage n'a pas été communiqué.", delegue: 'Farida K.' },
  { id: 'RCL-005', etudiant: 'Riad Bouazza', filiere: 'Informatique', objet: 'Erreur dans le PV de jury', date: '24 Mar 2026', status: 'Acceptée', description: 'Mon nom est mal orthographié dans le PV de délibération.', delegue: 'Leila M.' },
  { id: 'RCL-006', etudiant: 'Nadia Hamidi', filiere: 'Mathématiques', objet: 'Module non validé par erreur', date: '23 Mar 2026', status: 'En attente', description: 'Le module Algèbre 2 apparaît non validé malgré une note de 12/20.', delegue: 'Karim B.' },
  { id: 'RCL-007', etudiant: 'Omar Fellah', filiere: 'Physique', objet: "Copie d'examen non rendue", date: '22 Mar 2026', status: 'Refusée', description: "Ma copie d'examen final n'a pas été restituée après correction.", delegue: 'Farida K.' },
  { id: 'RCL-008', etudiant: 'Amina Zouari', filiere: 'Sciences', objet: 'Changement de groupe refusé', date: '21 Mar 2026', status: 'Acceptée', description: 'Demande de changement de groupe pédagogique non traitée.', delegue: 'Leila M.' },
]);

const filter = ref('Toutes');
const selected = ref(null);
const showModal = ref(false);
const motif = ref('');

const filtered = computed(() =>
  filter.value === 'Toutes' ? reclamations.value : reclamations.value.filter(r => r.status === filter.value)
);

function avatarColor(name) {
  const colors = ['#6366F1','#0891B2','#16A34A','#D97706','#DC2626','#9333EA']
  return colors[name.charCodeAt(0) % colors.length]
}
const chips = computed(() => [
  { label: 'Total', value: reclamations.value.length, color: '#255fe3', bg: '#DEE2F0', gradient: 'linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%)', shadow: '0 2px 8px rgba(37,95,227,0.35)', filter: 'Toutes' },
  { label: 'En attente', value: reclamations.value.filter(r => r.status === 'En attente').length, color: '#CA8A04', bg: '#FEF9C3', gradient: 'linear-gradient(135deg, #b47d04 0%, #CA8A04 50%, #a16e03 100%)', shadow: '0 2px 8px rgba(202,138,4,0.35)', filter: 'En attente' },
  { label: 'Acceptées', value: reclamations.value.filter(r => r.status === 'Acceptée').length, color: '#16A34A', bg: '#DCFCE7', gradient: 'linear-gradient(135deg, #128c3e 0%, #16A34A 50%, #0f7a35 100%)', shadow: '0 2px 8px rgba(22,163,74,0.35)', filter: 'Acceptée' },
  { label: 'Refusées', value: reclamations.value.filter(r => r.status === 'Refusée').length, color: '#DC2626', bg: '#FEE2E2', gradient: 'linear-gradient(135deg, #c41e1e 0%, #DC2626 50%, #a51b1b 100%)', shadow: '0 2px 8px rgba(220,38,38,0.35)', filter: 'Refusée' },
]);

const handleAction = (id, action) => {
  const r = reclamations.value.find(r => r.id === id);
  if (r) r.status = action;
  showModal.value = false;
  motif.value = '';
  selected.value = null;
};

const openDetail = (r) => {
  selected.value = r;
  showModal.value = true;
  motif.value = '';
};
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: 0.5px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
}

.dark .chip {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}
</style>