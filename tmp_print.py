import pathlib 
p=pathlib.Path('src/views/ClueWallView.vue') 
lines=p.read_text('utf-8').splitlines() 
for i,line in enumerate(lines,1): 
