(function(host){
  'use strict';
  const prepositionGroups={dativ:['ab','außer','bei','mit','nach','seit','von','zu','aus','gegenüber'],wechsel:['an','auf','hinter','in','neben','über','unter','vor','zwischen'],akkusativ:['bis','durch','für','gegen','ohne','um'],genitiv:['außerhalb','innerhalb','statt','trotz','während','wegen']};
  const caseRounds=[
    {id:'mit-bus',sentence:'Ich fahre mit dem Bus.',prep:'mit',answer:'Dativ',note:'mit always takes Dativ.'},{id:'durch-park',sentence:'Wir gehen durch den Park.',prep:'durch',answer:'Akkusativ',note:'durch always takes Akkusativ.'},{id:'bild-wand',sentence:'Das Bild hängt an der Wand.',prep:'an',answer:'Dativ',note:'Location: Wo? The picture is already there.'},{id:'bild-wand-move',sentence:'Ich hänge das Bild an die Wand.',prep:'an',answer:'Akkusativ',note:'Direction/change: Wohin? The picture moves there.'},{id:'kino',sentence:'Sie geht ohne ihren Bruder ins Kino.',prep:'ohne',answer:'Akkusativ',note:'ohne always takes Akkusativ.'},{id:'schule',sentence:'Nach der Schule gehe ich nach Hause.',prep:'nach',answer:'Dativ',note:'nach always takes Dativ.'},{id:'tisch',sentence:'Die Katze schläft unter dem Tisch.',prep:'unter',answer:'Dativ',note:'Location: Wo? The cat is under the table.'},{id:'tisch-move',sentence:'Die Katze läuft unter den Tisch.',prep:'unter',answer:'Akkusativ',note:'Direction: Wohin? The cat runs under the table.'},{id:'regen',sentence:'Wegen des Regens bleiben wir zu Hause.',prep:'wegen',answer:'Genitiv',note:'wegen is usually followed by Genitiv.'}
  ];
  // Original practice. Each frame is paired only with phrases written for it.
  const casePractice=[
    ['mit','Dativ','Ich fahre % zur Arbeit.','dem Zug|der Straßenbahn|dem Fahrrad|dem Auto|dem Roller|der U-Bahn|dem Motorrad|dem Taxi'],
    ['bei','Dativ','Ich übernachte %.','meiner Schwester|meinem Bruder|meinen Eltern|einem Freund|einer Freundin|meiner Tante|meinem Onkel|meinen Großeltern'],
    ['aus','Dativ','Sie holt die Unterlagen %.','dem Schrank|der Schublade|dem Ordner|der Tasche|dem Regal|der Mappe|dem Rucksack|der Kiste'],
    ['seit','Dativ','Ich wohne hier %.','einem Jahr|einer Woche|einem Monat|zwei Jahren|drei Monaten|vier Wochen|dem letzten Sommer|meiner Kindheit'],
    ['von','Dativ','Die Nachricht kommt %.','meiner Schwester|meinem Bruder|meinen Eltern|dem Chef|der Chefin|dem Vermieter|der Nachbarin|meinem Kollegen'],
    ['zu','Dativ','Ich gehe heute %.','meinem Arzt|meiner Ärztin|meinem Friseur|meiner Friseurin|meiner Schwester|meinem Bruder|meinen Eltern|meiner Tante'],
    ['nach','Dativ','Wir treffen uns %.','dem Kurs|der Arbeit|dem Mittagessen|der Vorlesung|dem Konzert|der Prüfung|dem Training|der Besprechung'],
    ['durch','Akkusativ','Wir spazieren %.','den Park|den Wald|den Tunnel|die Altstadt|den Garten|die Fußgängerzone|die Unterführung|den Innenhof'],
    ['für','Akkusativ','Das Geschenk ist %.','meinen Bruder|meine Schwester|meine Eltern|meinen Onkel|meine Tante|meinen Sohn|meine Tochter|meinen Vater'],
    ['gegen','Akkusativ','Der Ball prallt %.','die Wand|den Pfosten|das Tor|die Tür|den Zaun|die Mauer|das Fenster|den Baum'],
    ['ohne','Akkusativ','Sie fährt nie %.','ihren Helm|ihre Brille|ihren Ausweis|ihre Fahrkarte|ihren Führerschein|ihre Schlüssel|ihren Rucksack|ihr Handy'],
    ['um','Akkusativ','Wir gehen einmal %.','den See|den Häuserblock|den Platz|das Gebäude|den Teich|den Garten|den Brunnen|die Kirche'],
    ['wegen','Genitiv','% fällt das Spiel aus.','des starken Regens|des Schneefalls|des Gewitters|des Sturms|der großen Hitze|des Stromausfalls|des dichten Nebels|des vereisten Platzes'],
    ['während','Genitiv','% bleibt das Handy ausgeschaltet.','des Unterrichts|der Prüfung|des Konzerts|der Vorstellung|des Vortrags|der Besprechung|des Gesprächs|der Aufführung'],
    ['trotz','Genitiv','% gingen wir spazieren.','des Regens|des starken Winds|des dichten Nebels|der Kälte|der Hitze|des schlechten Wetters|des Schneefalls|der späten Stunde'],
    ['innerhalb','Genitiv','Die Lieferung kommt %.','einer Woche|eines Monats|eines Tages|einer Stunde|eines Werktags|einer halben Stunde|eines Arbeitstags|eines Jahres'],
    ['auf','Dativ','Die Tasche liegt %.','dem Tisch|der Bank|dem Stuhl|dem Sofa|dem Bett|der Kommode|dem Boden|der Ablage'],
    ['auf','Akkusativ','Ich lege die Tasche %.','den Tisch|die Bank|den Stuhl|das Sofa|das Bett|die Kommode|den Boden|die Ablage'],
    ['in','Dativ','Die Schlüssel liegen %.','der Tasche|dem Schrank|der Schublade|dem Rucksack|der Kiste|dem Korb|der Schale|der Kommode'],
    ['in','Akkusativ','Ich lege die Schlüssel %.','die Tasche|den Schrank|die Schublade|den Rucksack|die Kiste|den Korb|die Schale|die Kommode'],
    ['neben','Dativ','Der Stuhl steht %.','dem Tisch|der Tür|dem Bett|der Kommode|dem Schrank|dem Regal|der Heizung|dem Sofa'],
    ['neben','Akkusativ','Ich stelle den Stuhl %.','den Tisch|die Tür|das Bett|die Kommode|den Schrank|das Regal|die Heizung|das Sofa'],
    ['hinter','Dativ','Das Fahrrad steht %.','dem Haus|der Garage|dem Schuppen|der Hecke|dem Zaun|der Mauer|dem Tor|der Scheune'],
    ['hinter','Akkusativ','Ich stelle das Fahrrad %.','das Haus|die Garage|den Schuppen|die Hecke|den Zaun|die Mauer|das Tor|die Scheune'],
    ['unter','Dativ','Die Katze schläft %.','dem Bett|dem Sofa|der Bank|dem Schreibtisch|der Treppe|dem Auto|der Decke|dem Stuhl'],
    ['unter','Akkusativ','Die Katze kriecht %.','das Bett|das Sofa|die Bank|den Schreibtisch|die Treppe|das Auto|die Decke|den Stuhl'],
    ['vor','Dativ','Der Wagen steht %.','dem Haus|der Garage|dem Eingang|der Werkstatt|dem Tor|der Schule|dem Hotel|der Apotheke'],
    ['vor','Akkusativ','Ich stelle den Wagen %.','das Haus|die Garage|den Eingang|die Werkstatt|das Tor|die Schule|das Hotel|die Apotheke']
  ];
  for(let variant=0;variant<8;variant++){
    for(const [index,[prep,answer,frame,phrases]] of casePractice.entries()){
      const phrase=prep+' '+phrases.split('|')[variant];
      const sentence=frame.replace('%',phrase).replace(/^./,letter=>letter.toUpperCase());
      const note=prepositionGroups.wechsel.includes(prep)
        ? (answer==='Dativ'?'Wo? The phrase describes a location.':'Wohin? The phrase describes the destination.')
        : (answer==='Genitiv'?'In standard written German, '+prep+' takes Genitiv here.':prep+' takes '+answer+' here.');
      caseRounds.push({id:`practice-${index}-${variant}`,sentence,prep,answer,note});
    }
  }
  const connectorGroups=[
    {id:'zero',name:'Coordinating connectors',rule:'The following main clause keeps normal word order: subject then verb.',items:['und','oder','aber','denn','sondern'],example:'Ich bleibe zu Hause, denn ich bin krank.'},{id:'subordinate',name:'Subordinating connectors',rule:'In the subordinate clause, the conjugated verb goes to the end.',items:['weil','dass','ob','obwohl','wenn','als','falls','bevor','nachdem','während','damit','sodass'],example:'Ich bleibe zu Hause, weil ich krank bin.'},{id:'adverbs',name:'Conjunctive adverbs',rule:'At the start of a main clause, the connector takes position 1, so the conjugated verb comes directly after it.',items:['deshalb','deswegen','darum','daher','trotzdem','außerdem','jedoch','danach','vorher','sonst'],example:'Ich bin krank. Deshalb bleibe ich zu Hause.'},{id:'paired',name:'Paired connectors',rule:'These work as a pair. The usual main-clause verb position stays in place; je ... desto is the important exception.',items:['entweder ... oder','weder ... noch','nicht nur ... sondern auch','sowohl ... als auch','zwar ... aber','einerseits ... andererseits','je ... desto'],example:'Entweder fahre ich mit dem Zug oder ich bleibe zu Hause.'}
  ];
  const clauseRounds=[
    {id:'weil',hint:'because - subordinate clause',prompt:'Ich bleibe zu Hause, ...',tokens:['weil','ich','krank','bin.'],answer:['weil','ich','krank','bin.'],note:'weil starts a subordinate clause, so bin goes at the end.'},{id:'deshalb',hint:'therefore - conjunctive adverb',prompt:'Ich bin krank.',tokens:['Deshalb','bleibe','ich','zu','Hause.'],answer:['Deshalb','bleibe','ich','zu','Hause.'],note:'Deshalb is position 1. The verb bleibe follows immediately.'},{id:'denn',hint:'because - coordinating connector',prompt:'Ich bleibe zu Hause, ...',tokens:['denn','ich','bin','krank.'],answer:['denn','ich','bin','krank.'],note:'denn joins two main clauses; the second one keeps normal word order.'},{id:'obwohl',hint:'although - connector first',prompt:'...',tokens:['Obwohl','es','regnet,','gehe','ich','spazieren.'],answer:['Obwohl','es','regnet,','gehe','ich','spazieren.'],note:'The obwohl clause ends with regnet. After the comma, the main-clause verb gehe comes first.'},{id:'trotzdem',hint:'nevertheless - conjunctive adverb',prompt:'Es regnet.',tokens:['Trotzdem','gehe','ich','spazieren.'],answer:['Trotzdem','gehe','ich','spazieren.'],note:'Trotzdem takes position 1, then the verb gehe takes position 2.'},{id:'either',hint:'either ... or - paired connector',prompt:'...',tokens:['Entweder','fahre','ich','mit','dem','Zug','oder','ich','bleibe','zu','Hause.'],answer:['Entweder','fahre','ich','mit','dem','Zug','oder','ich','bleibe','zu','Hause.'],note:'Either part can lead a main clause. Here fahre and bleibe each stay in normal main-clause position.'}
  ];
  const normalize=s=>String(s).trim().toLocaleLowerCase('de').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss');
  const normalizeCase=s=>({dat:'Dativ',dativ:'Dativ',akk:'Akkusativ',akkusativ:'Akkusativ',gen:'Genitiv',genitiv:'Genitiv'})[normalize(s)]||'';
  const api={prepositionGroups,caseRounds,connectorGroups,clauseRounds,normalizeCase};if(typeof module!=='undefined'&&module.exports)module.exports=api;else host.GermanGrammar=api;
})(globalThis);
