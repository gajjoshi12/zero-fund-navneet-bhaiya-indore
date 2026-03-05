import os
import re

app_dir = os.path.join(os.getcwd(), 'app')

# Regex to match <div className="logo-icon">...</div>
# including newlines
pattern = re.compile(r'<div className="logo-icon">.*?</div>\s*', re.DOTALL)

for root, dirs, files in os.walk(app_dir):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub('', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Removed logo-icon from {filepath}")
