<template>
  <div class="announcements-page flex flex-col gap-4">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Bell class="w-6 h-6 text-blue-600 flex-shrink-0" />
        <div>
          <h3 class="font-semibold text-blue-900">Annonces Pédagogiques</h3>
          <p class="text-sm text-blue-700 mt-1">
            Les annonces sont publiées par l'administration, les professeurs et les délégués
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
      <div class="flex flex-wrap gap-3">
        <button
          v-for="f in filterButtons"
          :key="f.label"
          @click="activeFilter = f.filter"
          class="px-3 py-1.5 rounded-xl text-xs transition-all"
          :style="{
            background: activeFilter === f.filter ? f.gradient : f.bg,
            color: activeFilter === f.filter ? '#FFFFFF' : f.color,
            fontWeight: 600,
            boxShadow: activeFilter === f.filter ? f.shadow : '0 1px 4px rgba(0,0,0,0.08)',
          }"
        >
          {{ f.label }}
        </button>
      </div>
      <button
        v-if="canPublish"
        @click="showForm = !showForm"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
        style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%); --blue: #255fe3; --blue-dark: #1f54d2; --blue-deep: #1d3f95; font-weight: 600">
        <Plus class="w-3.5 h-3.5" />
        Publier
      </button>
      <div v-else class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
        <Lock class="w-5 h-5" />
        <span class="text-sm">Accès restreint</span>
      </div>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showForm && canPublish" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
      <h3 class="text-sm mb-3 form-title">Nouvelle Annonce</h3>
      <div class="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
        <input v-model="form.titre" placeholder="Titre de l'annonce*" class="col-span-1 sm:col-span-2" />
        <input v-model="form.cours" placeholder="Cours / Module" />
        <CustomSelect
          v-model="form.type"
          :options="typeOptions"
          placeholder="Type d'annonce"
        />
        <textarea v-model="form.contenu" placeholder="Contenu de l'annonce*" rows="3" class="col-span-2 resize-none"></textarea>
      </div>
      <div class="flex gap-2">
        <button @click="addAnnonce" class="publish-btn px-4 py-2 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95">Publier</button>
        <button @click="showForm = false" class="cancel-btn px-4 py-2 rounded-xl text-sm">Annuler</button>
      </div>
    </div>

    <!-- Information banner pour les utilisateurs sans permission -->
    <div v-if="!canPublish" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h3 class="font-semibold text-orange-900">Publication d'Annonces</h3>
      <p class="text-sm text-orange-700 mt-1">Seuls les délégués, professeurs et administrateurs peuvent créer et publier des annonces.</p>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="annonce in filteredAnnonces"
        :key="annonce.id"
        class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :style="{ background: typeStyle[annonce.type].bg, color: typeStyle[annonce.type].color, fontWeight: 600 }"
              >
                {{ annonce.type }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :style="{
                  background: roleColors[annonce.role] + '20',
                  color: roleColors[annonce.role],
                  fontWeight: 600,
                }"
              >
                {{ annonce.role }}
              </span>
              <span class="meta text-xs">
                <BookOpen class="w-3 h-3 inline mr-1" />
                {{ annonce.cours }}
              </span>
            </div>
            <h3 class="text-base mb-1 form-title">
              {{ annonce.titre }}
            </h3>
            <p class="text-sm leading-relaxed mb-3 content-text">
              {{ annonce.contenu }}
            </p>
            <div class="flex items-center gap-4">
              <div class="meta flex items-center gap-1.5 text-xs">
                <User class="w-3.5 h-3.5" />
                {{ annonce.auteur }}
              </div>
              <div class="meta flex items-center gap-1.5 text-xs">
                <Calendar class="w-3.5 h-3.5" />
                {{ annonce.date }}
              </div>
              <div class="meta flex items-center gap-1.5 text-xs">
                <Eye class="w-3.5 h-3.5" />
                {{ annonce.vues }} vues
              </div>
            </div>
          </div>
          <button
            v-if="allowReactions"
            @click="handleVote(annonce.id)"
            class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0"
            :style="{
              background: voted.has(annonce.id) ? '#4F5CF5' : '#F3F4FF',
              color: voted.has(annonce.id) ? '#FFFFFF' : '#4F5CF5',
            }"
          >
            <ThumbsUp class="w-4 h-4" />
            <span class="text-xs" style="font-weight: 700">{{ voteCounts[annonce.id] }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { Bell, Plus, BookOpen, Calendar, User, ThumbsUp, Eye, Lock } from 'lucide-vue-next';
import CustomSelect from './CustomSelect.vue'

// Props pour contrôler qui peut publier et réagir
const props = defineProps({
  allowReactions: {
    type: Boolean,
    default: false, // Par défaut, pas de réactions
  },
  canPublish: {
    type: Boolean,
    default: false, // Par défaut, pas de publication
  },
});

const activeFilter = ref('Toutes');

const typeOptions = [
  { value: 'Administrative', label: 'Administrative', dot: '#ca8a04' },
  { value: 'Pédagogique', label: 'Pédagogique', dot: '#4f5cf5' },
  { value: 'Événement', label: 'Événement', dot: '#16a34a' },
]

const filterButtons = [
  { label: 'Toutes', filter: 'Toutes', color: '#255fe3', bg: '#DEE2F0', gradient: 'linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%)', shadow: '0 2px 8px rgba(37,95,227,0.35)' },
  { label: 'Pédagogique', filter: 'Pédagogique', color: '#4F5CF5', bg: '#F3F4FF', gradient: 'linear-gradient(135deg, #3d48d9 0%, #4F5CF5 50%, #363fb5 100%)', shadow: '0 2px 8px rgba(79,92,245,0.35)' },
  { label: 'Administrative', filter: 'Administrative', color: '#CA8A04', bg: '#FEF9C3', gradient: 'linear-gradient(135deg, #b47d04 0%, #CA8A04 50%, #a16e03 100%)', shadow: '0 2px 8px rgba(202,138,4,0.35)' },
  { label: 'Événement', filter: 'Événement', color: '#16A34A', bg: '#DCFCE7', gradient: 'linear-gradient(135deg, #128c3e 0%, #16A34A 50%, #0f7a35 100%)', shadow: '0 2px 8px rgba(22,163,74,0.35)' },
];

const annonces = ref([
  { id: 1, titre: 'Mise à jour du programme Algorithmique S3', auteur: 'Dr. Meriem Hamdani', role: 'Professeur', cours: 'Algorithmique', date: '31 Mar 2026', type: 'Pédagogique', contenu: 'Le chapitre 5 sur les arbres et graphes sera couvert lors des deux prochaines séances. Les ressources sont disponibles sur la plateforme.', vues: 234, votes: 45 },
  { id: 2, titre: 'Planning des examens de rattrapage - Avril 2026', auteur: 'Administration', role: 'Admin', cours: 'Général', date: '30 Mar 2026', type: 'Administrative', contenu: 'Les examens de rattrapage auront lieu du 15 au 22 Avril 2026. Consultez votre emploi du temps pour plus de détails.', vues: 892, votes: 120 },
  { id: 3, titre: 'Journée portes ouvertes - Département Informatique', auteur: 'Karim Bouali', role: 'Délégué', cours: 'Informatique', date: '29 Mar 2026', type: 'Événement', contenu: 'Le département organise une journée portes ouvertes le 10 Avril. Des stands de démonstration de projets étudiants seront présentés.', vues: 567, votes: 88 },
  { id: 4, titre: 'Ressources complémentaires - Analyse Numérique', auteur: 'Dr. Rachid Benali', role: 'Professeur', cours: 'Analyse Numérique', date: '28 Mar 2026', type: 'Pédagogique', contenu: "De nouveaux exercices corrigés sur les méthodes d'interpolation ont été publiés. Téléchargez les PDFs depuis la bibliothèque numérique.", vues: 341, votes: 62 },
  { id: 5, titre: 'Proposition de révision des horaires des TPs', auteur: 'Leila Mansouri', role: 'Délégué', cours: 'Chimie', date: '27 Mar 2026', type: 'Administrative', contenu: 'Suite aux demandes des étudiants, nous proposons de décaler les TPs de chimie au jeudi matin. Votez pour soutenir cette suggestion.', vues: 210, votes: 34 },
]);

const typeStyle = {
  'Pédagogique': { bg: 'var(--accent)', color: 'var(--primary)' },
  'Administrative': { bg: 'oklch(0.95 0.06 95)', color: 'oklch(0.55 0.16 85)' },
  'Événement': { bg: 'oklch(0.95 0.06 150)', color: 'oklch(0.6 0.17 155)' },
};

const roleColors = {
  'Professeur': 'oklch(0.72 0.14 80)',
  'Admin': 'oklch(0.65 0.2 25)',
  'Délégué': 'var(--primary)',
};

const voted = ref(new Set());
const voteCounts = reactive(
  Object.fromEntries(annonces.value.map(a => [a.id, a.votes]))
);

const filteredAnnonces = computed(() => {
  if (activeFilter.value === 'Toutes') return annonces.value;
  return annonces.value.filter(a => a.type === activeFilter.value);
});

const showForm = ref(false);
const form = reactive({
  titre: '',
  cours: '',
  type: 'Administrative',
  contenu: '',
});

const addAnnonce = () => {
  if (!form.titre || !form.contenu) return;

  const now = new Date();
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const newId = Date.now();
  annonces.value.unshift({
    id: newId,
    titre: form.titre,
    auteur: 'Administration',
    role: 'Admin',
    cours: form.cours || 'Général',
    date: dateStr,
    type: form.type,
    contenu: form.contenu,
    vues: 0,
    votes: 0,
  });

  voteCounts[newId] = 0;

  // Reset form
  form.titre = '';
  form.cours = '';
  form.type = 'Administrative';
  form.contenu = '';
  showForm.value = false;
};

const handleVote = (id) => {
  if (voted.value.has(id)) {
    // Enlever le vote
    const newVoted = new Set([...voted.value]);
    newVoted.delete(id);
    voted.value = newVoted;
    voteCounts[id] = voteCounts[id] - 1;
  } else {
    // Ajouter le vote
    voted.value = new Set([...voted.value, id]);
    voteCounts[id] = voteCounts[id] + 1;
  }
};
</script>

<style scoped>
.banner-subtitle,
.meta,
.content-text {
  color: var(--muted-foreground);
}

.surface-card {
  background: var(--card);
  box-shadow: 0 2px 12px var(--shadow-neutral-soft);
}

.form-title {
  color: var(--foreground);
  font-weight: 700;
}


.publish-btn {
  background: linear-gradient(135deg, #1f54d2 0%, #255fe3 50%, #1d3f95 100%);
  color: #ffffff;
  font-weight: 600;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
}
</style>