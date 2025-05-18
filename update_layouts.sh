#!/bin/bash

# Lista de arquivos a serem atualizados
files=(
  "client/src/pages/owner/dashboard.tsx"
  "client/src/pages/owner/products.tsx"
  "client/src/pages/owner/customers.tsx"
  "client/src/pages/owner/quotes.tsx"
  "client/src/pages/owner/financial.tsx"
  "client/src/pages/owner/reviews.tsx"
  "client/src/pages/owner/marketing.tsx"
  "client/src/pages/owner/statistics.tsx"
  "client/src/pages/owner/settings.tsx"
  "client/src/pages/owner/profile.tsx"
  "client/src/pages/owner/profile-edit.tsx"
  "client/src/pages/owner/workshop-edit.tsx"
)

# Salva a importação original para poder substituir depois
for file in "${files[@]}"; do
  # Apenas se o arquivo existir e contiver OwnerPageLayout
  if grep -q "OwnerPageLayout" "$file"; then
    echo "Atualizando $file..."
    
    # 1. Substituir importações
    sed -i 's/import { OwnerPageLayout } from "@\/components\/layouts";/import { OwnerLayout } from "@\/components\/layouts";/g' "$file"
    sed -i 's/import { OwnerPageLayout, /import { OwnerLayout, /g' "$file"
    sed -i 's/, OwnerPageLayout/, OwnerLayout/g' "$file"
    
    # 2. Substituir todas as ocorrências de OwnerPageLayout por OwnerLayout
    sed -i 's/<OwnerPageLayout/<OwnerLayout>/g' "$file"
    sed -i 's/<\/OwnerPageLayout>/<\/OwnerLayout>/g' "$file"
  fi
done

echo "Layouts atualizados com sucesso!"
