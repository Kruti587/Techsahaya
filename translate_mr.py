import json
import time
import re
from deep_translator import GoogleTranslator

with open('frontend/src/utils/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()

en_block = re.search(r'en:\s*\{([\s\S]*?)\n  \},', text).group(1)
mr_block = re.search(r'mr:\s*\{([\s\S]*?)\n  \}', text).group(1)

def extract_keys(block):
    d = {}
    for line in block.split('\n'):
        m = re.match(r'^\s*([a-zA-Z0-9_]+):\s*\"(.*?)\",?$', line)
        if m:
            d[m.group(1)] = m.group(2)
    return d

en_dict = extract_keys(en_block)
mr_dict = extract_keys(mr_block)

translator = GoogleTranslator(source='en', target='mr')
new_mr_lines = []
translated_count = 0

print("Checking", len(en_dict), "keys")

for k, en_val in en_dict.items():
    mr_val = mr_dict.get(k, "")
    
    # Needs translation if: missing, identical to English (and not a proper noun), or contains English text.
    needs_translation = False
    if not mr_val:
        needs_translation = True
    elif mr_val == en_val and en_val not in ["Tech Sahaya", "Aadhaar", "PAN"]:
        needs_translation = True
    elif re.search(r'[a-zA-Z]{4,}', mr_val) and "Tech Sahaya" not in mr_val and "Aadhaar" not in mr_val and "PAN" not in mr_val and "PDF" not in mr_val and "PNG" not in mr_val and "JPG" not in mr_val and "JPEG" not in mr_val and "DELETE" not in mr_val and "API" not in mr_val:
        needs_translation = True
    
    if needs_translation:
        try:
            print(f"Translating {k}...")
            # Unescape \" before translating, then re-escape
            raw_val = en_val.replace('\\"', '"')
            translated = translator.translate(raw_val)
            translated = translated.replace('"', '\\"')
            mr_val = translated
            translated_count += 1
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to translate {k}: {e}")
            mr_val = en_val
            
    new_mr_lines.append(f'    {k}: "{mr_val}",')

print(f"Translated {translated_count} new keys.")

new_mr_block = '\n'.join(new_mr_lines)
new_text = re.sub(r'mr:\s*\{[\s\S]*?\n  \}', f'mr: {{\n{new_mr_block}\n  }}', text)

with open('frontend/src/utils/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Saved i18n.ts")
