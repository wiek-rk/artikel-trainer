# Table content and learning scope

Checked on 12 September 2026 against the user's local B2 / 3. Charts for the Classes folder. PDFs and dictionary records are not included in this feature. The app records grammar forms as structured data; instructions are newly written.

| Source | Pages used | Tables |
| --- | --- | --- |
| Articles, Pronouns and Prepositions .pdf | 1 | Definite, indefinite, dieser, welcher: Nominativ, Akkusativ, Dativ |
| Same document | 2 | Kein; personal pronouns |
| Same document | 3–4 | Mein, dein, sein, ihr, Ihr, unser, euer |
| Genitiv Euro Bhasha copy.pdf | 1 | Genitiv for definite, indefinite, dieser and possessives |
| Adjektive Endungen Euro Bhasha.pdf | 1 | Weak, mixed and strong endings, all four cases |
| Reflexive Verben Euro Bhasha B1_B2.pdf | 4 | Reflexive pronouns, Akkusativ and Dativ |
| sich mit Dativ.pdf | 1–2 | Reflexive table cross-check and distinction between mich / mir |

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

## Existing article deck

The base repository's index.html already embeds a noun deck and labels it a private dict.cc-derived edition, while its README describes a starter/import model. This discrepancy predates this change. The Tables feature does not add dictionary data or publish the branch to GitHub Pages. Review the existing deck's distribution status separately before any public deployment.
