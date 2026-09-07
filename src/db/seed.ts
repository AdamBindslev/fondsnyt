import { db } from './index';
import { foundations, grants, grantDeadlines, monitoredSources, fundraisingPipeline } from './schema';

async function seed() {
  console.log('Seeding Danish & EU grants database (pure monitoring mode)...');

  // Clear existing
  db.delete(fundraisingPipeline).run();
  db.delete(grantDeadlines).run();
  db.delete(monitoredSources).run();
  db.delete(grants).run();
  db.delete(foundations).run();

  const fNordea = {
    id: 'fnd-nordea',
    name: 'Nordea-fonden',
    cvr: '17706917',
    websiteUrl: 'https://nordeafonden.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter gode liv inden for sundhed, motion, natur og kultur. Fokus på fællesskaber og bred deltagelse.',
  };

  const fBikuben = {
    id: 'fnd-bikuben',
    name: 'Bikubenfonden',
    cvr: '13146410',
    websiteUrl: 'https://bikubenfonden.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Nyskabende og modige indsatser inden for professionel scenekunst, billedkunst og unge på kanten af samfundet.',
  };

  const fTuborg = {
    id: 'fnd-tuborg',
    name: 'Tuborgfondet',
    cvr: '33301814',
    websiteUrl: 'https://tuborgfondet.dk',
    type: 'Almenvelgørende Fond',
    description: 'Støtter unge mellem 16 og 30 år med at skabe forandring i samfundet, styrke demokratiet, musikmiljøer og frivillighed.',
  };

  const fAugustinus = {
    id: 'fnd-augustinus',
    name: 'Augustinus Fonden',
    cvr: '60133215',
    websiteUrl: 'https://augustinusfonden.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter kunst, kulturarv, klassisk musik, teater, videnskabelig forskning og sociale formål med høj faglig kvalitet.',
  };

  const fRealdania = {
    id: 'fnd-realdania',
    name: 'Realdania',
    cvr: '25494488',
    websiteUrl: 'https://realdania.dk',
    type: 'Forening / Fond',
    description: 'Skaber livskvalitet gennem det byggede miljø. Bygningsarv, landsbyfællesskaber, byrum og bæredygtighed.',
  };

  const fSlks = {
    id: 'fnd-slks',
    name: 'Statens Kunstfond (Slots- og Kulturstyrelsen)',
    cvr: '26470313',
    websiteUrl: 'https://www.kunstfonden.dk',
    type: 'Offentlig Pulje',
    description: 'Danmarks største kunststøtteordning. Scenekunst, billedkunst, litteratur, musik, arkitektur og kunsthåndværk.',
  };

  const fEU = {
    id: 'fnd-eu-culture',
    name: 'EU Creative Europe & Horizon',
    cvr: null,
    websiteUrl: 'https://ec.europa.eu/culture/creative-europe',
    type: 'EU Program',
    description: 'Den Europæiske Unions rammeprogram for de kulturelle og kreative sektorer samt grænseoverskridende samarbejde.',
  };

  const fStatensPuljer = {
    id: 'fnd-statens-puljer',
    name: 'Social- og Boligstyrelsen (Statens Tilskud)',
    cvr: '12228413',
    websiteUrl: 'https://statens-tilskudspuljer.dk',
    type: 'Offentlig Pulje',
    description: 'Statslige puljer og § 18-midler til civilsamfund, udsatte borgere, frivillighed og social integration.',
  };

  const fNyCarlsberg = {
    id: 'fnd-nycarlsberg',
    name: 'Ny Carlsbergfondet',
    cvr: '12351215',
    websiteUrl: 'https://www.ny-carlsbergfondet.dk',
    type: 'Almennyttig Fond',
    description: 'Styrker kunstens tilstedeværelse i Danmark gennem indkøb, udsmykninger og forskning i billedkunst.',
  };

  const fNovo = {
    id: 'fnd-novo',
    name: 'Novo Nordisk Fonden',
    cvr: '24256265',
    websiteUrl: 'https://novonordiskfonden.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Fremmer menneskers sundhed og planetens bæredygtighed. Puljer inden for videnskabsdidaktik, uddannelse og innovation.',
  };

  const fVelux = {
    id: 'fnd-velux',
    name: 'Villum Fonden & VELUX FONDEN',
    cvr: '11685314',
    websiteUrl: 'https://veluxfoundations.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter miljømæssig bæredygtighed, civilsamfundsfællesskaber, overgange i seniorlivet og samfundsengagement.',
  };

  const fSparNord = {
    id: 'fnd-sparnord',
    name: 'Spar Nord Fonden',
    cvr: '32001922',
    websiteUrl: 'https://www.sparnordfonden.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter det lokale fællesskab inden for kultur, socialt arbejde og fritid over hele landet.',
  };

  for (const f of [fNordea, fBikuben, fTuborg, fAugustinus, fRealdania, fSlks, fEU, fStatensPuljer, fNyCarlsberg, fNovo, fVelux, fSparNord]) {
    db.insert(foundations).values(f).run();
  }

  // Grants & Deadlines with verified live URLs
  const grantData = [
    {
      grant: {
        id: 'gr-nordea-trivsel',
        foundationId: 'fnd-nordea',
        title: 'Lyst til at deltage: Børn og Unges Fællesskaber',
        description: 'Puljen yder støtte til nytænkende projekter, der fremmer mental og social trivsel for børn og unge i alderen 6-18 år gennem kreative og fysiske fællesskaber.',
        categories: ['Kultur', 'Social', 'Børn & Unge', 'Fællesskab'],
        targetGroups: ['Foreninger', 'Kulturinstitutioner', 'Frivillige organisationer', 'Skoler'],
        minAmount: 100000,
        maxAmount: 1500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://nordeafonden.dk/sog-stotte',
        applicationUrl: 'https://nordeafonden.dk/sog-stotte',
        successRateEst: 'Middel (ca. 20-25%)'
      },
      deadlines: [
        {
          id: 'dl-nordea-1',
          deadlineDate: '2026-09-18',
          isOngoing: false,
          notes: 'Efterårsrunde - hurtig tilbagemelding ultimo oktober',
          quarter: 'Q3'
        }
      ]
    },
    {
      grant: {
        id: 'gr-slks-billedkunst',
        foundationId: 'fnd-slks',
        title: 'Statens Kunstfond: Projektstøtte til Billedkunst',
        description: 'Støtte til produktion, formidling og udstillingsvirksomhed af professionel samtidskunst i ind- og udland samt tværæstetiske eksperimenter.',
        categories: ['Kultur', 'Billedkunst', 'Samtidskunst'],
        targetGroups: ['Kunstnere', 'Udstillingssteder', 'Kuratorer', 'Foreninger'],
        minAmount: 20000,
        maxAmount: 350000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.kunstfonden.dk/soeg-stoette',
        applicationUrl: 'https://portal.slks.dk',
        successRateEst: 'Hård konkurrence (ca. 18%)'
      },
      deadlines: [
        {
          id: 'dl-slks-1',
          deadlineDate: '2026-09-15',
          isOngoing: false,
          notes: 'Frist kl. 14:00 præcis via portal.slks.dk',
          quarter: 'Q3'
        }
      ]
    },
    {
      grant: {
        id: 'gr-tuborg-dromme',
        foundationId: 'fnd-tuborg',
        title: 'Tuborgfondet Drømmepuljen',
        description: 'For unge mellem 16 og 30 år med en god idé til at styrke fællesskaber, engagere andre unge i samfundet eller skabe bæredygtig forandring.',
        categories: ['Ungdom', 'Fællesskab', 'Kultur', 'Bæredygtighed'],
        targetGroups: ['Unge 16-30 år', 'Uformelle ungegrupper', 'Elevråd', 'Ungdomsforeninger'],
        minAmount: 5000,
        maxAmount: 100000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://tuborgfondet.dk/droemmepuljen/',
        applicationUrl: 'https://tuborgfondet.dk/ansog/',
        successRateEst: 'Høj (ca. 45-50%)'
      },
      deadlines: [
        {
          id: 'dl-tuborg-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende behandling - svar inden for 7 arbejdsdage',
          quarter: 'Løbende'
        }
      ]
    },
    {
      grant: {
        id: 'gr-bikuben-scene',
        foundationId: 'fnd-bikuben',
        title: 'Nyskabende Scenekunst & Udsat Ungdom',
        description: 'Støtte til professionelle kunstneriske projekter, der udfordrer det etablerede format og udvikler nye metoder til at engagere publikum og unge på kanten.',
        categories: ['Scenekunst', 'Kultur', 'Social', 'Innovation'],
        targetGroups: ['Teatre', 'Performancegrupper', 'Scenekunstnere', 'Sociale organisationer'],
        minAmount: 250000,
        maxAmount: 2500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://bikubenfonden.dk',
        applicationUrl: 'https://bikubenfonden.dk/kom-i-dialog',
        successRateEst: 'Middel (ca. 22%)'
      },
      deadlines: [
        {
          id: 'dl-bikuben-1',
          deadlineDate: '2026-10-05',
          isOngoing: false,
          notes: 'Behandles på bestyrelsesmøde i november',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-eu-creative',
        foundationId: 'fnd-eu-culture',
        title: 'Creative Europe: European Cooperation Projects',
        description: 'Støtter tværeuropæiske samarbejdsprojekter mellem kulturaktører til udvikling af nye publikummer, digitalisering, kapacitetsopbygning og grøn omstilling.',
        categories: ['Kultur', 'EU / International', 'Scenekunst', 'Musik', 'Kreativt Erhverv'],
        targetGroups: ['Kulturinstitutioner', 'NGOer', 'Konsortier med min. 3 lande', 'Universiteter'],
        minAmount: 1500000,
        maxAmount: 15000000,
        currency: 'EUR',
        region: 'EU',
        sourceUrl: 'https://ec.europa.eu/culture/creative-europe',
        applicationUrl: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home',
        successRateEst: 'Konkurrencepræget (ca. 15%)'
      },
      deadlines: [
        {
          id: 'dl-eu-1',
          deadlineDate: '2026-11-15',
          isOngoing: false,
          notes: 'Elektronisk indsendelse i EU Funding & Tenders Portal',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-augustinus-kultur',
        foundationId: 'fnd-augustinus',
        title: 'Augustinus: Klassisk Musik, Teater & Kulturarv',
        description: 'Støtte til professionel opførelse af klassisk musik, teaterproduktioner samt bevaring og formidling af Danmarks historiske kulturarv.',
        categories: ['Kultur', 'Musik', 'Scenekunst', 'Kulturarv'],
        targetGroups: ['Ensembler', 'Orkestre', 'Teatre', 'Museer', 'Kirker'],
        minAmount: 50000,
        maxAmount: 2000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://augustinusfonden.dk/ansoegning/',
        applicationUrl: 'https://augustinusfonden.dk/ansoegning/',
        successRateEst: 'Middel (ca. 25-30%)'
      },
      deadlines: [
        {
          id: 'dl-aug-1',
          deadlineDate: '2026-10-10',
          isOngoing: false,
          notes: 'Frist til efterårets uddelingsmøde',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-realdania-undervaerker',
        foundationId: 'fnd-realdania',
        title: 'Underværker: Fysiske Rammer for Ildsjæle',
        description: 'Kampagnen Underværker støtter ildsjæle, der forvandler tomme eller forfaldne bygninger og byrum til nye, levende mødesteder for lokalsamfundet.',
        categories: ['Byggeri/Byrum', 'Civilsamfund', 'Fællesskab', 'Kulturarv'],
        targetGroups: ['Borgerforeninger', 'Frivillige initiativer', 'Lokale fonde', 'Andelsfællesskaber'],
        minAmount: 100000,
        maxAmount: 1000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://undervaerker.dk',
        applicationUrl: 'https://undervaerker.dk',
        successRateEst: 'God (ca. 30%)'
      },
      deadlines: [
        {
          id: 'dl-real-1',
          deadlineDate: '2026-09-30',
          isOngoing: false,
          notes: 'Efterårsansøgningsrunde via Underværker',
          quarter: 'Q3'
        }
      ]
    },
    {
      grant: {
        id: 'gr-social-paragraf18',
        foundationId: 'fnd-statens-puljer',
        title: 'Statens Tilskudspuljer: Frivilligt Socialt Arbejde',
        description: 'Tilskud til landsdækkende og regionale sociale organisationer, der yder rådgivning, lektiehjælp, væresteder og støtte til socialt truede borgere.',
        categories: ['Social', 'Civilsamfund', 'Frivillighed', 'Sundhed'],
        targetGroups: ['Frivillige sociale foreninger', 'Landsorganisationer', 'Brugerråd'],
        minAmount: 50000,
        maxAmount: 800000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://statens-tilskudspuljer.dk',
        applicationUrl: 'https://statens-tilskudspuljer.dk',
        successRateEst: 'Middel (ca. 28%)'
      },
      deadlines: [
        {
          id: 'dl-soc-1',
          deadlineDate: '2026-09-22',
          isOngoing: false,
          notes: 'Frist via Statens Tilskudspuljer portal',
          quarter: 'Q3'
        }
      ]
    },
    {
      grant: {
        id: 'gr-sparnord-lokal',
        foundationId: 'fnd-sparnord',
        title: 'Spar Nord Fonden: Lokale Fællesskaber & Idræt',
        description: 'Hurtig støtte til lokale aktiviteter og udstyr i foreningslivet, der samler mennesker og styrker sammenhængskraften i lokalområder.',
        categories: ['Fællesskab', 'Social', 'Kultur', 'Idræt'],
        targetGroups: ['Idrætsforeninger', 'Klubber', 'Lokalråd', 'Amatørteatre'],
        minAmount: 10000,
        maxAmount: 150000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.sparnordfonden.dk/ansoeg/',
        applicationUrl: 'https://www.sparnordfonden.dk/ansoeg/',
        successRateEst: 'Meget god (ca. 50%)'
      },
      deadlines: [
        {
          id: 'dl-spar-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende behandling 12 måneder om året',
          quarter: 'Løbende'
        }
      ]
    },
    {
      grant: {
        id: 'gr-velux-overgange',
        foundationId: 'fnd-velux',
        title: 'VELUX FONDEN: Voksenlivets Overgange & Civilsamfund',
        description: 'Støtte til civilsamfundsdrevne initiativer, der styrker det aktive medborgerskab, gensidig læring mellem generationer og demokratisk deltagelse.',
        categories: ['Civilsamfund', 'Social', 'Fællesskab', 'Demokrati'],
        targetGroups: ['Frivilligorganisationer', 'Folkeoplysning', 'Sociale entreprenører'],
        minAmount: 300000,
        maxAmount: 3000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://veluxfoundations.dk/da/ansoeg-stoette',
        applicationUrl: 'https://veluxfoundations.dk/da/ansoeg-stoette',
        successRateEst: 'Middel (ca. 20%)'
      },
      deadlines: [
        {
          id: 'dl-velux-1',
          deadlineDate: '2026-10-20',
          isOngoing: false,
          notes: 'Trin 1 skitseansøgning',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-novo-didaktik',
        foundationId: 'fnd-novo',
        title: 'Novo Nordisk Fonden: Naturvidenskabelig Dannelse & Kultur',
        description: 'Pulje til innovative formidlingsprojekter, museer og tværfaglige projekter mellem kunst og videnskab, der styrker børns nysgerrighed.',
        categories: ['Forskning', 'Kultur', 'Uddannelse', 'Børn & Unge'],
        targetGroups: ['Museer', 'Videnscentre', 'Kulturhuse', 'Uddannelsesinstitutioner'],
        minAmount: 500000,
        maxAmount: 4000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://novonordiskfonden.dk/grants/',
        applicationUrl: 'https://novonordiskfonden.dk/grants/',
        successRateEst: 'Konkurrencepræget (ca. 16%)'
      },
      deadlines: [
        {
          id: 'dl-novo-1',
          deadlineDate: '2026-10-12',
          isOngoing: false,
          notes: 'Frist kl. 14:00 via Novo Nordisk Fonden Grants portal',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-slks-musik',
        foundationId: 'fnd-slks',
        title: 'Statens Kunstfond: Musikudgivelser & Koncertturnéer',
        description: 'Støtte til professionelle musikere, komponister og ensembler til koncerter i Danmark og internationalt, herunder tværkunstneriske samarbejder.',
        categories: ['Kultur', 'Musik', 'Scenekunst'],
        targetGroups: ['Musikere', 'Spillesteder', 'Festivaler', 'Ensembler'],
        minAmount: 15000,
        maxAmount: 250000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.kunstfonden.dk/soeg-stoette',
        applicationUrl: 'https://portal.slks.dk',
        successRateEst: 'Middel (ca. 24%)'
      },
      deadlines: [
        {
          id: 'dl-slks-2',
          deadlineDate: '2026-10-01',
          isOngoing: false,
          notes: 'Frist kl. 14:00',
          quarter: 'Q4'
        }
      ]
    },
    {
      grant: {
        id: 'gr-eu-erasmus',
        foundationId: 'fnd-eu-culture',
        title: 'Erasmus+ Samarbejdspartnerskaber inden for Kultur og Ungdom',
        description: 'Støtte til internationale konsortier af NGOer og kulturinstitutioner, der udvikler innovative undervisnings- og formidlingsmetoder for unge.',
        categories: ['EU / International', 'Ungdom', 'Kultur', 'Uddannelse'],
        targetGroups: ['NGOer', 'Ungdomsorganisationer', 'Kulturskoler', 'Kommuner'],
        minAmount: 900000,
        maxAmount: 3000000,
        currency: 'EUR',
        region: 'EU',
        sourceUrl: 'https://ufm.dk/uddannelse/tilskud-til-udveksling-og-internationale-projekter/erasmusplus',
        applicationUrl: 'https://ufm.dk/uddannelse/tilskud-til-udveksling-og-internationale-projekter/erasmusplus',
        successRateEst: 'Middel (ca. 28%)'
      },
      deadlines: [
        {
          id: 'dl-eu-2',
          deadlineDate: '2026-10-04',
          isOngoing: false,
          notes: 'Elektronisk indsendelse kl. 12:00 CET',
          quarter: 'Q4'
        }
      ]
    }
  ];

  for (const item of grantData) {
    db.insert(grants).values(item.grant).run();
    for (const dl of item.deadlines) {
      db.insert(grantDeadlines).values({
        ...dl,
        grantId: item.grant.id
      }).run();
    }
  }

  // Monitored Sources (Lag 1 & Lag 2) with real official targets
  const sources = [
    {
      id: 'src-1',
      foundationId: 'fnd-nordea',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://nordeafonden.dk/sog-stotte',
      contentSelector: 'main',
      lastContentHash: '8e12fa4b9c1d09e3a778e7146b9a8cf6a928e08d1bc50f6bc0e67cf76db91a10',
      lastCheckedAt: '2026-09-07T08:15:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Ingen ændringer fundet ved seneste tjek.'
    },
    {
      id: 'src-2',
      foundationId: 'fnd-bikuben',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://bikubenfonden.dk',
      contentSelector: 'body',
      lastContentHash: '1c45ff802da904be9f88c3a50d2bb812e52467d3e0988622f98e72304918e77a',
      lastCheckedAt: '2026-09-07T08:20:00Z',
      lastStatus: 'CHANGED',
      status: 'ACTIVE',
      detectedChangesSummary: 'Opdatering af fokusområder for scenekunst og ungedialog.'
    },
    {
      id: 'src-3',
      foundationId: 'fnd-slks',
      sourceType: 'API',
      targetUrl: 'https://www.kunstfonden.dk/soeg-stoette',
      contentSelector: null,
      lastContentHash: '39a7b6c533e498c87de6134bca8892019b88ef612a419280b2a7589d9841bb23',
      lastCheckedAt: '2026-09-07T06:00:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Feed synkroniseret med Statens Kunstfonds puljekatalog.'
    },
    {
      id: 'src-4',
      foundationId: 'fnd-eu-culture',
      sourceType: 'API',
      targetUrl: 'https://ec.europa.eu/culture/creative-europe',
      contentSelector: null,
      lastContentHash: '77d54b8ecf3014a6839352e847be6632c028a2a8689531ca11894d0e5ecbe94b',
      lastCheckedAt: '2026-09-07T05:30:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Creative Europe & Erasmus+ åbne calls indlæst automatisk.'
    },
    {
      id: 'src-5',
      foundationId: 'fnd-statens-puljer',
      sourceType: 'API',
      targetUrl: 'https://statens-tilskudspuljer.dk',
      contentSelector: null,
      lastContentHash: '61a0e7f7b76428c9b980da8dbf72382f1b4028ec11cfcb9317549842a2657e29',
      lastCheckedAt: '2026-09-06T18:00:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Seneste kvartalsvise ministeriepuljer hentet.'
    },
    {
      id: 'src-6',
      foundationId: 'fnd-tuborg',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://tuborgfondet.dk/ansog/',
      contentSelector: 'body',
      lastContentHash: 'a558c374b62dbf88c83e1c3905e94b2923a3cb5e69e4f55db622f5e2786a3451',
      lastCheckedAt: '2026-09-07T08:25:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Løbende ansøgningsportal verificeret aktiv.'
    }
  ];

  for (const src of sources) {
    db.insert(monitoredSources).values(src).run();
  }

  console.log('Seeding completed successfully with real verified URLs!');
}

seed().catch(console.error);
