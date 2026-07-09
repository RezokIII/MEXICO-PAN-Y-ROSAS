(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());


// ===== La Izquierda: automatic glossary markup =====
(function() {
  var G = {};
  function d(cls, tip, names) {
    for (var i = 0; i < names.length; i++) { G[names[i]] = {c: cls, tip: tip}; }
  }
  // personas
  d('per','Gustavo Díaz Ordaz, President 1964-70. The man of Tlatelolco; history will not be argued out of it.',['Díaz Ordaz']);
  d('per','Luis Echeverría Álvarez, Secretary of Gobernación on Oct 2 1968; President 1970-76. Apertura with one hand, dirty war with the other.',['Echeverría']);
  d('per','José López Portillo, President 1976-82. Elected unopposed; will preside over the oil boom, the reform, and the crash.',['López Portillo']);
  d('per','Jesús Reyes Heroles, historian and ideologue of the system’s serious wing; at Gobernación from 1976, architect of the political reform.',['Reyes Heroles']);
  d('per','Valentín Campa, railwayman, communist since the 1920s, 11 years in Lecumberri; refused to organize Trotsky’s murder and refused every charola since.',['Campa','Valentín Campa']);
  d('per','Demetrio Vallejo, leader of the 1958-59 railway strike; 11 years imprisoned under Article 145. Reads wage tables like horizons.',['Vallejo','Demetrio Vallejo']);
  d('per','José Revueltas, novelist of prisons, twice expelled from the Party he defended to the death. Lecumberri’s most dangerous inmate: he wrote it.',['Revueltas']);
  d('per','Heberto Castillo, engineer of ’68, inventor of the tridilosa, three years in Lecumberri. Building a new left next door — not yours, but needed.',['Heberto Castillo','Castillo']);
  d('per','Arnoldo Martínez Verdugo, First Secretary since 1963. Sign painter, autodidact, heretic by temperament, custodian by trade.',['Martínez Verdugo']);
  d('per','Othón Salazar, teacher of the Montaña de Guerrero; led the 1958 teachers’ movement into the Zócalo and the granaderos’ clubs.',['Othón Salazar','Othón']);
  d('per','Ramón Danzós Palomino, campesino leader; presidential candidate of an unregistered front in 1964. The independent countryside’s memory.',['Danzós']);
  d('per','Benita Galeana, arrested 58 times across five decades for saying true things loudly. The Party’s grandmother and sharpest tongue.',['Benita Galeana']);
  d('per','Rosario Ibarra de Piedra. Her son was disappeared in 1975; she has been the state’s most dangerous question ever since: ¿dónde están?',['Rosario Ibarra']);
  d('per','Lucio Cabañas, schoolteacher of Atoyac, driven to the sierra after the 1967 massacre; leads the Partido de los Pobres in Guerrero.',['Lucio Cabañas','Lucio']);
  d('per','Genaro Vázquez Rojas, teacher and civic organizer beaten off the electoral road; led the ACNR in Guerrero until his death in 1972.',['Genaro Vázquez','Genaro']);
  d('per','Rafael Galván, electricians’ leader, founder of the Tendencia Democrática — the most serious challenge to charro labor in a generation.',['Galván']);
  d('per','Fidel Velázquez, boss of the CTM since 1941. Has outlasted five presidents and intends to outlast the rest.',['Fidel Velázquez','don Fidel']);
  d('per','Julio Scherer García, editor of Excélsior — the one great daily that read like a free country’s paper, until July 1976.',['Scherer']);
  d('per','Eugenio Garza Sada, patriarch of the Monterrey Group, killed in a botched Liga kidnapping in 1973. His funeral turned the business class against Echeverría.',['Garza Sada']);
  d('per','Rubén Jaramillo, the last Zapatista; amnestied three times, executed with his pregnant wife and sons at Xochicalco, May 1962.',['Jaramillo']);
  d('per','Miguel Nazar Haro, DFS interrogator ascending through the dirty war’s machinery. The files are his art form.',['Nazar Haro']);
  d('per','Salvador Allende, President of Chile 1970-73. Died in La Moneda with the vía pacífica; Mexico received his exiles with full honors.',['Allende']);
  // el Estado
  d('est','Partido Revolucionario Institucional: the party-state, governing since 1929 under three names. It has never lost an election it counted.',['PRI']);
  d('est','Dirección Federal de Seguridad — the political police. Keeps the files, runs the informers, answers to Gobernación and to habit.',['DFS']);
  d('est','The Brigada Blanca: the extralegal joint unit hunting the urban guerrilla, building by building, with all the time in the world.',['Brigada Blanca']);
  d('est','Los Halcones: a paramilitary shock force on a city payroll that officially does not exist. Corpus Christi, 1971, was their exhibition match.',['Halcones']);
  d('est','The riot police. Clubs first, questions never.',['granaderos']);
  d('est','Confederación de Trabajadores de México: official labor, the CTM — don Fidel’s empire of dues checkoffs and protection contracts.',['CTM']);
  d('est','The official teachers’ union, largest in Latin America, run by Vanguardia Revolucionaria as a personal ranch.',['SNTE']);
  d('est','The state paper monopoly. Every newspaper in the Republic prints on paper the government sells — or doesn’t.',['PIPSA']);
  d('est','The electoral authority, chaired by the Secretary of Gobernación. The count is the count.',['Comisión Federal Electoral']);
  d('est','Partido Acción Nacional: the Catholic-business opposition, permitted its share and no more.',['PAN']);
  d('est','Partido Popular Socialista: Lombardo’s heirs — Marxist in theory, reliably PRI-adjacent in practice.',['PPS']);
  // el movimiento y los armados
  d('org','The National Strike Council of 1968 — the student movement’s elected leadership, half of it jailed at Tlatelolco.',['CNH']);
  d('org','The Communist Youth — the Party’s impatient future, permanently at war with its patient past.',['Juventud Comunista','JC']);
  d('org','The electricians’ democratic current, born at Guadalajara in April 1975: union democracy and the Constitution taken at its word.',['Tendencia Democrática']);
  d('org','Sindicato Único de Trabajadores Electricistas — the merged electrical union, charro-run since Galván’s expulsion.',['SUTERM']);
  d('org','Lucio Cabañas’ Partido de los Pobres: peasant brigades holding the Costa Grande sierra with rifles and moral credit.',['Partido de los Pobres']);
  d('org','Genaro Vázquez’s Asociación Cívica Nacional Revolucionaria — civic organizers driven to arms.',['ACNR']);
  d('org','Liga Comunista 23 de Septiembre: the urban guerrilla, named for Madera. Considers you the principal obstacle to revolution.',['Liga Comunista 23 de Septiembre','Liga Comunista']);
  d('org','Central Campesina Independiente — the independent peasant central, Danzós’ life’s work.',['CCI']);
  // lugares y fechas
  d('evt','Plaza de las Tres Culturas, Tlatelolco: October 2, 1968. The plaza was hosed clean before morning; the counting has never stopped.',['Tlatelolco']);
  d('evt','The Black Palace — the Porfirian penitentiary whose Crujía M holds the Republic’s political education.',['Lecumberri']);
  d('evt','September 23, 1965: Arturo Gámiz’s band assaults the Madera barracks and dies. The date becomes a signature.',['Madera']);
  d('evt','June 10, 1971: the Halcones maul the first big march since ’68 while the police direct traffic. The apertura’s other hand.',['Halconazo']);
  d('evt','The presidential residence. Where the dedazo lives.',['Los Pinos']);
  d('evt','Street of the Secretaría de Gobernación — the ministry of the interior, the files, and the count.',['Bucareli']);
  d('evt','Guerrero’s coffee coast — Atoyac, the sierra, the dirty war’s deepest theater.',['Costa Grande']);
  // el idioma del sistema
  d('trm','The six-year presidential reign; also the Republic’s unit of historical time.',['sexenio']);
  d('trm','The pointing finger: the outgoing president names his successor. Denied while it happens, absolute when it lands.',['dedazo']);
  d('trm','The unveiling of the hidden candidate — followed by the cargada, the stampede of instant loyalty.',['destape']);
  d('trm','The hidden successor. He exists already; only the Republic doesn’t know his name. Perhaps he doesn’t either.',['tapado']);
  d('trm','The stampede: governors, senators and union bosses discovering they always supported the winner.',['cargada']);
  d('trm','Literally a badge or tray; in practice, the offer you should have refused.',['charola']);
  d('trm','A state-controlled union boss; hence charrismo, the whole apparatus of captive labor.',['charro','charrismo']);
  d('trm','The constitutional writ of protection. Beautiful instrument, routinely denied.',['amparo']);
  d('trm','Article 145: the crime of “dissolving society.” Eleven years of Vallejo’s life; repealed 1970 without apology.',['disolución social']);
  d('trm','The democratic opening — the regime’s word for the space it sells you, at prices to be determined.',['apertura']);
  d('trm','The wartime seizure law: strike inside a requisitioned industry and you are no longer a striker but a saboteur.',['requisa']);
  d('trm','The dirty war: disappearances, clandestine prisons, flights over the sea. Officially it is not happening.',['guerra sucia']);
  d('per','Miguel de la Madrid, President 1982-88. The tecnicos\u2019 coronation: austerity by spreadsheet, renovacion moral by press release.',['De la Madrid']);
  d('per','Manuel Bartlett, Secretary of Gobernacion 1982-88. Smooth, patient, owner of the files and of the count. Remember the name.',['Bartlett']);
  d('per','Carlos Salinas de Gortari: Harvard, Budget, the austerity made candidate by the 1987 dedazo.',['Salinas']);
  d('per','Cuauhtemoc Cardenas: engineer, ex-governor, son of the canonized general. Left the PRI when the dedazo refused democracy \u2014 and took the Revolution\u2019s surname with him.',['C\u00e1rdenas','Cuauht\u00e9moc C\u00e1rdenas']);
  d('per','Porfirio Munoz Ledo: the system\u2019s most dangerous debater, co-founder of the Corriente Democratica.',['Mu\u00f1oz Ledo']);
  d('per','Rosario Ibarra ran for president on the PRT line in 1982 \u2014 the first woman candidate in Mexican history.',['Rosario Ibarra de Piedra']);
  d('org','Coalicion Obrero Campesina Estudiantil del Istmo: the Zapotec left of Juchitan, first leftist city government since the 1920s \u2014 evicted by decree and army in 1983.',['COCEI']);
  d('org','Consejo Estudiantil Universitario: the 1986-87 UNAM movement that beat the rectory on live radio. The next generation.',['CEU']);
  d('org','The Corriente Democratica: Cardenas and Munoz Ledo\u2019s heresy inside the PRI \u2014 democracy in the succession, or the door.',['Corriente Democr\u00e1tica']);
  d('org','Coordinadora Nacional de Trabajadores de la Educacion: the teachers\u2019 insurgency inside the SNTE, born Tuxtla 1979.',['CNTE']);
  d('org','The National Coordinator of the Urban Popular Movement: the organized colonias.',['CONAMUP']);
  d('trm','Desaparicion de poderes: the legal instrument by which a state legislature declares an elected municipal government to have ceased existing. Used on Juchitan, 1983.',['desaparici\u00f3n de poderes']);
  d('est','The Secretaria de Gobernacion: interior ministry, political police, electoral authority and succession broker in one building on Bucareli street. Your true counterparty.',['Gobernación']);
  d('est','Confederacion Nacional Campesina: the PRI captive peasant sector. Delivers the countryside vote and calls it representation.',['CNC']);
  d('est','The PRI popular sector - bureaucrats, teachers, colonos - everyone the other two sectors missed.',['CNOP']);
  d('est','The old-guard professional politicians of the PRI: plazas, unions, the corporatist machine. Losing ground to the tecnicos.',['políticos']);
  d('est','The economist-technocrats rising through Budget and the Bank of Mexico. Harvard-fluent, ballot-innocent. They inherit the state in 1982.',['técnicos']);
  d('est','The PRI reform wing: those who believe the system must widen or die. Your least impossible interlocutors.',['aperturistas']);
  d('est','The PRI hard men: Gobernacion veterans, security chiefs, those who found the apertura sentimental from the start.',['duros']);
  d('est','The labor courts. Strikes are legal in Mexico the way unicorns are: by definition, rarely in nature. The boards declare inconvenient ones inexistentes.',['juntas de conciliación']);
  d('est','Expulsion from the union means firing from the job: the closed-shop clause don Fidel wields as a scythe.',['cláusula de exclusión']);
  d('org','Frente Autentico del Trabajo: independent unionism with Christian-left roots. Led the Spicer strike of 1975.',['FAT']);
  d('org','Frente Democratico Nacional: the 1988 convergence behind Cardenas - satellites, currents, movements, and perhaps you.',['FDN']);
  d('org','Partido Socialista Unificado de Mexico: the 1981 fusion of the PCM with the reform-era left.',['PSUM']);
  d('org','Partido Mexicano Socialista: the 1987 fusion - PSUM plus Castillo PMT and the movement parties. The unified left, at last, one year before it mattered most.',['PMS']);
  d('org','Partido Mexicano de los Trabajadores: Heberto Castillo new-left party - nationalist, honest, allergic to Moscow.',['PMT']);
  d('org','Partido Revolucionario de los Trabajadores: the Trotskyists. Small, loud, brave on human rights; ran Rosario Ibarra in 82.',['PRT']);
  d('org','Partido Autentico de la Revolucion Mexicana: a regime satellite of retired generals - until it nominated Cardenas first.',['PARM']);
  d('org','The PST rebranded: Frente Cardenista de Reconstruccion Nacional. Your co-opted 70s flank, returned wearing the general son colors.',['PFCRN']);
  d('org','The thirty mothers of Xalapa who organized against the Laguna Verde reactor - sit-ins every Saturday, and the coast highway when needed.',['Madres Veracruzanas']);
  d('trm','Your poll-watcher network: trained representatives, certified actas, a telephone tree. Each point is one casilla in a hundred covered. Fraud requires darkness; this is the lamp.',['red de casillas']);
  d('trm','The polling station. The whole war of 1988, fought one table at a time.',['casilla','casillas']);
  d('trm','The official tally sheet signed at each casilla. A certified copy in your pocket is the only vote that cannot be unhappened.',['acta','actas']);
  d('trm','Legal party registration - the license to exist electorally. Granted, conditioned, and revocable by Gobernacion.',['registro']);
  d('trm','The regime electoral arithmetic: pregnant urns, carousel voters, tallies rewritten in better handwriting. Measured as the gap between your count and theirs.',['alquimia']);
  d('trm','GAME: your action points - full-time cadres. Gained from history (releases, amnesties), lost to raids. Gate the biggest plays.',['Organizers','organizers']);
  d('trm','GAME: the leadership authority to impose decisions - spent at congresses, mergers, registrations, and gambles.',['Political capital','political capital']);
  d('trm','GAME: internal cohesion. Multiplies all organizing; drained by sidelined corrientes and marginal factions. Below 25, splits threaten.',['Unity']);
  d('trm','GAME: the five milestones from survival to the united front - the visible road to a 1988 the state cannot steal.',['El camino']);
  d('trm','GAME: general-strike infrastructure - committees, funds, the delegate web. Built for years, spent in one telephone call. The state charrazo erodes it.',['General strike readiness']);
  d('trm','GAME: what your sources see of the war - below 40, the Sierra map is fog and guesses; above, real garrison numbers.',['Intelligence capacity']);
  d('evt','September 19, 1985, 7:19 a.m. The earthquake \u2014 and the week the city governed itself.',['diecinueve de septiembre']);

  var keys = Object.keys(G).sort(function(a, b) { return b.length - a.length; });
  var esc = keys.map(function(k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
  var RE;
  try { RE = new RegExp('(?<![\\p{L}\\p{N}])(?:' + esc.join('|') + ')(?![\\p{L}\\p{N}])', 'gu'); }
  catch (e) { RE = new RegExp('(?:' + esc.join('|') + ')', 'g'); }

  function markup(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [], n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode;
      if (!p) continue;
      if (p.closest && p.closest('a, button, script, style, .gloss, input, select')) continue;
      nodes.push(n);
    }
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], text = node.nodeValue;
      RE.lastIndex = 0;
      var m, last = 0, out = [], any = false;
      while ((m = RE.exec(text))) {
        any = true;
        out.push(document.createTextNode(text.slice(last, m.index)));
        var info = G[m[0]];
        var span = document.createElement('span');
        span.className = 'gloss ' + info.c;
        span.setAttribute('data-tip', info.tip);
        span.textContent = m[0];
        out.push(span);
        last = m.index + m[0].length;
      }
      if (any) {
        out.push(document.createTextNode(text.slice(last)));
        var parent = node.parentNode;
        for (var j = 0; j < out.length; j++) { parent.insertBefore(out[j], node); }
        parent.removeChild(node);
      }
    }
  }

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function() {
      pending = false;
      markup(document.getElementById('content'));
      markup(document.getElementById('qualities'));
      markup(document.getElementById('qualities2'));
    }, 60);
  }
  window.addEventListener('load', function() {
    var content = document.getElementById('content');
    var quals = document.getElementById('qualities');
    var quals2 = document.getElementById('qualities2');
    var obs = new MutationObserver(function(muts) {
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        if (t.nodeType === 1 && t.closest && t.closest('.gloss')) continue;
        schedule();
        return;
      }
    });
    if (content) obs.observe(content, {childList: true, subtree: true});
    if (quals) obs.observe(quals, {childList: true, subtree: true});
    if (quals2) obs.observe(quals2, {childList: true, subtree: true});
    schedule();
  });
})();


// ===== Sierra war map: colorizer + hover intelligence =====
(function(){
  var prev = {};
  var INFO = {
    tijuana:  ['Baja California Norte','The border: dollars, crossings, the longest escape route in the Republic.'],
    chihuahua:['Chihuahua','Madera country: the northern sierra, long memories, thin garrisons.'],
    nl:       ['Nuevo Leon','Monterrey: the industrial belt, railway veins, money with its own foreign policy.'],
    jalisco:  ['Jalisco','Guadalajara: old Liga craft, seminarians gone left, police who remember.'],
    valle:    ['Valle de Mexico','The capital: deepest waters, thickest garrison, the war argued in print.'],
    guerrero: ['Guerrero','The Costa Grande: Lucio country. The dirty war deepest theater.'],
    oaxaca:   ['Oaxaca','The Istmo: COCEI country, Zapotec politics, ranges the army maps badly.']
  };
  function trend(z, guar){
    if (prev[z] === undefined) { return 'no prior data'; }
    var d = Math.round(guar - prev[z]);
    if (d >= 5) return 'REINFORCING (+' + d + ')';
    if (d >= 2) return 'building up (+' + d + ')';
    if (d <= -3) return 'drawing down (' + d + ')';
    return 'static';
  }
  function qual(v, hi, mid){ return v >= hi ? 'heavy' : (v >= mid ? 'moderate' : 'light'); }
  window.paintSierraMap = function(){
    if (!window.dendryUI || !window.dendryUI.dendryEngine) return;
    var Q = window.dendryUI.dendryEngine.state.qualities;
    var via = Q.via;
    var atWar = (via === 'armada' || via === 'dual');
    var el = document.getElementById('mapa_sierra');
    if (!atWar) { if (el) { el.parentNode.removeChild(el); } return; }
    if (!el) {
      if (window.statusTab !== 'status.guerra') return;
      var host = document.getElementById('qualities');
      if (!host) return;
      el = document.createElement('div');
      el.id = 'mapa_sierra';
      el.style.position = 'relative';
      el.style.margin = '0.5em 0';
      var h = host.querySelector('h1');
      if (h && h.nextSibling) { host.insertBefore(el, h.nextSibling); }
      else { host.appendChild(el); }
    }
    if (!document.getElementById('z_guerrero')) { el.innerHTML = '<svg viewBox="0 0 320 200" width="100%" xmlns="http://www.w3.org/2000/svg"><polygon points="48,20 140,44 186,58 204,78 198,100 210,120 252,118 300,106 312,126 296,150 258,146 224,152 216,170 186,166 158,164 126,150 96,116 74,90 56,50" style="fill:#e8e4d4;stroke:#999;stroke-width:0.8"/><polygon id="z_tijuana" points="16,34 30,32 40,52 54,76 66,100 60,114 46,96 32,68 20,46" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_chihuahua" points="48,20 140,44 150,60 120,84 84,74 60,44" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_nl" points="140,44 186,58 202,78 196,96 160,86 150,60" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_jalisco" points="84,74 120,84 136,110 118,128 92,112 76,92" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_valle" points="150,112 170,108 178,126 158,132" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_guerrero" points="118,128 158,132 176,146 160,162 128,148" style="fill:#ccc;stroke:#333;stroke-width:1"/><polygon id="z_oaxaca" points="176,146 206,138 224,150 216,168 186,164 160,162" style="fill:#ccc;stroke:#333;stroke-width:1"/><text x="18" y="28" font-size="9">BCN</text><text x="80" y="42" font-size="10">CHIH</text><text x="165" y="56" font-size="10">NL</text><text x="92" y="104" font-size="10">JAL</text><text x="151" y="124" font-size="8">CDMX</text><text x="130" y="150" font-size="9">GRO</text><text x="188" y="160" font-size="9">OAX</text></svg><div id="mapa_tip" style="display:none;position:absolute;background:#2a2118;color:#f3ecd8;border:1px solid #8a6d3b;padding:7px 10px;font-size:12px;max-width:230px;pointer-events:none;z-index:99;border-radius:3px"></div>'; }
    var zonas = ['guerrero','chihuahua','valle','jalisco','nl','oaxaca','tijuana'];
    var tip = document.getElementById('mapa_tip');
    for (var i=0;i<zonas.length;i++){
      (function(z){
        var poly=document.getElementById('z_'+z);
        if(!poly) return;
        var pres=Q['pres_'+z]||0, guar=Q['guar_'+z]||0, intel=Q['inteligencia']||0;
        if (!atWar) {
          poly.style.fill='#d8d4c4'; poly.style.strokeWidth='1px'; poly.style.stroke='#999';
        } else {
          var r=Math.round(200+(55*Math.min(1,pres/40)));
          var gb=Math.round(200-(160*Math.min(1,pres/40)));
          poly.style.fill='rgb('+r+','+gb+','+gb+')';
          poly.style.strokeWidth=(1+Math.min(5,guar/18))+'px';
          poly.style.stroke = guar>=55 ? '#0f7040' : '#333';
        }
        poly.style.cursor='help';
        poly.onmousemove=function(ev){
          if(!tip) return;
          var body;
          if (!atWar){
            body='<i>No armed presence. The war opens only on the armed road (choose it at a strategy congress).</i>';
          } else if (intel >= 40){
            body='Columns: <b>'+Math.round(pres)+'</b> &middot; Garrison: <b>'+Math.round(guar)+'</b><br>Troop movements: '+trend(z,guar)+(guar>=55?'<br><b>Ground too hot: presence erodes here.</b>':'');
          } else {
            body='Columns: '+(pres>=20?'strong':(pres>=5?'some structure':'almost none'))+' &middot; Army posture: '+qual(guar,45,30)+'<br>Troop movements: <i>estimates only (intel '+Math.round(intel)+' of 40 needed)</i>';
          }
          tip.innerHTML='<b>'+INFO[z][0]+'</b><br><span style="opacity:.85">'+INFO[z][1]+'</span><br>'+body;
          tip.style.display='block';
          var rect=el.getBoundingClientRect();
          tip.style.left=Math.max(0,Math.min(rect.width-240,(ev.clientX-rect.left+12)))+'px';
          tip.style.top=(ev.clientY-rect.top+12)+'px';
        };
        poly.onmouseleave=function(){ if(tip) tip.style.display='none'; };
      })(zonas[i]);
    }
    if (prev._time !== Q.time){
      for (var j=0;j<zonas.length;j++){
        var zz=zonas[j];
        if (prev._time !== undefined && prev['_pending_'+zz] !== undefined) { prev[zz] = prev['_pending_'+zz]; }
        prev['_pending_'+zz] = Q['guar_'+zz];
      }
      prev._time = Q.time;
    }
  }
  var obs=new MutationObserver(function(){ setTimeout(window.paintSierraMap,80); });
  window.addEventListener('load', function(){
    var q=document.getElementById('qualities');
    if(q) obs.observe(q,{childList:true,subtree:true});
    var q2=document.getElementById('qualities2');
    if(q2) obs.observe(q2,{childList:true,subtree:true});
    setTimeout(window.paintSierraMap,500);
  });
})();


// ===== La Izquierda: right sidebar (militant column) =====
(function(){
  window.statusTabRight = 'status.paramilitaries';
  window.updateSidebarRight = function() {
    var el = $('#qualities2');
    if (!el.length || !window.dendryUI || !dendryUI.game) return;
    el.empty();
    var scene = dendryUI.game.scenes[window.statusTabRight];
    if (!scene) return;
    try {
      if (scene.onArrival) { dendryUI.dendryEngine._runActions(scene.onArrival); }
      var dc = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      el.append(dendryUI.contentToHTML.convert(dc));
    } catch(err) {
      el.append('<p>(display error: '+ (err && err.message ? err.message : err) +')</p>');
    }
    if (window.paintSierraMap) { setTimeout(window.paintSierraMap, 20); }
  };
  function setActive(container, tabId){
    var btns = document.querySelectorAll(container + ' .tab_button');
    for (var i=0;i<btns.length;i++){ btns[i].className = btns[i].className.replace(' active',''); }
    var b = document.getElementById(tabId);
    if (b) b.className += ' active';
  }
  var baseChange = window.changeTab;
  window.changeTab = function(newTab, tabId){
    if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
      window.alert('Polls are not available in historical mode.');
      return;
    }
    setActive('#stats_sidebar', tabId);
    window.statusTab = newTab;
    window.updateSidebar();
    if (window.paintSierraMap) { setTimeout(window.paintSierraMap, 20); }
  };
  window.changeTabRight = function(newTab, tabId){
    setActive('#tools_right', tabId);
    window.statusTabRight = newTab;
    window.updateSidebarRight();
  };
  window.onDisplayContent = function(){
    try { window.updateSidebar(); } catch(e){ if(window.console)console.warn('sidebar:',e); }
    if (window.paintSierraMap) { setTimeout(window.paintSierraMap, 20); }
  };
  window.addEventListener('load', function(){
    setTimeout(window.updateSidebarRight, 600);
    // directly bind the right-sidebar tab buttons in case inline onclick is unreliable
    setTimeout(function(){
      var d = document.getElementById('paramilitary_tab');
      var g = document.getElementById('sierra_tab');
      if (d) d.addEventListener('click', function(e){ e.preventDefault(); window.changeTab('status.paramilitaries','paramilitary_tab'); });
      if (g) g.addEventListener('click', function(e){ e.preventDefault(); window.changeTab('status.guerra','sierra_tab'); });
    }, 700);
  });
})();


// ===== La Izquierda: inject advisor portraits (engine drops pinned-card images) =====
(function(){
  var MAP = {
    valentin_campa:'campa.jpg', demetrio_vallejo:'vallejo.jpeg', martinez_verdugo:'verdugo.jpeg',
    othon_salazar:'othon.jpeg', danzos_palomino:'danzos.jpeg', benita_galeana:'benita.jpeg',
    jose_revueltas:'revueltas.jpg', heberto_castillo:'heberto.jpeg', rosario_ibarra:'ibarra.jpg'
  };
  function inject(){
    var cards = document.querySelectorAll('a.card[card-id]');
    for (var i=0;i<cards.length;i++){
      var a=cards[i], id=a.getAttribute('card-id');
      if (MAP[id] && !a.querySelector('img.card-img')){
        var img=document.createElement('img');
        img.className='card-img';
        img.src='img/portraits/'+MAP[id];
        a.insertBefore(img, a.firstChild);
      }
    }
  }
  window.addEventListener('load', function(){
    var c=document.getElementById('content');
    if(c){ var o=new MutationObserver(function(){ setTimeout(inject,30); }); o.observe(c,{childList:true,subtree:true}); }
    setTimeout(inject,600);
  });
})();
