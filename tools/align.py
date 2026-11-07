import json, re, subprocess, numpy as np
lines=[l.strip() for l in open('script_lines.txt') if l.strip()]
def gaps(f,off):
    out=subprocess.run(['ffmpeg','-i',f,'-af','silencedetect=n=-28dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
    e=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    return [(a+off,b+off) for a,b in zip(s,e) if b-a>=0.0]
A='/home/claude/assets/lv_0_20261107155308.mp3'
B='/home/claude/assets/lv_0_20261107155428.mp3'
d1,d2=68.754286,172.251429
g=gaps(A,0)+gaps(B,d1)
T=d1+d2
# active-speech weighting: cumulative char count (+ punctuation pause weight)
w=[len(l)+ (6 if l.endswith(('...','?')) else 3) for l in lines]
cum=np.cumsum(w)/sum(w)
est=[c*T for c in cum]
# part-1 boundary: line whose estimated end is nearest d1
k=int(np.argmin([abs(e-d1) for e in est]))
print('split after line',k,lines[k][:50],est[k])
ends=[]
for i,e in enumerate(est[:-1]):
    if i==k: ends.append(d1); continue
    # candidate gaps within window; prefer long ones
    c=[(abs((a+b)/2-e)-(b-a)*4,(a+b)/2) for a,b in g if abs((a+b)/2-e)<1.6]
    ends.append(min(c)[1] if c else e)
ends.append(T)
for i in range(1,len(ends)):
    if ends[i]<=ends[i-1]+0.8: ends[i]=ends[i-1]+0.8
starts=[0]+ends[:-1]
data=[{"text":l,"start":round(s,2),"end":round(e,2)} for l,s,e in zip(lines,starts,ends)]
json.dump({"part1":d1,"part2":d2,"total":T,"lines":data},open('timing.json','w'),ensure_ascii=False,indent=1)
for i,x in enumerate(data): print(i,x['start'],x['end'],x['text'][:45])
