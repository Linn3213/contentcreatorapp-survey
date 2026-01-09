import React, { useState } from 'react';
import './index.css';

const ContentSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [started, setStarted] = useState(false);
  const [email, setEmail] = useState('');

  // ============================================
  // WEBHOOK URL - Byt ut mot din GHL webhook
  // ============================================
  const WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL_HERE';

  const questions = [
    {
      id: 'platforms',
      type: 'multi',
      question: 'Var delar du med dig av det du skapar?',
      subtitle: 'Välj alla som passar in',
      options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'pinterest', label: 'Pinterest' },
        { value: 'blog', label: 'Blogg eller hemsida' },
        { value: 'other', label: 'Någon annanstans' }
      ]
    },
    {
      id: 'frequency',
      type: 'single',
      question: 'Hur ofta brukar du lägga upp något?',
      subtitle: 'Det finns inget rätt eller fel',
      options: [
        { value: 'daily', label: 'Nästan varje dag', description: 'Det har blivit en vana' },
        { value: 'several_week', label: 'Några gånger i veckan', description: 'När inspiration och tid möts' },
        { value: 'weekly', label: 'Ungefär en gång i veckan', description: 'En rytm jag försöker hålla' },
        { value: 'monthly', label: 'Då och då', description: 'När det känns rätt' },
        { value: 'rarely', label: 'Mer sällan än jag skulle vilja', description: 'Något jag vill förändra' }
      ]
    },
    {
      id: 'biggest_challenge',
      type: 'single',
      question: 'Vad känns svårast just nu?',
      subtitle: 'Välj det som ligger närmast',
      options: [
        { value: 'ideas', label: 'Att veta vad jag ska dela', description: 'Idéerna tar slut ibland' },
        { value: 'consistency', label: 'Att hålla igång', description: 'Jag börjar starkt men tappar fart' },
        { value: 'time', label: 'Att hinna med allt', description: 'Det tar längre tid än jag har' },
        { value: 'strategy', label: 'Att veta om det fungerar', description: 'Osäker på om jag gör rätt' },
        { value: 'engagement', label: 'Att få respons', description: 'Det känns tyst ibland' },
        { value: 'growth', label: 'Att nå ut till fler', description: 'Jag vill växa men vet inte hur' }
      ]
    },
    {
      id: 'current_tools',
      type: 'multi',
      question: 'Vilka verktyg använder du idag?',
      subtitle: 'Välj alla du känner igen',
      options: [
        { value: 'canva', label: 'Canva' },
        { value: 'capcut', label: 'CapCut' },
        { value: 'later', label: 'Later' },
        { value: 'planoly', label: 'Planoly' },
        { value: 'buffer', label: 'Buffer' },
        { value: 'notion', label: 'Notion' },
        { value: 'trello', label: 'Trello' },
        { value: 'sheets', label: 'Kalkylark' },
        { value: 'notes', label: 'Anteckningar' },
        { value: 'chatgpt', label: 'AI-verktyg' },
        { value: 'none', label: 'Inga just nu' },
        { value: 'other', label: 'Något annat' }
      ]
    },
    {
      id: 'missing_features',
      type: 'multi',
      question: 'Vad skulle underlätta mest för dig?',
      subtitle: 'Välj det som känns viktigast',
      options: [
        { value: 'hooks', label: 'Hjälp att fånga intresse direkt' },
        { value: 'ideas', label: 'Oändlig inspiration' },
        { value: 'templates', label: 'Färdiga strukturer att utgå från' },
        { value: 'calendar', label: 'En tydlig översikt' },
        { value: 'strategy', label: 'Hjälp att skapa en plan' },
        { value: 'analytics', label: 'Förstå vad som fungerar' },
        { value: 'ai_writing', label: 'Hjälp att skriva texter' },
        { value: 'repurpose', label: 'Göra mer av det jag redan skapat' },
        { value: 'cta', label: 'Veta vad jag ska be folk göra' },
        { value: 'hashtags', label: 'Rätt taggar för att synas' }
      ]
    },
    {
      id: 'most_valuable',
      type: 'ranking',
      question: 'Om du fick välja tre saker',
      subtitle: 'Klicka i ordning – det viktigaste först',
      options: [
        { value: 'hooks_library', label: 'Inspiration för att fånga uppmärksamhet' },
        { value: 'content_calendar', label: 'En plats att planera allt' },
        { value: 'ai_assistant', label: 'En hjälpande hand med texterna' },
        { value: 'templates', label: 'Mallar som gör det enkelt' },
        { value: 'strategy_builder', label: 'Stöd att bygga en strategi' },
        { value: 'analytics', label: 'Insikter om vad som fungerar' },
        { value: 'idea_generator', label: 'Idéer när kreativiteten tryter' },
        { value: 'repurpose', label: 'Sätt att återanvända det jag gjort' }
      ]
    },
    {
      id: 'price_willing',
      type: 'single',
      question: 'Vad känns rimligt att investera?',
      subtitle: 'Per månad, om det verkligen hjälpte dig',
      options: [
        { value: 'free_only', label: 'Helst gratis', description: 'Försiktig med utgifter just nu' },
        { value: 'under_100', label: 'Upp till 100 kr', description: 'För något enkelt och bra' },
        { value: '100_200', label: '100–200 kr', description: 'Om det faktiskt gör skillnad' },
        { value: '200_300', label: '200–300 kr', description: 'För något som blir mitt go-to' },
        { value: 'over_300', label: 'Mer än 300 kr', description: 'Om det ersätter annat' }
      ]
    },
    {
      id: 'content_type',
      type: 'multi',
      question: 'Vad gillar du att skapa?',
      subtitle: 'Välj allt som stämmer',
      options: [
        { value: 'reels', label: 'Korta videos' },
        { value: 'stories', label: 'Stories' },
        { value: 'feed_posts', label: 'Inlägg med bild och text' },
        { value: 'carousels', label: 'Bildspel' },
        { value: 'long_video', label: 'Längre videos' },
        { value: 'lives', label: 'Livesändningar' },
        { value: 'blogs', label: 'Texter och artiklar' },
        { value: 'podcasts', label: 'Ljud och podd' }
      ]
    },
    {
      id: 'goal',
      type: 'single',
      question: 'Vad hoppas du mest på?',
      subtitle: 'Vad driver dig framåt',
      options: [
        { value: 'grow_audience', label: 'Att nå ut till fler', description: 'Jag vill att fler ska hitta mig' },
        { value: 'sell', label: 'Att det leder till något', description: 'Kunder, samarbeten, möjligheter' },
        { value: 'brand', label: 'Att bygga något eget', description: 'Bli känd för det jag gör' },
        { value: 'community', label: 'Att skapa gemenskap', description: 'Hitta min skara' },
        { value: 'fun', label: 'Att det ska vara kul', description: 'Glädjen i att skapa' },
        { value: 'thought_leader', label: 'Att bli en röst', description: 'Dela kunskap och perspektiv' }
      ]
    },
    {
      id: 'open_feedback',
      type: 'text',
      question: 'Är det något annat du tänker på?',
      subtitle: 'Alla tankar är värdefulla',
      placeholder: 'Berätta vad som skulle göra din vardag enklare...'
    }
  ];

  const handleSingleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };

  const handleMultiAnswer = (questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [questionId]: [...current, value] };
      }
    });
  };

  const handleRankingAnswer = (questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else if (current.length < 3) {
        return { ...prev, [questionId]: [...current, value] };
      }
      return prev;
    });
  };

  const handleTextAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowThankYou(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Send data to GHL webhook
    if (WEBHOOK_URL && WEBHOOK_URL !== 'YOUR_GHL_WEBHOOK_URL_HERE') {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            survey_type: 'contalier_research',
            timestamp: new Date().toISOString(),
            // Individual answers
            platforms: answers.platforms?.join(', ') || '',
            frequency: answers.frequency || '',
            biggest_challenge: answers.biggest_challenge || '',
            current_tools: answers.current_tools?.join(', ') || '',
            missing_features: answers.missing_features?.join(', ') || '',
            top_3_features: answers.most_valuable?.join(', ') || '',
            price_willing: answers.price_willing || '',
            content_type: answers.content_type?.join(', ') || '',
            goal: answers.goal || '',
            open_feedback: answers.open_feedback || '',
            // Tags for segmentation
            tags: 'survey-completed,contalier-interest'
          })
        });
      } catch (error) {
        console.error('Webhook error:', error);
      }
    }
    
    console.log('Survey submitted:', { email, answers });
    setShowThankYou('complete');
  };

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentAnswer = answers[question?.id];

  const canProceed = () => {
    if (!question) return false;
    if (question.type === 'text') return true;
    if (question.type === 'single') return !!currentAnswer;
    if (question.type === 'multi') return currentAnswer && currentAnswer.length > 0;
    if (question.type === 'ranking') return currentAnswer && currentAnswer.length === 3;
    return false;
  };

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#4A4039',
    letterSpacing: '0.03em'
  };

  // START SCREEN
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #F7F3EE 0%, #EDE6DD 100%)' }}>
        <div className="max-w-xl w-full text-center">
          
          <div className="flex items-center justify-center mb-10">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(139, 115, 94, 0.4))' }}></div>
            <div className="mx-4 text-xs tracking-widest uppercase" style={{ color: 'rgba(139, 115, 94, 0.7)', letterSpacing: '0.3em' }}>Marknadsundersökning</div>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(139, 115, 94, 0.4))' }}></div>
          </div>

          <h1 style={{ ...headingStyle, fontSize: '2.5rem', fontWeight: '300', marginBottom: '16px', lineHeight: '1.2' }}>
            Vi Vill Höra
          </h1>
          <h2 style={{ 
            ...headingStyle, 
            fontSize: '2.8rem', 
            fontWeight: '300', 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #8B735E 0%, #A69080 50%, #8B735E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}>
            Från Dig
          </h2>

          <p style={{ fontSize: '0.95rem', marginBottom: '24px', maxWidth: '26rem', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.8', color: '#7A6E63' }}>
            Vi bygger något som ska göra det enklare att skapa och dela det du brinner för.
          </p>

          <p style={{ fontSize: '0.85rem', marginBottom: '48px', color: '#9A8E83', fontStyle: 'italic' }}>
            Dina svar hjälper oss forma det till något som verkligen passar dig.
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(139, 115, 94, 0.4)',
              color: '#8B735E',
              padding: '16px 48px',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(139, 115, 94, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.7)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.4)';
            }}
          >
            Jag Vill Vara Med
          </button>

          <p style={{ marginTop: '32px', fontSize: '0.75rem', color: '#A89E93', letterSpacing: '0.1em' }}>
            Cirka 3 minuter
          </p>
        </div>
      </div>
    );
  }

  // EMAIL CAPTURE
  if (showThankYou === true) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #F7F3EE 0%, #EDE6DD 100%)' }}>
        <div className="max-w-md w-full text-center">
          
          <div className="flex items-center justify-center mb-10">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(139, 115, 94, 0.4))' }}></div>
            <div className="mx-4 text-xs tracking-widest uppercase" style={{ color: 'rgba(139, 115, 94, 0.7)', letterSpacing: '0.3em' }}>Ditt Resultat Väntar</div>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(139, 115, 94, 0.4))' }}></div>
          </div>

          <h2 style={{ ...headingStyle, fontSize: '2rem', fontWeight: '300', marginBottom: '16px' }}>
            Ett Steg Kvar
          </h2>
          
          <p style={{ fontSize: '0.9rem', marginBottom: '40px', maxWidth: '20rem', marginLeft: 'auto', marginRight: 'auto', color: '#7A6E63', lineHeight: '1.8' }}>
            Ange din e-post för att säkra din plats som early supporter och få exklusiv tidig tillgång.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); if (email) handleSubmit(); }}>
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
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(139, 115, 94, 0.25)',
                color: '#4A4039',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                marginBottom: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.5)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.25)'}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #8B735E 0%, #A69080 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: '500',
                cursor: 'pointer',
                opacity: email ? 1 : 0.6
              }}
            >
              Säkra Min Plats
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '0.7rem', color: '#A89E93', letterSpacing: '0.05em' }}>
            Vi delar aldrig din e-post med någon annan
          </p>
        </div>
      </div>
    );
  }

  // THANK YOU COMPLETE
  if (showThankYou === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #F7F3EE 0%, #EDE6DD 100%)' }}>
        <div className="max-w-md w-full text-center">
          
          <div className="flex items-center justify-center mb-10">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(139, 115, 94, 0.4))' }}></div>
            <div className="mx-4 text-xs tracking-widest uppercase" style={{ color: 'rgba(139, 115, 94, 0.7)', letterSpacing: '0.3em' }}>Välkommen</div>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(139, 115, 94, 0.4))' }}></div>
          </div>
          
          <h2 style={{ 
            ...headingStyle, 
            fontSize: '2rem', 
            fontWeight: '300', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #8B735E 0%, #A69080 50%, #8B735E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Du Är Med
          </h2>
          
          <p style={{ fontSize: '0.9rem', marginBottom: '32px', color: '#7A6E63', lineHeight: '1.8' }}>
            Tack för att du delade dina tankar. Din feedback formar det vi bygger.
          </p>

          <div style={{
            background: 'rgba(139, 115, 94, 0.06)',
            border: '1px solid rgba(139, 115, 94, 0.15)',
            padding: '32px'
          }}>
            <p style={{ color: '#8B735E', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Som Early Supporter Får Du
            </p>
            <div style={{ textAlign: 'left', maxWidth: '16rem', margin: '0 auto' }}>
              <p style={{ color: '#5C5248', fontSize: '0.85rem', lineHeight: '2', marginBottom: '8px' }}>
                Tidig tillgång innan alla andra
              </p>
              <p style={{ color: '#5C5248', fontSize: '0.85rem', lineHeight: '2', marginBottom: '8px' }}>
                Exklusivt pris vid lansering
              </p>
              <p style={{ color: '#5C5248', fontSize: '0.85rem', lineHeight: '2' }}>
                Möjlighet att påverka utvecklingen
              </p>
            </div>
          </div>

          <p style={{ marginTop: '32px', fontSize: '0.75rem', color: '#A89E93', letterSpacing: '0.1em' }}>
            Håll utkik i din inbox
          </p>
        </div>
      </div>
    );
  }

  // QUESTIONS
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #F7F3EE 0%, #EDE6DD 100%)' }}>
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#A89E93', letterSpacing: '0.15em' }}>
              Fråga {currentStep + 1} av {questions.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#8B735E', letterSpacing: '0.1em' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: '1px', width: '100%', background: 'rgba(139, 115, 94, 0.15)' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progress}%`, 
                background: 'linear-gradient(90deg, #8B735E, #A69080)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-10">
          <h2 style={{ ...headingStyle, fontSize: '1.5rem', fontWeight: '300', marginBottom: '12px', lineHeight: '1.4' }}>
            {question.question}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9A8E83', letterSpacing: '0.05em' }}>
            {question.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="mb-10">
          {/* SINGLE CHOICE */}
          {question.type === 'single' && (
            <div className="flex flex-col gap-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleAnswer(question.id, option.value)}
                  className="w-full p-5 text-left transition-all"
                  style={{
                    background: currentAnswer === option.value 
                      ? 'rgba(139, 115, 94, 0.1)' 
                      : 'rgba(255, 255, 255, 0.5)',
                    border: currentAnswer === option.value 
                      ? '1px solid rgba(139, 115, 94, 0.4)' 
                      : '1px solid rgba(139, 115, 94, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (currentAnswer !== option.value) {
                      e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentAnswer !== option.value) {
                      e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.15)';
                    }
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#4A4039' }}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#9A8E83' }}>
                      {option.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* MULTI CHOICE */}
          {question.type === 'multi' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {question.options.map((option) => {
                const isSelected = currentAnswer?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMultiAnswer(question.id, option.value)}
                    className="p-4 text-center transition-all"
                    style={{
                      background: isSelected 
                        ? 'rgba(139, 115, 94, 0.1)' 
                        : 'rgba(255, 255, 255, 0.5)',
                      border: isSelected 
                        ? '1px solid rgba(139, 115, 94, 0.4)' 
                        : '1px solid rgba(139, 115, 94, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.15)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: isSelected ? '#8B735E' : '#5C5248' }}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* RANKING */}
          {question.type === 'ranking' && (
            <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                const rankIndex = currentAnswer?.indexOf(option.value);
                const isSelected = rankIndex !== undefined && rankIndex !== -1;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleRankingAnswer(question.id, option.value)}
                    className="p-4 text-left flex items-center gap-4 transition-all"
                    style={{
                      background: isSelected 
                        ? 'rgba(139, 115, 94, 0.1)' 
                        : 'rgba(255, 255, 255, 0.5)',
                      border: isSelected 
                        ? '1px solid rgba(139, 115, 94, 0.4)' 
                        : '1px solid rgba(139, 115, 94, 0.15)',
                      cursor: currentAnswer?.length >= 3 && !isSelected ? 'not-allowed' : 'pointer',
                      opacity: currentAnswer?.length >= 3 && !isSelected ? 0.5 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? '#8B735E' : 'rgba(139, 115, 94, 0.15)',
                      color: isSelected ? '#FFFFFF' : '#A89E93',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {isSelected ? rankIndex + 1 : ''}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: isSelected ? '#8B735E' : '#5C5248' }}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
              <p style={{ fontSize: '0.75rem', color: '#A89E93', marginTop: '8px', textAlign: 'center' }}>
                {currentAnswer?.length || 0} av 3 valda
              </p>
            </div>
          )}

          {/* TEXT */}
          {question.type === 'text' && (
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => handleTextAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(139, 115, 94, 0.2)',
                color: '#4A4039',
                fontSize: '0.9rem',
                lineHeight: '1.7',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.4)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(139, 115, 94, 0.2)'}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: currentStep > 0 ? '#9A8E83' : 'transparent',
              fontSize: '0.8rem',
              cursor: currentStep > 0 ? 'pointer' : 'default',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { if (currentStep > 0) e.currentTarget.style.color = '#7A6E63' }}
            onMouseOut={(e) => { if (currentStep > 0) e.currentTarget.style.color = '#9A8E83' }}
          >
            Tillbaka
          </button>

          {(question.type !== 'single' || !canProceed()) && (
            <button
              onClick={handleNext}
              disabled={!canProceed() && question.type !== 'text'}
              style={{
                background: canProceed() || question.type === 'text'
                  ? 'linear-gradient(135deg, rgba(139, 115, 94, 0.15) 0%, rgba(139, 115, 94, 0.08) 100%)'
                  : 'rgba(139, 115, 94, 0.05)',
                border: canProceed() || question.type === 'text'
                  ? '1px solid rgba(139, 115, 94, 0.4)'
                  : '1px solid rgba(139, 115, 94, 0.15)',
                color: canProceed() || question.type === 'text' ? '#8B735E' : '#A89E93',
                padding: '12px 32px',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: canProceed() || question.type === 'text' ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              {currentStep === questions.length - 1 ? 'Slutför' : 'Nästa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentSurvey;
