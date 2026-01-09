import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // CONFIGURATION
  // Byt ut denna URL mot din GHL webhook URL
  // ============================================
  
  const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/aonDt0qX9aQUpCoNGeSi/webhook-trigger/313f8136-4c30-45cb-9f2a-79778038ed1b';

  // ============================================
  // QUESTIONS
  // ============================================

  const questions = [
    {
      id: 'skinUndertone',
      question: 'Titta på insidan av din handled i naturligt dagsljus. Vilken färg har dina vener?',
      subtitle: 'Detta avgör din huds grundläggande undertoner',
      options: [
        { value: 'cool', label: 'Blå eller lila', description: 'Tyder på kalla undertoner' },
        { value: 'warm', label: 'Gröna eller olivfärgade', description: 'Tyder på varma undertoner' },
        { value: 'neutral', label: 'En blandning av båda', description: 'Tyder på neutrala undertoner' }
      ]
    },
    {
      id: 'jewelryTest',
      question: 'Vilket smycke får din hud att se mest levande och frisk ut?',
      subtitle: 'Metaller avslöjar mycket om din naturliga färgprofil',
      options: [
        { value: 'cool', label: 'Silver, vitt guld eller platina', description: 'Kalla metaller kompletterar din hud' },
        { value: 'warm', label: 'Guld, roséguld eller koppar', description: 'Varma metaller lyfter din lyster' },
        { value: 'neutral', label: 'Båda alternativen ser lika bra ut', description: 'Du har flexibla undertoner' }
      ]
    },
    {
      id: 'skinDepth',
      question: 'Hur skulle du beskriva din hudfärg?',
      subtitle: 'Oavsett undertoner – hur ljus eller mörk är din hud?',
      options: [
        { value: 'light', label: 'Ljus till mycket ljus', description: 'Porslinshy, elfenben eller ljust beige' },
        { value: 'medium', label: 'Medium', description: 'Beige, olivfärgad eller honungsfärgad' },
        { value: 'deep', label: 'Mörk till mycket mörk', description: 'Karamell, choklad eller espresso' }
      ]
    },
    {
      id: 'eyeColor',
      question: 'Hur skulle du beskriva dina ögon?',
      subtitle: 'Titta nära i spegeln – notera både färg och intensitet',
      options: [
        { value: 'light-clear', label: 'Ljusa och klara', description: 'Ljusblå, ljusgrön, ljusgrå med tydlig iris' },
        { value: 'light-soft', label: 'Ljusa men mjuka', description: 'Gråblå, grågrön, dammigt blå med diffusa kanter' },
        { value: 'medium', label: 'Mellanmörka', description: 'Hassel, mellanbruna, gråbruna, teal' },
        { value: 'deep', label: 'Mörka och intensiva', description: 'Mörkbruna, svartbruna, djupt gröna' }
      ]
    },
    {
      id: 'hairNatural',
      question: 'Vilken är din naturliga hårfärg?',
      subtitle: 'Tänk på din barndoms hårfärg om du färgar håret idag',
      options: [
        { value: 'light-warm', label: 'Ljust med värme', description: 'Gyllene blond, jordgubbsblond, ljus koppar' },
        { value: 'light-cool', label: 'Ljust utan värme', description: 'Askblond, platinablond, ljust mushroom' },
        { value: 'medium-warm', label: 'Medium med värme', description: 'Gyllene brun, auburn, koppar, rödbrun' },
        { value: 'medium-cool', label: 'Medium utan värme', description: 'Askbrun, mushroom brun, mörkblond' },
        { value: 'deep', label: 'Mörkt', description: 'Mörkbrun, svart, djupt auburn' }
      ]
    },
    {
      id: 'contrast',
      question: 'Hur stor är kontrasten mellan din hud, ditt hår och dina ögon?',
      subtitle: 'Kontrast = skillnaden i ljushet mellan dina drag',
      options: [
        { value: 'low', label: 'Låg kontrast', description: 'Allt smälter samman – liknande ljushetsnivå' },
        { value: 'medium', label: 'Medium kontrast', description: 'Viss variation men ändå harmoniskt' },
        { value: 'high', label: 'Hög kontrast', description: 'Stark skillnad, t.ex. ljus hud + mörkt hår' }
      ]
    },
    {
      id: 'colorClarity',
      question: 'Vilket påstående beskriver dig bäst?',
      subtitle: 'Tänk på hur du upplevs av andra och i foton',
      options: [
        { value: 'muted', label: 'Mjuk och dämpad', description: 'Jag ser bäst ut i dämpade, gråtonade färger' },
        { value: 'clear', label: 'Klar och levande', description: 'Jag ser bäst ut i rena, klara färger' },
        { value: 'neutral', label: 'Någonstans mittemellan', description: 'Både mjuka och klara färger fungerar' }
      ]
    }
  ];

  // ============================================
  // ALL 12 SEASON RESULTS
  // ============================================

  const seasonResults = {
    // ========== SPRING ==========
    lightSpring: {
      id: 'light-spring',
      name: 'Light Spring',
      tagline: 'Ljus, varm och strålande som en vårmorgon',
      description: 'Du har den ljusaste och mest delikata versionen av vårens värme. Din skönhet är fräsch, ungdomlig och full av ljus. Du strålar i lätta, varma färger som ser ut som de doppats i solsken.',
      characteristics: 'Ljus hy med gyllene eller persikofärgade undertoner, ljust hår med värme, klara ljusa ögon',
      colors: ['#FFE4B5', '#FFB6C1', '#98FB98', '#87CEEB', '#FFC67D'],
      colorNames: ['Moccasin', 'Light Pink', 'Pale Green', 'Sky Blue', 'Apricot'],
      bestColors: 'Persika, ljus korall, varmt elfenben, ljus aprikos, mjuk turkos, varm lavendel, ljus kamel',
      avoid: 'Svart, mörkgrått, bordeaux, mörk marinblå, alla tunga eller mättade färger',
      makeup: 'Persikofärgad rouge, korallrosa läppar, varma ljusbruna ögonskuggor, mascara i brun eller soft black',
      style: 'Ljusa, luftiga tyger. Monokroma looks i ljusa toner. Guld- och roséguldsmycken. Undvik hårda kontraster.'
    },
    warmSpring: {
      id: 'warm-spring',
      name: 'Warm Spring',
      tagline: 'Gyllene värme och naturlig lyster',
      description: 'Du är vårens mest genuint varma typ. Din hud har en naturlig gyllene lyster och du strålar i färger som påminner om solmogna frukter och vårblommor. Värme är nyckeln till din palett.',
      characteristics: 'Gyllene eller persikofärgad hy, hår med tydlig värme (gyllene, koppar, auburn), varma ögon',
      colors: ['#FF7F50', '#FFD700', '#F4A460', '#98D8C8', '#E9967A'],
      colorNames: ['Coral', 'Gold', 'Sandy Brown', 'Aquamarine', 'Dark Salmon'],
      bestColors: 'Korall, mango, guld, varm turkos, persika, tomatsoppsröd, varm aqua, kamel',
      avoid: 'Kalla rosa toner, grått, svart, fuchsia, iskall blå, silver',
      makeup: 'Bronzer med gyllene skimmer, korall eller persikofärgade läppar, koppar och guld på ögonen',
      style: 'Rika, varma toner. Mix av prints och texturer. Guld är din metall. Jordnära men livfulla kombinationer.'
    },
    clearSpring: {
      id: 'clear-spring',
      name: 'Clear Spring',
      tagline: 'Livfull klarhet med värme',
      description: 'Du har vårens mest intensiva och levande utstrålning. Din skönhet har en elektrisk kvalitet – klara ögon, tydlig kontrast och en lyster som kräver rena, klara färger.',
      characteristics: 'Klar, strålande hy, hög kontrast, mycket klara ögon (ofta ljusblå eller ljusgröna), hår kan vara ljust till mörkt men med värme',
      colors: ['#FF6347', '#00CED1', '#FF69B4', '#32CD32', '#FF8C00'],
      colorNames: ['Tomato', 'Dark Turquoise', 'Hot Pink', 'Lime Green', 'Dark Orange'],
      bestColors: 'Klarröd, turkos, varm rosa, äppelgrön, mandarin, klarkorall, electric blue med värme',
      avoid: 'Dämpade, gråtonade färger, mörkt brunt, olivgrönt, alla "muddy" nyanser',
      makeup: 'Klara, pigmenterade färger. Ren röd läppstift, turkos eyeliner, klara rosa toner på kinderna',
      style: 'Rena, klara färger med hög intensitet. Kontrasterande kombinationer. Guld och även silver fungerar.'
    },

    // ========== SUMMER ==========
    lightSummer: {
      id: 'light-summer',
      name: 'Light Summer',
      tagline: 'Eterisk elegans i mjuka toner',
      description: 'Du har sommarens mest delikata och ljusa uttryck. Din skönhet är drömmande och sofistikerad, som en dimmig sommarmorgon vid havet. Mjuka, svala pastelltoner får dig att stråla.',
      characteristics: 'Ljus, porslinsaktig hy med rosa eller neutral underton, askigt eller mjukt hår, mjuka ljusa ögon',
      colors: ['#E6E6FA', '#B0C4DE', '#DDA0DD', '#F0F8FF', '#C8B4D4'],
      colorNames: ['Lavender', 'Light Steel Blue', 'Plum', 'Alice Blue', 'Wisteria'],
      bestColors: 'Lavendel, puderrosa, ljust gråblå, mintgrön, mjuk mauve, dammig rose, platina',
      avoid: 'Svart, orange, stark gul, alla varma eller intensiva färger, guld',
      makeup: 'Rosa toner, mjuk mauve på läpparna, gråbruna och lavendelfärgade ögonskuggor, mjuk svart mascara',
      style: 'Ton-i-ton i ljusa, svala nyanser. Flödande tyger. Silver och vitguld. Undvik hårda kanter.'
    },
    softSummer: {
      id: 'soft-summer',
      name: 'Soft Summer',
      tagline: 'Dämpad sofistikering och naturlig elegans',
      description: 'Du är sommarens mest neutrala och dämpade typ. Din skönhet är sofistikerad och understated – aldrig skrikig. Du ser bäst ut i gråtonade, mjuka färger som inte konkurrerar med dina naturligt harmoniska drag.',
      characteristics: 'Neutral till sval hy, låg till medium kontrast, mjuka ögon och hår utan stark intensitet',
      colors: ['#708090', '#8FBC8F', '#B8860B', '#9999A1', '#C4AEAD'],
      colorNames: ['Slate Gray', 'Dark Sea Green', 'Dark Goldenrod', 'Mauve Gray', 'Rose Taupe'],
      bestColors: 'Dammig rose, grågrön, mjuk teal, taupe, gråblå, gammalrosa, mjuk jade',
      avoid: 'Neonfärger, rent svart, rent vitt, orange, alla klara eller intensiva färger',
      makeup: 'Dämpade, gråtonade toner. Mauve eller rose läppar, mjuka brungrå skuggor, brun mascara',
      style: 'Layering i mjuka toner. Naturliga material. Matt silver. Undvik starka kontraster och prints.'
    },
    coolSummer: {
      id: 'cool-summer',
      name: 'Cool Summer',
      tagline: 'Sval elegans med dämpad intensitet',
      description: 'Du är sommarens mest genuint kalla typ. Din skönhet har en tidlös, klassisk kvalitet. Du bär svala, dämpade färger med en naturlig grace som utstrålar sofistikation.',
      characteristics: 'Rosa eller blåaktig underton i hyn, askigt eller mörkt askblont hår, ögon med sval ton',
      colors: ['#4682B4', '#DA70D6', '#5F9EA0', '#9370DB', '#778899'],
      colorNames: ['Steel Blue', 'Orchid', 'Cadet Blue', 'Medium Purple', 'Light Slate Gray'],
      bestColors: 'Blågrå, orkidé, vattenblå, mjuk fuchsia, blålila, sval rosa, plommon',
      avoid: 'Orange, guld, varma bruna toner, persika, alla färger med gul underton',
      makeup: 'Rosa och lila toner. Berry-färgade läppar, grålila skuggor, svart mascara',
      style: 'Eleganta, svala toner. Klassiska snitt. Silver, vitguld, platina. Monokroma looks.'
    },

    // ========== AUTUMN ==========
    softAutumn: {
      id: 'soft-autumn',
      name: 'Soft Autumn',
      tagline: 'Varm mjukhet och naturlig harmoni',
      description: 'Du har höstens mest dämpade och neutrala uttryck. Din skönhet är jordnära och sofistikerad. Du strålar i färger som påminner om dimhöljda höstlandskap – varma men aldrig skrikiga.',
      characteristics: 'Neutral-varm hy, låg till medium kontrast, mjuka varma ögon, hår utan stark intensitet',
      colors: ['#D2B48C', '#BC8F8F', '#8B7355', '#9ACD32', '#C3B091'],
      colorNames: ['Tan', 'Rosy Brown', 'Burly Wood', 'Yellow Green', 'Khaki'],
      bestColors: 'Kamel, mjuk terrakotta, olivgrön, rostad aprikos, varm taupe, mjuk teal, gammalt guld',
      avoid: 'Svart, rent vitt, neonfärger, alla klara eller iskalla färger',
      makeup: 'Dämpade, varma toner. Nude-bruna läppar, bronsfärgade skuggor, brun mascara',
      style: 'Mjuka, jordiga toner i lager. Naturliga material som lin och kashmir. Antikt guld, koppar.'
    },
    warmAutumn: {
      id: 'warm-autumn',
      name: 'Warm Autumn',
      tagline: 'Rik värme och jordnära elegans',
      description: 'Du är höstens mest genuint varma typ. Din skönhet har samma rika, varma kvalitet som ett höstlandskap i full färgprakt. Du bär jordiga, mättade färger med en naturlig auktoritet.',
      characteristics: 'Gyllene eller bronsfärgad hy, hår med tydlig värme (auburn, koppar, varmt brunt), varma ögon',
      colors: ['#CD853F', '#8B4513', '#D2691E', '#556B2F', '#B8860B'],
      colorNames: ['Peru', 'Saddle Brown', 'Chocolate', 'Dark Olive', 'Dark Goldenrod'],
      bestColors: 'Rost, senapsgul, bränd orange, olivgrön, chokladbrun, pumpkin, mossgrön, guld',
      avoid: 'Kalla rosa toner, grått, svart, fuchsia, marinblå, silver',
      makeup: 'Varma, jordiga toner. Terrakotta och nude läppar, bronsfärgade skuggor, koppar highlighter',
      style: 'Rika texturer och varma toner. Mix av mönster i samma färgfamilj. Guld, koppar, mässing.'
    },
    deepAutumn: {
      id: 'deep-autumn',
      name: 'Deep Autumn',
      tagline: 'Dramatisk värme och intensiv elegans',
      description: 'Du har höstens djupaste och mest intensiva uttryck. Din skönhet är rik och magnetisk. Du behöver mörka, mättade färger med värme för att matcha din naturliga dramatik.',
      characteristics: 'Medium till mörk hy med värme, mörkt hår med varma toner, intensiva mörka ögon',
      colors: ['#800000', '#006400', '#8B0000', '#4B3621', '#996515'],
      colorNames: ['Maroon', 'Dark Green', 'Dark Red', 'Dark Brown', 'Golden Brown'],
      bestColors: 'Bordeaux, skogsgrön, mörk teal, choklad, bränd sienna, mörk tomat, olivgrön',
      avoid: 'Pasteller, ljusrosa, ljusblå, grått, alla ljusa eller dämpade färger',
      makeup: 'Rika, djupa toner. Mörkröda eller plommonläppar, bronsiga och koppriga skuggor, svart mascara',
      style: 'Dramatiska, mörka färger med värme. Lyxiga material. Antikt guld, koppar, brons.'
    },

    // ========== WINTER ==========
    coolWinter: {
      id: 'cool-winter',
      name: 'Cool Winter',
      tagline: 'Iskall elegans och tidlös klarhet',
      description: 'Du är vinterns mest genuint kalla typ. Din skönhet har en slående, nästan isig kvalitet. Du bär rena, kalla färger med en naturlig sofistikation som utstrålar makt och elegans.',
      characteristics: 'Rosa eller olivfärgad hy med kall underton, askigt eller mörkt hår, ögon med kall klarhet',
      colors: ['#000080', '#C71585', '#008B8B', '#4169E1', '#2F4F4F'],
      colorNames: ['Navy', 'Medium Violet Red', 'Dark Cyan', 'Royal Blue', 'Dark Slate Gray'],
      bestColors: 'Marinblå, magenta, smaragd, isblå, ren vit, svart, royalblå, klarrosa',
      avoid: 'Orange, guld, varma bruna toner, persika, alla jordiga eller dämpade färger',
      makeup: 'Klara, kalla toner. Berry eller fuchsia läppar, grå och plommonfärgade skuggor, svart mascara',
      style: 'Klassisk elegans i rena, kalla toner. Starka kontraster. Silver, platina, vitguld.'
    },
    clearWinter: {
      id: 'clear-winter',
      name: 'Clear Winter',
      tagline: 'Strålande kontrast och elektrisk klarhet',
      description: 'Du har vinterns mest intensiva och levande uttryck. Din skönhet är dramatisk med hög kontrast och en klarhet som kräver rena, starka färger. Du kan bära färger som skulle överväldia andra.',
      characteristics: 'Klar hy med stark kontrast till hår och ögon, mörkt hår, ljusa intensiva ögon (ofta blå eller gröna)',
      colors: ['#FF0000', '#00BFFF', '#FF1493', '#00FF00', '#0000CD'],
      colorNames: ['Red', 'Deep Sky Blue', 'Deep Pink', 'Lime', 'Medium Blue'],
      bestColors: 'Klarröd, electric blue, hot pink, smaragdgrön, svart, rent vitt, klarviolett',
      avoid: 'Dämpade färger, beige, alla "muddy" eller gråtonade nyanser, mjuka pasteller',
      makeup: 'Intensiva, klara färger. Klarröda eller rosa läppar, dramatiska smokey eyes, svart eyeliner',
      style: 'Hög kontrast, starka statements. Metalliska accenter. Silver och även guld i klara toner.'
    },
    deepWinter: {
      id: 'deep-winter',
      name: 'Deep Winter',
      tagline: 'Mörk dramatik och luxuös intensitet',
      description: 'Du har vinterns djupaste och mest dramatiska uttryck. Din skönhet är mörk, rik och magnetisk. Du behöver mörka, intensiva färger för att matcha din naturliga djup och kraft.',
      characteristics: 'Medium till mörk hy med neutral-kall underton, mörkt hår, djupa intensiva ögon',
      colors: ['#191970', '#800020', '#006400', '#4B0082', '#2C1810'],
      colorNames: ['Midnight Blue', 'Burgundy', 'Dark Green', 'Indigo', 'Black Coffee'],
      bestColors: 'Svart, midnattsblå, aubergine, mörk smaragd, bordeaux, djupt lila, mörkgrå',
      avoid: 'Pasteller, ljusa beige, orange, ljusa varma bruna toner, alla ljusa eller dämpade färger',
      makeup: 'Djupa, mättade färger. Mörkröda eller plommonläppar, dramatiska mörka skuggor, intensiv mascara',
      style: 'Mörka, luxuösa färger. Dramatiska silhuetter. Silver, vitguld, diamanter.'
    }
  };

  // ============================================
  // CALCULATE RESULT ALGORITHM
  // ============================================

  const calculateResult = () => {
    const { skinUndertone, jewelryTest, skinDepth, eyeColor, hairNatural, contrast, colorClarity } = answers;
    
    // Calculate temperature (warm vs cool)
    let warmPoints = 0;
    let coolPoints = 0;
    
    if (skinUndertone === 'warm') warmPoints += 3;
    if (skinUndertone === 'cool') coolPoints += 3;
    if (skinUndertone === 'neutral') { warmPoints += 1; coolPoints += 1; }
    
    if (jewelryTest === 'warm') warmPoints += 3;
    if (jewelryTest === 'cool') coolPoints += 3;
    if (jewelryTest === 'neutral') { warmPoints += 1; coolPoints += 1; }
    
    if (hairNatural === 'light-warm' || hairNatural === 'medium-warm') warmPoints += 2;
    if (hairNatural === 'light-cool' || hairNatural === 'medium-cool') coolPoints += 2;
    
    const isWarm = warmPoints > coolPoints;
    
    // Calculate depth
    let lightPoints = 0;
    let deepPoints = 0;
    
    if (skinDepth === 'light') lightPoints += 2;
    if (skinDepth === 'deep') deepPoints += 2;
    
    if (eyeColor === 'light-clear' || eyeColor === 'light-soft') lightPoints += 1;
    if (eyeColor === 'deep') deepPoints += 1;
    
    if (hairNatural === 'light-warm' || hairNatural === 'light-cool') lightPoints += 1;
    if (hairNatural === 'deep') deepPoints += 1;
    
    const isLight = lightPoints > deepPoints;
    const isDeep = deepPoints > lightPoints;
    
    // Calculate clarity (clear vs muted)
    let clearPoints = 0;
    let mutedPoints = 0;
    
    if (colorClarity === 'clear') clearPoints += 3;
    if (colorClarity === 'muted') mutedPoints += 3;
    
    if (eyeColor === 'light-clear') clearPoints += 2;
    if (eyeColor === 'light-soft') mutedPoints += 2;
    
    if (contrast === 'high') clearPoints += 2;
    if (contrast === 'low') mutedPoints += 2;
    
    const isClear = clearPoints > mutedPoints;
    const isMuted = mutedPoints > clearPoints;
    
    // Determine season
    let season;
    
    if (isWarm || (warmPoints === coolPoints)) {
      // SPRING or AUTUMN
      if (isLight) {
        if (isClear) {
          season = 'clearSpring';
        } else if (isMuted) {
          season = 'lightSpring';
        } else {
          season = 'warmSpring';
        }
      } else if (isDeep) {
        if (isMuted) {
          season = 'softAutumn';
        } else {
          season = 'deepAutumn';
        }
      } else {
        if (isMuted) {
          season = 'softAutumn';
        } else if (isClear) {
          season = 'clearSpring';
        } else {
          season = 'warmAutumn';
        }
      }
    } else {
      // SUMMER or WINTER
      if (isLight) {
        if (isMuted) {
          season = 'softSummer';
        } else if (isClear) {
          season = 'lightSummer';
        } else {
          season = 'coolSummer';
        }
      } else if (isDeep) {
        if (isClear) {
          season = 'clearWinter';
        } else {
          season = 'deepWinter';
        }
      } else {
        if (isMuted) {
          season = 'softSummer';
        } else if (isClear) {
          season = 'clearWinter';
        } else {
          season = 'coolWinter';
        }
      }
    }
    
    return seasonResults[season];
  };

  // ============================================
  // EMAIL SUBMISSION TO GHL
  // ============================================

  const submitToWebhook = async (emailAddress, seasonResult) => {
    if (!WEBHOOK_URL || WEBHOOK_URL === 'YOUR_GHL_WEBHOOK_URL_HERE') {
      console.log('Webhook URL not configured. Data:', { emailAddress, seasonResult: seasonResult.name });
      return;
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          color_season: seasonResult.name,
          color_season_id: seasonResult.id,
          timestamp: new Date().toISOString(),
          source: 'color-analysis-quiz',
          tags: `color-${seasonResult.id},quiz-completed`,
          best_colors: seasonResult.bestColors,
          tagline: seasonResult.tagline
        }),
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Skip email capture - go directly to result
      // Use setTimeout to ensure state is updated
      setTimeout(() => {
        setShowEmailCapture(false);
        const finalResult = calculateResult();
        setResult(finalResult);
      }, 50);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalResult = calculateResult();
    await submitToWebhook(email, finalResult);
    
    setResult(finalResult);
    setShowEmailCapture(false);
    setIsSubmitting(false);
  };

  const handleSkipEmail = () => {
    const finalResult = calculateResult();
    setResult(finalResult);
    setShowEmailCapture(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setEmail('');
    setShowEmailCapture(false);
    setStarted(false);
  };

  // ============================================
  // STYLES
  // ============================================

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#f5f5f5',
    letterSpacing: '0.05em'
  };

  const goldGradient = {
    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  // ============================================
  // RENDER: START SCREEN
  // ============================================

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ height: '1px', width: '64px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6))' }}></div>
            <div style={{ margin: '0 16px', color: 'rgba(212,175,55,0.8)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Linnartistry</div>
            <div style={{ height: '1px', width: '64px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.6))' }}></div>
          </div>

          <h1 style={{ ...headingStyle, fontSize: '2.5rem', fontWeight: '300', marginBottom: '16px' }}>
            Upptäck Din
          </h1>
          <h2 style={{ ...headingStyle, ...goldGradient, fontSize: '3rem', fontWeight: '300', marginBottom: '32px', letterSpacing: '0.08em' }}>
            Färgpalett
          </h2>

          <p style={{ fontSize: '0.9rem', marginBottom: '48px', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.7', color: '#a0a0a0', letterSpacing: '0.02em' }}>
            Sju frågor som avslöjar vilka färger som harmoniserar med din 
            unika skönhet och får dig att stråla.
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              padding: '16px 48px',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212, 175, 55, 0.1)';
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            }}
          >
            Starta Analysen
          </button>

          <p style={{ marginTop: '32px', fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em' }}>
            Cirka 3 minuter
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: EMAIL CAPTURE
  // ============================================

  if (showEmailCapture) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6))' }}></div>
            <div style={{ margin: '0 16px', color: 'rgba(212,175,55,0.8)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Klart</div>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.6))' }}></div>
          </div>

          <h2 style={{ ...headingStyle, fontSize: '2rem', fontWeight: '300', marginBottom: '16px' }}>
            Ditt Resultat Väntar
          </h2>
          
          <p style={{ fontSize: '0.9rem', marginBottom: '40px', maxWidth: '24rem', marginLeft: 'auto', marginRight: 'auto', color: '#a0a0a0', lineHeight: '1.8' }}>
            Ange din e-post för att få ditt resultat samt en exklusiv guide 
            med dina mest smickrande färger.
          </p>

          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
              style={{
                width: '100%',
                padding: '16px 24px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: '#f5f5f5',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                marginBottom: '16px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#d4af37',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Laddar...' : 'Visa Mitt Resultat'}
            </button>
          </form>

          <button
            onClick={handleSkipEmail}
            style={{
              marginTop: '24px',
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            Hoppa över
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: RESULT SCREEN
  // ============================================

  if (result) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px 24px 48px' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6))' }}></div>
              <div style={{ margin: '0 16px', color: 'rgba(212,175,55,0.8)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Din Färgsäsong</div>
              <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.6))' }}></div>
            </div>
            
            <h1 style={{ ...headingStyle, ...goldGradient, fontSize: '2.5rem', fontWeight: '300', marginBottom: '12px' }}>
              {result.name}
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#a0a0a0', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
              {result.tagline}
            </p>
          </div>

          {/* Main content card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212, 175, 55, 0.15)', padding: '48px', marginBottom: '32px' }}>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '32px', textAlign: 'center', color: '#c0c0c0' }}>
              {result.description}
            </p>

            <p style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '40px', color: '#808080', fontStyle: 'italic' }}>
              {result.characteristics}
            </p>

            {/* Color palette */}
            <div style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '0.7rem', textAlign: 'center', marginBottom: '24px', textTransform: 'uppercase', color: '#808080', letterSpacing: '0.2em' }}>
                Din Signaturpalett
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {result.colors.map((color, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: color, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        marginBottom: '8px'
                      }}
                    />
                    <p style={{ color: '#707070', letterSpacing: '0.03em', fontSize: '0.65rem' }}>
                      {result.colorNames[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '8px', color: '#d4af37', letterSpacing: '0.15em' }}>
                  Dina Bästa Färger
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: '1.7' }}>
                  {result.bestColors}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '8px', color: '#d4af37', letterSpacing: '0.15em' }}>
                  Undvik Dessa
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: '1.7' }}>
                  {result.avoid}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)', marginTop: '24px', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '8px', color: '#d4af37', letterSpacing: '0.15em' }}>
                Makeup-Tips
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: '1.7' }}>
                {result.makeup}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)', marginTop: '24px', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '8px', color: '#d4af37', letterSpacing: '0.15em' }}>
                Stilråd
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a0a0a0', lineHeight: '1.7' }}>
                {result.style}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '16px', color: '#d4af37', letterSpacing: '0.2em' }}>
              Nästa Steg
            </p>
            <h3 style={{ ...headingStyle, fontSize: '1.75rem', fontWeight: '300', marginBottom: '16px' }}>
              Ta Din Glow-Up Till Nästa Nivå
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '32px', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', color: '#a0a0a0', lineHeight: '1.8' }}>
              Nu vet du dina färger. Men hur applicerar du dem på garderob, makeup, 
              hårfärg och accessoarer för en komplett transformation?
            </p>
            <a
              href={`https://links.hereis.se/widget/form/iLNru7dljffQZIsUAqxp?color_season=${result.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
                border: 'none',
                color: '#0d0d0d',
                padding: '16px 40px',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Få Din Personliga Färgguide
            </a>
            <p style={{ marginTop: '24px', fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em' }}>
              Din kompletta guide till personlig stil
            </p>
          </div>

          <button
            onClick={resetQuiz}
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '12px',
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            Gör om analysen
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: QUESTION SCREEN
  // ============================================

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '36rem', width: '100%' }}>
        {/* Progress */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.15em' }}>
              Fråga {currentStep + 1} av {questions.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#d4af37', letterSpacing: '0.1em' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.1)' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progress}%`, 
                background: 'linear-gradient(90deg, #d4af37, #f4e4bc)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ ...headingStyle, fontSize: '1.5rem', fontWeight: '300', marginBottom: '12px', lineHeight: '1.4' }}>
            {question.question}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#808080', letterSpacing: '0.1em' }}>
            {question.subtitle}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.value)}
              style={{
                width: '100%',
                padding: '20px',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <span style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#e0e0e0', letterSpacing: '0.02em' }}>
                {option.label}
              </span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>
                {option.description}
              </span>
            </button>
          ))}
        </div>

        {/* Back button */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '12px',
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            Föregående fråga
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
