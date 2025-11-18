import pathlib, subprocess
base = pathlib.Path('index.html').read_text('utf-8', errors='ignore')
HEAD = subprocess.run(['git','show','HEAD:index.html'], capture_output=True, text=True, encoding='utf-8', errors='ignore').stdout
print('len(base)', len(base))
print('len(HEAD)', len(HEAD))
print('same?', base == HEAD)
