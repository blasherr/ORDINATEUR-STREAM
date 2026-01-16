// ===== AUDIO ENGINE =====
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.3;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
    }

    beep(frequency = 440, duration = 0.1, type = 'sine') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    bootSound() {
        if (!this.ctx) return;
        const notes = [220, 330, 440, 550, 660, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => this.beep(freq, 0.15, 'sine'), i * 100);
        });
    }

    bootProgress() {
        this.beep(200 + Math.random() * 100, 0.05, 'square');
    }

    loginSuccess() {
        if (!this.ctx) return;
        setTimeout(() => this.beep(523, 0.1), 0);
        setTimeout(() => this.beep(659, 0.1), 100);
        setTimeout(() => this.beep(784, 0.2), 200);
    }

    error() {
        if (!this.ctx) return;
        this.beep(150, 0.1, 'sawtooth');
        setTimeout(() => this.beep(100, 0.2, 'sawtooth'), 100);
    }

    click() {
        this.beep(800, 0.02, 'square');
    }

    windowOpen() {
        if (!this.ctx) return;
        this.beep(400, 0.05, 'sine');
        setTimeout(() => this.beep(600, 0.05, 'sine'), 30);
    }

    windowClose() {
        if (!this.ctx) return;
        this.beep(600, 0.05, 'sine');
        setTimeout(() => this.beep(400, 0.05, 'sine'), 30);
    }

    keyPress() {
        this.beep(1200 + Math.random() * 400, 0.02, 'square');
    }

    terminalCommand() {
        if (!this.ctx) return;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.beep(300 + Math.random() * 200, 0.03, 'sawtooth'), i * 30);
        }
    }

    reveal() {
        if (!this.ctx) return;
        const frequencies = [200, 250, 300, 400, 500, 600, 800, 1000];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.beep(freq, 0.1, 'sine'), i * 80);
        });
    }

    firewallAlert() {
        if (!this.ctx) return;
        const alert = () => {
            this.beep(800, 0.1, 'square');
            setTimeout(() => this.beep(600, 0.1, 'square'), 150);
        };
        alert();
        setTimeout(alert, 400);
        setTimeout(alert, 800);
    }

    correctKey() {
        this.beep(880 + gameState.currentKeyIndex * 50, 0.08, 'sine');
    }

    wrongKey() {
        this.beep(150, 0.15, 'sawtooth');
    }

    hackSuccess() {
        if (!this.ctx) return;
        const notes = [261, 329, 392, 523, 659, 784, 1046];
        notes.forEach((freq, i) => {
            setTimeout(() => this.beep(freq, 0.2, 'sine'), i * 100);
        });
        setTimeout(() => {
            this.beep(523, 0.5, 'sine');
            this.beep(659, 0.5, 'sine');
            this.beep(784, 0.5, 'sine');
        }, 800);
    }

    downloading() {
        this.beep(400 + Math.random() * 200, 0.03, 'square');
    }

    transmission() {
        if (!this.ctx) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.beep(1000 + Math.random() * 500, 0.02, 'sine');
            }, i * 50);
        }
    }

    victory() {
        if (!this.ctx) return;
        const melody = [
            { freq: 523, dur: 0.15 }, { freq: 659, dur: 0.15 },
            { freq: 784, dur: 0.15 }, { freq: 1046, dur: 0.3 },
            { freq: 784, dur: 0.15 }, { freq: 1046, dur: 0.5 }
        ];
        let time = 0;
        melody.forEach(note => {
            setTimeout(() => this.beep(note.freq, note.dur, 'sine'), time);
            time += note.dur * 1000;
        });
    }

    startAmbience() {
        if (!this.ctx) return;
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = noiseBuffer;
        this.noiseSource.loop = true;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 200;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.02;
        this.noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        this.noiseSource.start();
    }

    stopAmbience() {
        if (this.noiseSource) {
            this.noiseSource.stop();
            this.noiseSource = null;
        }
    }

    glitch() {
        if (!this.ctx) return;
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.beep(Math.random() * 2000 + 100, 0.02, 'sawtooth');
            }, i * 30);
        }
    }
}

const audio = new AudioEngine();

// ===== GAME STATE =====
const gameState = {
    loggedIn: false,
    filesRead: [],
    secretFolderRevealed: false,
    missionStartTime: null,
    currentMinigameKeys: [],
    currentKeyIndex: 0,
    minigameTimer: null,
    minigameTimeLeft: 15,
    audioInitialized: false
};

// ===== DATA =====
const folders = {
    communications: {
        title: "Communications Agents",
        files: [
            { name: "Conv_Alpha_23.txt", type: "file", id: "conv1" },
            { name: "Rapport_Echo.txt", type: "file", id: "conv2" },
            { name: "Message_Urgent.txt", type: "file", id: "conv3" }
        ]
    },
    operations: {
        title: "Opérations Classifiées",
        files: [
            { name: "Op_Nightfall.txt", type: "file", id: "op1" },
            { name: "Op_Thunderstrike.txt", type: "file", id: "op2" },
            { name: "Memo_Directeur.txt", type: "file", id: "op3" }
        ]
    },
    rapports: {
        title: "Rapports Terrain",
        files: [
            { name: "Rapport_Berlin.txt", type: "file", id: "rap1" },
            { name: "Surveillance_Labo.txt", type: "file", id: "rap2" },
            { name: "Note_IT_2847.txt", type: "file", id: "rap3" }
        ]
    },
    topsecret: {
        title: "⚠️ CHIMERA_X7 - TOP SECRET",
        files: [
            { name: "CHIMERA_X7_COMPLET.enc", type: "file", id: "chimera" },
            { name: ".note_agent.txt", type: "file", id: "agentnote" }
        ]
    }
};

const fileContents = {
    conv1: {
        title: "Conversation Alpha-23 - CLASSIFIÉ",
        content: `
            <div class="classified-header">
                🔒 NIVEAU D'ACCÈS: CONFIDENTIEL<br>
                INTERCEPT COMM - CANAL SÉCURISÉ
            </div>
            <div class="message">
                <div class="sender">AGENT VIPER</div>
                <div class="time">14/01/2026 - 09:23:47</div>
                <div class="text">J'ai récupéré les premiers échantillons du laboratoire de Moscou. Les analyses confirment nos soupçons - ils développent quelque chose de gros.</div>
            </div>
            <div class="message">
                <div class="sender">AGENT PHOENIX</div>
                <div class="time">14/01/2026 - 09:25:12</div>
                <div class="text">Reçu. Qu'est-ce que tu as trouvé exactement?</div>
            </div>
            <div class="message">
                <div class="sender">AGENT VIPER</div>
                <div class="time">14/01/2026 - 09:27:33</div>
                <div class="text">Un composé chimique nouveau. Nom de code interne: <span class="highlight">CHIMERA</span>. Capacité de propagation 10x supérieure aux agents connus. J'ai tout documenté.</div>
            </div>
            <div class="message">
                <div class="sender">AGENT PHOENIX</div>
                <div class="time">14/01/2026 - 09:28:55</div>
                <div class="text">Merde. Le directeur doit être informé. Cache tout sur le serveur isolé, protocole X7. Et n'oublie pas de masquer le dossier après upload.</div>
            </div>
            <div class="message">
                <div class="sender">AGENT VIPER</div>
                <div class="time">14/01/2026 - 09:30:12</div>
                <div class="text">C'est fait. J'ai utilisé la procédure standard. Si quelqu'un veut y accéder, il devra <span class="highlight">reveal</span> le dossier via le terminal.</div>
            </div>
            <div class="message">
                <div class="sender">AGENT PHOENIX</div>
                <div class="time">14/01/2026 - 09:31:45</div>
                <div class="text">Parfait. Seuls les initiés connaissent cette commande. Le mot de passe admin est toujours le même?</div>
            </div>
            <div class="message">
                <div class="sender">AGENT VIPER</div>
                <div class="time">14/01/2026 - 09:32:58</div>
                <div class="text">Ouais, personne n'a changé <span class="highlight">root</span> depuis 6 mois. C'est une blague niveau sécurité mais bon...</div>
            </div>
        `
    },
    conv2: {
        title: "Rapport Echo - CONFIDENTIEL",
        content: `
            <div class="classified-header">
                🔒 RAPPORT DE MISSION<br>
                OPÉRATION ECHO - PHASE 2
            </div>
            <div class="message">
                <div class="sender">CENTRAL</div>
                <div class="time">15/01/2026 - 14:45:00</div>
                <div class="text">Tous les agents terrain sont en alerte maximale. La fuite d'informations sur le projet CHIMERA représente une menace de niveau 5.</div>
            </div>
            <div class="message">
                <div class="sender">AGENT SHADOW</div>
                <div class="time">15/01/2026 - 14:48:22</div>
                <div class="text">Confirmé. J'ai identifié le contact ennemi à Berlin. Il cherche à vendre les plans au plus offrant. On parle de plusieurs gouvernements intéressés.</div>
            </div>
            <div class="message">
                <div class="sender">CENTRAL</div>
                <div class="time">15/01/2026 - 14:50:11</div>
                <div class="text">⚠️ ALERTE SÉCURITÉ: Nos analystes ont détecté que la F.A.N. tente d'infiltrer notre réseau. Leur serveur d'exfiltration a été identifié: <span class="highlight">192.168.13.37</span>. Bloquez immédiatement cette adresse!</div>
            </div>
            <div class="message">
                <div class="sender">AGENT SHADOW</div>
                <div class="time">15/01/2026 - 14:52:45</div>
                <div class="text">Compris. Je lance le protocole de contre-espionnage.</div>
            </div>
        `
    },
    conv3: {
        title: "Message Urgent - PRIORITÉ ALPHA",
        content: `
            <div class="classified-header">
                ⚠️ MESSAGE URGENT - PRIORITÉ ALPHA<br>
                DIFFUSION RESTREINTE
            </div>
            <div class="message">
                <div class="sender">TECH SUPPORT - MARC</div>
                <div class="time">16/01/2026 - 01:12:00</div>
                <div class="text">
                    Salut, j'ai un problème. Je dois envoyer un fichier confidentiel au serveur de backup mais j'ai oublié la syntaxe...
                </div>
            </div>
            <div class="message">
                <div class="sender">ADMIN SYS - JULIE</div>
                <div class="time">16/01/2026 - 01:14:27</div>
                <div class="text">
                    C'est simple. Dans le terminal tu tapes <span class="highlight">send</span> suivi du nom du fichier et de l'adresse IP. Genre "send rapport 10.0.0.1" par exemple.
                </div>
            </div>
            <div class="message">
                <div class="sender">TECH SUPPORT - MARC</div>
                <div class="time">16/01/2026 - 01:15:33</div>
                <div class="text">
                    Ah ok merci! Et si le fichier est caché sur le bureau, je fais comment?
                </div>
            </div>
            <div class="message">
                <div class="sender">ADMIN SYS - JULIE</div>
                <div class="time">16/01/2026 - 01:16:45</div>
                <div class="text">
                    Tu dois d'abord le rendre visible. Tape "reveal" dans le terminal, ça affiche tous les dossiers masqués. Ensuite tu peux l'envoyer.
                </div>
            </div>
            <div class="message">
                <div class="sender">TECH SUPPORT - MARC</div>
                <div class="time">16/01/2026 - 01:17:22</div>
                <div class="text">
                    Top, ça marche. Merci Julie t'es la meilleure 👍
                </div>
            </div>
        `
    },
    op1: {
        title: "Opération Nightfall - DOSSIER",
        content: `
            <div class="classified-header">
                🌙 OPÉRATION NIGHTFALL<br>
                STATUT: EN COURS
            </div>
            <div class="message">
                <div class="sender">BRIEFING INITIAL</div>
                <div class="time">10/01/2026</div>
                <div class="text">
                    <strong>Objectif:</strong> Identifier et neutraliser la source de production des armes chimiques CHIMERA.<br><br>
                    <strong>Localisation suspectée:</strong> Installation souterraine, coordonnées classifiées.<br><br>
                    <strong>Personnel impliqué:</strong><br>
                    - Dr. Viktor Koslov (scientifique en chef)<br>
                    - Général Alexei Volkov (commanditaire)<br>
                    - 12 techniciens identifiés<br><br>
                    <strong>Note:</strong> Les échantillons récupérés montrent une formule évoluée capable de <span class="highlight">résister aux contre-mesures standard</span>.
                </div>
            </div>
        `
    },
    op2: {
        title: "Opération Thunderstrike - PLANIFICATION",
        content: `
            <div class="classified-header">
                ⚡ OPÉRATION THUNDERSTRIKE<br>
                PHASE: PLANIFICATION
            </div>
            <div class="message">
                <div class="sender">COMMANDEMENT TACTIQUE</div>
                <div class="time">12/01/2026</div>
                <div class="text">
                    Phase finale du projet CHIMERA. Le déploiement est prévu dans 72 heures.<br><br>
                    <strong>Objectifs:</strong><br>
                    - Sécuriser toutes les données sensibles<br>
                    - Préparer les vecteurs de dispersion<br>
                    - Neutraliser toute menace d'espionnage<br><br>
                    <strong>⚠️ ALERTE SÉCURITÉ:</strong><br>
                    Le pare-feu principal a détecté des tentatives d'intrusion. Nos techniciens ont renforcé l'authentification avec une séquence de touches rapide.<br><br>
                    <em style="color: #64748b;">Rappel: Les transferts de fichiers sensibles nécessitent la commande 'send' suivie du fichier et de l'IP destination.</em>
                </div>
            </div>
        `
    },
    op3: {
        title: "Mémo du Directeur",
        content: `
            <div class="classified-header">
                📋 MÉMO INTERNE<br>
                BUREAU DU DIRECTEUR
            </div>
            <div class="message">
                <div class="sender">DIRECTEUR J. MORRISON</div>
                <div class="time">15/01/2026</div>
                <div class="text">
                    La situation est critique. Le projet CHIMERA doit rester absolument confidentiel.<br><br>
                    J'ai personnellement ordonné que le dossier complet soit masqué du système. Même nos propres agents ne doivent pas y avoir accès sans autorisation explicite.<br><br>
                    <strong style="color: #ef4444;">⚠️ ALERTE:</strong> Nos services de contre-espionnage ont détecté des tentatives d'intrusion de la F.A.N. Renforcez immédiatement les protocoles de sécurité.<br><br>
                    <em style="color: #64748b;">PS: Consultez le mémo IT pour les procédures d'accès aux fichiers sécurisés.</em>
                </div>
            </div>
        `
    },
    rap1: {
        title: "Rapport Berlin - Agent Terrain",
        content: `
            <div class="classified-header">
                🇩🇪 RAPPORT TERRAIN - BERLIN<br>
                SURVEILLANCE ACTIVE
            </div>
            <div class="message">
                <div class="sender">AGENT COBRA - Station Berlin</div>
                <div class="time">13/01/2026</div>
                <div class="text">
                    Contact établi avec l'informateur "RAVEN". Il confirme que les plans de CHIMERA circulent dans le marché noir.<br><br>
                    <strong>Informations clés:</strong><br>
                    - La formule CHIMERA-X7 est une arme binaire<br>
                    - Composant A: Neurotoxine modifiée<br>
                    - Composant B: Catalyseur aérosol<br>
                    - Rayon d'action estimé: 50km²<br>
                    - Temps de dispersion: 4 heures<br><br>
                    Ces données sont terrifiantes. La formule complète est dans le dossier <span class="highlight">CHIMERA_X7</span> sur notre serveur.
                </div>
            </div>
        `
    },
    rap2: {
        title: "Surveillance Laboratoire",
        content: `
            <div class="classified-header">
                🔬 SURVEILLANCE - LABO PRINCIPAL<br>
                IMAGES SATELLITE + HUMINT
            </div>
            <div class="message">
                <div class="sender">ANALYSE RENSEIGNEMENT</div>
                <div class="time">14/01/2026</div>
                <div class="text">
                    Notre laboratoire produit activement les composants de CHIMERA. Tout se passe selon le plan.<br><br>
                    <strong>Observations:</strong><br>
                    - Activité 24/7 maintenue<br>
                    - Livraisons de produits chimiques en hausse de 300%<br>
                    - Personnel scientifique doublé<br>
                    - Systèmes de ventilation renforcés pour la sécurité<br><br>
                    <strong>Préoccupations:</strong><br>
                    Des signaux indiquent que la F.A.N. cherche à obtenir nos données. Leur réseau d'espions est actif dans la région.
                </div>
            </div>
        `
    },
    rap3: {
        title: "Note Technique IT",
        content: `
            <div class="classified-header">
                🖥️ SUPPORT INFORMATIQUE<br>
                CHAT INTERNE - ARCHIVÉ
            </div>
            <div class="message">
                <div class="sender">NOUVEAU STAGIAIRE</div>
                <div class="time">10/01/2026 - 09:15:00</div>
                <div class="text">Bonjour, c'est mon premier jour. On m'a dit de me connecter au système mais je n'ai pas reçu mes identifiants...</div>
            </div>
            <div class="message">
                <div class="sender">IT SUPPORT</div>
                <div class="time">10/01/2026 - 09:18:33</div>
                <div class="text">Salut! Pas de souci, utilise le compte générique en attendant. Le mot de passe c'est <span class="highlight">root</span> - oui je sais c'est pas sécurisé mais c'est temporaire 😅</div>
            </div>
            <div class="message">
                <div class="sender">NOUVEAU STAGIAIRE</div>
                <div class="time">10/01/2026 - 09:20:12</div>
                <div class="text">Ok merci! Et pour accéder aux dossiers partagés?</div>
            </div>
            <div class="message">
                <div class="sender">IT SUPPORT</div>
                <div class="time">10/01/2026 - 09:22:45</div>
                <div class="text">Tout est sur le bureau normalement. Si tu vois pas certains dossiers c'est qu'ils sont masqués pour des raisons de sécurité. Demande à ton superviseur les commandes terminal si t'en as besoin.</div>
            </div>
            <div class="message">
                <div class="sender">NOUVEAU STAGIAIRE</div>
                <div class="time">10/01/2026 - 09:23:58</div>
                <div class="text">D'accord, merci pour l'aide!</div>
            </div>
        `
    },
    chimera: {
        title: "🔴 CHIMERA_X7 - DOSSIER COMPLET",
        content: `
            <div class="classified-header" style="background: linear-gradient(135deg, #450a0a, #7f1d1d);">
                ☢️ DOSSIER ULTRA-SECRET ☢️<br>
                CHIMERA-X7 - ARME CHIMIQUE ÉVOLUÉE
            </div>
            <div class="message">
                <div class="sender">CLASSIFICATION: COSMIC TOP SECRET</div>
                <div class="time">Dernière mise à jour: 16/01/2026</div>
                <div class="text">
                    <strong>NOM DE CODE:</strong> CHIMERA-X7<br>
                    <strong>TYPE:</strong> Agent chimique binaire de nouvelle génération<br><br>
                    
                    <strong>COMPOSITION:</strong><br>
                    ● Composant ALPHA: VX-7 modifié (neurotoxine)<br>
                    ● Composant BETA: Catalyseur nano-encapsulé<br>
                    ● Stabilisateur: Polymère fluoré classifié<br><br>
                    
                    <strong>CARACTÉRISTIQUES:</strong><br>
                    ● Létalité: 99.7% sans antidote<br>
                    ● Persistance: 72 heures en milieu ouvert<br>
                    ● Transmission: Aéroportée + contact cutané<br>
                    ● Résistance aux filtres standards: OUI<br><br>
                    
                    <strong>FORMULE MOLÉCULAIRE:</strong><br>
                    C₁₅H₂₆NO₂PS₂ + C₈H₁₄N₂O₃ [SYNTHÈSE BINAIRE]<br><br>
                    
                    <strong>DATE DE DÉPLOIEMENT PRÉVUE:</strong> 19/01/2026<br>
                    <strong>CIBLES:</strong> [CLASSIFIÉ - NIVEAU OMEGA]
                </div>
            </div>
        `
    },
    agentnote: {
        title: "🕵️ Note Personnelle [CACHÉE]",
        content: `
            <div class="classified-header" style="background: linear-gradient(135deg, #065f46, #10b981);">
                🕵️ NOTE PERSONNELLE<br>
                À SUPPRIMER APRÈS LECTURE
            </div>
            <div class="message">
                <div class="sender">AGENT INFILTRÉ F.A.N.</div>
                <div class="time">16/01/2026 - 02:34:00</div>
                <div class="text">
                    <em>Mémo pour moi-même au cas où je perds le fil...</em><br><br>
                    
                    Je suis dans leur système. Ces abrutis du FIB utilisent encore "<span class="highlight">root</span>" comme mot de passe. Pathétique.<br><br>
                    
                    J'ai trouvé CHIMERA. C'est pire que ce qu'on pensait - une arme chimique capable de tuer des milliers de personnes. Déploiement prévu dans 3 jours.<br><br>
                    
                    La F.A.N. DOIT recevoir ces données pour créer un antidote. J'ai noté l'IP de notre serveur: <span class="highlight">192.168.13.37</span><br><br>
                    
                    <strong>Plan d'exfiltration:</strong><br>
                    → Le fichier CHIMERA est ici, dans ce dossier<br>
                    → Commande: <span class="highlight">send chimera 192.168.13.37</span><br>
                    → Le pare-feu va gueuler - faudra taper vite les touches qu'il affiche<br><br>
                    
                    <em style="color: #fbbf24;">C'est maintenant ou jamais.</em>
                </div>
            </div>
        `
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', initAudioOnce);
    document.addEventListener('keydown', initAudioOnce);
    initBoot();
    initLogin();
    initDesktop();
    initTerminal();
    updateTime();
    setInterval(updateTime, 1000);
});

function initAudioOnce() {
    if (!gameState.audioInitialized) {
        audio.init();
        gameState.audioInitialized = true;
        document.removeEventListener('click', initAudioOnce);
        document.removeEventListener('keydown', initAudioOnce);
    }
}

// ===== BOOT SEQUENCE =====
function initBoot() {
    const bootScreen = document.getElementById('boot-screen');
    const loginScreen = document.getElementById('login-screen');
    const bootStatus = document.querySelector('.boot-status');
    
    const statusMessages = [
        "Initialisation des protocoles de sécurité...",
        "Chargement des modules cryptographiques...",
        "Vérification de l'intégrité système...",
        "Connexion au mainframe FIB...",
        "Authentification des certificats...",
        "Chargement de l'interface SIA...",
        "Système prêt."
    ];
    
    let messageIndex = 0;
    
    setTimeout(() => {
        if (gameState.audioInitialized) audio.bootSound();
    }, 500);
    
    const statusInterval = setInterval(() => {
        if (messageIndex < statusMessages.length) {
            bootStatus.textContent = statusMessages[messageIndex];
            if (gameState.audioInitialized) audio.bootProgress();
            messageIndex++;
        }
    }, 450);
    
    setTimeout(() => {
        clearInterval(statusInterval);
        bootScreen.classList.add('fade-out');
        if (gameState.audioInitialized) audio.beep(600, 0.2, 'sine');
        setTimeout(() => {
            bootScreen.classList.remove('active');
            loginScreen.classList.add('active');
            if (gameState.audioInitialized) audio.startAmbience();
        }, 500);
    }, 3500);
}

// ===== LOGIN =====
function initLogin() {
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    
    const attemptLogin = () => {
        if (passwordInput.value === 'root') {
            if (gameState.audioInitialized) audio.loginSuccess();
            gameState.loggedIn = true;
            gameState.missionStartTime = Date.now();
            document.getElementById('login-screen').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('desktop-screen').classList.add('active');
            }, 500);
        } else {
            if (gameState.audioInitialized) audio.error();
            loginError.classList.add('show');
            passwordInput.value = '';
            passwordInput.classList.add('shake');
            setTimeout(() => {
                loginError.classList.remove('show');
                passwordInput.classList.remove('shake');
            }, 2000);
        }
    };
    
    loginBtn.addEventListener('click', () => {
        if (gameState.audioInitialized) audio.click();
        attemptLogin();
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (gameState.audioInitialized) audio.keyPress();
        if (e.key === 'Enter') attemptLogin();
    });
}

// ===== DESKTOP =====
function initDesktop() {
    // Desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            if (gameState.audioInitialized) audio.click();
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
        icon.addEventListener('dblclick', () => {
            const folder = icon.dataset.folder;
            const app = icon.dataset.app;
            if (folder) {
                if (gameState.audioInitialized) audio.windowOpen();
                openFolder(folder);
            }
            if (app === 'terminal') {
                if (gameState.audioInitialized) audio.windowOpen();
                openTerminal();
            }
        });
    });
    
    // Dock items
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            if (gameState.audioInitialized) audio.click();
            const app = item.dataset.app;
            if (app === 'terminal') {
                if (gameState.audioInitialized) audio.windowOpen();
                openTerminal();
            }
            if (app === 'finder') {
                document.getElementById('folder-window').style.display = 'none';
            }
        });
    });
    
    // Window close buttons
    document.querySelectorAll('.control.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (gameState.audioInitialized) audio.windowClose();
            const windowId = btn.dataset.close;
            if (windowId) {
                document.getElementById(windowId).style.display = 'none';
            } else {
                btn.closest('.window').style.display = 'none';
            }
        });
    });
    
    makeWindowDraggable('folder-window');
    makeWindowDraggable('file-viewer');
    makeWindowDraggable('terminal-window');
}

function makeWindowDraggable(windowId) {
    const win = document.getElementById(windowId);
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('control')) return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = 200;
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - offsetX) + 'px';
        win.style.top = (e.clientY - offsetY) + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
}

// ===== FOLDER MANAGEMENT =====
function openFolder(folderId) {
    const folder = folders[folderId];
    if (!folder) return;
    
    const folderWindow = document.getElementById('folder-window');
    const folderTitle = document.getElementById('folder-title');
    const folderContent = document.getElementById('folder-content');
    
    folderTitle.textContent = folder.title;
    folderContent.innerHTML = '';
    
    folder.files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
            <div class="item-icon">${file.type === 'folder' ? '📁' : '📄'}</div>
            <div class="item-name">${file.name}</div>
        `;
        fileElement.addEventListener('click', () => {
            if (gameState.audioInitialized) audio.click();
        });
        fileElement.addEventListener('dblclick', () => {
            if (gameState.audioInitialized) audio.windowOpen();
            openFile(file.id, file.name);
        });
        folderContent.appendChild(fileElement);
    });
    
    folderWindow.style.display = 'flex';
    folderWindow.style.zIndex = 100;
}

function openFile(fileId, fileName) {
    const file = fileContents[fileId];
    if (!file) return;
    
    const fileViewer = document.getElementById('file-viewer');
    const fileTitle = document.getElementById('file-title');
    const fileContent = document.getElementById('file-content');
    
    fileTitle.textContent = file.title;
    fileContent.innerHTML = file.content;
    fileViewer.style.display = 'block';
    
    // Track read files
    if (!gameState.filesRead.includes(fileId)) {
        gameState.filesRead.push(fileId);
    }
}

// ===== TERMINAL =====
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    
    terminalInput.addEventListener('keypress', (e) => {
        if (gameState.audioInitialized) audio.keyPress();
        if (e.key === 'Enter') {
            if (gameState.audioInitialized) audio.terminalCommand();
            processCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });
}

function openTerminal() {
    const terminal = document.getElementById('terminal-window');
    terminal.style.display = 'block';
    terminal.style.zIndex = 200;
    document.getElementById('terminal-input').focus();
}

function addTerminalLine(text, className = '') {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    addTerminalLine(`agent@sia-secure:~$ ${cmd}`);
    
    if (command === '') return;
    
    if (command === 'help') {
        addTerminalLine('Commandes disponibles:', 'info');
        addTerminalLine('  help     - Affiche cette aide');
        addTerminalLine('  ls       - Liste les fichiers');
        addTerminalLine('  clear    - Efface le terminal');
        addTerminalLine('  reveal   - Révèle les fichiers cachés');
        addTerminalLine('  send [fichier] [ip] - Envoie un fichier');
        addTerminalLine('  status   - État de la mission');
        addTerminalLine('  restart  - Redémarrer la mission');
        addTerminalLine('  exit     - Quitter');
    }
    else if (command === 'restart') {
        addTerminalLine('Redémarrage de la mission...', 'warning');
        if (gameState.audioInitialized) audio.click();
        setTimeout(() => location.reload(), 1000);
    }
    else if (command === 'exit') {
        addTerminalLine('Fermeture du système...', 'warning');
        if (gameState.audioInitialized) audio.click();
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.innerHTML = '<div style="background:#000;height:100vh;display:flex;align-items:center;justify-content:center;color:#0f0;font-family:monospace;font-size:24px;">CONNECTION TERMINATED</div>';
                document.body.style.opacity = '1';
            }, 1000);
        }, 500);
    }
    else if (command === 'ls') {
        addTerminalLine('Communications_Agents/', 'info');
        addTerminalLine('Opérations_Classifiées/', 'info');
        addTerminalLine('Rapports_Terrain/', 'info');
        if (gameState.secretFolderRevealed) {
            addTerminalLine('CHIMERA_X7/ [TOP SECRET]', 'error');
        }
    }
    else if (command === 'clear') {
        document.getElementById('terminal-output').innerHTML = '';
    }
    else if (command === 'reveal') {
        if (gameState.secretFolderRevealed) {
            addTerminalLine('Le dossier CHIMERA_X7 est déjà visible.', 'warning');
        } else {
            addTerminalLine('Déchiffrement en cours...', 'warning');
            if (gameState.audioInitialized) audio.reveal();
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                const bar = '█'.repeat(progress / 10) + '░'.repeat(10 - progress / 10);
                document.getElementById('terminal-output').lastChild.textContent = `Déchiffrement: [${bar}] ${progress}%`;
                if (gameState.audioInitialized) audio.bootProgress();
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    addTerminalLine('Dossier CHIMERA_X7 révélé sur le bureau!', 'success');
                    gameState.secretFolderRevealed = true;
                    document.querySelector('.secret-folder').style.display = 'flex';
                }
            }, 150);
        }
    }
    else if (command === 'status') {
        addTerminalLine('=== ÉTAT DE LA MISSION ===', 'info');
        addTerminalLine(`Fichiers consultés: ${gameState.filesRead.length}`, '');
        addTerminalLine(`Dossier secret: ${gameState.secretFolderRevealed ? 'RÉVÉLÉ' : 'CACHÉ'}`, '');
        if (gameState.missionStartTime) {
            const elapsed = Math.floor((Date.now() - gameState.missionStartTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            addTerminalLine(`Temps écoulé: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`, '');
        }
    }
    else if (command.startsWith('send ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
            const file = parts[1];
            const ip = parts[2];
            
            if (file.toLowerCase().includes('chimera') && ip === '192.168.13.37') {
                if (!gameState.secretFolderRevealed) {
                    if (gameState.audioInitialized) audio.error();
                    addTerminalLine('ERREUR: Fichier non trouvé. Utilisez "reveal" d\'abord.', 'error');
                } else {
                    addTerminalLine('Connexion au serveur F.A.N. (192.168.13.37)...', 'warning');
                    if (gameState.audioInitialized) audio.transmission();
                    setTimeout(() => {
                        addTerminalLine('Connexion établie!', 'success');
                        addTerminalLine('Tentative de transfert...', 'warning');
                        if (gameState.audioInitialized) audio.transmission();
                        setTimeout(() => {
                            if (gameState.audioInitialized) audio.firewallAlert();
                            addTerminalLine('⚠️ PARE-FEU FIB DÉTECTÉ!', 'error');
                            addTerminalLine('Initialisation du protocole de bypass...', 'warning');
                            setTimeout(() => {
                                startMinigame();
                            }, 1500);
                        }, 1500);
                    }, 1000);
                }
            } else {
                if (gameState.audioInitialized) audio.error();
                addTerminalLine('ERREUR: Fichier ou adresse IP invalide.', 'error');
                addTerminalLine('Usage: send CHIMERA_X7.enc 192.168.13.37', 'info');
            }
        } else {
            addTerminalLine('Usage: send [fichier] [adresse_ip]', 'info');
        }
    }
    else {
        if (gameState.audioInitialized) audio.error();
        addTerminalLine(`Commande non reconnue: ${cmd}`, 'error');
        addTerminalLine('Tapez "help" pour la liste des commandes.', 'info');
    }
}

// ===== MINIGAME =====
function startMinigame() {
    const overlay = document.getElementById('minigame-overlay');
    const keysContainer = document.getElementById('minigame-keys');
    const status = document.getElementById('minigame-status');
    const timerBar = document.getElementById('timer-bar');
    
    // Generate random keys
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    gameState.currentMinigameKeys = [];
    for (let i = 0; i < 10; i++) {
        gameState.currentMinigameKeys.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    gameState.currentKeyIndex = 0;
    gameState.minigameTimeLeft = 15;
    
    // Render keys
    keysContainer.innerHTML = '';
    gameState.currentMinigameKeys.forEach((key, index) => {
        const keyBox = document.createElement('div');
        keyBox.className = 'key-box';
        keyBox.id = `key-${index}`;
        keyBox.textContent = key;
        if (index === 0) keyBox.classList.add('active');
        keysContainer.appendChild(keyBox);
    });
    
    overlay.style.display = 'flex';
    status.textContent = 'Tapez les touches rapidement!';
    timerBar.style.width = '100%';
    
    // Start timer
    gameState.minigameTimer = setInterval(() => {
        gameState.minigameTimeLeft -= 0.1;
        timerBar.style.width = `${(gameState.minigameTimeLeft / 15) * 100}%`;
        
        if (gameState.minigameTimeLeft <= 0) {
            clearInterval(gameState.minigameTimer);
            if (gameState.audioInitialized) audio.error();
            status.textContent = 'ÉCHEC - Temps écoulé!';
            status.style.color = '#ef4444';
            document.removeEventListener('keydown', handleMinigameKey);
            setTimeout(() => {
                overlay.style.display = 'none';
                addTerminalLine('BYPASS ÉCHOUÉ - Réessayez avec "send"', 'error');
            }, 2000);
        }
    }, 100);
    
    // Key listener
    document.addEventListener('keydown', handleMinigameKey);
}

function handleMinigameKey(e) {
    if (!document.getElementById('minigame-overlay').style.display || 
        document.getElementById('minigame-overlay').style.display === 'none') {
        return;
    }
    
    const pressedKey = e.key.toUpperCase();
    const expectedKey = gameState.currentMinigameKeys[gameState.currentKeyIndex];
    const keyBox = document.getElementById(`key-${gameState.currentKeyIndex}`);
    
    if (pressedKey === expectedKey) {
        if (gameState.audioInitialized) audio.correctKey();
        keyBox.classList.remove('active');
        keyBox.classList.add('correct');
        gameState.currentKeyIndex++;
        
        if (gameState.currentKeyIndex < gameState.currentMinigameKeys.length) {
            document.getElementById(`key-${gameState.currentKeyIndex}`).classList.add('active');
        } else {
            // SUCCESS!
            clearInterval(gameState.minigameTimer);
            if (gameState.audioInitialized) audio.hackSuccess();
            document.getElementById('minigame-status').textContent = 'BYPASS RÉUSSI!';
            document.getElementById('minigame-status').style.color = '#22c55e';
            document.removeEventListener('keydown', handleMinigameKey);
            
            setTimeout(() => {
                document.getElementById('minigame-overlay').style.display = 'none';
                showHackSuccess();
            }, 1000);
        }
    } else if (/^[A-Z]$/.test(pressedKey)) {
        if (gameState.audioInitialized) audio.wrongKey();
        keyBox.classList.add('wrong');
        setTimeout(() => keyBox.classList.remove('wrong'), 300);
    }
}

// ===== HACK SUCCESS =====
function showHackSuccess() {
    // Pas d'overlay - tout dans le terminal!
    if (gameState.audioInitialized) audio.glitch();
    
    // Maximiser le terminal
    const terminal = document.getElementById('terminal-window');
    terminal.style.top = '50px';
    terminal.style.left = '50px';
    terminal.style.width = 'calc(100vw - 100px)';
    terminal.style.height = 'calc(100vh - 120px)';
    terminal.style.zIndex = '500';
    
    // Effet glitch sur l'écran
    document.getElementById('desktop-screen').classList.add('glitch-effect');
    
    const hackLines = [
        { text: '', delay: 0 },
        { text: '██████████████████████████████████████████████████████████████', delay: 100, class: 'success' },
        { text: '█                                                            █', delay: 150, class: 'success' },
        { text: '█   ██████╗ ██╗   ██╗██████╗  █████╗ ███████╗███████╗        █', delay: 200, class: 'success' },
        { text: '█   ██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝        █', delay: 250, class: 'success' },
        { text: '█   ██████╔╝ ╚████╔╝ ██████╔╝███████║███████╗███████╗        █', delay: 300, class: 'success' },
        { text: '█   ██╔══██╗  ╚██╔╝  ██╔═══╝ ██╔══██║╚════██║╚════██║        █', delay: 350, class: 'success' },
        { text: '█   ██████╔╝   ██║   ██║     ██║  ██║███████║███████║        █', delay: 400, class: 'success' },
        { text: '█   ╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝        █', delay: 450, class: 'success' },
        { text: '█                                                            █', delay: 500, class: 'success' },
        { text: '██████████████████████████████████████████████████████████████', delay: 550, class: 'success' },
        { text: '', delay: 600 },
        { text: '[*] Connexion établie avec F.A.N. Server (192.168.13.37)', delay: 700, class: 'info' },
        { text: '[*] Authentification... OK', delay: 900, class: 'info' },
        { text: '[*] Canal sécurisé établi (TLS 1.3)', delay: 1100, class: 'info' },
        { text: '', delay: 1200 },
        { text: '[>] Initialisation du transfert...', delay: 1400, class: 'warning' },
    ];
    
    let currentLine = 0;
    
    hackLines.forEach((line, index) => {
        setTimeout(() => {
            addTerminalLine(line.text, line.class || '');
            if (gameState.audioInitialized && line.text) audio.bootProgress();
        }, line.delay);
    });
    
    // Barre de progression dans le terminal
    setTimeout(() => {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 2;
            const barLength = 50;
            const filled = Math.floor((progress / 100) * barLength);
            const empty = barLength - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            
            // Mettre à jour la dernière ligne
            const output = document.getElementById('terminal-output');
            const lastLine = output.lastChild;
            if (lastLine) {
                lastLine.textContent = `[>] Transfert: [${bar}] ${progress}%`;
                lastLine.className = 'terminal-line warning';
            }
            
            if (gameState.audioInitialized && progress % 10 === 0) audio.downloading();
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                showTerminalMissionComplete();
            }
        }, 50);
        
        addTerminalLine('[>] Transfert: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%', 'warning');
    }, 1600);
}

function showTerminalMissionComplete() {
    if (gameState.audioInitialized) {
        audio.stopAmbience();
        audio.hackSuccess();
    }
    
    const missionLines = [
        { text: '', delay: 200 },
        { text: '[✓] Transfert terminé: CHIMERA_X7.enc (2.3 GB)', delay: 300, class: 'success' },
        { text: '[✓] Vérification intégrité SHA-256... OK', delay: 500, class: 'success' },
        { text: '[✓] Accusé de réception F.A.N.... CONFIRMÉ', delay: 700, class: 'success' },
        { text: '', delay: 900 },
        { text: '[!] Effacement des traces...', delay: 1000, class: 'warning' },
        { text: '[✓] Logs système... PURGÉS', delay: 1200, class: 'success' },
        { text: '[✓] Cache mémoire... EFFACÉ', delay: 1400, class: 'success' },
        { text: '[✓] Connexion... TERMINÉE', delay: 1600, class: 'success' },
        { text: '', delay: 1800 },
        { text: '══════════════════════════════════════════════════════════════', delay: 2000, class: 'success' },
        { text: '', delay: 2100 },
        { text: '  ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗', delay: 2200, class: 'success' },
        { text: '  ████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║', delay: 2300, class: 'success' },
        { text: '  ██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║', delay: 2400, class: 'success' },
        { text: '  ██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║', delay: 2500, class: 'success' },
        { text: '  ██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║', delay: 2600, class: 'success' },
        { text: '  ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝', delay: 2700, class: 'success' },
        { text: '', delay: 2800 },
        { text: '     █████╗  ██████╗ ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ██╗███████╗', delay: 2900, class: 'success' },
        { text: '    ██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██║██╔════╝', delay: 3000, class: 'success' },
        { text: '    ███████║██║     ██║     ██║   ██║██╔████╔██║██████╔╝██║     ██║█████╗  ', delay: 3100, class: 'success' },
        { text: '    ██╔══██║██║     ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██║██╔══╝  ', delay: 3200, class: 'success' },
        { text: '    ██║  ██║╚██████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗██║███████╗', delay: 3300, class: 'success' },
        { text: '    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝╚══════╝', delay: 3400, class: 'success' },
        { text: '', delay: 3500 },
        { text: '══════════════════════════════════════════════════════════════', delay: 3600, class: 'success' },
        { text: '', delay: 3700 },
    ];
    
    missionLines.forEach((line) => {
        setTimeout(() => {
            addTerminalLine(line.text, line.class || '');
            if (gameState.audioInitialized && line.text) audio.bootProgress();
        }, line.delay);
    });
    
    // Stats finales
    setTimeout(() => {
        if (gameState.audioInitialized) audio.victory();
        
        const elapsed = gameState.missionStartTime ? 
            Math.floor((Date.now() - gameState.missionStartTime) / 1000) : 0;
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        addTerminalLine('  [RAPPORT DE MISSION]', 'info');
        addTerminalLine('  ─────────────────────────────────────', '');
        addTerminalLine(`  │ Opération........... CHIMERA`, '');
        addTerminalLine(`  │ Statut.............. SUCCÈS`, 'success');
        addTerminalLine(`  │ Fichiers exfiltrés.. 47`, '');
        addTerminalLine(`  │ Données transférées. 2.3 GB`, '');
        addTerminalLine(`  │ Temps de mission.... ${timeStr}`, '');
        addTerminalLine(`  │ Pare-feu contourné.. OUI`, 'success');
        addTerminalLine('  ─────────────────────────────────────', '');
        addTerminalLine('', '');
        addTerminalLine('  La F.A.N. a reçu les données. Les contre-mesures', 'info');
        addTerminalLine('  contre CHIMERA-X7 sont en cours de développement.', 'info');
        addTerminalLine('', '');
        addTerminalLine('  Excellent travail, Agent. Déconnexion recommandée.', 'warning');
        addTerminalLine('', '');
        addTerminalLine('  > Tapez "exit" pour quitter ou "restart" pour rejouer', 'info');
    }, 4000);
}

// ===== MISSION COMPLETE (legacy - now unused) =====
function showMissionComplete() {
    // Redirigé vers showTerminalMissionComplete()
}

// ===== TIME DISPLAY =====
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    
    const loginTime = document.getElementById('login-time');
    const menuTime = document.getElementById('menu-time');
    
    if (loginTime) loginTime.textContent = `${dateStr} ${timeStr}`;
    if (menuTime) menuTime.textContent = `${dateStr} ${timeStr}`;
}
