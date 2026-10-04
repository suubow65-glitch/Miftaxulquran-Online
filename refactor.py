import os
import re

files = [
    "app/admin/dashboard/page.tsx",
    "app/teacher/dashboard/page.tsx",
    "app/admin/login/page.tsx"
]

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'import { useStore }' in content:
        content = content.replace('import { useStore } from "@/lib/store";', 'import { useStore, type CMSState } from "@/lib/store";')
    
    content = re.sub(r'useStore\(\s*([a-zA-Z0-9_]+)\s*=>', r'useStore((\1: CMSState) =>', content)
    content = re.sub(r'useStore\(\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*=>', r'useStore((\1: CMSState) =>', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Refactored useStore calls!")
