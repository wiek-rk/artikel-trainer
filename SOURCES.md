# Learning notes

The tables follow the supplied B2 grammar materials.

## Editorial decisions

- Kein Genitiv is extended from the documented ein pattern; welcher Genitiv from the der-word pattern. These two extensions are identified in the in-app source notes.
- The source calls possessive determiners “Possessive Pronomen”. The app uses “Possessivartikel” because these forms accompany a noun. It does not teach independent possessive pronouns here.
- There is no plural indefinite article. Null cells are displayed as a dash and excluded from scoring and review. Mixed adjective plural forms are for keine/meine/etc., not ein.
- The personal-pronoun chart has three cases; the reflexive chart has two. Neither receives an artificial Genitiv row.
- Formal Ihr and Sie/Ihnen are case-sensitive. Lowercase ihr/ihnen remains distinct. Reflexive sich stays lowercase even for formal Sie.
- Euer uses the source's contracted eur- forms before endings. Other variants are outside this first exercise set.
- Adjective exercises ask for the ending, not a whole word. Leading hyphens are optional.
- The strong adjective Genitiv masculine/neuter ending is -en.
- Source prose contains simplified explanations. This feature uses the verified forms and original, narrowly scoped notes; it does not copy general rules about fixed word positions, counting vowels for noun Genitiv endings, or all adjectives without following nouns being uninflected.
- No preposition or sentence-transformation module is included yet. Those are later stages after table practice.

## Progress

Only the first checked attempt is recorded for each exercise cell. Showing Study earns no credit. Wrong answers enter Review; two subsequent correct attempts clear the cell. Review spans tables and follows the Genitiv filter. Progress uses the separate localStorage key `artikel-tables-v1` and can be exported as JSON. Storage failure leaves practice usable and displays a temporary-progress notice. Article rounds remain in memory as before.

## Shared possessives

One ending grid covers all seven stems. Rebuild tests endings (a dash means zero ending); Recall tests full words with a supplied stem. Existing per-stem records and mistakes keep their IDs and remain available in Review. Old possessive selections open the shared table. Endings and word-form progress are counted separately within that one section.

## Expression practice

The first Nomen–Verb set contains 40 patterns selected from Nomen Verb Verbindungen B2.pdf, pages 1–3. The verb-preposition set contains 44 patterns selected from the supplied fixed-preposition chart, pages 1–5 and 7–11. Meanings and example sentences are written for this app. Study includes all selected patterns; practice rounds contain up to 12.

Editorial decisions: the missing reflexive pronoun in sich Mühe geben is restored. The prompt meaning distinguishes keeping/breaking a promise, starting/practising a profession, anticipation with sich freuen auf and satisfaction with sich freuen über. Conversation-partner and topic meanings are separated. Sprechen von + Dativ is also accepted for the topic prompt; it is not treated as Akkusativ. Selected noun–verb synonyms are accepted without requiring the chart's exact wording. Infinitives are requested explicitly, so conjugated forms are not scored as infinitives.

The source's inconsistent schimpfen mit + Akkusativ and schützen vor + Akkusativ rows are not included; the first set does not reproduce those entries. It also omits als constructions, which need a different treatment. Fixed verb-preposition combinations are taught as units, not by the spatial location/destination rule. Standalone preposition-case and verb-case sections remain future work.
