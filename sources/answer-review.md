# Past-paper answer review

Reviewed on 2026-11-17 for [issue #1](https://github.com/lalob1/wireless-final-prep/issues/1). Missing-source work remains tracked in [issue #2](https://github.com/lalob1/wireless-final-prep/issues/2). Baseline: commit `a7707a64a137f49a9008e13c329cbf9cbc123768`.

The review covers all 48 existing past-paper entries: 25 from Variant 1 and 23 from Variant 2. The prepared keys remain unchanged. Explanations now teach the underlying principle, calculation or main distractor trap, with technical evidence separate from exam provenance. The four broad fading/interference items retain `needsReview: true`.

**Original-photo transcription fidelity is unverified.** The public transcript and question bank can be compared with each other, but their agreement cannot establish that OCR captured the paper correctly. Technical standards and vendor documentation support the worked reasoning; they are not an official examination marking scheme.

## Method and scope

1. Read `ALINA_AGENT_PROMPT.md`, `CONTRIBUTING.md`, the existing transcript, question bank and OCR manifest. Retain the source labels, original numbering and stable IDs.
2. Review every prompt, all four choices, the stated ONE/TWO-answer requirement, zero-based answer indexes, units and numerical values. Judge answers against the available choices while documenting overly broad wording.
3. Independently recompute every numerical past-paper answer from the stated quantities. Use decimal MB/GB where specified; distinguish bits from bytes, power from energy and radius from area.
4. Consult the primary standards and official documentation catalogued below. Source sections are identified so a reviewer can check the inference without relying on this report.
5. Preserve all original prompts and choices. Do not infer an official key from handwritten selections. Do not insert absent questions from memory or from unrelated practice material.

No photo/OCR wording correction is claimed in this contribution. The eleven arithmetic problems are classified as `Worked calculation`; the other 37 are `Worked answer`. None of the 48 is `Source feedback`. Assignment 4's 67 practice items and the seven last-practice calculations remain outside this past-paper ownership boundary.

## All 48 keys and selection counts

Letters correspond to the original displayed choices. Indexes are zero-based. “Count” is the number of choices required, not the number of concepts named inside a choice. Every row retains its baseline key. A dagger marks an unresolved wording ambiguity discussed below.

| ID | Key | Indexes | Count | Review conclusion / evidence |
| --- | --- | --- | ---: | --- |
| `m1-01` | B | `[1]` | 1 | Radio provides wireless information transfer; the answer says “can,” not “only.” [R4] |
| `m1-02` | C | `[2]` | 1 | One byte contains eight bits. [R1] |
| `m1-03` | C | `[2]` | 1 | Seven OSI layers; do not substitute a TCP/IP layer count. [R3] |
| `m1-04` | B | `[1]` | 1 | Physical-layer signaling transmits bits over a medium. [R3] |
| `m1-05` | C | `[2]` | 1 | Network-layer addressing and routing; IP is the relevant example. [R3], [R5] |
| `m1-06` | B | `[1]` | 1 | IEEE 802.11 supplies the WLAN MAC/PHY standards. [R4] |
| `m1-07` | B | `[1]` | 1 | 1G's principal service was analog voice. [R6] |
| `m1-08` | C | `[2]` | 1 | The UMTS radio node is Node B. [R7] |
| `m1-09` | B | `[1]` | 1 | Frequency locates a carrier in spectrum; time slots are a different resource dimension. [R8] |
| `m1-10` | A | `[0]` | 1 | Closest option; terminology remains broad. † [R9] |
| `m1-11` | B | `[1]` | 1 | Unwanted radio activity can impair reception or medium access; no connection to storage units. [R10] |
| `m1-12` | A | `[0]` | 1 | The BSC controls a group of base stations and associated radio parameters. [R11] |
| `m1-13` | A | `[0]` | 1 | Node B and RNC are already paired in one option; select one option. [R7] |
| `m1-14` | A,C | `[0,2]` | 2 | Circuit-switched 2G voice versus packet-based LTE; 2G can also carry packet data through GPRS. [R12] |
| `m1-15` | C | `[2]` | 1 | `24 MB / 3 s = 8 MB/s` (64 Mbps). [R1] |
| `m1-16` | B | `[1]` | 1 | `100 MB / (20 MB/s) = 5 s`. |
| `m1-17` | C | `[2]` | 1 | `1000 MB × 8 / (100 Mb/s) = 80 s`, ignoring overhead. [R1] |
| `m1-18` | D | `[3]` | 1 | `(50/5)² = 100`; use area, not the radius ratio. |
| `m1-19` | C | `[2]` | 1 | `(18−6) W × 1.5 h/day × 7 days = 126 Wh`. |
| `m1-20` | B | `[1]` | 1 | `$60,000/30 = $2,000`; `$120,000/150 = $800` per user, treating both costs as annual. |
| `m1-21` | C | `[2]` | 1 | Data → segment → packet → frame → bits, the conventional TCP encapsulation example. [R13] |
| `m1-22` | B,D | `[1,3]` | 2 | Obstruction can weaken reception; active users share finite radio resources. [R9], [R10] |
| `m1-23` | B | `[1]` | 1 | Discovery, initial 802.11 authentication, association, then data; protected networks add security steps. [R14] |
| `m1-24` | A,C | `[0,2]` | 2 | The WPA2 handshake derives/confirms keys and security state; it does not broadcast the passphrase. [R14] |
| `m1-25` | B,C | `[1,2]` | 2 | Expected choices, but propagation and resource sharing need more precise names. † [R9], [R10] |
| `m2-01` | A | `[0]` | 1 | A mobile-phone call uses a mobile communications service. [R11] |
| `m2-02` | C | `[2]` | 1 | `10⁻³ s / 10⁻⁶ s = 1000`; one millisecond is 1000 microseconds. [R2] |
| `m2-03` | B | `[1]` | 1 | TCP and UDP are transport-layer protocols; reliability differs between them. [R5] |
| `m2-04` | A | `[0]` | 1 | Presentation handles representation/compression and can support encipherment; encryption is not exclusive to this layer. [R3], [R15] |
| `m2-05` | B | `[1]` | 1 | Wi-Fi is wireless LAN technology. [R4] |
| `m2-06` | C | `[2]` | 1 | Pre-cellular mobile radio preceded cellular networks; the other choices name later cellular generations. [R16] |
| `m2-07` | A | `[0]` | 1 | 2G introduced digital cellular communication rather than a return to analog. [R6] |
| `m2-08` | A | `[0]` | 1 | Universal Mobile Telecommunications System. [R7] |
| `m2-09` | A | `[0]` | 1 | TDMA separates access in time slots. [R8] |
| `m2-10` | A | `[0]` | 1 | FDMA separates access by frequency channels. [R8] |
| `m2-11` | A | `[0]` | 1 | The RNC controls radio resources and its Node Bs. [R7] |
| `m2-12` | A | `[0]` | 1 | A base station provides radio transmission/reception between terminals and the network. [R7], [R11] |
| `m2-13` | B | `[1]` | 1 | `50 MB / 5 s = 10 MB/s`. |
| `m2-14` | C | `[2]` | 1 | `80 Mb/s / 8 = 10 MB/s`. [R1] |
| `m2-15` | C | `[2]` | 1 | `400 MB × 8 / (80 Mb/s) = 40 s`, ignoring overhead. [R1] |
| `m2-18` | C | `[2]` | 1 | `(20/5)² = 16`, under the comparable-shape area model. |
| `m2-19` | C | `[2]` | 1 | `(12−4) W × 2 h = 16 Wh`. |
| `m2-20` | A,B | `[0,1]` | 2 | GSM is associated with 2G and LTE with 4G; analog-only and HD-streaming claims are distractors. [R6], [R12] |
| `m2-21` | A | `[0]` | 1 | The sender adds encapsulation as data moves down the stack. [R13] |
| `m2-22` | B | `[1]` | 1 | Best supplied term; shadowing is the more precise explanation. † [R9] |
| `m2-23` | A | `[0]` | 1 | Expected term; airtime contention is directly relevant and destructive interference is not proved. † [R10] |
| `m2-24` | A,B | `[0,1]` | 2 | LTE/EPS supports higher-rate packet-based IP services. [R12] |
| `m2-25` | A,C | `[0,2]` | 2 | Packet traffic shares network resources; a permanent dedicated circuit is not required for every flow. [R12], [R13] |

There are 41 single-answer and seven two-answer questions. The two-answer IDs are `m1-14`, `m1-22`, `m1-24`, `m1-25`, `m2-20`, `m2-24` and `m2-25`. An answer is correct only when its selected set exactly matches the keyed set.

The calculations assume the quantities in the prompt, not measured device performance. The download problems omit protocol overhead and rate variation. Cell-count estimates compare areas of similarly shaped cells, not an exact radio deployment. Power figures are givens in the exercise, not general measurements of all 1G/2G phones. The arithmetic supports the prepared options, not the fidelity of the original transcription.

## Four wording ambiguities

### `m1-10`: “What is fading?”

Source: `photo_4_2026-11-17_17-17-10.jpg`, Variant 1 question 10. Keep A, index `[0]`.

The option combines distance and obstacles. 3GPP separately models mean path loss, shadow fading and fast fading. Shadowing is legitimately called shadow fading; distance loss alone is not a complete definition of fading. A remains the closest supplied answer. [R9, §§7.4.1, 7.4.4, 7.5][R9]

### `m1-25`: distance, a building and many users

Source: `photo_1_2026-11-17_17-17-10.jpg`, Variant 1 question 25. Keep B,C, indexes `[1,2]`.

The first two conditions suggest path loss and shadowing. The user count suggests resource sharing. B and C are the only plausible choices, but the scenario does not establish multipath fading or harmful simultaneous transmissions. Preserve the wording and explain this limit. [R9], [R10]

### `m2-22`: a weaker signal behind concrete

Source: `photo_5_2026-11-17_17-17-10.jpg`, Variant 2 question 22. Keep B, index `[1]`.

Obstruction/shadowing is the precise mechanism suggested. Shadow fading is consistent with the broad answer “fading”; sudden weakening alone does not prove a particular small-scale fading model. [R9, §§7.4.1, 7.4.4][R9]

### `m2-23`: twenty devices sharing one Wi-Fi channel

Source: `photo_5_2026-11-17_17-17-10.jpg`, Variant 2 question 23. Keep A, index `[0]`.

Active stations compete for airtime and can defer transmission. Cisco uses “co-channel interference” broadly enough to include excessive CSMA deferrals as well as collisions. Thus A is defensible in that operational vocabulary, but the prompt does not prove destructive radio interference. More devices do not imply every transmission collides. [R10, “Co-Channel Interference”][R10]

These findings explain the likely classroom choices; they do not resolve instructor terminology. Keep all four review flags until source clarification is available. Compression and encapsulation are data-processing concepts rather than propagation diagnoses; the unrelated distractors do not remove the wording problem.

## Primary technical evidence

Links and relevant sections were inspected on 2026-11-17 unless a retrieval limit is stated. Versioned historical documents are used for stable protocol concepts, not as claims about current deployment prevalence.

| Ref | Primary source and inspected location | What it supports |
| --- | --- | --- |
| R1 | [NIST, Prefixes for binary multiples][R1], “Examples and comparisons with SI prefixes” | Eight bits per byte; distinction between decimal and binary prefixes. |
| R2 | [NIST SP 811, chapter 4][R2], §4.3, Table 5 | Milli = 10⁻³, micro = 10⁻⁶; SI prefixes denote powers of ten. |
| R3 | [ITU-T X.200 (07/1994)][R3], §6.1.2; §§7.2.2/7.2.4; §§7.5 and 7.7.2 | Seven OSI layers; representation/compression; network and physical-layer responsibilities. The English PDF was opened from the official landing page. |
| R4 | [IEEE 802.11 Working Group][R4] and [IEEE's 802.11 standard description][R4b] | IEEE's WLAN standards role, wireless connectivity and MAC/PHY scope. |
| R5 | [Cisco, Industrial Ethernet: A Control Engineer's Guide][R5], printed page 3 | IP addressing/routing at Layer 3 and TCP/UDP at Layer 4. Do not generalize reliable delivery to UDP. |
| R6 | [ITU, Assignment and use of radio spectrum (2016)][R6], Figure 6, printed page 34 | Historical analog 1G versus digital 2G and the progression of mobile services. Figure text was available in indexed extraction; the PDF opened, but screenshot retrieval failed. |
| R7 | [3GPP TS 25.401 v18.0.0 / ETSI TS 125 401][R7], §3.1 and §6 | Node B's radio role, RNC radio-resource control and UTRAN architecture. |
| R8 | [3GPP TS 45.002 v17.0.0 / ETSI TS 145 002][R8], §§4.1–4.3 | Radio resources divided in frequency channels and time slots. |
| R9 | [3GPP TR 38.901 v19.3.0 / ETSI TR 138 901][R9], §§7.4.1, 7.4.4 and 7.5 | Separate path-loss, shadow-fading and fast-fading treatments. |
| R10 | [Cisco Wireless Mesh Access Points, Design and Deployment Guide 7.3][R10], “Co-Channel Interference” | The vendor's broad operational term includes collisions and excessive CSMA deferrals. |
| R11 | [ETSI TR 100 053 v1.3.1][R11], §§5.3.1 and 5.3.3.1 | BTS radio transmission/reception, BSC control and GSM configuration. |
| R12 | [IETF RFC 6459][R12], §§2.1, 3.1 and 4.1 | GSM/GPRS evolution and the packet-optimized LTE/EPS architecture. This is an Informational RFC, not an exam key. |
| R13 | [Cisco networking seminar material][R13], “Layers with TCP/IP and OSI Model,” “Transforming Human Network Communications to Bits” | Conventional encapsulation sequence and the distinction between model and protocol implementation. |
| R14 | [Cisco WLAN and Fast-Secure Roaming technical note][R14], “Background Information,” “Roaming with Higher-Level Security,” “WPA/WPA2-PSK” | Initial authentication/association order and PMK/PTK/GTK key-management concepts. Initial 802.11 authentication is distinct from later enterprise EAP authentication. |
| R15 | [ITU-T X.800 (03/1991)][R15], §§7.6.1–7.6.2 | Presentation-layer confidentiality support and encipherment. Its security architecture also discusses mechanisms at other layers. The English PDF was opened. |
| R16 | [Ericsson and Centre for Business History, First networks][R16], paragraphs on MTS and IMTS | Official industry history of mobile telephone services introduced in 1946 and 1964, before cellular generations. This historical account is not a protocol standard. |

The IEEE-authored [802.11 CSMA/CA tutorial](https://www.ieee802.org/11/Documents/DocumentArchives/1996_docs/1196049C_scan.pdf) was also located. Its indexed text explains deferral and random backoff, but direct PDF retrieval timed out, so the successful Cisco retrieval is the principal evidence used for the contention discussion.

## Original-source availability and unresolved coverage

The repository contains the transcription and manifest, not the original student-header photos. The manifest records earlier PaddleOCR-VL-1.6 processing of 19 images; that inherited processing record is not a fresh visual audit. A filename search under the available `Documents/Codex` workspace found no originals matching the manifest's photo naming pattern and no endterm-named files. This is a bounded search, not a claim about every local folder or cloud account. The user was asked once for the originals' location; no replacement source is assumed.

The exact missing image filenames for this fidelity audit are:

```text
photo_1_2026-11-17_17-17-10.jpg
photo_2_2026-11-17_17-17-10.jpg
photo_3_2026-11-17_17-17-10.jpg
photo_4_2026-11-17_17-17-10.jpg
photo_5_2026-11-17_17-17-10.jpg
photo_6_2026-11-17_17-17-10.jpg
photo_7_2026-11-17_17-17-10.jpg
photo_8_2026-11-17_17-17-10.jpg
photo_9_2026-11-17_17-17-10.jpg
photo_10_2026-11-17_17-17-10.jpg
photo_11_2026-11-17_17-17-10.jpg
photo_12_2026-11-17_17-17-10.jpg
photo_13_2026-11-17_17-17-10.jpg
photo_14_2026-11-17_17-17-10.jpg
photo_15_2026-11-17_17-17-10.jpg
photo_16_2026-11-17_17-17-10.jpg
photo_17_2026-11-17_17-17-10.jpg
photo_18_2026-11-17_17-17-10.jpg
photo_19_2026-11-17_17-17-10.jpg
```

- Variant 2 questions **16 and 17** remain absent. Their wording, choices, selection instructions and answers are unknown; `m2-16` and `m2-17` are not created.
- No separate **endterm-labeled paper or question set** is available for this review. No final-exam completeness claim is made.
- No **official past-paper marking scheme** is supplied. Prepared solutions remain labeled as worked answers/calculations.
- No new image was submitted, so no new OCR run or claimed OCR correction is part of this review. The complete bank remains **122 practice items** with the same IDs.

The validation script checks integrity and agreement between public representations, including the exact reviewed key sets. Its success cannot establish photo fidelity or official answer correctness. Browser testing and UI screenshots are documented separately with the pull request.

[R1]: https://physics.nist.gov/cuu/Units/binary.html
[R2]: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes
[R3]: https://www.itu.int/rec/T-REC-X.200-199407-I/en
[R4]: https://www.ieee802.org/11/index.shtml
[R4b]: https://standards.ieee.org/ieee/802.11/11852/
[R5]: https://www.cisco.com/c/dam/en/us/products/collateral/switches/catalyst-2950-series-switches/prod_white_paper0900aecd8013313e.pdf
[R6]: https://www.itu.int/dms_pub/itu-d/opb/pref/D-PREF-EF.RAD_SPEC_GUIDE-2016-PDF-E.pdf
[R7]: https://www.etsi.org/deliver/etsi_ts/125400_125499/125401/18.00.00_60/ts_125401v180000p.pdf
[R8]: https://www.etsi.org/deliver/etsi_ts/145000_145099/145002/17.00.00_60/ts_145002v170000p.pdf
[R9]: https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/19.03.00_60/tr_138901v190300p.pdf
[R10]: https://www.cisco.com/c/en/us/td/docs/wireless/technology/mesh/7-3/design/guide/Mesh/Mesh_chapter_0100.html
[R11]: https://www.etsi.org/deliver/etsi_tr/100001_100099/100053/01.03.01_60/tr_100053v010301p.pdf
[R12]: https://www.rfc-editor.org/rfc/rfc6459.html
[R13]: https://www.cisco.com/web/TH/assets/docs/seminar/20080401_handout1.pdf
[R14]: https://www.cisco.com/c/en/us/support/docs/wireless-mobility/wireless-lan-wlan/116493-technote-technology-00.html
[R15]: https://www.itu.int/rec/T-REC-X.800-199103-I/en
[R16]: https://www.ericsson.com/en/about-us/history/changing-the-world/small-steps-great-advances/first-networks
