import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sameAnswers,toggleAnswer,shuffle,examScore} from '../model.js';
import {validatePastPaperReview} from './review-check.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/question-bank.json'),'utf8'));
const ids=new Set();
for(const q of bank.questions){
 assert(!ids.has(q.id),`Duplicate ID ${q.id}`);ids.add(q.id);
 assert(q.prompt?.trim() && q.source && q.sourceFile && q.explanation,`Missing content ${q.id}`);
 assert(q.choices.length>=2 && new Set(q.choices).size===q.choices.length,`Invalid choices ${q.id}`);
 assert(q.answers.length===q.selectionCount && new Set(q.answers).size===q.answers.length,`Invalid key ${q.id}`);
 assert(q.answers.every(i=>Number.isInteger(i)&&i>=0&&i<q.choices.length),`Out of range key ${q.id}`);
 assert(['Source feedback','Worked answer','Worked calculation'].includes(q.answerStatus),`Unknown answer provenance ${q.id}`);
 assert(!/\uFFFD|Student name:|Score: ___/.test(JSON.stringify(q)),`Unclean extraction ${q.id}`);
}
assert.equal(bank.questions.length,bank.coverage.practiceItems);
assert.equal(bank.questions.filter(q=>q.source==='Midterm Variant 1').length,25);
assert.equal(bank.questions.filter(q=>q.source==='Midterm Variant 2').length,23);
assert.equal(bank.questions.filter(q=>q.source==='Assignment 4').length,67);
assert.equal(bank.questions.filter(q=>q.source==='Last practice').length,7);
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'sources/ocr-manifest.json'))).length,19);
validatePastPaperReview(bank,root);
// Regression: an incorrect single answer can be replaced after grading.
let answer=toggleAnswer([],0,1);assert(!sameAnswers(answer,[1]));
answer=toggleAnswer(answer,1,1);assert(sameAnswers(answer,[1]));
// Multi-select requires the exact set, in any order; extra choices fail.
assert(sameAnswers([2,0],[0,2]));assert(!sameAnswers([0],[0,2]));assert(!sameAnswers([0,1,2],[0,2]));
assert(!sameAnswers([0,0],[0,2]));
assert.deepEqual(toggleAnswer([0,2],0,2),[2]);
let multi=toggleAnswer([0,1],1,2);multi=toggleAnswer(multi,2,2);assert(sameAnswers(multi,[0,2]));
// Every mock contains 25 unique source items.
const mock=shuffle(bank.questions).slice(0,25);assert.equal(new Set(mock.map(q=>q.id)).size,25);
const selections=Object.fromEntries(mock.map(q=>[q.id,[...q.answers]]));
assert.equal(examScore(mock,selections),25);
selections[mock[0].id]=[];assert.equal(examScore(mock,selections),24);
selections[mock[0].id]=mock[0].answers;assert.equal(examScore(mock,selections),25);
// Independently calculate the last-practice numerical results.
assert.equal(2*4000*Math.log2(16),32000);
assert(Math.abs(3000*Math.log2(101)-19974.634448)<0.001);
assert(Math.abs(5e6*Math.log2(11)-17297158.093)<0.01);
assert(Math.abs(20*Math.log10(4*Math.PI*20/0.125)-66.066596)<0.0001);
// Public deliverables must contain neither credentials nor personal exam headers.
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(entry.name==='.git')continue;
 const p=path.join(dir,entry.name);if(entry.isDirectory())scan(p);else {
 // Screenshot bytes are not UTF-8 source; retain scanning for other files,
 // including extensionless files or accidentally added local configuration.
 if(/\.(?:jpg|jpeg|png|webp|gif|ico)$/i.test(p))continue;
 const text=fs.readFileSync(p,'utf8');
 assert(!/gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|[a-zA-Z_]*(?:ACCESS_TOKEN|API_KEY)\s*[=:]\s*["']?[a-f0-9]{40}/.test(text),`Credential in ${p}`);
 }
}}
scan(root);
console.log(`Validated ${bank.questions.length} items, 48 transcript mappings and reviewed keys, evidence metadata, 19 OCR inputs, model answer editing, exact-set grading, 25-question mock scoring and 11 past-paper calculations. Photo fidelity and technical correctness require source review; UI behavior requires browser testing.`);
