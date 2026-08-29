from pathlib import Path
import re

records = Path("shared/records.ts").read_text(encoding="utf-8")
component = Path("components/body-diagram.tsx").read_text(encoding="utf-8")
record_ids = set(re.findall(r'\bid:\s*"([^"]+)"', records))
component_ids = set(re.findall(r'(?:id:\s*"|detail\(\s*`)([a-z0-9-]+)', component))
# Dynamic template IDs are represented by their family in the report; explicit IDs are the audit target.
missing = sorted(x for x in record_ids if x not in component_ids and not x.startswith(("pain-", "food-", "emotion-", "med-")))
print(f"record_ids={len(record_ids)}")
print(f"component_ids={len(component_ids)}")
print("missing_anatomical_ids:")
for item in missing:
    print(item)
