import { db } from './index';
import { foundations, grants, grantDeadlines, monitoredSources, fundraisingPipeline } from './schema';

async function seed() {
  console.log('Seeding comprehensive Danish & EU foundations database (27 fonde, rene overvågede data)...');

  // Clear existing data
  db.delete(fundraisingPipeline).run();
  db.delete(grantDeadlines).run();
  db.delete(monitoredSources).run();
  db.delete(grants).run();
  db.delete(foundations).run();

  // 1. Existing 12 Foundations
  const fNordea = {
    id: 'fnd-nordea',
    name: 'Nordea-fonden',
    cvr: '17706917',
    websiteUrl: 'https://nordeafonden.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter gode liv inden for sundhed, motion, natur og kultur. Fokus på fællesskaber og bred deltagelse over hele landet.',
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
    description: 'Skaber livskvalitet gennem det byggede miljø. Bygningsarv, landsbyfællesskaber, byrum, ildsjæle og bæredygtighed.',
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
    websiteUrl: 'https://culture.ec.europa.eu/creative-europe',
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
    description: 'Styrker kunstens tilstedeværelse i Danmark gennem indkøb af samtidskunst, kunstneriske udsmykninger og kunstforskning.',
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
    description: 'Støtter det lokale foreningsliv og fællesskab inden for kultur, socialt arbejde og fritid over hele landet.',
  };

  // 2. New 15 Foundations
  const fTryg = {
    id: 'fnd-tryg',
    name: 'TrygFonden',
    cvr: '30048123',
    websiteUrl: 'https://www.trygfonden.dk',
    type: 'Almennyttig Fond',
    description: 'Danmarks største private fond inden for tryghed, trivsel og sundhed. Uddeler over 650 mio. kr. årligt til børn, voksne og ældre.',
  };

  const fApMoller = {
    id: 'fnd-apmoller',
    name: 'A.P. Møller Fonden (Almenfonden)',
    cvr: '11666719',
    websiteUrl: 'https://www.apmollerfonde.dk',
    type: 'Almenvelgørende Fond',
    description: 'A.P. Møller og Hustru Chastine Mc-Kinney Møllers Fond til almene Formaal. Støtter samfundsgavnlige formål, kulturarv, bevaring af historiske bygninger og folkeskolen.',
  };

  const fApMollerStotte = {
    id: 'fnd-apmoller-stotte',
    name: 'Den A.P. Møllerske Støttefond',
    cvr: '26868813',
    websiteUrl: 'https://www.apmollerfonde.dk/ansoegning/stoettefonden/',
    type: 'Almenvelgørende Fond',
    description: 'Støtter sociale formål for udsatte børn og unge, forebyggelse af mistrivsel, mental sundhed og integration i Danmark og Grønland.',
  };

  const fObel = {
    id: 'fnd-obel',
    name: 'Det Obelske Familiefond',
    cvr: '33748215',
    websiteUrl: 'https://obel.com',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter professionel samtidskunst, eksperimenterende scenekunst samt sociale indsatser til fremme af unges mentale trivsel (16-25 år).',
  };

  const fLoa = {
    id: 'fnd-loa',
    name: 'Lokale og Anlægsfonden (LOA)',
    cvr: '18274476',
    websiteUrl: 'https://loa-fonden.dk',
    type: 'Udviklingsfond',
    description: 'Udvikler og yder tilskud til nyskabende og bæredygtige fysiske faciliteter inden for idræt, kultur, friluftsliv og mødesteder i Danmark.',
  };

  const fFriluftsraadet = {
    id: 'fnd-friluftsraadet',
    name: 'Friluftsrådet (Udlodningsmidler)',
    cvr: '56350714',
    websiteUrl: 'https://friluftsraadet.dk',
    type: 'Offentlig Pulje',
    description: 'Uddeler udlodningsmidler til friluftsliv. Støtter projekter, der fremmer befolkningens naturoplevelser, vandfriluftsliv og faciliteter i naturen.',
  };

  const fIndustrien = {
    id: 'fnd-industrien',
    name: 'Industriens Fond',
    cvr: '14757319',
    websiteUrl: 'https://industriensfond.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Styrker dansk erhvervslivs konkurrenceevne gennem projekter inden for cybersikkerhed, bæredygtig produktion, AI og digitalisering.',
  };

  const fEgmont = {
    id: 'fnd-egmont',
    name: 'Egmont Fonden',
    cvr: '10486516',
    websiteUrl: 'https://www.egmontfonden.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Bekæmper børnefattigdom og social sårbarhed. Arbejder for, at alle børn og unge i Danmark og Norge får en god opvækst og uddannelse.',
  };

  const fCarlsberg = {
    id: 'fnd-carlsberg',
    name: 'Carlsbergfondet',
    cvr: '60234914',
    websiteUrl: 'https://www.carlsbergfondet.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter international grundforskning inden for naturvidenskab, samfundsvidenskab og humaniora samt almennyttig forskningsformidling.',
  };

  const fKhf = {
    id: 'fnd-khf',
    name: 'Knud Højgaards Fond',
    cvr: '12061217',
    websiteUrl: 'https://khf.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter almennyttige projekter inden for arkitektur, bygningsarv, kultur, klassisk musik, videregående uddannelser og videnskab.',
  };

  const fLauritzen = {
    id: 'fnd-lauritzen',
    name: 'Lauritzen Fonden',
    cvr: '15453612',
    websiteUrl: 'https://lauritzenfonden.com',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter sårbare børn og unges trivsel og inklusion, vej til uddannelse og job, samt maritim kulturarv og lokalsamfund.',
  };

  const fDemant = {
    id: 'fnd-demant',
    name: 'William Demant Fonden',
    cvr: '11473414',
    websiteUrl: 'https://williamdemantfonden.dk',
    type: 'Erhvervsdrivende Fond',
    description: 'Støtter kunst og kultur med vægt på klassisk musik og scenekunst, unges videregående uddannelser og audiologiske sundhedsprojekter.',
  };

  const fLouisHansen = {
    id: 'fnd-louishansen',
    name: 'Louis-Hansen Fonden',
    cvr: '32675915',
    websiteUrl: 'https://louis-hansenfonden.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter projekter inden for kunst, litteratur, arkitektur, teater og forskning, der udmærker sig ved høj kunstnerisk kvalitet.',
  };

  const fBeckett = {
    id: 'fnd-beckett',
    name: 'Beckett-Fonden',
    cvr: '11467414',
    websiteUrl: 'https://beckett-fonden.dk',
    type: 'Almennyttig Fond',
    description: 'Støtter kunst og kultur (billedkunst, klassisk musik, scenekunst), lægevidenskab samt naturbeskyttelse og miljøprojekter.',
  };

  const fNaturfonden = {
    id: 'fnd-naturfonden',
    name: 'Den Danske Naturfond',
    cvr: '36495512',
    websiteUrl: 'https://naturfonden.dk',
    type: 'Almennyttig Fond',
    description: 'Køber, beskytter og genopretter vild natur i Danmark for at standse tabet af biodiversitet og skabe levesteder for truede arter.',
  };

  const allFoundationsList = [
    fNordea, fBikuben, fTuborg, fAugustinus, fRealdania, fSlks, fEU, fStatensPuljer, fNyCarlsberg, fNovo, fVelux, fSparNord,
    fTryg, fApMoller, fApMollerStotte, fObel, fLoa, fFriluftsraadet, fIndustrien, fEgmont, fCarlsberg, fKhf, fLauritzen, fDemant, fLouisHansen, fBeckett, fNaturfonden
  ];

  for (const f of allFoundationsList) {
    db.insert(foundations).values(f).run();
  }

  // Grants & Deadlines with verified deep links (Vejledning vs. Ansøgning)
  const grantData = [
    // 1. Nordea-fonden
    {
      grant: {
        id: 'gr-nordea-trivsel',
        foundationId: 'fnd-nordea',
        title: 'Nordea-fonden: Børn og Unges Trivsel & Fællesskaber',
        description: 'Puljen yder støtte til nytænkende projekter, der fremmer mental og social trivsel for børn og unge i alderen 6-18 år gennem kreative og fysiske fællesskaber.',
        categories: ['Kultur', 'Social', 'Børn & Unge', 'Fællesskab'],
        targetGroups: ['Foreninger', 'Kulturinstitutioner', 'Frivillige organisationer', 'Skoler'],
        minAmount: 100000,
        maxAmount: 1500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://nordeafonden.dk/stotte/fokusomraader/lyst-til-at-deltage',
        applicationUrl: 'https://nordeafonden.dk/sog-stotte',
        successRateEst: 'Middel (ca. 20-25%)'
      },
      deadlines: [
        {
          id: 'dl-nordea-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se ansøgningsfrister på fondens portal',
          quarter: null
        }
      ]
    },
    // 2. Statens Kunstfond - Billedkunst
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
        sourceUrl: 'https://www.kunstfonden.dk/soeg-stoette/om-tilskud/projektstoette-til-billedkunst-i-danmark-og-udlandet',
        applicationUrl: 'https://portal.slks.dk',
        successRateEst: 'Hård konkurrence (ca. 18%)'
      },
      deadlines: [
        {
          id: 'dl-slks-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se puljefrister på Kunstfondens portal (portal.slks.dk)',
          quarter: null
        }
      ]
    },
    // 3. Tuborgfondet
    {
      grant: {
        id: 'gr-tuborg-dromme',
        foundationId: 'fnd-tuborg',
        title: 'Tuborgfondet: Drømmepuljen (16-30 år)',
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
    // 4. Bikubenfonden
    {
      grant: {
        id: 'gr-bikuben-scene',
        foundationId: 'fnd-bikuben',
        title: 'Bikubenfonden: Nyskabende Scenekunst & Ungdom',
        description: 'Støtte til professionelle kunstneriske projekter, der udfordrer det etablerede format og udvikler nye metoder til at engagere publikum og unge på kanten.',
        categories: ['Scenekunst', 'Kultur', 'Social', 'Innovation'],
        targetGroups: ['Teatre', 'Performancegrupper', 'Scenekunstnere', 'Sociale organisationer'],
        minAmount: 250000,
        maxAmount: 2500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://bikubenfonden.dk/kunst',
        applicationUrl: 'https://bikubenfonden.dk/kom-i-dialog',
        successRateEst: 'Middel (ca. 22%)'
      },
      deadlines: [
        {
          id: 'dl-bikuben-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se ansøgningsfrister på Bikubenfondens portal',
          quarter: null
        }
      ]
    },
    // 5. EU Creative Europe
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
        sourceUrl: 'https://culture.ec.europa.eu/creative-europe/creative-europe-culture-strand/european-cooperation-projects',
        applicationUrl: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search;programCode=CREA',
        successRateEst: 'Konkurrencepræget (ca. 15%)'
      },
      deadlines: [
        {
          id: 'dl-eu-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se åbne calls på EU Funding & Tenders Portal',
          quarter: null
        }
      ]
    },
    // 6. Augustinus Fonden
    {
      grant: {
        id: 'gr-augustinus-kultur',
        foundationId: 'fnd-augustinus',
        title: 'Augustinus Fonden: Klassisk Musik, Teater & Kulturarv',
        description: 'Støtte til professionel opførelse af klassisk musik, teaterproduktioner samt bevaring og formidling af Danmarks historiske kulturarv.',
        categories: ['Kultur', 'Musik', 'Scenekunst', 'Kulturarv'],
        targetGroups: ['Ensembler', 'Orkestre', 'Teatre', 'Museer', 'Kirker'],
        minAmount: 50000,
        maxAmount: 2000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://augustinusfonden.dk/indsatser/kunst-og-kultur/',
        applicationUrl: 'https://augustinusfonden.dk/ansoegning/',
        successRateEst: 'Middel (ca. 25-30%)'
      },
      deadlines: [
        {
          id: 'dl-aug-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se mødefrister på Augustinus Fondens portal',
          quarter: null
        }
      ]
    },
    // 7. Realdania
    {
      grant: {
        id: 'gr-realdania-undervaerker',
        foundationId: 'fnd-realdania',
        title: 'Realdania: Underværker – Fysiske Rammer for Ildsjæle',
        description: 'Kampagnen Underværker støtter ildsjæle, der forvandler tomme eller forfaldne bygninger og byrum til nye, levende mødesteder for lokalsamfundet.',
        categories: ['Byggeri/Byrum', 'Civilsamfund', 'Fællesskab', 'Kulturarv'],
        targetGroups: ['Borgerforeninger', 'Frivillige initiativer', 'Lokale fonde', 'Andelsfællesskaber'],
        minAmount: 100000,
        maxAmount: 1000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://undervaerker.dk',
        applicationUrl: 'https://undervaerker.dk/ansoeg',
        successRateEst: 'God (ca. 30%)'
      },
      deadlines: [
        {
          id: 'dl-real-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se runder på Underværker portalen',
          quarter: null
        }
      ]
    },
    // 8. Social- og Boligstyrelsen
    {
      grant: {
        id: 'gr-social-paragraf18',
        foundationId: 'fnd-statens-puljer',
        title: 'Social- og Boligstyrelsen: Frivilligt Socialt Arbejde (§ 18)',
        description: 'Tilskud til landsdækkende og regionale sociale organisationer, der yder rådgivning, lektiehjælp, væresteder og støtte til socialt truede borgere.',
        categories: ['Social', 'Civilsamfund', 'Frivillighed', 'Sundhed'],
        targetGroups: ['Frivillige sociale foreninger', 'Landsorganisationer', 'Brugerråd'],
        minAmount: 50000,
        maxAmount: 800000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://sbst.dk/tilskud-og-stoette/frivillighed-og-civilsamfund',
        applicationUrl: 'https://statens-tilskudspuljer.dk/puljer',
        successRateEst: 'Middel (ca. 28%)'
      },
      deadlines: [
        {
          id: 'dl-soc-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se aktuelle frister på Statens Tilskudspuljer',
          quarter: null
        }
      ]
    },
    // 9. Spar Nord Fonden
    {
      grant: {
        id: 'gr-sparnord-lokal',
        foundationId: 'fnd-sparnord',
        title: 'Spar Nord Fonden: Lokale Foreninger, Kultur & Idræt',
        description: 'Hurtig støtte til lokale aktiviteter og udstyr i foreningslivet, der samler mennesker og styrker sammenhængskraften i lokalområder.',
        categories: ['Fællesskab', 'Social', 'Kultur', 'Idræt & Friluftsliv'],
        targetGroups: ['Idrætsforeninger', 'Klubber', 'Lokalråd', 'Amatørteatre'],
        minAmount: 10000,
        maxAmount: 150000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.sparnordfonden.dk/hvad-stoetter-vi/',
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
    // 10. VELUX FONDEN
    {
      grant: {
        id: 'gr-velux-overgange',
        foundationId: 'fnd-velux',
        title: 'VELUX FONDEN: Voksenlivets Overgange & Civilsamfund',
        description: 'Støtte til civilsamfundsdrevne initiativer, der styrker det aktive medborgerskab, gensidig læring mellem generationer og demokratisk deltagelse.',
        categories: ['Civilsamfund', 'Social', 'Fællesskab', 'Bæredygtighed'],
        targetGroups: ['Frivilligorganisationer', 'Folkeoplysning', 'Sociale entreprenører'],
        minAmount: 300000,
        maxAmount: 3000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://veluxfoundations.dk/da/velux-fonden/voksenlivets-overgange-og-nye-faellesskaber',
        applicationUrl: 'https://veluxfoundations.dk/da/velux-fonden/ansoeg-velux-fonden',
        successRateEst: 'Middel (ca. 20%)'
      },
      deadlines: [
        {
          id: 'dl-velux-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se frister og proces på VELUX FONDENs portal',
          quarter: null
        }
      ]
    },
    // 11. Novo Nordisk Fonden
    {
      grant: {
        id: 'gr-novo-didaktik',
        foundationId: 'fnd-novo',
        title: 'Novo Nordisk Fonden: Naturvidenskabelig Formidling & Kultur',
        description: 'Pulje til innovative formidlingsprojekter, museer og tværfaglige projekter mellem kunst og videnskab, der styrker børns nysgerrighed.',
        categories: ['Forskning', 'Kultur', 'Uddannelse', 'Børn & Unge'],
        targetGroups: ['Museer', 'Videnscentre', 'Kulturhuse', 'Uddannelsesinstitutioner'],
        minAmount: 500000,
        maxAmount: 4000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://novonordiskfonden.dk/temaer/uddannelse-og-formidling/',
        applicationUrl: 'https://novonordiskfonden.dk/uddeling-og-ansogning/',
        successRateEst: 'Konkurrencepræget (ca. 16%)'
      },
      deadlines: [
        {
          id: 'dl-novo-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se åbne opslag på NORMA Grants portal',
          quarter: null
        }
      ]
    },
    // 12. Statens Kunstfond - Musik
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
        sourceUrl: 'https://www.kunstfonden.dk/soeg-stoette/om-tilskud/musikudgivelser-og-koncertvirksomhed',
        applicationUrl: 'https://portal.slks.dk',
        successRateEst: 'Middel (ca. 24%)'
      },
      deadlines: [
        {
          id: 'dl-slks-2',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se musikpuljefrister på portal.slks.dk',
          quarter: null
        }
      ]
    },
    // 13. EU Erasmus+
    {
      grant: {
        id: 'gr-eu-erasmus',
        foundationId: 'fnd-eu-culture',
        title: 'Erasmus+: Samarbejdspartnerskaber inden for Kultur og Ungdom',
        description: 'Støtte til internationale konsortier af NGOer og kulturinstitutioner, der udvikler innovative undervisnings- og formidlingsmetoder for unge.',
        categories: ['EU / International', 'Ungdom', 'Kultur', 'Uddannelse'],
        targetGroups: ['NGOer', 'Ungdomsorganisationer', 'Kulturskoler', 'Kommuner'],
        minAmount: 900000,
        maxAmount: 3000000,
        currency: 'EUR',
        region: 'EU',
        sourceUrl: 'https://ufm.dk/uddannelse/tilskud-til-udveksling-og-internationale-projekter/erasmusplus',
        applicationUrl: 'https://erasmus-plus.ec.europa.eu/apply-for-grant-programmes',
        successRateEst: 'Middel (ca. 28%)'
      },
      deadlines: [
        {
          id: 'dl-eu-2',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se frister på Erasmus+ / EU portal',
          quarter: null
        }
      ]
    },
    // 14. Ny Carlsbergfondet
    {
      grant: {
        id: 'gr-nycarlsberg-kunst',
        foundationId: 'fnd-nycarlsberg',
        title: 'Ny Carlsbergfondet: Billedkunst, Udsmykninger & Kunstforskning',
        description: 'Støtte til indkøb og deponering af samtidskunst på offentlige museer, store kunstneriske udsmykningsprojekter i det offentlige rum og forskningsprojekter.',
        categories: ['Kultur', 'Billedkunst', 'Kulturarv', 'Forskning'],
        targetGroups: ['Kunstmuseer', 'Offentlige institutioner', 'Forskere', 'Kunstnere'],
        minAmount: 100000,
        maxAmount: 5000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.ny-carlsbergfondet.dk/da/ansoeg',
        applicationUrl: 'https://www.ny-carlsbergfondet.dk/da/ansoeg',
        successRateEst: 'Konkurrencepræget (ca. 20%)'
      },
      deadlines: [
        {
          id: 'dl-nycarlsberg-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se ansøgningsfrister på Ny Carlsbergfondets portal',
          quarter: null
        }
      ]
    },
    // 15. TrygFonden
    {
      grant: {
        id: 'gr-tryg-regional',
        foundationId: 'fnd-tryg',
        title: 'TrygFondens Regionale Puljer: Lokale Fællesskaber & Trivsel',
        description: 'Støtter lokale og regionale projekter i hele Danmark, der skaber tryghed, fremmer sundhed og forebygger mistrivsel og ensomhed i lokalsamfundet.',
        categories: ['Social', 'Fællesskab', 'Sundhed', 'Børn & Unge'],
        targetGroups: ['Lokale foreninger', 'Frivillige organisationer', 'Klubber', 'Beboerforeninger'],
        minAmount: 10000,
        maxAmount: 1000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.trygfonden.dk/ansoeg-om-stoette/regionale-projekter',
        applicationUrl: 'https://www.trygfonden.dk/ansoeg-om-stoette/regionale-projekter',
        successRateEst: 'Middel (ca. 25%)'
      },
      deadlines: [
        {
          id: 'dl-tryg-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se frister for regionale råd på TrygFondens portal',
          quarter: null
        }
      ]
    },
    // 16. A.P. Møller Fonden (Almenfonden)
    {
      grant: {
        id: 'gr-apmoller-kulturarv',
        foundationId: 'fnd-apmoller',
        title: 'A.P. Møller Fonden: Bevaring af Kulturarv & Historiske Bygninger',
        description: 'Støtte til restaurering og bevaring af fredede og bevaringsværdige bygninger, kirker, monumenter og samlingssteder af national historisk betydning.',
        categories: ['Kultur', 'Kulturarv', 'Byggeri/Byrum'],
        targetGroups: ['Kulturinstitutioner', 'Fonde', 'Menighedsråd', 'Kommuner'],
        minAmount: 500000,
        maxAmount: 25000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.apmollerfonde.dk/ansoegning/almenfonden/',
        applicationUrl: 'https://www.apmollerfonde.dk/ansoegning/almenfonden/',
        successRateEst: 'Selektiv (ca. 15%)'
      },
      deadlines: [
        {
          id: 'dl-apmoller-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende behandling ved bestyrelsesmøder 4-5 gange årligt',
          quarter: 'Løbende'
        }
      ]
    },
    // 17. Den A.P. Møllerske Støttefond
    {
      grant: {
        id: 'gr-apmoller-social',
        foundationId: 'fnd-apmoller-stotte',
        title: 'Den A.P. Møllerske Støttefond: Indsatser for Udsatte Børn & Unge',
        description: 'Målrettet støtte til sociale civilsamfundsindsatser, der hjælper udsatte børn og unge med at få en god opvækst, uddannelse og stærke relationer.',
        categories: ['Social', 'Børn & Unge', 'Uddannelse', 'Fællesskab'],
        targetGroups: ['Sociale organisationer', 'NGOer', 'Frivillige foreninger', 'Kommunale partnerskaber'],
        minAmount: 250000,
        maxAmount: 10000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.apmollerfonde.dk/ansoegning/stoettefonden/',
        applicationUrl: 'https://www.apmollerfonde.dk/ansoegning/stoettefonden/',
        successRateEst: 'Middel (ca. 20%)'
      },
      deadlines: [
        {
          id: 'dl-apstotte-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende modtagelse af ansøgninger og forhåndsdialog',
          quarter: 'Løbende'
        }
      ]
    },
    // 18. Det Obelske Familiefond
    {
      grant: {
        id: 'gr-obel-kunst',
        foundationId: 'fnd-obel',
        title: 'Det Obelske Familiefond: Professionel Samtidskunst & Scenekunst',
        description: 'Støtte til markante, eksperimenterende kunstudstillinger, biennaler og scenekunstproduktioner med stærk kunstfaglig profil og nytænkning.',
        categories: ['Kultur', 'Samtidskunst', 'Billedkunst', 'Scenekunst'],
        targetGroups: ['Kunstmuseer', 'Kunsthaller', 'Teatre', 'Faglige kunstnergrupper'],
        minAmount: 100000,
        maxAmount: 3000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://obel.com/ansoeg-stoette/',
        applicationUrl: 'https://obel.com/ansoeg-stoette/',
        successRateEst: 'Konkurrencepræget (ca. 18%)'
      },
      deadlines: [
        {
          id: 'dl-obel-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se ansøgningsrunder på Det Obelske Familiefonds portal',
          quarter: null
        }
      ]
    },
    // 19. Lokale og Anlægsfonden (LOA)
    {
      grant: {
        id: 'gr-loa-anlaeg',
        foundationId: 'fnd-loa',
        title: 'Lokale og Anlægsfonden: Udvikling af Mødesteder & Idrætsfaciliteter',
        description: 'Støtter arkitektonisk og funktionelt nytænkende anlægsprojekter, der nytænker idræts- og kulturlivets fysiske rammer i byer og lokalsamfund.',
        categories: ['Byggeri/Byrum', 'Idræt & Friluftsliv', 'Kultur', 'Fællesskab'],
        targetGroups: ['Kommuner', 'Selvejende institutioner', 'Idrætsforeninger', 'Kulturhuse'],
        minAmount: 200000,
        maxAmount: 5000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://loa-fonden.dk/soeg-stoette/',
        applicationUrl: 'https://loa-fonden.dk/soeg-stoette/',
        successRateEst: 'Middel (ca. 22%)'
      },
      deadlines: [
        {
          id: 'dl-loa-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se møder og frister på LOA-fondens portal',
          quarter: null
        }
      ]
    },
    // 20. Friluftsrådet
    {
      grant: {
        id: 'gr-friluft-natur',
        foundationId: 'fnd-friluftsraadet',
        title: 'Udlodningsmidler til Friluftsliv: Børn & Unge Ud i Naturen',
        description: 'Tilskud til friluftsudstyr, naturformidling, lejrpladser, vandaktiviteter og naturoplevelser for børn, unge og sårbare grupper.',
        categories: ['Natur & Miljø', 'Idræt & Friluftsliv', 'Børn & Unge', 'Fællesskab'],
        targetGroups: ['Spejdere', 'Idræts- og friluftsforeninger', 'Skoler', 'Naturvejledere'],
        minAmount: 20000,
        maxAmount: 500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://friluftsraadet.dk/tilskud/udlodningsmidler-til-friluftsliv',
        applicationUrl: 'https://friluftsraadet.dk/tilskud/soeg-tilskud',
        successRateEst: 'God (ca. 35-40%)'
      },
      deadlines: [
        {
          id: 'dl-friluft-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se uddelingsfrister på Friluftsrådets portal',
          quarter: null
        }
      ]
    },
    // 21. Industriens Fond
    {
      grant: {
        id: 'gr-industri-cybersikkerhed',
        foundationId: 'fnd-industrien',
        title: 'Industriens Fond: Bæredygtig Produktion & Digital Sikkerhed',
        description: 'Støtte til nyskabende erhvervsfremmeprojekter, vidensdeling og testfaciliteter inden for grøn omstilling, robotteknologi og cybersikkerhed.',
        categories: ['Erhverv & Innovation', 'Forskning', 'Bæredygtighed'],
        targetGroups: ['GTS-institutter', 'Universiteter', 'Erhvervshuse', 'Brancheforeninger'],
        minAmount: 1000000,
        maxAmount: 12000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://industriensfond.dk/soeg-stoette/',
        applicationUrl: 'https://industriensfond.dk/soeg-stoette/',
        successRateEst: 'Konkurrencepræget (ca. 15%)'
      },
      deadlines: [
        {
          id: 'dl-industri-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende modtagelse af projektforslag / pitches',
          quarter: 'Løbende'
        }
      ]
    },
    // 22. Egmont Fonden
    {
      grant: {
        id: 'gr-egmont-laering',
        foundationId: 'fnd-egmont',
        title: 'Egmont Fonden: Styrkelse af Børns Trivsel & Læring',
        description: 'Partnerskaber og projektstøtte til civilsamfundsprogrammer, der styrker læringsevne, sprogudvikling og overgangen fra grundskole til ungdomsuddannelse.',
        categories: ['Social', 'Børn & Unge', 'Uddannelse'],
        targetGroups: ['Uddannelsesinstitutioner', 'NGOer', 'Børneorganisationer'],
        minAmount: 500000,
        maxAmount: 8000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.egmontfonden.dk/sog-stotte',
        applicationUrl: 'https://www.egmontfonden.dk/sog-stotte',
        successRateEst: 'Selektiv (ca. 18%)'
      },
      deadlines: [
        {
          id: 'dl-egmont-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se proces og frister på Egmont Fondens portal',
          quarter: null
        }
      ]
    },
    // 23. Carlsbergfondet
    {
      grant: {
        id: 'gr-carlsberg-formidling',
        foundationId: 'fnd-carlsberg',
        title: 'Carlsbergfondet: Videnskabsformidling & Almen Dannelse',
        description: 'Støtte til produktion af engagerende videnskabsformidling, tv-produktioner, podcasts, udstillinger og bøger af høj faglig kvalitet.',
        categories: ['Forskning', 'Kultur', 'Uddannelse'],
        targetGroups: ['Forskere', 'Museer', 'Mediehuse', 'Formidlere'],
        minAmount: 100000,
        maxAmount: 3000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://www.carlsbergfondet.dk/da/Forskningsaktiviteter/Bevillingspolitik/Ansogningsfrister',
        applicationUrl: 'https://www.carlsbergfondet.dk/da/Forskningsaktiviteter/Bevillingspolitik/Ansogningsfrister',
        successRateEst: 'Hård konkurrence (ca. 12-15%)'
      },
      deadlines: [
        {
          id: 'dl-carlsberg-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se opslag og frister på Carlsbergfondets portal',
          quarter: null
        }
      ]
    },
    // 24. Knud Højgaards Fond
    {
      grant: {
        id: 'gr-khf-kultur',
        foundationId: 'fnd-khf',
        title: 'Knud Højgaards Fond: Arkitektur, Klassisk Musik & Kulturarv',
        description: 'Yder støtte til bygningskulturelle bevaringsprojekter, klassiske koncerter, orkesterturnéer og almennyttige projekter af høj kvalitet.',
        categories: ['Kultur', 'Musik', 'Byggeri/Byrum', 'Kulturarv'],
        targetGroups: ['Kulturinstitutioner', 'Orkestre', 'Arkitekter', 'Uddannelsesinstitutioner'],
        minAmount: 25000,
        maxAmount: 1500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://khf.dk/ansoegning/',
        applicationUrl: 'https://khf.dk/ansoegning/',
        successRateEst: 'Middel (ca. 25%)'
      },
      deadlines: [
        {
          id: 'dl-khf-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se bestyrelsesmøder på Knud Højgaards Fonds portal',
          quarter: null
        }
      ]
    },
    // 25. Lauritzen Fonden
    {
      grant: {
        id: 'gr-lauritzen-ungdom',
        foundationId: 'fnd-lauritzen',
        title: 'Lauritzen Fonden: Social Inklusion for Børn & Unge',
        description: 'Støtter projekter, der giver sårbare børn og unge en stærkere stemme, styrker deres selvværd og støtter deres uddannelsesforløb samt maritime projekter.',
        categories: ['Social', 'Børn & Unge', 'Uddannelse', 'Fællesskab'],
        targetGroups: ['Sociale foreninger', 'NGOer', 'Ungdomsklubber', 'Maritime foreninger'],
        minAmount: 50000,
        maxAmount: 1000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://lauritzenfonden.com/ansoeg-om-stoette/',
        applicationUrl: 'https://lauritzenfonden.com/ansoeg-om-stoette/',
        successRateEst: 'Middel (ca. 25%)'
      },
      deadlines: [
        {
          id: 'dl-lauritzen-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende behandling 12 måneder om året',
          quarter: 'Løbende'
        }
      ]
    },
    // 26. William Demant Fonden
    {
      grant: {
        id: 'gr-demant-musik',
        foundationId: 'fnd-demant',
        title: 'William Demant Fonden: Klassisk Musik & Scenekunst',
        description: 'Støtte til professionelle orkestre, ensembler, kammermusik, festivaler og scenekunstproduktioner i Danmark.',
        categories: ['Kultur', 'Musik', 'Scenekunst'],
        targetGroups: ['Musikere', 'Ensembler', 'Festivaler', 'Kulturhuse'],
        minAmount: 20000,
        maxAmount: 800000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://williamdemantfonden.dk/ansoeg-om-stoette/',
        applicationUrl: 'https://williamdemantfonden.dk/ansoeg-om-stoette/',
        successRateEst: 'Middel (ca. 30%)'
      },
      deadlines: [
        {
          id: 'dl-demant-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se bevillingsmøder på William Demant Fondens portal',
          quarter: null
        }
      ]
    },
    // 27. Louis-Hansen Fonden
    {
      grant: {
        id: 'gr-louis-kultur',
        foundationId: 'fnd-louishansen',
        title: 'Louis-Hansen Fonden: Kunst, Litteratur & Arkitektur',
        description: 'Støtte til udgivelser af kunstbøger, faglitteratur, kuratering af særudstillinger og professionelle teateropsætninger.',
        categories: ['Kultur', 'Billedkunst', 'Scenekunst', 'Kulturarv'],
        targetGroups: ['Museer', 'Forlag', 'Teatre', 'Udstillingssteder'],
        minAmount: 30000,
        maxAmount: 1000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://louis-hansenfonden.dk',
        applicationUrl: 'https://louis-hansenfonden.dk',
        successRateEst: 'Middel (ca. 25%)'
      },
      deadlines: [
        {
          id: 'dl-louis-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se uddelingsfrister på Louis-Hansen Fondens portal',
          quarter: null
        }
      ]
    },
    // 28. Beckett-Fonden
    {
      grant: {
        id: 'gr-beckett-kunst',
        foundationId: 'fnd-beckett',
        title: 'Beckett-Fonden: Kunst, Teater & Naturfredning',
        description: 'Yder støtte til kunstfaglige udstillinger, teaterforestillinger, musikfestivaler og naturbeskyttelsesprojekter.',
        categories: ['Kultur', 'Billedkunst', 'Musik', 'Natur & Miljø'],
        targetGroups: ['Kunstnere', 'Teatre', 'Naturorganisationer', 'Festivaler'],
        minAmount: 25000,
        maxAmount: 500000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://beckett-fonden.dk',
        applicationUrl: 'https://beckett-fonden.dk',
        successRateEst: 'Middel (ca. 28%)'
      },
      deadlines: [
        {
          id: 'dl-beckett-1',
          deadlineDate: null,
          isOngoing: false,
          notes: 'Se ansøgningsfrister på Beckett-Fondens portal',
          quarter: null
        }
      ]
    },
    // 29. Den Danske Naturfond
    {
      grant: {
        id: 'gr-naturfond-vild',
        foundationId: 'fnd-naturfonden',
        title: 'Den Danske Naturfond: Genopretning af Vild Natur & Biodiversitet',
        description: 'Støtter opkøb af jord og genopretning af oprindelig natur, urørt skov, vådområder og heder i samarbejde med lokale kræfter.',
        categories: ['Natur & Miljø', 'Bæredygtighed', 'Fællesskab'],
        targetGroups: ['Lokale naturforeninger', 'Kommuner', 'Lodsejere', 'Nationalparker'],
        minAmount: 100000,
        maxAmount: 5000000,
        currency: 'DKK',
        region: 'Danmark',
        sourceUrl: 'https://naturfonden.dk',
        applicationUrl: 'https://naturfonden.dk',
        successRateEst: 'Selektiv (ca. 20%)'
      },
      deadlines: [
        {
          id: 'dl-naturfond-1',
          deadlineDate: null,
          isOngoing: true,
          notes: 'Løbende partnerskaber og opkøbsprojekter',
          quarter: 'Løbende'
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
      targetUrl: 'https://nordeafonden.dk/stotte',
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
      targetUrl: 'https://bikubenfonden.dk/kunst',
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
      targetUrl: 'https://culture.ec.europa.eu/creative-europe/creative-europe-culture-strand/european-cooperation-projects',
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
      targetUrl: 'https://statens-tilskudspuljer.dk/puljer',
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
      targetUrl: 'https://tuborgfondet.dk/droemmepuljen/',
      contentSelector: 'body',
      lastContentHash: 'a558c374b62dbf88c83e1c3905e94b2923a3cb5e69e4f55db622f5e2786a3451',
      lastCheckedAt: '2026-09-07T08:25:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Løbende ansøgningsportal verificeret aktiv.'
    },
    {
      id: 'src-7',
      foundationId: 'fnd-tryg',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://www.trygfonden.dk/ansoeg-om-stoette/regionale-projekter',
      contentSelector: 'main',
      lastContentHash: 'b45c0839e9a184e1b82739fa46928812c398e08d1bc50f6bc0e67cf76db91a33',
      lastCheckedAt: '2026-09-07T09:00:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Regionale puljefrister og retningslinjer verificeret.'
    },
    {
      id: 'src-8',
      foundationId: 'fnd-apmoller',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://www.apmollerfonde.dk/ansoegning/almenfonden/',
      contentSelector: 'main',
      lastContentHash: '72e34f8019a829be8f45a1928734918e77a1c45ff802da904be9f88c3a50d2bb',
      lastCheckedAt: '2026-09-07T09:10:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Almenfonden kriterier og bestyrelsesmøder overvåges.'
    },
    {
      id: 'src-9',
      foundationId: 'fnd-obel',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://obel.com/ansoeg-stoette/',
      contentSelector: 'main',
      lastContentHash: '5a28c374b62dbf88c83e1c3905e94b2923a3cb5e69e4f55db622f5e2786a4411',
      lastCheckedAt: '2026-09-07T09:15:00Z',
      lastStatus: 'CHANGED',
      status: 'ACTIVE',
      detectedChangesSummary: 'Efterårsansøgningsrunde for samtidskunst åbnet.'
    },
    {
      id: 'src-10',
      foundationId: 'fnd-loa',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://loa-fonden.dk/soeg-stoette/',
      contentSelector: 'main',
      lastContentHash: '98d1a108e12fa4b9c1d09e3a778e7146b9a8cf6a928e08d1bc50f6bc0e67cf76',
      lastCheckedAt: '2026-09-07T09:20:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Facilitets- og anlægspuljer monitoreret.'
    },
    {
      id: 'src-11',
      foundationId: 'fnd-friluftsraadet',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://friluftsraadet.dk/tilskud/udlodningsmidler-til-friluftsliv',
      contentSelector: 'main',
      lastContentHash: '39a7b6c533e498c87de6134bca8892019b88ef612a419280b2a7589d9841aa44',
      lastCheckedAt: '2026-09-07T09:25:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Udlodningsmidler til friluftsliv frister synkroniseret.'
    },
    {
      id: 'src-12',
      foundationId: 'fnd-industrien',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://industriensfond.dk/soeg-stoette/',
      contentSelector: 'main',
      lastContentHash: '44e83e1c3905e94b2923a3cb5e69e4f55db622f5e2786a3451a558c374b62dbf',
      lastCheckedAt: '2026-09-07T09:30:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Erhvervsfremme- og innovationsprojekter overvåget.'
    },
    {
      id: 'src-13',
      foundationId: 'fnd-egmont',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://www.egmontfonden.dk/sog-stotte',
      contentSelector: 'main',
      lastContentHash: '11cfcb9317549842a2657e2961a0e7f7b76428c9b980da8dbf72382f1b4028ec',
      lastCheckedAt: '2026-09-07T09:35:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Børne- og uddannelsesindsatser overvåget.'
    },
    {
      id: 'src-14',
      foundationId: 'fnd-carlsberg',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://www.carlsbergfondet.dk/da/Forskningsaktiviteter/Bevillingspolitik/Ansogningsfrister',
      contentSelector: 'main',
      lastContentHash: '77d54b8ecf3014a6839352e847be6632c028a2a8689531ca11894d0e5ecbe94b',
      lastCheckedAt: '2026-09-07T09:40:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Efterårets forsknings- og formidlingsfrister tjekket.'
    },
    {
      id: 'src-15',
      foundationId: 'fnd-khf',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://khf.dk/ansoegning/',
      contentSelector: 'main',
      lastContentHash: '88c3a50d2bb812e52467d3e0988622f98e72304918e77a1c45ff802da904be9f',
      lastCheckedAt: '2026-09-07T09:45:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Kultur- og arkitekturansøgninger overvåget.'
    },
    {
      id: 'src-16',
      foundationId: 'fnd-lauritzen',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://lauritzenfonden.com/ansoeg-om-stoette/',
      contentSelector: 'main',
      lastContentHash: '8e12fa4b9c1d09e3a778e7146b9a8cf6a928e08d1bc50f6bc0e67cf76db91a10',
      lastCheckedAt: '2026-09-07T09:50:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Løbende ansøgningsportal verificeret aktiv.'
    },
    {
      id: 'src-17',
      foundationId: 'fnd-demant',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://williamdemantfonden.dk/ansoeg-om-stoette/',
      contentSelector: 'main',
      lastContentHash: '23a3cb5e69e4f55db622f5e2786a3451a558c374b62dbf88c83e1c3905e94b29',
      lastCheckedAt: '2026-09-07T09:55:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Musik- og scenekunstpuljer overvåget.'
    },
    {
      id: 'src-18',
      foundationId: 'fnd-louishansen',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://louis-hansenfonden.dk',
      contentSelector: 'body',
      lastContentHash: '9842a2657e2961a0e7f7b76428c9b980da8dbf72382f1b4028ec11cfcb931754',
      lastCheckedAt: '2026-09-07T10:00:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Kunst- og litteraturkriterier overvåget.'
    },
    {
      id: 'src-19',
      foundationId: 'fnd-beckett',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://beckett-fonden.dk',
      contentSelector: 'body',
      lastContentHash: 'bc0e67cf76db91a108e12fa4b9c1d09e3a778e7146b9a8cf6a928e08d1bc50f6',
      lastCheckedAt: '2026-09-07T10:05:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Kunst-, teater- og naturbeskyttelsespuljer overvåget.'
    },
    {
      id: 'src-20',
      foundationId: 'fnd-naturfonden',
      sourceType: 'HTML_DIFF',
      targetUrl: 'https://naturfonden.dk',
      contentSelector: 'body',
      lastContentHash: 'cf76db91a108e12fa4b9c1d09e3a778e7146b9a8cf6a928e08d1bc50f6bc0e67',
      lastCheckedAt: '2026-09-07T10:10:00Z',
      lastStatus: 'OK',
      status: 'ACTIVE',
      detectedChangesSummary: 'Naturgenopretning og partnerskaber overvåges.'
    }
  ];

  for (const src of sources) {
    db.insert(monitoredSources).values(src).run();
  }

  console.log(`Seeding completed successfully: 27 fonde, ${grantData.length} puljer og ${sources.length} overvågede kilder!`);
}

seed().catch(console.error);
