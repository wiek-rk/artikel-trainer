(function(host){
  'use strict';
  // Patterns selected from the supplied B2 charts. Meanings and examples written for this app.
  const nvvRows = [
    ['dream','einen Traum','verwirklichen','make a dream come true','Mit der Reise möchte ich einen alten Traum verwirklichen.'],
    ['contract','einen Vertrag','abschließen','conclude a contract','Wir möchten einen Vertrag mit der Firma abschließen.'],
    ['hope','die Hoffnung','aufgeben','give up hope','Du solltest die Hoffnung nicht aufgeben.'],
    ['contact','Kontakt','aufnehmen','make contact','Ich werde morgen Kontakt mit dem Büro aufnehmen.'],
    ['profession','einen Beruf','ausüben','practise a profession','Sie möchte ihren Beruf auch im Ausland ausüben.'],
    ['mistake','einen Fehler','begehen/machen','make a mistake','Auch erfahrene Menschen können einen Fehler begehen.'],
    ['basis','die Grundlage','bilden','form the basis','Klare Regeln bilden die Grundlage unserer Zusammenarbeit.'],
    ['break-promise','ein Versprechen','brechen','break a promise','Ich möchte mein Versprechen nicht brechen.'],
    ['study','eine Studie','durchführen','conduct a study','Das Team möchte eine Studie zum Lernen durchführen.'],
    ['keep-promise','ein Versprechen','einhalten/halten','keep a promise','Du solltest dein Versprechen einhalten.'],
    ['wish','einen Wunsch','erfüllen','fulfil a wish','Damit kann ich meiner Schwester einen Wunsch erfüllen.'],
    ['career','einen Beruf','ergreifen','enter a profession','Nach der Schule möchte er einen technischen Beruf ergreifen.'],
    ['goal','ein Ziel','erreichen','achieve a goal','Gemeinsam können wir dieses Ziel erreichen.'],
    ['solution','eine Lösung','finden','find a solution','Wir müssen bis Freitag eine Lösung finden.'],
    ['conversation','ein Gespräch','führen','have a conversation','Ich möchte ein ruhiges Gespräch mit dir führen.'],
    ['answer','eine Antwort','geben','give an answer','Kannst du mir heute eine Antwort geben?'],
    ['notify','Bescheid','geben/sagen','let someone know','Bitte gib mir Bescheid, wenn du angekommen bist.'],
    ['effort','sich Mühe','geben','make an effort','Beim Sprechen möchte ich mir mehr Mühe geben.'],
    ['advice','einen Rat','geben','give someone advice','Kannst du mir einen Rat geben?'],
    ['come-true','in Erfüllung','gehen','come true (a wish)','Endlich ist mein Wunsch in Erfüllung gegangen.'],
    ['nerves','jemandem auf die Nerven','gehen','get on someone’s nerves','Der ständige Lärm geht mir auf die Nerven.'],
    ['avoid','jemandem aus dem Weg','gehen','avoid someone','Nach dem Streit möchte er ihr aus dem Weg gehen.'],
    ['trouble','in Schwierigkeiten','geraten/kommen','get into difficulties','Ohne Unterstützung könnte die Firma in Schwierigkeiten geraten.'],
    ['talk','einen Vortrag','halten','give a presentation','Morgen werde ich einen Vortrag über Musik halten.'],
    ['result','zu einem Ergebnis','kommen/gelangen','arrive at a result','Wir müssen heute zu einem Ergebnis kommen.'],
    ['network','Kontakte','knüpfen','establish contacts','Im neuen Verein kann ich Kontakte knüpfen.'],
    ['peace','zur Ruhe','kommen','settle down and relax','Nach der Arbeit möchte ich zur Ruhe kommen.'],
    ['leave-alone','jemanden in Ruhe','lassen','leave someone alone','Bitte lass mich kurz in Ruhe.'],
    ['value','Wert auf etwas','legen','attach importance to something','Wir legen Wert auf klare Kommunikation.'],
    ['impression','einen guten Eindruck','machen/hinterlassen','make a good impression','Mit ihrer Bewerbung hat sie einen guten Eindruck gemacht.'],
    ['suggestion','einen Vorschlag','machen/unterbreiten','make a suggestion','Darf ich einen Vorschlag machen?'],
    ['goodbye','Abschied','nehmen','say farewell','Am Bahnhof mussten wir Abschied nehmen.'],
    ['consideration','Rücksicht','nehmen','show consideration','Bitte nimm Rücksicht auf die anderen Gäste.'],
    ['experience','Erfahrungen','sammeln','gain experience','Im Praktikum möchte ich Erfahrungen sammeln.'],
    ['role','eine Rolle','spielen','play a role','Der Preis spielt bei meiner Entscheidung eine Rolle.'],
    ['application','einen Antrag','stellen','submit an application','Sie möchte einen Antrag auf Unterstützung stellen.'],
    ['question','eine Frage','stellen','ask a question','Darf ich eine Frage stellen?'],
    ['decision','eine Entscheidung','treffen/fällen','make a decision','Wir müssen bald eine Entscheidung treffen.'],
    ['sport','Sport','treiben/machen','do sport','Am Wochenende möchte ich mehr Sport treiben.'],
    ['time','Zeit','verbringen','spend time','Ich möchte mehr Zeit mit meiner Familie verbringen.']
  ];
  const prepRows = [
    ['denken-an','denken','an','Akkusativ','think of someone or something','Ich denke oft an meinen Bruder.'],
    ['erinnern-an','sich erinnern','an','Akkusativ','remember an earlier experience','Ich erinnere mich an den ersten Schultag.'],
    ['glauben-an','glauben','an','Akkusativ','believe in someone’s ability','Ich glaube an dich.'],
    ['achten-auf','achten','auf','Akkusativ','pay attention to something','Bitte achte auf den Verkehr.'],
    ['antworten-auf','antworten','auf','Akkusativ','reply to a question','Ich antworte auf deine Frage.'],
    ['freuen-auf','sich freuen','auf','Akkusativ','look forward to an event that has not happened yet','Ich freue mich auf den Urlaub nächste Woche.'],
    ['freuen-ueber','sich freuen','über','Akkusativ','be pleased about a gift already received','Ich freue mich über dein Geschenk.'],
    ['hoffen-auf','hoffen','auf','Akkusativ','hope for a positive result','Wir hoffen auf eine schnelle Antwort.'],
    ['konzentrieren-auf','sich konzentrieren','auf','Akkusativ','concentrate on a task','Ich konzentriere mich auf die Aufgabe.'],
    ['vorbereiten-auf','sich vorbereiten','auf','Akkusativ','prepare for a coming exam','Ich bereite mich auf die Prüfung vor.'],
    ['warten-auf','warten','auf','Akkusativ','wait for a bus','Wir warten auf den Bus.'],
    ['verlieben-in','sich verlieben','in','Akkusativ','fall in love with someone','Sie hat sich in ihren Kollegen verliebt.'],
    ['danken-fuer','danken','für','Akkusativ','thank someone for their help','Ich danke dir für deine Hilfe.'],
    ['interessieren-fuer','sich interessieren','für','Akkusativ','be interested in a subject','Ich interessiere mich für Geschichte.'],
    ['anfangen-mit','anfangen','mit','Dativ','begin with the first task','Wir fangen mit der ersten Aufgabe an.'],
    ['rechnen-mit','rechnen','mit','Dativ','expect a delay','Wir rechnen mit einer Verspätung.'],
    ['sprechen-mit','sprechen','mit','Dativ','talk with a person (your conversation partner)','Ich spreche mit meiner Nachbarin.'],
    ['sprechen-ueber','sprechen','über','Akkusativ','talk about a topic','Wir sprechen über unsere Pläne.'],
    ['fragen-nach','fragen','nach','Dativ','ask for information about the way','Sie fragt nach dem Weg.'],
    ['aergern-ueber','sich ärgern','über','Akkusativ','be annoyed about a delay','Ich ärgere mich über die Verspätung.'],
    ['lachen-ueber','lachen','über','Akkusativ','laugh at a joke','Wir lachen über den Witz.'],
    ['bitten-um','bitten','um','Akkusativ','ask someone for help','Ich bitte dich um Hilfe.'],
    ['abhaengen-von','abhängen','von','Dativ','depend on the weather','Unser Ausflug hängt von dem Wetter ab.'],
    ['halten-von','halten','von','Dativ','ask someone’s opinion of a proposal','Was hältst du von diesem Vorschlag?'],
    ['handeln-von','handeln','von','Dativ','be about a subject (a book)','Das Buch handelt von einer langen Reise.'],
    ['traeumen-von','träumen','von','Dativ','dream of a future journey','Ich träume von einer Reise nach Japan.'],
    ['trennen-von','sich trennen','von','Dativ','separate from a partner','Er hat sich von seiner Partnerin getrennt.'],
    ['arbeiten-an','arbeiten','an','Dativ','work on a project','Wir arbeiten an einem neuen Projekt.'],
    ['aufhoeren-mit','aufhören','mit','Dativ','stop a habit','Er hört mit dem Rauchen auf.'],
    ['bedanken-bei','sich bedanken','bei','Dativ','thank a person (the recipient of your thanks)','Ich bedanke mich bei meiner Lehrerin.'],
    ['bedanken-fuer','sich bedanken','für','Akkusativ','give thanks for a gift (the reason for your thanks)','Ich bedanke mich für das Geschenk.'],
    ['beschaeftigen-mit','sich beschäftigen','mit','Dativ','deal with a topic','Wir beschäftigen uns mit diesem Thema.'],
    ['beschweren-bei','sich beschweren','bei','Dativ','complain to a person or organisation','Ich beschwere mich bei der Firma.'],
    ['beschweren-ueber','sich beschweren','über','Akkusativ','complain about a problem','Ich beschwere mich über den Lärm.'],
    ['bestehen-aus','bestehen','aus','Dativ','consist of several parts','Der Kurs besteht aus vier Teilen.'],
    ['bestehen-auf','bestehen','auf','Dativ','insist on something','Ich bestehe auf einer schriftlichen Antwort.'],
    ['einladen-zu','einladen','zu','Dativ','invite someone to a celebration','Ich lade dich zu meiner Feier ein.'],
    ['entschuldigen-bei','sich entschuldigen','bei','Dativ','apologise to a person','Ich entschuldige mich bei meinem Kollegen.'],
    ['entschuldigen-fuer','sich entschuldigen','für','Akkusativ','apologise for a mistake','Ich entschuldige mich für meinen Fehler.'],
    ['teilnehmen-an','teilnehmen','an','Dativ','participate in a course','Ich nehme an einem Sprachkurs teil.'],
    ['kuemmern-um','sich kümmern','um','Akkusativ','look after someone','Sie kümmert sich um ihren kleinen Bruder.'],
    ['verlassen-auf','sich verlassen','auf','Akkusativ','rely on a person','Du kannst dich auf mich verlassen.'],
    ['verzichten-auf','verzichten','auf','Akkusativ','do without something','Heute verzichte ich auf den Nachtisch.'],
    ['zweifeln-an','zweifeln','an','Dativ','doubt a statement','Ich zweifle an dieser Aussage.']
  ];
  const nvv=nvvRows.map(([id,phrase,verbs,meaning,example])=>({id,phrase,meaning,example,answers:verbs.split('/')}));
  const preps=prepRows.map(([id,verb,prep,grammaticalCase,meaning,example])=>({id,verb,meaning,example,pairs:[{prep,grammaticalCase}]}));
  // These alternatives are valid for this meaning, and must keep their own case.
  preps.find(x=>x.id==='sprechen-ueber').pairs.push({prep:'von',grammaticalCase:'Dativ'});
  const normalize=s=>String(s).trim().normalize('NFC').toLocaleLowerCase('de').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/\s+/g,' ');
  function normalizeCase(s){const n=normalize(s).replace(/\.$/,'');return ({akk:'Akkusativ',akkusativ:'Akkusativ',accusative:'Akkusativ',dat:'Dativ',dativ:'Dativ',dative:'Dativ'})[n]||''}
  function grade(kind,item,answer,caseAnswer=''){
    if(kind==='nvv'){const ok=item.answers.some(a=>normalize(a)===normalize(answer));return {ok,wordOK:ok}}
    const pair=item.pairs.find(p=>normalize(p.prep)===normalize(answer));
    const caseOK=!!pair&&pair.grammaticalCase===normalizeCase(caseAnswer);
    return {ok:!!pair&&caseOK,wordOK:!!pair,caseOK};
  }
  const api={nvv,preps,normalize,normalizeCase,grade};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else host.GermanPhrases=api;
})(globalThis);
