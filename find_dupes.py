import re
from collections import Counter

with open('frontend/src/utils/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()
mr = re.search(r'mr:\s*\{([\s\S]*?)\}', text).group(1)
keys = []
for line in mr.split('\n'):
    m = re.match(r'^\s*([a-zA-Z0-9_]+):\s*\"', line)
    if m:
        keys.append(m.group(1))

c = Counter(keys)
for k, v in c.items():
    if v > 1: print(k, v)
