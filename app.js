import {sameAnswers, toggleAnswer, shuffle, examScore} from './model.js';

const main = document.querySelector('main');
const STORE = 'wireless-final-prep-v1';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let bank, questions, byId, current, practiceId, expandedId, showAll = false;
let state = {attempts:{}, saved:[], exam:null};
let filters = {source:'all', topic:'all', query:'', missed:false};
try {
  const saved = JSON.parse(localStorage.getItem(STORE));
  if (saved && Array.isArray(saved.saved)) {
    const attempts = saved.attempts && typeof saved.attempts === 'object' && !Array.isArray(saved.attempts) ? saved.attempts : {};
    state = {...state, ...saved, attempts};
  }
} catch { /* An unavailable or damaged store must not prevent studying. */ }
function persist() {
  try {localStorage.setItem(STORE, JSON.stringify(state));}
  catch {toast('Progress could not be saved on this device. You can keep studying.');}
}
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 3200);
}
function route() {
  const requested = location.hash.slice(1) || 'practice';
  current = ['practice','bank','saved','formulas','sources','exam'].includes(requested) ? requested : 'practice';
  if (current === 'exam' && !state.exam) current = 'practice';
  document.querySelectorAll('[data-nav]').forEach(el => {
    const active = el.dataset.nav === (current === 'exam' ? 'practice' : current);
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
  render();
}
function filtered() {
  const term = filters.query.toLowerCase().trim();
  return questions.filter(q => (filters.source === 'all' || filters.source === q.source)
    && (filters.topic === 'all' || filters.topic === q.topic)
    && (!term || `${q.id} ${q.source} ${q.topic} ${q.prompt} ${q.choices.join(' ')} ${q.context || ''}`.toLowerCase().includes(term))
    && (!filters.missed || (state.attempts[q.id]?.checked && !sameAnswers(state.attempts[q.id].selected || [], q.answers)))
    && (current !== 'saved' || state.saved.includes(q.id)));
}
function stats() {
  const attempted = questions.filter(q => state.attempts[q.id]?.checked);
  const correct = attempted.filter(q => sameAnswers(state.attempts[q.id].selected || [], q.answers)).length;
  return `<section class="stats" aria-label="Your study progress"><div class="stat"><span class="stat-num">${questions.length}</span><span class="stat-label">in your bank</span></div><div class="stat"><span class="stat-num">${correct}<small> / ${attempted.length}</small></span><span class="stat-label">latest answers correct</span></div><div class="stat"><span class="stat-num">${questions.length - attempted.length}</span><span class="stat-label">still to explore</span></div><a class="progress-link" href="#bank">Explore the full bank <span aria-hidden="true">↗</span></a></section>`;
}
function filterBar() {
  const options = (values, selected, all) => `<option value="all">${all}</option>` + values.map(v => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
  const active = filters.source !== 'all' || filters.topic !== 'all' || filters.query || filters.missed;
  return `<section class="filter-panel" aria-label="Question filters"><div class="filters"><div class="field search-field"><label for="search">Find a question</label><input id="search" type="search" placeholder="Keyword, topic or question ID" value="${esc(filters.query)}"></div><div class="field"><label for="source">Source</label><select id="source">${options([...new Set(questions.map(q => q.source))], filters.source, 'All sources')}</select></div><div class="field"><label for="topic">Topic</label><select id="topic">${options([...new Set(questions.map(q => q.topic))].sort(), filters.topic, 'All topics')}</select></div></div><div class="filter-footer"><label class="check-filter"><input id="missed" type="checkbox" ${filters.missed ? 'checked' : ''}> Missed only</label><span class="filter-summary">${active ? 'Filters applied' : 'Every source included'}</span><button class="text-button" data-action="clear-filters" ${active ? '' : 'disabled'}>Clear filters</button></div></section>`;
}
function picks(q) {return current === 'exam' ? state.exam.selections[q.id] || [] : state.attempts[q.id]?.selected || [];}
function feedbackVisible(q) {return current === 'exam' ? state.exam.finished : Boolean(showAll || (!state.attempts[q.id]?.hidden && (state.attempts[q.id]?.checked || state.attempts[q.id]?.revealed)));}
function evidenceDetails(q) {
  const evidence = (q.evidence || []).filter(item => /^https:\/\//i.test(item.url));
  if (!q.reviewNote && !q.transcriptionStatus && !evidence.length) return '';
  return `<details class="evidence-details" id="evidence-${esc(q.id)}"><summary>Sources & review notes <span aria-hidden="true">↗</span></summary><div>${q.reviewNote ? `<p>${esc(q.reviewNote)}</p>` : ''}${q.transcriptionStatus ? `<p class="transcription-note"><strong>Photo comparison:</strong> ${esc(q.transcriptionStatus)}.</p>` : ''}${evidence.length ? `<ul>${evidence.map(item => `<li><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul>` : ''}</div></details>`;
}
function card(q, position = '') {
  const selected = picks(q), visible = feedbackVisible(q);
  const graded = current === 'exam' ? state.exam.finished : Boolean(state.attempts[q.id]?.checked);
  const correct = sameAnswers(selected, q.answers);
  const isSaved = state.saved.includes(q.id);
  return `<article class="question-card" id="question-${esc(q.id)}" aria-labelledby="prompt-${esc(q.id)}"><div class="question-top"><span class="source-chip">${esc(q.sourceRef)}</span><span class="question-number">${esc(position || q.id)}</span><button class="bookmark ${isSaved ? 'saved' : ''}" data-action="save" data-q="${q.id}" aria-label="${isSaved ? 'Unsave' : 'Save'} question ${q.id}" aria-pressed="${isSaved}">${isSaved ? '★' : '☆'}</button></div><div class="question-meta"><span class="topic-label">${esc(q.topic)}</span>${q.needsReview ? '<span class="review-label">Wording needs care</span>' : ''}</div>${q.context ? `<p class="question-context">${esc(q.context)}</p>` : ''}<h2 class="question-prompt" id="prompt-${q.id}" tabindex="-1">${esc(q.prompt)}</h2><div class="answer-hint" id="hint-${q.id}"><span class="selection-badge">Choose ${q.selectionCount === 1 ? 'one' : q.selectionCount}</span><span>${q.selectionCount > 1 ? `${selected.length} of ${q.selectionCount} selected · Exact set required` : 'Your answer stays editable'}</span></div><div class="choice-list" role="${q.selectionCount === 1 ? 'radiogroup' : 'group'}" aria-label="Answer choices" aria-describedby="hint-${q.id}">${q.choices.map((choice, i) => {
    const chosen = selected.includes(i), key = q.answers.includes(i);
    const cls = `choice ${chosen ? 'selected' : ''} ${visible && key ? 'correct' : ''} ${visible && chosen && !key ? 'wrong' : ''}`;
    const tabstop = q.selectionCount === 1 ? (selected.length ? chosen : i === 0) : true;
    return `<button class="${cls}" type="button" role="${q.selectionCount === 1 ? 'radio' : 'checkbox'}" aria-checked="${chosen}" tabindex="${tabstop ? '0' : '-1'}" data-action="choose" data-q="${q.id}" data-choice="${i}"><span class="letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span class="choice-text"><span class="sr-only">${String.fromCharCode(65 + i)}. </span>${esc(choice)}</span>${visible && key ? '<span class="choice-indicator" aria-label="Correct choice">✓</span>' : visible && chosen ? '<span class="choice-indicator" aria-label="Incorrect choice">×</span>' : '<span class="choice-control" aria-hidden="true"></span>'}</button>`;
  }).join('')}</div>${current !== 'exam' ? `<div class="question-actions"><div class="actions-group"><button class="btn" data-action="check" data-q="${q.id}" ${!selected.length ? 'disabled' : ''}>${graded ? 'Check again' : 'Check answer'} <span aria-hidden="true">↗</span></button><button class="btn text" data-action="reveal" data-q="${q.id}">${visible ? 'Hide answer' : 'Show answer'}</button></div><span class="small-info">${esc(q.id)}</span></div>` : ''}${visible ? `<section class="feedback ${graded && !correct ? 'incorrect' : ''}" aria-label="Answer feedback"><div class="feedback-heading" role="status"><span class="feedback-icon" aria-hidden="true">${graded && !correct ? '↻' : '✓'}</span><strong>${graded ? (correct ? 'Correct. Your latest answer is saved.' : 'Not quite. Try another selection.') : 'Answer & explanation'}</strong></div><div class="feedback-body"><span class="status">${esc(q.answerStatus)}</span><p>${esc(q.explanation)}</p><p class="source-note"><strong>Answer: ${q.answers.map(i => String.fromCharCode(65 + i)).join(' + ')}</strong>${q.type === 'matching-to-mcq' ? ' · Adapted from a matching pair' : q.type === 'calculation-to-mcq' ? ' · MCQ choices added to the original task' : ''}</p>${evidenceDetails(q)}</div></section>` : ''}</article>`;
}
function practice() {
  const pool = filtered();
  if (!pool.some(q => q.id === practiceId)) practiceId = pool[0]?.id;
  const q = byId.get(practiceId), position = pool.findIndex(q => q.id === practiceId);
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Your wireless study space</p><h1>Build understanding.<br> One question at a time.</h1><p class="subtitle">Practice, learn why, and try again.</p><button class="hero-jump" data-action="jump-question">Jump to your question <span aria-hidden="true">↓</span></button></div><div class="exam-launch"><span class="kicker">READY FOR A RUN-THROUGH?</span><h2>Try a mixed<br> 25-question mock.</h2><p>A mixed mock, with solutions after you finish.</p><button class="btn lime" data-action="start-exam">${state.exam && !state.exam.finished ? 'Start a new mock' : 'Start mock exam'} <span aria-hidden="true">↗</span></button>${state.exam ? `<a class="resume-link" href="#exam">${state.exam.finished ? 'Review your last mock' : 'Resume your current mock'} →</a>` : ''}</div></section>${stats()}<div class="study-heading"><div><p class="eyebrow">LEARN AT YOUR PACE</p><h2>Your next question</h2></div><button class="pill-btn" data-action="shuffle">Shuffle <span aria-hidden="true">↻</span></button></div>${filterBar()}${q ? card(q, `${position + 1} / ${pool.length}`) : '<div class="empty"><h2>No questions match.</h2><p>Clear the filters to explore the full bank.</p></div>'}<div class="practice-footer"><span>${pool.length} questions in this selection · <a href="#bank">Browse all</a></span><button class="btn ghost" data-action="next" ${!q ? 'disabled' : ''}>Next question <span aria-hidden="true">→</span></button></div>`;
}
function bankView() {
  const pool = filtered();
  const compact=state.bankLayout!=='cards';
  const rows=pool.map((q,i)=>{
    const result=state.attempts[q.id];
    const status=result?.checked?(sameAnswers(result.selected||[],q.answers)?'Correct':'Try again'):'Not checked';
    return `<div class="bank-row-wrap ${expandedId===q.id?'expanded':''}"><button class="bank-row" data-action="expand" data-q="${q.id}" aria-expanded="${expandedId===q.id}" ${expandedId===q.id?`aria-controls="expanded-${q.id}"`:""}><span class="row-number">${String(i+1).padStart(2,'0')}</span><span class="row-main"><span class="row-source">${esc(q.sourceRef)} <span>· ${esc(q.topic)}</span></span><span class="row-prompt">${esc(q.prompt.replace(/\n+/g,' '))}</span></span><span class="row-status ${status==='Correct'?'done':status==='Try again'?'retry':''}">${status==='Correct'?'✓ ':status==='Try again'?'↻ ':''}${status}</span><span class="row-expand" aria-hidden="true">${expandedId===q.id?'−':'+'}</span></button>${expandedId===q.id?`<div id="expanded-${q.id}" class="expanded-question">${card(q,`${i+1} / ${pool.length}`)}</div>`:''}</div>`;
  }).join('');
  return `<div class="bank-top"><div><p class="eyebrow">The complete collection</p><h1>${current==='saved'?'Your saved questions.':'All questions. One place.'}</h1><p class="subtitle">Find a topic, open a question, and work through it. Every answer stays editable.</p></div><button class="btn ghost" data-action="toggle-all">${showAll?'Hide all answers':'Show all answers'}</button></div>${filterBar()}<div class="toolbar"><p>${pool.length} of ${questions.length} questions${current==='saved'?' · Saved on this device':''}</p><div class="view-toggle"><div class="segmented" role="group" aria-label="Question layout"><button data-action="layout-list" aria-pressed="${compact}" class="${compact?'active':''}">List</button><button data-action="layout-cards" aria-pressed="${!compact}" class="${!compact?'active':''}">Cards</button></div></div></div>${pool.length?(compact?`<div class="bank-list">${rows}</div>`:pool.map((q,i)=>card(q,`${i+1} / ${pool.length}`)).join('')):'<div class="empty">No questions here yet. Save a question with ☆ or adjust the filters.</div>'}`;
}
function examView() {
  const ex=state.exam, list=ex.ids.map(id=>byId.get(id)), q=list[ex.index];
  const answered=list.filter(q=>(ex.selections[q.id]||[]).length===q.selectionCount).length;
  const score=examScore(list,ex.selections);
  return `<p class="eyebrow">Mock exam · ${list.length} questions</p><div class="bank-top"><div><h1>${ex.finished?'Your mock results.':'Your 25-question mock.'}</h1><p class="subtitle">${ex.finished?'All answers remain editable. Your revised score updates as you change them.':'Pick your answers and move freely between questions. Explanations appear after you finish.'}</p></div><a class="btn ghost" href="#practice">Back to practice</a></div>${ex.finished?`<div class="exam-summary"><div><span class="kicker">CURRENT REVISED SCORE</span><h2>${score} / ${list.length} <span class="score-percent">${Math.round(score/list.length*100)}%</span></h2><p>First submission: ${ex.originalScore} / ${list.length} · Current revised score: ${score} / ${list.length}</p></div><button class="btn lime" data-action="start-exam">Try a new mock ↗</button></div>`:`<div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${list.length}" aria-valuenow="${answered}" aria-label="Questions answered"><div class="progress-fill" style="width:${answered/list.length*100}%"></div></div><div class="study-heading"><p>${answered} / ${list.length} answered · No time limit</p><button class="btn" data-action="finish-exam">Finish & score</button></div>`}<nav class="exam-steps" aria-label="Question navigation">${list.map((q,i)=>`<button class="exam-step ${i===ex.index?'active':''} ${(ex.selections[q.id]||[]).length===q.selectionCount?'answered':''}" data-action="exam-jump" data-index="${i}" aria-label="Go to question ${i+1}${(ex.selections[q.id]||[]).length===q.selectionCount?', answered':''}" ${i===ex.index?'aria-current="step"':''}>${i+1}</button>`).join('')}</nav>${card(q,`${ex.index+1} / ${list.length}`)}<div class="practice-footer"><button class="btn ghost" data-action="exam-prev" ${ex.index===0?'disabled':''}>← Previous</button><span>${ex.finished?'Revised answers are saved':'Your answers are saved automatically'}</span><button class="btn ghost" data-action="exam-next" ${ex.index===list.length-1?'disabled':''}>Next →</button></div>`;
}
function formulas() {
  const sheets=[
    ['Nyquist · noiseless channel','R = 2B log₂ M','B is bandwidth in Hz, M is the number of signal levels, and R is the maximum bit rate in bps.','Example: 2 × 4000 × log₂16 = 32,000 bps.'],
    ['Shannon · noisy channel','C = B log₂(1 + SNR)','Use the linear power ratio in the formula. Convert from decibels first: SNR = 10^(SNRdB / 10).','Example: 20 dB → 100; 3000 log₂101 ≈ 19.975 kbps.'],
    ['Friis · free space','Pᵣ = PₜGₜGᵣ (λ / 4πd)²','Use linear power and antenna gains in this equation. λ = c/f; take c ≈ 3 × 10⁸ m/s. It assumes free-space propagation and far-field operation.','Double the distance → quarter the received power → 6.02 dB additional loss.'],
    ['Link budget · decibels','FSPL = 20 log₁₀(4πd / λ)','Pᵣ[dBm] = Pₜ[dBm] + Gₜ[dBi] + Gᵣ[dBi] − FSPL[dB]. Use the same length units for d and λ.','P[dBm] = 10 log₁₀(P[mW]); 100 mW = 20 dBm.'],
    ['Bits, bytes & transfer time','1 byte = 8 bits','Time [s] = file size [bits] / rate [bits/s]. MB means megabytes; Mb means megabits. Rates are theoretical and ignore protocol overhead.','80 Mbps = 10 MB/s. A 400 MB file needs 40 seconds at that rate.'],
    ['Area, energy & cost','Cell count ≈ (Rold / Rnew)²','Area scaling assumes comparable cell shapes. Energy = power × time; W × h = Wh. Annual cost per user = annual cost / users.','(50/5)² = 100 cells; (18 − 6) × 1.5 × 7 = 126 Wh.']
  ];
  return `<p class="eyebrow">Keep the essentials close</p><h1>Formula sheet.</h1><p class="subtitle">The equations behind your last-practice tasks, with units and worked examples.</p><div class="formula-grid">${sheets.map(([title,formula,body,example])=>`<article class="formula"><h3>${title}</h3><div class="equation">${formula}</div><p>${body}</p><p><strong>${example}</strong></p></article>`).join('')}</div><p class="mini-note">These are theoretical models. Apply the assumptions given in each question.</p>`;
}
function sources() {
  return `<p class="eyebrow">Know what you’re studying</p><h1>Sources & teamwork.</h1><p class="subtitle">A shared question bank for Ibragim and Alina. Every item keeps its original source and question number.</p><div class="coverage-grid"><div class="coverage-tile"><b>48</b><h3>Past-paper questions</h3><p>OCR from 19 source photos. Photo comparison remains unverified. Variant 1: 25 questions. Variant 2: 23 questions.</p></div><div class="coverage-tile"><b>40 → 67</b><h3>Assignment 4</h3><p>Original MCQs preserved. Matching pairs become separate practice items. Keys come from source feedback.</p></div><div class="coverage-tile"><b>7</b><h3>Last-practice tasks</h3><p>Original calculation prompts preserved, with added MCQ choices and worked solutions.</p></div></div><div class="prose"><details class="coverage-details" open><summary>Coverage gaps & answer status</summary><ul>${bank.coverage.missing.map(t=>`<li>${esc(t)}</li>`).join('')}<li>Original photos were not available for this review; transcription fidelity remains unverified.</li><li>This bank covers the supplied materials; it does not guarantee which questions will appear on the final.</li><li>“Source feedback” comes from the Assignment 4 file. “Worked answer” and “Worked calculation” are prepared solutions, not an official marking scheme.</li><li>Some original questions use broad wording for fading and interference. They keep the intended option with a note explaining the distinction.</li><li>Two-answer questions require the exact set of answers. The seven open calculation tasks and Assignment 4 matching pairs are adapted for MCQ practice.</li></ul></details><h2>Read the source transcriptions</h2><ul><li><a href="sources/answer-review.md" target="_blank" rel="noopener">Past-paper answer review and technical evidence ↗</a></li><li><a href="sources/past-paper-transcription.md" target="_blank">Past-paper transcription and worked answers ↗</a></li><li><a href="sources/assignment-4.txt" target="_blank">Assignment 4 original text and feedback ↗</a></li><li><a href="sources/last-practice.txt" target="_blank">Last-practice original prompts ↗</a></li><li><a href="data/question-bank.json" target="_blank">Complete editable question bank (JSON) ↗</a></li><li><a href="sources/ocr-manifest.json" target="_blank">OCR coverage manifest for all 19 photos ↗</a></li></ul><h2>Work in parallel</h2><div class="role-line"><strong>Alina</strong><span>Review photo transcriptions, check the worked keys and clarify the four flagged questions. Add the missing Variant 2 questions or endterm material when available.</span></div><div class="role-line"><strong>Ibragim</strong><span>Check calculations and Assignment 4 conversions. Maintain the practice site and test answer changes on phone and desktop.</span></div><p><a class="btn" href="https://github.com/lalob1/wireless-final-prep/issues" target="_blank" rel="noopener">Open the task board ↗</a> <a class="btn ghost" href="https://github.com/lalob1/wireless-final-prep/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">How to contribute ↗</a></p><h2>Reference checks</h2><ul><li><a href="https://www.ieee802.org/11/index.shtml" target="_blank" rel="noopener">IEEE 802.11 Wireless LAN working group</a></li><li><a href="https://docs.oracle.com/cd/E19504-01/802-5886/intro-45828/index.html" target="_blank" rel="noopener">Oracle documentation: OSI reference model</a></li></ul><h2>Your progress</h2><p>Selections, saved questions and the current mock are stored only in this browser on this device. They do not sync between people or devices. Changes to the shared question bank happen through GitHub.</p><button class="btn ghost danger" data-action="reset">Reset my local progress</button></div>`;
}
function render() {
  if (!bank) return;
  const active = document.activeElement;
  const focusId = active?.id;
  const action = active?.dataset.action, choice = active?.dataset.choice;
  const qid = active?.dataset.q, index = active?.dataset.index;
  const wasInside = main.contains(active);
  const openDetails = [...main.querySelectorAll('details[open][id]')].map(el => el.id);
  let cursor;
  try { cursor = active?.selectionStart; } catch {}
  main.innerHTML = current === 'practice' ? practice() : current === 'bank' || current === 'saved' ? bankView() : current === 'exam' ? examView() : current === 'formulas' ? formulas() : sources();
  openDetails.forEach(id => { const el = document.getElementById(id); if (el) el.open = true; });
  let next = focusId ? document.getElementById(focusId) : null;
  if (!next && action) {
    next = [...main.querySelectorAll('[data-action]')].find(el => el.dataset.action === action && el.dataset.q === qid && el.dataset.choice === choice && el.dataset.index === index);
  }
  if (next && !next.disabled) {
    next.focus({preventScroll: true});
    if (typeof cursor === 'number' && next.setSelectionRange) try { next.setSelectionRange(cursor, cursor); } catch {}
  } else if (wasInside) main.focus({preventScroll: true});
}
function focusQuestion() {
  const prompt = main.querySelector('.question-prompt');
  prompt?.focus({preventScroll: true});
  prompt?.scrollIntoView({block: 'center'});
}
function recordExamResults() {
  for(const id of state.exam.ids) state.attempts[id]={selected:[...(state.exam.selections[id]||[])],checked:true};
}
main.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]'); if(!button || button.disabled)return;
  const action=button.dataset.action, q=byId.get(button.dataset.q);
  if(action==='jump-question') {focusQuestion();return;}
  if(action==='save') {
    state.saved=state.saved.includes(q.id)?state.saved.filter(id=>id!==q.id):[...state.saved,q.id];persist();render();return;
  }
  if(action==='choose') {
    const selection=toggleAnswer(picks(q),Number(button.dataset.choice),q.selectionCount);
    if(current==='exam') {state.exam.selections[q.id]=selection;if(state.exam.finished)recordExamResults();}
    else state.attempts[q.id]={...state.attempts[q.id],selected:selection,hidden:false};
    persist();render();
    if(filters.missed && current !== 'exam' && state.attempts[q.id]?.checked && sameAnswers(selection,q.answers)) toast('Correct. This question has left your missed-only selection.');
    return;
  }
  if(action==='check') {state.attempts[q.id]={...state.attempts[q.id],checked:true,hidden:false};persist();render();return;}
  if(action==='reveal') {
    const visible=feedbackVisible(q);
    if(showAll)showAll=false;
    state.attempts[q.id]={...state.attempts[q.id],hidden:visible,revealed:!visible};persist();render();return;
  }
  if(action==='next'||action==='shuffle') {
    const pool=filtered();if(!pool.length)return;
    practiceId=action==='shuffle'?shuffle(pool.filter(q=>q.id!==practiceId))[0]?.id || pool[0].id:pool[(pool.findIndex(q=>q.id===practiceId)+1)%pool.length].id;
    render();focusQuestion();return;
  }
  if(action==='expand'){expandedId=expandedId===q.id?undefined:q.id;render();return;}
  if(action==='layout-list'||action==='layout-cards'){state.bankLayout=action==='layout-list'?'list':'cards';persist();render();return;}
  if(action==='toggle-all'){showAll=!showAll;if(showAll)state.bankLayout='cards';persist();render();return;}
  if(action==='clear-filters'){filters={source:'all',topic:'all',query:'',missed:false};render();return;}
  if(action==='start-exam') {
    if(state.exam && !state.exam.finished && !confirm('Start a new mock? This will replace your unfinished mock.'))return;
    state.exam={ids:shuffle(questions).slice(0,25).map(q=>q.id),selections:{},index:0,finished:false,startedAt:new Date().toISOString()};
    persist();if(location.hash==='#exam')route();else location.hash='exam';window.scrollTo({top:0});return;
  }
  if(action==='finish-exam') {
    const list=state.exam.ids.map(id=>byId.get(id));
    const incomplete=list.filter(q=>(state.exam.selections[q.id]||[]).length!==q.selectionCount).length;
    if(incomplete && !confirm(`${incomplete} questions have incomplete selections. Finish and score anyway?`))return;
    state.exam.finished=true;state.exam.originalScore=examScore(list,state.exam.selections);recordExamResults();persist();render();window.scrollTo({top:0,behavior:'smooth'});return;
  }
  if(action==='exam-prev'||action==='exam-next'||action==='exam-jump') {
    state.exam.index=action==='exam-jump'?Number(button.dataset.index):state.exam.index+(action==='exam-next'?1:-1);persist();render();focusQuestion();return;
  }
  if(action==='reset') {
    if(confirm('Reset your saved questions, answers and mock on this device?')){state={attempts:{},saved:[],exam:null};persist();toast('Your local progress has been reset.');render();}return;
  }
});
main.addEventListener('input',event=>{if(event.target.id==='search'){filters.query=event.target.value;render();}});
main.addEventListener('change',event=>{
  if(event.target.id==='source'||event.target.id==='topic')filters[event.target.id]=event.target.value;
  else if(event.target.id==='missed')filters.missed=event.target.checked;
  else return;
  render();
});
// Custom radio buttons support the usual arrow-key navigation, including answer changes.
main.addEventListener('keydown',event=>{
  const button=event.target.closest('[role="radio"][data-choice]');
  if(!button||!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const q=byId.get(button.dataset.q);
  const direction=['ArrowDown','ArrowRight'].includes(event.key)?1:-1;
  const next=event.key==='Home'?0:event.key==='End'?q.choices.length-1:(Number(button.dataset.choice)+direction+q.choices.length)%q.choices.length;
  main.querySelector(`[data-q="${q.id}"][data-choice="${next}"]`)?.click();
  main.querySelector(`[data-q="${q.id}"][data-choice="${next}"]`)?.focus({preventScroll:true});
});
document.querySelector('.skip').addEventListener('click', event => {event.preventDefault(); main.focus(); main.scrollIntoView({block:'start'});});
window.addEventListener('hashchange',()=>{route();main.focus({preventScroll:true});window.scrollTo({top:0});});
try {
  const response=await fetch('./data/question-bank.json');if(!response.ok)throw Error(`HTTP ${response.status}`);
  bank=await response.json();questions=bank.questions;byId=new Map(questions.map(q=>[q.id,q]));
  state.saved=state.saved.filter(id=>byId.has(id));
  if(state.exam && (!Array.isArray(state.exam.ids)||state.exam.ids.some(id=>!byId.has(id))||!state.exam.selections||state.exam.index<0||state.exam.index>=state.exam.ids.length))state.exam=null;
  document.querySelector('#nav-count').textContent=questions.length;
  route();
} catch(error) {
  main.innerHTML='<h1>The bank couldn’t load.</h1><p>Please reload the page. If you opened this file directly, use the published GitHub Pages site or a local HTTP server.</p>';
  console.error('Question bank load failed',error);
}
