<template>
  <div>
    <!-- Banner -->
    <div
      class="relative px-8 pt-7 pb-6 text-center overflow-hidden"
      :style="{ background: bannerGradient, transition: 'background 0.5s ease' }"
    >
      <div
        class="absolute inset-0 opacity-10"
        :style="{
          backgroundImage:
            'radial-gradient(circle at 20% 50%,white 1px,transparent 1px),radial-gradient(circle at 80% 20%,white 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }"
      />

      <!-- Back button -->
      <button
        type="button"
        @click="$emit('flip')"
        class="absolute top-4 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
        :style="{
          background: 'rgba(255,255,255,0.18)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.25)',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 600,
        }"
        @mouseenter="(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')"
        @mouseleave="(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')"
      >
        <IconBack /> Retour
      </button>

      <div
        class="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2 mt-1"
        :style="{
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }"
      >
        <GraduationCap v-if="role === 'etudiant'" :size="24" stroke="white"  />
        <Briefcase v-else-if="role === 'enseignant'" :size="24" stroke="white" />
        <User v-else :size="24" stroke="white" stroke-width="1.8" />
      </div>
      <h1 class="text-white text-lg mb-0.5" :style="{ fontWeight: 700, letterSpacing: '-0.02em' }">Créer un compte</h1>
      <p class="text-white text-xs" :style="{ opacity: 0.8 }">
        {{ role === 'etudiant' ? 'Espace Étudiant' : role === 'enseignant' ? 'Espace Enseignant' : 'Rejoignez votre université' }}
      </p>
    </div>

    <div class="px-8 py-6 ">
      <!-- Role Selector -->
      <div class="mb-5">
        <p class="text-xs uppercase mb-2.5 text-slate-500 font-semibold tracking-[0.07em]">
          Choisissez votre rôle
        </p>
        <div class="grid grid-cols-2 gap-3">
          <RoleCard
            :active="role === 'etudiant'"
            @click="role = 'etudiant'"
            color="#0d9488"
            :icon="IconEtudiant"
            label="Étudiant"
            desc="Accès cours & ressources"
          />
          <RoleCard
            :active="role === 'enseignant'"
            @click="role = 'enseignant'"
            color="#8b5cf6"
            :icon="IconEnseignant"
            label="Enseignant"
            desc="Gestion cours & étudiants"
          />
        </div>
      </div>

      <!-- Dynamic Form -->
      <form v-show="role" @submit.prevent="handleSubmit" class="flex flex-col gap-3.5" :style="{
        opacity: role ? 1 : 0,
        transform: role ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: role ? 'auto' : 'none',
        willChange: 'opacity, transform',
      }">
          <!-- Common fields -->
          <div class="grid grid-cols-2 gap-3">
            <Field id="prenom" label="Prénom" v-model="prenom" placeholder="" :icon="IconUser" />
            <Field id="nom" label="Nom" v-model="nom" placeholder="" :icon="IconUser" />
          </div>
          <Field
            id="signup-email"
            label="Adresse email"
            v-model="email"
            placeholder=""
            :icon="IconEmail"
          />

          <!-- Role-specific fields -->
          <template v-if="role === 'etudiant'">
            <div class="grid grid-cols-2 gap-3">
              <Field id="numEtu" label="N° Étudiant" v-model="numEtudiant" placeholder="" :icon="IconId" />
              <Field
                id="filiere"
                label="Filière / Programme"
                v-model="filiere"
                placeholder=""
                :icon="IconBook"
              />
            </div>
          </template>
          <template v-else-if="role === 'enseignant'">
            <div class="grid grid-cols-2 gap-3">
              <Field
                id="dept"
                label="Département"
                v-model="departement"
                placeholder=""
                :icon="IconBuild"
              />
              <Field
                id="grade"
                label="Grade / Spécialité"
                v-model="grade"
                placeholder=""
                :icon="IconStar"
              />
            </div>
          </template>

          <div class="grid grid-cols-2 gap-3">
            <PasswordField id="signup-password" label="Mot de passe" v-model="password" />
            <PasswordField id="confirm-password" label="Confirmer mot de passe" v-model="confirm" />
          </div>

          <!-- Password match indicator -->
          <div v-if="confirm.length > 0" class="flex items-center gap-2 text-xs" :style="{ color: confirm === password ? '#16a34a' : '#dc2626' }">
            <svg v-if="confirm === password" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            {{ confirm === password ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
          </div>

          <div class="pt-1">
            <ActionButton
              :label="role === 'etudiant' ? 'Créer mon compte étudiant' : 'Créer mon compte enseignant'"
              :loading="loading"
              :icon="IconCheck"
              :gradient="btnGradient"
            />
          </div>
      </form>

      <p v-if="!role" class="text-center text-sm py-2" :style="{ color: '#94a3b8' }">
        Sélectionnez un rôle pour continuer
      </p>
    </div>

    <SecurityBadge />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  GraduationCap,
  Briefcase,
  User,
  Mail,
  CreditCard,
  Book,
  Wrench,
  Star,
  Check,
  ArrowLeft,
} from 'lucide-vue-next'
import Field from './Field.vue'
import PasswordField from './PasswordField.vue'
import ActionButton from './ActionButton.vue'
import RoleCard from './RoleCard.vue'
import SecurityBadge from './SecurityBadge.vue'

const role = ref(null)
const loading = ref(false)
const prenom = ref('')
const nom = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const numEtudiant = ref('')
const filiere = ref('')
const departement = ref('')
const grade = ref('')

const bannerGradient = computed(() => {
  if (role.value === 'etudiant') return 'linear-gradient(135deg,#0f7069 0%,#0d9084 60%,#13b3a1 100%)'
  if (role.value === 'enseignant') return 'linear-gradient(135deg,#7640d8 0%,#8557ee 60%,#9f86f5 100%)'
  return 'linear-gradient(135deg,#1f54d2 0%,#255fe3 60%,#3b7af0 100%)'
})

const btnGradient = computed(() => {
  if (role.value === 'etudiant') return 'linear-gradient(135deg,#0d9084,#13b3a1)'
  if (role.value === 'enseignant') return 'linear-gradient(135deg,#7640d8,#8557ee)'
  return undefined
})

const IconEtudiant = GraduationCap
const IconEnseignant = Briefcase
const IconEmail = Mail
const IconUser = User
const IconId = CreditCard
const IconBook = Book
const IconBuild = Wrench
const IconStar = Star
const IconCheck = Check
const IconBack = ArrowLeft

defineEmits([
  'flip'
])

const handleSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
