<template>
  <div class="footer-container">
    <!-- Ligne de sécurité -->
    <div class="security-bar">
      <div class="security-content">
        <Lock :size="14" class="lock-icon" />
        <span class="security-text">Connexion sécurisée · SSL/TLS 256-bit</span>
      </div>
    </div>
  </div>

</template>
<script setup>
import { Lock } from 'lucide-vue-next'
</script>

<style scoped>
.footer-container {
  background: var(--color-background-secondary);
  border-top: 1px solid var(--color-border-tertiary);
  padding: 0;
  font-family: var(--font-sans);
}

.security-bar {
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border-tertiary);
}

.security-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.lock-icon {
  color: var(--color-text-success);
  flex-shrink: 0;
}

.security-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  letter-spacing: 0.3px;
}
</style>