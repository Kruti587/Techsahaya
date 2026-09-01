import json
import sys
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(encoding='utf-8')

def translate_schemes():
    # Translator for translating Hindi to Marathi (because scheme_translations.json has hi)
    translator_hi_to_mr = GoogleTranslator(source='hi', target='mr')
    
    try:
        with open('data/config/scheme_translations.json', 'r', encoding='utf-8') as f:
            trans = json.load(f)
            
        print(f"Translating {len(trans)} scheme translations to Marathi...")
        
        count = 0
        for scheme_id, lang_dict in trans.items():
            if 'hi' in lang_dict:
                try:
                    hi_data = lang_dict['hi']
                    def translate_list(lst):
                        if not lst: return []
                        return [translator_hi_to_mr.translate(item) for item in lst]
                        
                    mr_data = {
                        "description": translator_hi_to_mr.translate(hi_data['description']),
                        "benefits": translate_list(hi_data['benefits']),
                        "eligibility": translate_list(hi_data['eligibility']),
                        "required_documents": translate_list(hi_data['required_documents']),
                        "application_steps": translate_list(hi_data['application_steps']),
                        "department": translator_hi_to_mr.translate(hi_data['department'])
                    }
                    lang_dict['mr'] = mr_data
                    count += 1
                    print(f"Successfully translated {scheme_id} to Marathi.")
                except Exception as e:
                    print(f"Error on detailed scheme {scheme_id}: {e}")
                    
        with open('data/config/scheme_translations.json', 'w', encoding='utf-8') as f:
            json.dump(trans, f, indent=4, ensure_ascii=False)
        print(f"Successfully injected {count} Marathi translations into scheme_translations.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    translate_schemes()
