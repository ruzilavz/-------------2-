import pathlib
text=pathlib.Path('index.html').read_text('latin-1')
lines=text.splitlines()
for idx,line in enumerate(lines,1):
    if '<section id="tracks">' in line:
        print(idx)
        for i in range(idx-5, idx+20):
            if 0 < i <= len(lines):
                print(f'{i}: {lines[i-1]}')
        break
