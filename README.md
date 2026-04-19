# EduDeck - Vue 3 (Composition API)

Conversion React TSX → Vue 3 avec `<script setup>` et Composition API.

## Stack
- **Vue 3** avec `<script setup>` (Composition API)
- **TypeScript**
- **Tailwind CSS v3**
- **lucide-vue-next** (équivalent de lucide-react)
- **vue-chartjs + chart.js** (équivalent de recharts)

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Structure

```
src/
├── App.vue                          # Composant racine (routing par état)
├── main.ts                          # Point d'entrée
├── styles/
│   ├── index.css                    # Import Tailwind + thème
│   ├── theme.css                    # Variables CSS (inchangées)
│   └── fonts.css                    # Polices (inchangées)
└── components/
    ├── Sidebar.vue                  # Navigation latérale
    ├── Header.vue                   # Barre supérieure
    ├── StatsCards.vue               # Cartes de statistiques
    ├── StudentPerformance.vue       # Graphique en barres (vue-chartjs)
    ├── CourseProgress.vue           # Graphique SVG circulaire
    ├── RecentTickets.vue            # Liste des tickets
    ├── AnnouncementPanel.vue        # Panneau d'annonces
    └── pages/
        ├── Dashboard.vue            # Page tableau de bord
        ├── CoursesList.vue          # Page liste des cours
        ├── StudentsList.vue         # Page liste des étudiants
        └── GradeManagement.vue      # Page gestion des notes
```

## Correspondances React → Vue

| React                     | Vue 3                          |
|---------------------------|--------------------------------|
| `useState`                | `ref()` / `reactive()`         |
| `useMemo` / calcul dérivé | `computed()`                   |
| `props`                   | `defineProps<{}>()`            |
| `emit` (callback prop)    | `defineEmits<{}>()` + `$emit`  |
| `onClick`                 | `@click`                       |
| `onChange`                | `@input` / `v-model`           |
| `onSubmit`                | `@submit.prevent`              |
| JSX conditionnel          | `v-if` / `v-else-if` / `v-else`|
| `.map()` en JSX           | `v-for`                        |
| `className`               | `class` / `:class`             |
| `style={{ width: x }}`   | `:style="{ width: x }"`        |
| Composant dynamique       | `<component :is="..." />`      |
| `lucide-react`            | `lucide-vue-next`              |
| `recharts`                | `vue-chartjs` + `chart.js`     |


# new Structure :

```

# 📁 Project Structure Documentation

## Structure des dossiers optimisée

```
src/
├── App.vue                     # Root component
├── main.js                     # Entry point (imports global styles)
│
├── styles/
│   ├── global/                 # Global styles (centralized)
│   │   └── index.css          # Main stylesheet (imports tailwind, theme, animations)
│   └── common/                 # CSS variables & theme
│       ├── theme.css          # Color system and theming
│       └── fonts.css          # Font imports
│
├── components/                 # Reusable Vue components (organized by purpose)
│   ├── auth/                  # Authentication components
│   │   ├── LoginFace.vue
│   │   ├── LoginCard.vue
│   │   ├── SignupFace.vue
│   │   ├── PasswordField.vue
│   │   └── index.js          # Barrel export
│   │
│   ├── layout/                # Layout components (navigation, headers, etc)
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── ThemeToggle.vue
│   │   └── index.js          # Barrel export
│   │
│   ├── common/                # Generic utility components
│   │   ├── Field.vue
│   │   ├── CustomSelect.vue
│   │   ├── SecurityBadge.vue
│   │   ├── ActionButton.vue
│   │   └── index.js          # Barrel export
│   │
│   ├── features/              # Feature-specific components
│   │   ├── Annonce.vue
│   │   ├── Aide.vue
│   │   ├── AboutSection.vue
│   │   ├── HeroSection.vue
│   │   ├── HowItWorks.vue
│   │   ├── RoleCard.vue
│   │   ├── Profile.vue
│   │   └── index.js          # Barrel export
│   │
│   └── shared/                # Shared/context components
│       ├── Notification.vue
│       └── index.js          # Barrel export
│
├── pages/                      # Main page components (not module-specific)
│   ├── HomePage.vue
│   ├── LoginPage.vue
│   └── index.js              # Barrel export
│
├── layouts/                    # Layout wrappers for different roles
│   ├── AdminLayout.vue
│   ├── StudentLayout.vue
│   └── ProfLayout.vue
│
├── modules/                    # Feature modules (role/feature based)
│   ├── admin/
│   │   ├── pages/            # Admin-specific pages
│   │   │   ├── DashboardPage.vue
│   │   │   ├── AnnoncesPage.vue
│   │   │   ├── TicketsPage.vue
│   │   │   ├── DeleguesPage.vue
│   │   │   └── UtilisateursPage.vue
│   │   └── components/       # Admin-specific components (future use)
│   │
│   ├── student/
│   │   ├── pages/            # Student-specific pages
│   │   │   ├── AnnouncementsPage.vue
│   │   │   ├── ModuleProgress.vue
│   │   │   ├── Suggestions.vue
│   │   │   └── Tickets.vue
│   │   └── components/       # Student-specific components (future use)
│   │
│   ├── prof/
│   │   ├── pages/            # Prof-specific pages
│   │   │   ├── Dashboard.vue
│   │   │   ├── AnnoncesPage.vue
│   │   │   ├── CoursesList.vue
│   │   │   ├── StudentsList.vue
│   │   │   ├── GradeManagement.vue
│   │   │   └── Tickets.vue
│   │   └── components/       # Prof-specific components (future use)
│   │
│   └── home/                 # (Deprecated - use /pages instead)
│       ├── HomePage.vue      # (Now in /pages)
│       └── LoginPage.vue     # (Now in /pages)
│
├── composables/               # Vue composables (reusable logic)
│   ├── useAuth.js
│   ├── useStudents.js
│   └── useScrollReveal.js
│
├── router/                    # Vue Router config
│   └── index.js
│
└── Asset/                     # Images, icons, media
    └── favicon.svg
```

## 🎯 Key Improvements

### ✅ Cleaned Up
- Removed duplicate `Dashboard.vue` from components
- Consolidated all CSS into `styles/global/index.css`
- Removed old CSS files: `Home/`, `login-fallback.css`, `tailwind-login.css`
- Organized 20 components into 5 logical folders

### ✅ Better Organization
- **auth/**: Login, signup, password forms
- **layout/**: Header, footer, theme toggle
- **common/**: Reusable form components and utilities
- **features/**: Business logic components (Annonce, Profile, etc)
- **shared/**: Context-wide components (Notifications)

### ✅ Barrel Exports
- Each component folder has `index.js` for cleaner imports
- `import { LoginCard } from '@/components/auth'` instead of long paths

### ✅ Centralized Imports
- `main.js` imports only `styles/global/index.css`
- Global styles include Tailwind, theme variables, and animations

## 📝 Import Examples

### Before (Complex)
```javascript
import LoginCard from '../../../components/LoginCard.vue'
import ThemeToggle from '../../../components/ThemeToggle.vue'
```

### After (Simple)
```javascript
import { LoginCard } from '@/components/auth'
import { ThemeToggle } from '@/components/layout'
```

## 📦 Module Structure
- Each module (admin, student, prof) contains role-specific pages
- Shared components moved to root `components/`
- Pages moved to root `pages/` (accessible to all roles)

## 🔧 Future Improvements
- Add module-specific components in `modules/{role}/components/`
- Create shared API/store structure
- Add type definitions for TypeScript
- Extract complex logic into more composables
