<template>
  <div class="flex flex-col gap-4">
    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <!-- Stats Cards -->
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700"
        style="box-shadow: 0 2px 12px rgba(0,0,0,0.06)"
      >
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: stat.bg }">
          <component :is="stat.icon" class="w-4 h-4" :style="{ color: stat.color }" />
        </div>
        <div>
          <p class="text-xl font-bold leading-none text-slate-800 dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ stat.label }}</p>
        </div>
      </div>

    </div>
 
    <!-- Action Bar -->
    <div class="flex items-center justify-end">
      <button
        @click="showForm = !showForm"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600"
      >
        <Plus class="w-4 h-4" />
        Nouveau délégué
      </button>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Ajouter un délégué</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input v-model="form.nom" placeholder="Nom complet *" />
        <CustomSelect v-model="form.filiere" :options="filiereOptions" placeholder="Filière *" />
        <input v-model="form.annee" placeholder="Niveau (ex: L3, M1) *" />
        <input v-model="form.email" placeholder="Adresse email" />
        <input v-model="form.telephone" placeholder="Numéro de téléphone" />
      </div>
      <div class="flex gap-3 justify-end mt-4">
        <button @click="showForm = false" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Annuler</button>
        <button @click="add" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all w-full sm:w-auto">Confirmer l'ajout</button>
      </div>
    </div>

    <!-- Cards Délégués -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      <div
        v-for="d in delegues"
        :key="d.id"
        class="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 flex flex-col h-full"
        :class="[
          d.actif ? 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600/50' : 'border-slate-100 dark:border-slate-800 opacity-75 grayscale-[0.2]'
        ]"
      >
        <!-- Status toggle -->
        <div class="absolute top-4 right-4">
           <button
             @click="toggle(d.id)"
             class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 border"
             :class="[
               d.actif 
                 ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-800/50 hover:bg-emerald-100' 
                 : 'text-slate-500 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100'
             ]"
           >
             <span class="w-1.5 h-1.5 rounded-full" :class="d.actif ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400 dark:bg-slate-500'"></span>
             {{ d.actif ? 'Actif' : 'Inactif' }}
           </button>
        </div>

        <!-- Profil -->
        <div class="flex items-center gap-4 mb-5 mt-2">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
            :style="{ background: `linear-gradient(135deg, ${filiereColors[d.filiere] || '#4F5CF5'}, ${filiereColors[d.filiere] ? filiereColors[d.filiere] + 'dd' : '#4F5CF5dd'})` }"
          >
            {{ d.nom.charAt(0) }}
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ d.nom }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="text-[11px] px-2 py-0.5 rounded-md font-bold"
                :style="{ background: (filiereColors[d.filiere] || '#4F5CF5') + '15', color: filiereColors[d.filiere] || '#4F5CF5' }"
              >
                {{ d.filiere }}
              </span>
              <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">{{ d.annee }}</span>
            </div>
          </div>
        </div>

        <!-- Contact info -->
        <div class="space-y-2.5 mb-6 flex-grow">
          <div v-if="d.email" class="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <Mail class="w-3.5 h-3.5" />
            </div>
            <span class="truncate">{{ d.email }}</span>
          </div>
          <div v-if="d.telephone" class="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <Phone class="w-3.5 h-3.5" />
            </div>
            <span>{{ d.telephone }}</span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div class="flex gap-4">
             <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Tickets</span>
               <div class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                 <BookOpen class="w-3.5 h-3.5 text-blue-500" />
                 {{ d.reclamationsTraitees }}
               </div>
             </div>
             
             <div v-if="d.note > 0" class="flex flex-col">
               <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Éval</span>
               <div class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                 <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                 {{ d.note }}
               </div>
             </div>
          </div>

          <button
            @click="remove(d.id)"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Supprimer"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { UserCheck, Plus, Trash2, Mail, Phone, BookOpen, Star, CheckCircle, FileText } from 'lucide-vue-next';
import CustomSelect from '../../../components/CustomSelect.vue'

const filieres = ['Informatique', 'Mathématiques', 'Sciences', 'Physique', 'Chimie'];

const filiereColors = {
  'Informatique': '#4F5CF5',
  'Mathématiques': '#8B5CF6',
  'Sciences': '#10B981',
  'Physique': '#F59E0B',
  'Chimie': '#EF4444',
};

const filiereOptions = filieres.map(f => ({
  value: f,
  label: f,
  dot: filiereColors[f] || '#4F5CF5',
}));

const delegues = ref([
  { id: 1, nom: 'Karim Bouali', filiere: 'Informatique', annee: 'L3', email: 'k.bouali@univ.dz', telephone: '0550 123 456', reclamationsTraitees: 42, note: 4.8, actif: true },
  { id: 2, nom: 'Leila Mansouri', filiere: 'Mathématiques', annee: 'M1', email: 'l.mansouri@univ.dz', telephone: '0661 789 012', reclamationsTraitees: 38, note: 4.6, actif: true },
  { id: 3, nom: 'Farida Kaci', filiere: 'Sciences', annee: 'L2', email: 'f.kaci@univ.dz', telephone: '0770 345 678', reclamationsTraitees: 29, note: 4.3, actif: true },
  { id: 4, nom: 'Omar Bensalem', filiere: 'Physique', annee: 'L3', email: 'o.bensalem@univ.dz', telephone: '0550 901 234', reclamationsTraitees: 21, note: 4.1, actif: false },
  { id: 5, nom: 'Amira Djebbar', filiere: 'Chimie', annee: 'M2', email: 'a.djebbar@univ.dz', telephone: '0661 567 890', reclamationsTraitees: 35, note: 4.5, actif: true },
]);

const showForm = ref(false);
const form = reactive({ nom: '', filiere: '', annee: '', email: '', telephone: '' });

const stats = computed(() => [
  { label: 'Délégués Actifs', value: delegues.value.filter(d => d.actif).length, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: CheckCircle },
  { label: 'Total Réclamations Traitées', value: delegues.value.reduce((a, d) => a + d.reclamationsTraitees, 0), color: '#4F5CF5', bg: 'rgba(79, 92, 245, 0.1)', icon: FileText },
]);

const toggle = (id) => {
  const d = delegues.value.find(d => d.id === id);
  if (d) d.actif = !d.actif;
};

const remove = (id) => {
  delegues.value = delegues.value.filter(d => d.id !== id);
};

const add = () => {
  if (!form.nom || !form.filiere) return;
  delegues.value.push({
    id: Date.now(),
    nom: form.nom,
    filiere: form.filiere,
    annee: form.annee || 'L1',
    email: form.email,
    telephone: form.telephone,
    reclamationsTraitees: 0,
    note: 0,
    actif: true,
  });
  form.nom = '';
  form.filiere = '';
  form.annee = '';
  form.email = '';
  form.telephone = '';
  showForm.value = false;
};
</script>
