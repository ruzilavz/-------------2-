with open('index.html','rb') as f:
    data=f.read()
start=data.index(b'<div class="track-chart-panel" id="trackChartPanel">')
end=data.index(b'<div class="tracks-grid">', start)
line_start=data.rfind(b'\n',0,start)
if line_start==-1:
    line_start=start
new_data=data[:line_start+1]+data[end:]
with open('index.html','wb') as f:
    f.write(new_data)
