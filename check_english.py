import re
with open('frontend/src/utils/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()
mr = re.search(r'mr:\s*\{([\s\S]*?)\}', text).group(1)
count = 0
for line in mr.split('\n'):
    val_m = re.search(r'^\s*[a-zA-Z0-9_]+:\s*"(.*?)"', line)
    if val_m:
        val = val_m.group(1)
        if re.search(r'[a-zA-Z]{4,}', val) and 'Tech Sahaya' not in val and 'Aadhaar' not in val and 'PAN' not in val and 'PDF' not in val and 'PNG' not in val and 'JPG' not in val and 'JPEG' not in val and 'DELETE' not in val and 'API' not in val:
            print(line.strip().encode('utf-8'))
            count += 1
print('Total English words left:', count)
