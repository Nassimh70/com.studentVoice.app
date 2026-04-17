<template>
  <div class="flex flex-col gap-4">
    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-card dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-border/50 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 class="text-lg font-bold text-foreground">{{ selectedTicket.titre }}</h3>
            <p class="text-xs font-mono text-muted-foreground mt-0.5">{{ selectedTicket.id }}</p>
          </div>
          <button @click="selectedTicket = null" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <!-- Ticket Info -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 animate-slide-down">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Expéditeur</p>
              <p class="text-foreground font-semibold">{{ selectedTicket.expediteur }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Cours</p>
              <p class="text-foreground font-semibold line-clamp-1">{{ selectedTicket.cours }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Ouvert le</p>
              <p class="text-foreground font-semibold">{{ selectedTicket.date }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Statut</p>
              <span
                class="inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ring-1 ring-inset"
                :style="{ background: statusStyle[selectedTicket.status].bg, color: statusStyle[selectedTicket.status].color, '--tw-ring-color': statusStyle[selectedTicket.status].color + '30' }"
              >
                {{ selectedTicket.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Messages Section -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-for="(msg, idx) in selectedTicket.responses" :key="idx" class="flex gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-inset" 
                 :class="msg.isProf ? 'bg-blue-50 text-blue-600 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-100 text-slate-600 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-400'">
                {{ msg.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-bold text-foreground">{{ msg.name }}</span>
                <span v-if="msg.isProf" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 font-bold uppercase tracking-wider">Professeur</span>
                <span class="text-[11px] text-muted-foreground ml-auto">{{ msg.time }}</span>
              </div>
              <p class="text-sm text-foreground/80 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl rounded-tl-none">{{ msg.content }}</p>
            </div>
          </div>
        </div>

        <!-- Response Form -->
        <div class="p-6 border-t border-border bg-card/50">
          <textarea
            v-model="responseText"
            placeholder="Écrire une réponse..."
            class="w-full p-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-900/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            rows="3"
          ></textarea>
          <div class="flex gap-3 mt-4">
            <button
              @click="sendResponse"
              class="flex-1 px-4 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20"
              style="background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--blue-deep) 100%)"
            >
              Envoyer la réponse
            </button>
            <button
              @click="selectedTicket = null"
              class="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-muted-foreground bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        @click="openTicket(ticket.id)"
        class="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 flex flex-col h-full cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50"
      >
        <!-- Status & Badge -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-slate-100 dark:bg-slate-900 text-muted-foreground ring-1 ring-slate-200 dark:ring-slate-700">{{ ticket.id }}</span>
          <span
            class="text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ring-1 ring-inset"
            :style="{ background: statusStyle[ticket.status].bg, color: statusStyle[ticket.status].color, '--tw-ring-color': statusStyle[ticket.status].color + '30' }"
          >
            {{ ticket.status }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-base font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
          {{ ticket.titre }}
        </h3>

        <!-- Meta Info -->
        <div class="space-y-2.5 mb-6 flex-grow">
          <div class="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <UserCheck class="w-3.5 h-3.5" />
            </div>
            <div class="flex flex-col min-w-0">
               <span class="truncate font-semibold text-slate-700 dark:text-slate-300">{{ ticket.expediteur }}</span>
               <span class="text-[10px] font-bold uppercase" :style="{ color: roleColors[ticket.role] }">{{ ticket.role }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <BookOpen class="w-3.5 h-3.5" />
            </div>
            <span class="truncate font-medium">{{ ticket.cours }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div class="flex gap-4">
             <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Réponses</span>
               <div class="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                 <MessageSquare class="w-3.5 h-3.5 text-blue-500" />
                 {{ ticket.responses.length }}
               </div>
             </div>
             <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Date</span>
               <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                 {{ ticket.date }}
               </div>
             </div>
          </div>

          <button
            v-if="ticket.status !== 'Résolu'"
            @click.stop="resolveTicket(ticket.id)"
            class="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-95 shadow-md shadow-green-500/20"
            style="background: linear-gradient(135deg, #16A34A 0%, #15803D 50%, #166534 100%)"
          >
            Résoudre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Send, Clock, CheckCircle, MessageSquare, Ticket as TicketIcon, UserCheck, BookOpen } from 'lucide-vue-next';

const tickets = ref([
  { 
    id: 'TKT-101', 
    titre: 'Problème accès plateforme e-learning', 
    expediteur: 'Karim Bouali', 
    role: 'Délégué', 
    cours: 'Algorithmique', 
    date: '31 Mar 2026', 
    status: 'Ouvert', 
    responses: [
      { name: 'Karim Bouali', content: 'Je n\'arrive pas à accéder à la plateforme depuis ce matin', time: '10:30', isProf: false },
      { name: 'Dr. Martin', content: 'Nous investiguons ce problème. Pouvez-vous vérifier votre connexion internet?', time: '11:15', isProf: true }
    ]
  },
  { 
    id: 'TKT-102', 
    titre: 'Erreur dans les ressources du module', 
    expediteur: 'Leila Mansouri', 
    role: 'Délégué', 
    cours: 'Analyse 2', 
    date: '30 Mar 2026', 
    status: 'Ouvert', 
    responses: [
      { name: 'Leila Mansouri', content: 'Le PDF du chapitre 3 semble corrompu', time: '14:20', isProf: false },
      { name: 'Dr. Ahmed', content: 'Merci de signaler ce problème. Je vais télécharger une nouvelle version.', time: '14:45', isProf: true },
      { name: 'Leila Mansouri', content: 'Merci, je vais vérifier', time: '15:00', isProf: false }
    ]
  },
  { 
    id: 'TKT-103', 
    titre: 'Mise à jour avancement Chapitre 4', 
    expediteur: 'Dr. Yousfi', 
    role: 'Professeur', 
    cours: 'Physique Moderne', 
    date: '29 Mar 2026', 
    status: 'Résolu', 
    responses: [
      { name: 'Dr. Yousfi', content: 'Pouvez-vous publier les corrections du chapitre 4?', time: '09:00', isProf: true },
      { name: 'Admin', content: 'Les corrections sont maintenant disponibles', time: '10:30', isProf: true }
    ]
  },
  { 
    id: 'TKT-104', 
    titre: 'Demande de rattrapage séance TP', 
    expediteur: 'Farida Kaci', 
    role: 'Délégué', 
    cours: 'Chimie Organique', 
    date: '28 Mar 2026', 
    status: 'En cours', 
    responses: [
      { name: 'Farida Kaci', content: 'Je n\'ai pas pu assister au TP du 25 Mars', time: '16:45', isProf: false }
    ]
  },
  { 
    id: 'TKT-105', 
    titre: 'Erreur dans le calendrier des examens', 
    expediteur: 'Hamid Seddiki', 
    role: 'Délégué', 
    cours: 'Mathématiques Discrètes', 
    date: '27 Mar 2026', 
    status: 'En cours', 
    responses: [
      { name: 'Hamid Seddiki', content: 'La date de l\'examen final semble incorrecte', time: '13:00', isProf: false }
    ]
  },
  { 
    id: 'TKT-106', 
    titre: 'Ressources manquantes pour TD', 
    expediteur: 'Dr. Benmoussa', 
    role: 'Professeur', 
    cours: 'Réseaux', 
    date: '26 Mar 2026', 
    status: 'Résolu', 
    responses: [
      { name: 'Dr. Benmoussa', content: 'Les slides du TD 5 ne sont pas disponibles', time: '11:20', isProf: true },
      { name: 'Admin', content: 'Les slides sont en ligne', time: '12:00', isProf: true }
    ]
  },
]);

const selectedTicket = ref(null);
const responseText = ref('');

const statusStyle = {
  'Ouvert': { bg: '#DBEAFE', color: '#1D4ED8' },
  'En cours': { bg: '#FEF9C3', color: '#CA8A04' },
  'Résolu': { bg: '#DCFCE7', color: '#16A34A' },
};

const roleColors = {
  'Délégué': '#818CF8',
  'Professeur': '#F59E0B',
};

const stats = computed(() => [
  { label: 'Total Tickets', value: tickets.value.length, color: '#4F5CF5', bg: 'rgba(79, 92, 245, 0.1)', icon: TicketIcon },
  { label: 'Attente', value: tickets.value.filter(t => t.status === 'Ouvert').length, color: '#1D4ED8', bg: 'rgba(29, 78, 216, 0.1)', icon: Send },
  { label: 'En cours', value: tickets.value.filter(t => t.status === 'En cours').length, color: '#CA8A04', bg: 'rgba(202, 138, 4, 0.1)', icon: Clock },
  { label: 'Résolus', value: tickets.value.filter(t => t.status === 'Résolu').length, color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)', icon: CheckCircle },
]);

function openTicket(ticketId) {
  selectedTicket.value = tickets.value.find(t => t.id === ticketId);
  responseText.value = '';
}

function sendResponse() {
  if (selectedTicket.value && responseText.value.trim()) {
    const now = new Date();
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    
    selectedTicket.value.responses.push({
      name: 'Vous (Professeur)',
      content: responseText.value,
      time: time,
      isProf: true
    });
    
    // Passer le ticket à "Ouvert" quand le professeur répond
    if (selectedTicket.value.status === 'En cours') {
      selectedTicket.value.status = 'Ouvert';
    }
    
    responseText.value = '';
  }
}

function resolveTicket(ticketId) {
  const ticket = tickets.value.find(t => t.id === ticketId)
  if (ticket) {
    ticket.status = 'Résolu'
  }
}
</script>
