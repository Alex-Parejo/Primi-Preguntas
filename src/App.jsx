import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Importación de logotipos cargados
import logoUnimagdalena from './assets/logo-unimagdalena.jpg';
import logoTalento from './assets/logo-talento.png';

function App() {
  /* ==========================================================================
     1. TEMA DE COLOR (Light Mode por defecto y Dark Mode)
     ========================================================================== */
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ==========================================================================
     2. CONTROL DE ENRUTAMIENTO Y VISTAS MÓVILES
     ========================================================================== */
  const [activeView, setActiveView] = useState('view-home');

  const navigateTo = (viewId) => {
    setActiveView(viewId);
    
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(viewId);
      if (element) {
        const yOffset = -90;
        const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: yPosition, behavior: 'smooth' });
      }
    }
  };

  /* ==========================================================================
     3. BASE DE DATOS DE PREGUNTAS FRECUENTES (FAQ - UNIMAGDALENA & TALENTO)
     ========================================================================== */
  const faqData = [
    {
      id: 'faq-unimag-permanencia',
      category: 'vida',
      question: '¿Cuál es el promedio acumulado mínimo de permanencia en la Universidad del Magdalena?',
      answer: '<p>De acuerdo con el Reglamento Estudiantil general (Acuerdo Académico No. 27 de 2023), todo estudiante debe mantener un promedio ponderado acumulado de mínimo <strong>300 sobre 500 puntos</strong> al finalizar cada período académico.</p><p>Si obtienes un promedio acumulado entre <strong>250 y 299 puntos</strong>, entrarás en situación de <strong>Permanencia Académica Condicional</strong>. Si el promedio acumulado es inferior a <strong>250 puntos</strong>, perderás la condición de estudiante de la universidad por rendimiento.</p>'
    },
    {
      id: 'faq-talento-requisitos',
      category: 'talento',
      question: '¿Qué promedio y condiciones exige el programa Talento Magdalena para conservar los beneficios?',
      answer: '<p>Para conservar la beca del 100% de la matrícula y los apoyos del programa Talento Magdalena, debes cumplir obligatoriamente con los siguientes requisitos:</p><ul><li><strong>Promedio Ponderado</strong>: Mantener un promedio semestral o acumulado igual o superior a <strong>300 sobre 500 puntos</strong>.</li><li><strong>Asistencia a Tutorías</strong>: Asistencia obligatoria a las monitorías y talleres de preparación para pruebas académicas organizados por la universidad.</li><li><strong>Consejería</strong>: Asistir como mínimo una vez al mes a las sesiones de orientación psicológica y vocacional.</li><li><strong>Reportes bimestrales</strong>: Presentar los reportes de seguimiento académico con la firma de tu padre o tutor.</li><li><strong>Servicio Social</strong>: Cumplir con las horas de servicio social o corresponsabilidad estudiantil asignadas.</li></ul>'
    },
    {
      id: 'faq-cancelacion-creditos',
      category: 'vida',
      question: '¿Cómo funciona la cancelación de materias y cuántos créditos mínimos debo registrar?',
      answer: '<p>Puedes solicitar la cancelación de materias a través del Portal Estudiantil antes de la fecha límite establecida en el calendario académico. Sin embargo, para los estudiantes beneficiarios de <strong>Talento Magdalena</strong>, se exige mantener matriculado y cursando un mínimo de <strong>12 créditos semestrales</strong>.</p><p>Si cancelas materias y quedas por debajo de este límite, podrías perder los beneficios de la beca. Es fundamental que consultes con la Dirección de Desarrollo Estudiantil (<em>desarrolloest@unimagdalena.edu.co</em>) antes de efectuar cualquier cancelación.</p>'
    },
    {
      id: 'faq-apoyo-alimentario',
      category: 'talento',
      question: '¿Cómo puedo acceder al apoyo de alimentación (almuerzos y refrigerios) en el campus?',
      answer: '<p>El programa Talento Magdalena incluye el acceso gratuito a los almuerzos de la cafetería central como apoyo de permanencia. Para activarlo, debes estar atento a la convocatoria de apoyos alimentarios de la Dirección de Desarrollo Estudiantil al inicio del semestre a través del Portal Estudiantil.</p><p>Recuerda que debes hacer un uso responsable del beneficio: inasistencias injustificadas a la cafetería pueden resultar en la suspensión del almuerzo.</p>'
    },
    {
      id: 'faq-estudio-efectivo',
      category: 'estudio',
      question: '¿Cómo puedo organizar mi tiempo para estudiar y evitar procrastinar en mis materias?',
      answer: '<p>Estudiar en la universidad requiere un método autónomo y constante. Aquí tienes tres recomendaciones:</p><ul><li><strong>Usa el temporizador Pomodoro integrado</strong>: Estudia en bloques de 25 minutos sin mirar el celular, seguidos de 5 minutos de descanso.</li><li><strong>Estudio Activo (Active Recall)</strong>: En lugar de solo releer textos, cierra los apuntes e intenta recordar o explicar el concepto con tus propias palabras (<strong>Técnica Feynman</strong>).</li><li><strong>Organiza tu semana</strong>: Reserva bloques fijos en tu agenda para repasar cada materia inmediatamente después de ver la clase.</li></ul>'
    },
    {
      id: 'faq-bienestar-psicologico',
      category: 'bienestar',
      question: '¿Qué debo hacer si me siento abrumado por el estrés o la ansiedad académica?',
      answer: '<p>Es normal sentir presión durante el primer semestre. La Universidad del Magdalena cuenta con servicios de apoyo psicológico totalmente confidenciales y gratuitos a través del Centro de Bienestar Universitario y el programa Talento Magdalena.</p><p>Puedes agendar una cita de orientación psicológica desde tu Portal Estudiantil, asistir a los talleres de manejo del estrés o escribir directamente al equipo de bienestar de Desarrollo Estudiantil para recibir acompañamiento inmediato. Tu salud mental es la base del éxito académico.</p>'
    }
  ];

  /* ==========================================================================
     4. ESTADOS DE FAQ (BÚSQUEDA Y ACORDEÓN)
     ========================================================================== */
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState(null);

  const handleFaqToggle = (faqId) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = currentCategory === 'all' || faq.category === currentCategory;
    const cleanQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = cleanQuery === '' ||
      faq.question.toLowerCase().includes(cleanQuery) ||
      faq.answer.toLowerCase().includes(cleanQuery);
    return matchesCategory && matchesSearch;
  });

  /* ==========================================================================
     5. CALCULADORA DE NOTAS (ESCALA 0-500)
     ========================================================================== */
  const [subjects, setSubjects] = useState([]);
  const [subName, setSubName] = useState('');
  const [subGrade, setSubGrade] = useState('');
  const [subCredits, setSubCredits] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    const grade = parseFloat(subGrade);
    const credits = parseInt(subCredits);

    if (isNaN(grade) || grade < 0 || grade > 500 || isNaN(credits) || credits < 1) {
      alert('Ingresa una calificación válida (0 a 500) y créditos válidos.');
      return;
    }

    setSubjects([...subjects, { name: subName.trim() || `Materia ${subjects.length + 1}`, grade, credits }]);
    setSubName('');
    setSubGrade('');
    setSubCredits('');
  };

  const handleDeleteSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(sub => {
      totalPoints += sub.grade * sub.credits;
      totalCredits += sub.credits;
    });
    return Math.round(totalPoints / totalCredits);
  };

  const gpa = calculateGPA();

  const getGpaStatus = () => {
    if (subjects.length === 0) return { badge: 'Ingresa materias', className: 'status-neutral', tip: 'Agrega las asignaturas del semestre con sus respectivas notas y créditos para evaluar el estado de tu beca.' };
    if (gpa >= 400) {
      return {
        badge: '¡Beca Excelente!',
        className: 'status-success',
        tip: `Excelente: Tu promedio de <strong>${gpa}</strong> puntos está en un nivel sobresaliente. Mantienes con seguridad tu beca de Talento Magdalena.`
      };
    } else if (gpa >= 300) {
      return {
        badge: 'Aprobado (Talento Vigente)',
        className: 'status-warning',
        tip: `Felicidades: Tu promedio de <strong>${gpa}</strong> puntos cumple con el mínimo de <strong>300</strong> exigido para conservar tu cupo y beneficios en Talento Magdalena. ¡No te descuides!`
      };
    } else if (gpa >= 250) {
      return {
        badge: 'Condicional Académico',
        className: 'status-danger',
        tip: `Riesgo Académico: Tu promedio acumulado de <strong>${gpa}</strong> está por debajo del promedio mínimo de permanencia (300). Entras en condicionalidad y corres riesgo de perder la beca.`
      };
    } else {
      return {
        badge: 'Pérdida de Permanencia',
        className: 'status-danger',
        tip: `Alerta Crítica: Un promedio acumulado inferior a <strong>250</strong> puntos genera pérdida de la condición de estudiante en la Universidad del Magdalena.`
      };
    }
  };

  const gpaStatus = getGpaStatus();

  /* ==========================================================================
     6. TEST DE ESTILO DE APRENDIZAJE CON TRANSICIONES
     ========================================================================== */
  const [quizStep, setQuizStep] = useState('intro'); // intro | question | result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [fadeClass, setFadeClass] = useState('fade-in');

  const quizQuestions = [
    {
      question: '¿Qué es lo que más recuerdas después de conocer a un profesor nuevo?',
      options: [
        { text: 'Su rostro, sus gestos o la presentación visual de la clase.', type: 'V' },
        { text: 'Su tono de voz, sus explicaciones orales o sus anécdotas habladas.', type: 'A' },
        { text: 'La dinámica grupal del primer día o lo cómodo que me sentí en el salón.', type: 'K' }
      ]
    },
    {
      question: 'Cuando estás preparando una exposición de un tema difícil, ¿qué prefieres?',
      options: [
        { text: 'Diseñar diapositivas llenas de diagramas, mapas y colores.', type: 'V' },
        { text: 'Ensayar el discurso en voz alta frente al espejo o grabarte.', type: 'A' },
        { text: 'Escribir fichas, mover las manos al hablar y construir maquetas.', type: 'K' }
      ]
    },
    {
      question: '¿Cuál es tu método principal al repasar apuntes en casa?',
      options: [
        { text: 'Usar resaltadores de colores y dibujar mapas conceptuales.', type: 'V' },
        { text: 'Grabar las clases y volverlas a escuchar, o debatir con amigos.', type: 'A' },
        { text: 'Escribir resúmenes de nuevo a mano o resolver ejercicios prácticos.', type: 'K' }
      ]
    },
    {
      question: 'Si compras un dispositivo electrónico nuevo, ¿cómo aprendes a usarlo?',
      options: [
        { text: 'Leo y examino el manual ilustrado de instrucciones.', type: 'V' },
        { text: 'Busco un video tutorial o le pregunto a alguien que ya lo sepa usar.', type: 'A' },
        { text: 'Empiezo a tocar los botones y a experimentar directamente con él.', type: 'K' }
      ]
    },
    {
      question: '¿Qué te distrae más durante una jornada de estudio autónomo?',
      options: [
        { text: 'El desorden visual a mi alrededor en el escritorio o el teléfono iluminándose.', type: 'V' },
        { text: 'Ruidos de fondo constantes, música con letra o murmullos de otras personas.', type: 'A' },
        { text: 'Estar sentado mucho tiempo seguido; siento la necesidad física de moverme.', type: 'K' }
      ]
    }
  ];

  const handleQuizStart = () => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setQuizStep('question');
      setCurrentQuestionIndex(0);
      setQuizAnswers([]);
      setFadeClass('fade-in');
    }, 150);
  };

  const handleOptionSelect = (type) => {
    setQuizAnswers([...quizAnswers, type]);
    setFadeClass('fade-out');

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFadeClass('fade-in');
      } else {
        setQuizStep('result');
        setFadeClass('fade-in');
      }
    }, 180);
  };

  const handleQuizReset = () => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setQuizStep('intro');
      setFadeClass('fade-in');
    }, 150);
  };

  const getQuizResult = () => {
    const counts = { V: 0, A: 0, K: 0 };
    quizAnswers.forEach(ans => counts[ans]++);

    let dominantType = 'V';
    if (counts.A > counts[dominantType]) dominantType = 'A';
    if (counts.K > counts[dominantType]) dominantType = 'K';

    const styleDetails = {
      V: {
        name: 'Estudiante Visual',
        desc: 'Procesas y retienes mejor la información mediante elementos visuales. Recuerdas caras y tiendes a pensar en imágenes.',
        tips: [
          'Usa el <strong>Método Cornell</strong> estructurando tus notas con resaltadores y códigos de color.',
          'Esquematiza tus materias con <strong>mapas conceptuales</strong>, líneas de tiempo o dibujos.',
          'Utiliza fichas de estudio (flashcards) con gráficos e iconografía llamativa.'
        ]
      },
      A: {
        name: 'Estudiante Auditivo',
        desc: 'Aprendes más fácilmente a través de explicaciones verbales y debates. Recuerdas tonos y ritmos de voz con precisión.',
        tips: [
          'Graba tus propios resúmenes hablados y escúchalos en tus traslados al campus.',
          'Explica la lección en voz alta utilizando la <strong>Técnica Feynman</strong>.',
          'Organiza grupos de estudio donde discutan y debatan las respuestas verbalmente.'
        ]
      },
      K: {
        name: 'Estudiante Kinestésico',
        desc: 'Asimilas mejor los conceptos asociándolos al movimiento físico, la experimentación y la resolución directa de problemas prácticos.',
        tips: [
          'Resuelve simulacros de examen y realiza la mayor cantidad de <strong>ejercicios prácticos</strong> posibles.',
          'Estudia caminando por tu habitación o gesticulando mientras explicas apuntes.',
          'Aprovecha el temporizador Pomodoro integrado para cambiar de posición y dar descansos activos.'
        ]
      }
    };

    return styleDetails[dominantType];
  };

  const quizResult = quizStep === 'result' ? getQuizResult() : null;

  /* ==========================================================================
     7. TEMPORIZADOR POMODORO CON WEB AUDIO API
     ========================================================================== */
  const DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [totalDuration, setTotalDuration] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus');
  const [ambientSound, setAmbientSound] = useState(false);

  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const timerRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playBellSound = () => {
    initAudio();
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtxRef.current.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtxRef.current.currentTime + 0.15);
    osc.frequency.setValueAtTime(783.99, audioCtxRef.current.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.6);
  };

  const startNoise = () => {
    initAudio();
    const bufferSize = 4096;
    let lastOut = 0.0;

    noiseNodeRef.current = audioCtxRef.current.createScriptProcessor(bufferSize, 1, 1);
    noiseNodeRef.current.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    };

    const gain = audioCtxRef.current.createGain();
    gain.gain.value = 0.035;

    noiseNodeRef.current.connect(gain);
    gain.connect(audioCtxRef.current.destination);
  };

  const stopNoise = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
  };

  useEffect(() => {
    if (ambientSound && isRunning) {
      startNoise();
    } else {
      stopNoise();
    }
    return () => stopNoise();
  }, [ambientSound, isRunning]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playBellSound();
            
            if (timerMode === 'focus') {
              alert('¡Buen trabajo enfocado! Es momento de tomar un descanso.');
              handleSetMode('shortBreak');
            } else {
              alert('El descanso ha terminado. ¡Vamos a enfocarnos!');
              handleSetMode('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timerMode]);

  const handleStartPause = () => {
    initAudio();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const handleSetMode = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    setTotalDuration(DURATIONS[mode]);
    setTimeLeft(DURATIONS[mode]);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = 553 * (1 - timeLeft / totalDuration);

  /* ==========================================================================
     8. FORMULARIO EN CONEXIÓN CON WEBHOOK DE DISCORD
     ========================================================================== */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalCode, setModalCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalMessage.trim()) return;

    setIsSending(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Payload adaptado al formato de Discord Embed
    const payload = {
      embeds: [
        {
          title: "🆕 Inquietud de Estudiante - Primi-Preguntas",
          color: 888764, // Dec color para Teal de Unimag (#0d9488)
          fields: [
            { name: "👤 Nombre (Opcional)", value: modalName.trim() || "Anónimo", inline: true },
            { name: "🆔 Código Estudiantil (Opcional)", value: modalCode.trim() || "No especificado", inline: true },
            { name: "📝 Pregunta / Mensaje", value: modalMessage.trim() }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Enviado desde Primi-Preguntas Unimagdalena"
          }
        }
      ]
    };

    try {
      const response = await fetch('https://discord.com/api/webhooks/1510339527083036825/sF_KvaZdwSgDex73hk_4z1EsuHYYeVyVfnWvfXuF92GWu_tdRD4l4clEs9bDEPB_i8Qd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setModalName('');
        setModalCode('');
        setModalMessage('');
        // Cerrar modal automáticamente después de mostrar éxito
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 2200);
      } else {
        throw new Error('No se pudo enviar la solicitud.');
      }
    } catch (err) {
      setSubmitError('Hubo un problema de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Fondo de malla de color */}
      <div className="mesh-background" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

      {/* Header & Logos Branded */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo-area">
            <img src={logoUnimagdalena} className="img-logo-unimagdalena" alt="Escudo Universidad del Magdalena" />
            <img src={logoTalento} className="img-logo-talento" alt="Logo Talento Magdalena" />
            <div className="brand-text-container">
              <span className="brand-title">Primi-<span>Preguntas</span></span>
              <span className="brand-subtitle">Talento Magdalena</span>
            </div>
          </div>
          
          <div className="nav-menu-wrapper">
            <nav className="main-nav" aria-label="Navegación principal">
              <ul className="nav-menu">
                <li>
                  <button 
                    className={`nav-link ${activeView === 'view-home' ? 'active' : ''}`}
                    onClick={() => navigateTo('view-home')}
                  >
                    Inicio / FAQs
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeView === 'view-calc' ? 'active' : ''}`}
                    onClick={() => navigateTo('view-calc')}
                  >
                    Calculadora Promedio
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeView === 'view-quiz' ? 'active' : ''}`}
                    onClick={() => navigateTo('view-quiz')}
                  >
                    Test de Aprendizaje
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeView === 'view-pomo' ? 'active' : ''}`}
                    onClick={() => navigateTo('view-pomo')}
                  >
                    Pomodoro Focus
                  </button>
                </li>
              </ul>
            </nav>

            {/* Selector de Tema en Header Desktop */}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              aria-label="Cambiar tema de color"
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        
        {/* VISTA 1: INICIO & FAQ */}
        <div className={`mobile-view ${activeView === 'view-home' ? 'active-view' : ''}`} id="view-home">
          {/* Hero Section */}
          <section className="hero-section" id="inicio">

            <div className="hero-container">
              <span className="badge-talento">
                🎓 Programa Talento Magdalena • Universidad del Magdalena
              </span>
              <h1 className="hero-title">Sobrevive y brilla en tu primer semestre</h1>
              <p className="hero-subtitle">
                Accede a las respuestas sobre permanencia de Unimagdalena, simula tu promedio de calificaciones y optimiza tu estudio hoy mismo.
              </p>
              
              {/* Buscador */}
              <div className="search-container">
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="search-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                      type="search" 
                      className="search-input" 
                      placeholder="Busca tus dudas académicas (ej. parciales, beca, promedio, créditos)…" 
                      aria-label="Buscar en la base de datos de preguntas frecuentes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="search-button">Buscar</button>
                  </div>
                </form>
                
                <div className="search-suggestions">
                  <span className="suggestion-label">Sugerencias:</span>
                  <div className="suggestion-chips">
                    <button className="chip-btn" onClick={() => setSearchQuery('beca')}>Requisitos Beca</button>
                    <button className="chip-btn" onClick={() => setSearchQuery('permanencia')}>Permanencia</button>
                    <button className="chip-btn" onClick={() => setSearchQuery('créditos')}>Créditos mínimos</button>
                    <button className="chip-btn" onClick={() => setSearchQuery('alimentario')}>Almuerzos</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección FAQ */}
          <section className="faq-section" id="faq-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Preguntas Frecuentes Académicas</h2>
                <p className="section-description">Respuestas basadas en el reglamento de Unimagdalena para acompañarte en tu integración.</p>
              </div>

              {/* Filtros Categoría FAQ */}
              <div className="faq-filters" role="tablist" aria-label="Categorías de Preguntas Frecuentes">
                <button 
                  className={`filter-btn ${currentCategory === 'all' ? 'active' : ''}`}
                  onClick={() => { setCurrentCategory('all'); setOpenFaqId(null); }}
                >
                  Todas
                </button>
                <button 
                  className={`filter-btn ${currentCategory === 'estudio' ? 'active' : ''}`}
                  onClick={() => { setCurrentCategory('estudio'); setOpenFaqId(null); }}
                >
                  Métodos de Estudio
                </button>
                <button 
                  className={`filter-btn ${currentCategory === 'talento' ? 'active' : ''}`}
                  onClick={() => { setCurrentCategory('talento'); setOpenFaqId(null); }}
                >
                  Talento Magdalena
                </button>
                <button 
                  className={`filter-btn ${currentCategory === 'vida' ? 'active' : ''}`}
                  onClick={() => { setCurrentCategory('vida'); setOpenFaqId(null); }}
                >
                  Vida Universitaria
                </button>
                <button 
                  className={`filter-btn ${currentCategory === 'bienestar' ? 'active' : ''}`}
                  onClick={() => { setCurrentCategory('bienestar'); setOpenFaqId(null); }}
                >
                  Bienestar
                </button>
              </div>

              {/* Acordeón de FAQs */}
              <div className="faq-accordion" role="presentation">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className={`faq-item ${openFaqId === faq.id ? 'active' : ''}`}>
                    <button 
                      className="faq-trigger" 
                      aria-expanded={openFaqId === faq.id}
                      onClick={() => handleFaqToggle(faq.id)}
                    >
                      <span>{faq.question}</span>
                      <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div 
                      className="faq-panel" 
                      style={{ maxHeight: openFaqId === faq.id ? '300px' : '0px' }}
                    >
                      <div className="faq-content" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                    </div>
                  </div>
                ))}
                
                {filteredFAQs.length === 0 && (
                  <div className="search-empty-state">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <h3>No encontramos coincidencias</h3>
                    <p>Prueba con términos alternativos como "promedio", "cancelar", "estudio" o "alimentación".</p>
                  </div>
                )}

                {/* Callout para preguntas adicionales */}
                <div className="faq-additional-prompt">
                  <p className="faq-prompt-text">¿Tienes alguna otra pregunta? Háznoslo saber.</p>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsModalOpen(true)}
                  >
                    Enviar mi pregunta
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sección de Enlaces y Recursos de Interés */}
          <section className="resources-section" id="view-recursos">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Portales y Enlaces Institucionales</h2>
                <p className="section-description">Enlaces directos a los servicios clave de la Universidad del Magdalena.</p>
              </div>

              <div className="resources-grid">
                <div className="resource-card card glow-card">
                  <div className="resource-visual notion-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                      <path d="M6 6h10M6 10h10M6 14h8"></path>
                    </svg>
                  </div>
                  <div className="resource-body">
                    <h3>Portal Oficial Unimagdalena</h3>
                    <p>Accede directamente al sitio web oficial de la institución para consultar el calendario académico, noticias y trámites generales.</p>
                    <a href="https://www.unimagdalena.edu.co/" target="_blank" rel="noopener noreferrer" className="btn-text">
                      Visitar unimagdalena.edu.co
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="19" x2="19" y2="5"></line>
                        <polyline points="12 5 19 5 19 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="resource-card card glow-card">
                  <div className="resource-visual cornell-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div className="resource-body">
                    <h3>Desarrollo Estudiantil Unimagdalena</h3>
                    <p>Acompañamiento, monitorias y tutorías de apoyo académico para estudiantes de primer semestre y programa Talento.</p>
                    <a href="https://www.unimagdalena.edu.co/UnidadesOrganizativas/Direccion/1002" target="_blank" rel="noopener noreferrer" className="btn-text">
                      Portal Desarrollo Estudiantil
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="19" x2="19" y2="5"></line>
                        <polyline points="12 5 19 5 19 12"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* MODIFICACIÓN: Dubas Reglamentarias abre el Modal de Discord */}
                <div className="resource-card card glow-card">
                  <div className="resource-visual planner-bg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="resource-body">
                    <h3>¿Tienes dudas reglamentarias?</h3>
                    <p>¿Tienes alguna otra pregunta? Háznoslo saber. Envíanos un mensaje y te daremos respuesta inmediata en Desarrollo Estudiantil.</p>
                    <button 
                      className="btn btn-secondary btn-full"
                      style={{ marginTop: 'auto' }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Preguntar a Desarrollo
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{marginLeft: '6px'}}>
                        <line x1="5" y1="19" x2="19" y2="5"></line>
                        <polyline points="12 5 19 5 19 12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* PESTAÑAS DENTRO DEL CONTENEDOR BENTO (Desktop Dashboard / Pestañas móviles) */}
        <div className="desktop-bento-container container">
          
          {/* PESTAÑA 2: CALCULADORA DE PROMEDIO (0-500) */}
          <div className={`mobile-view bento-item bento-large card glow-card ${activeView === 'view-calc' ? 'active-view' : ''}`} id="view-calc">
            <div className="card-header">
              <div className="header-icon-wrapper secondary-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="9" y1="22" x2="9" y2="16"></line>
                  <line x1="8" y1="6" x2="16" y2="6"></line>
                  <line x1="16" y1="22" x2="16" y2="16"></line>
                  <line x1="9" y1="16" x2="16" y2="16"></line>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                </svg>
              </div>
              <div className="header-text">
                <h3>Calculadora de Notas Unimagdalena</h3>
                <p>Simulador de notas en escala de 0 a 500 puntos. Aprobación: 300 pts. Meta Beca: 400 pts.</p>
              </div>
            </div>

            <div className="calculator-layout">
              <div className="calc-form-container">
                <form onSubmit={handleAddSubject}>
                  <div className="form-row-grid">
                    <div className="form-group">
                      <label htmlFor="subjectName">Materia</label>
                      <input 
                        type="text" 
                        id="subjectName" 
                        className="form-control" 
                        placeholder="Ej. Cálculo Diferencial…" 
                        autoComplete="off"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                      />
                    </div>
                    <div className="form-row-sub">
                      <div className="form-group">
                        <label htmlFor="subjectGrade">Nota (0 - 500)</label>
                        <input 
                          type="number" 
                          id="subjectGrade" 
                          className="form-control" 
                          placeholder="Ej. 420…" 
                          min="0" 
                          max="500" 
                          required
                          value={subGrade}
                          onChange={(e) => setSubGrade(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subjectCredits">Créditos</label>
                        <input 
                          type="number" 
                          id="subjectCredits" 
                          className="form-control" 
                          placeholder="Ej. 4…" 
                          min="1" 
                          max="10" 
                          required
                          value={subCredits}
                          onChange={(e) => setSubCredits(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-secondary btn-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Registrar Asignatura
                  </button>
                </form>

                <div className="subjects-list-wrapper">
                  <h4 className="sub-title">Asignaturas Matriculadas</h4>
                  <div className="table-container">
                    <table className="subjects-table">
                      <thead>
                        <tr>
                          <th scope="col">Asignatura</th>
                          <th scope="col" className="text-right">Nota</th>
                          <th scope="col" className="text-right">Créditos</th>
                          <th scope="col" className="text-center" aria-label="Acciones"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((sub, i) => (
                          <tr key={i}>
                            <td>{sub.name}</td>
                            <td className="text-right tabular-numbers">{sub.grade}</td>
                            <td className="text-right tabular-numbers">{sub.credits}</td>
                            <td className="text-center">
                              <button 
                                className="delete-btn" 
                                aria-label={`Eliminar ${sub.name}`}
                                onClick={() => handleDeleteSubject(i)}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {subjects.length === 0 && (
                          <tr className="empty-row">
                            <td colSpan="4" className="text-center">No hay asignaturas añadidas en este semestre.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="calc-results-sidebar">
                <div className="result-display-card">
                  <span className="result-card-label">PROMEDIO SEMESTRAL</span>
                  <div className="gpa-number tabular-numbers">
                    {subjects.length > 0 ? gpa : '000'}
                  </div>
                  <div className={`gpa-status-badge ${gpaStatus.className}`}>
                    {gpaStatus.badge}
                  </div>
                  <p className="gpa-tip" dangerouslySetInnerHTML={{ __html: gpaStatus.tip }}></p>
                </div>
                
                <div className="scholarship-alert-box">
                  <div className="alert-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Reglamentación de Promedios</span>
                  </div>
                  <p className="alert-text">
                    La Universidad exige estar por encima de <strong>300 puntos</strong> para evitar la condicionalidad académica. En el programa Talento, bajar de 300 puntos es causal de suspensión temporal del beneficio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PESTAÑA 3: TEST DE APRENDIZAJE */}
          <div className={`mobile-view bento-item bento-small card glow-card ${activeView === 'view-quiz' ? 'active-view' : ''}`} id="view-quiz">
            <div className="card-header">
              <div className="header-icon-wrapper success-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
              </div>
              <div className="header-text">
                <h3>Test de Aprendizaje</h3>
                <p>Analiza tu canal perceptual de estudio principal.</p>
              </div>
            </div>

            <div className={`quiz-container ${fadeClass}`}>
              {quizStep === 'intro' && (
                <div className="quiz-step">
                  <p className="quiz-description">¿Sientes que lees bastante pero olvidas rápido? Descubre si eres un estudiante visual, auditivo o kinestésico. Responde 5 preguntas sencillas para adaptar tus técnicas al modelo pedagógico de Unimagdalena.</p>
                  <button className="btn btn-success btn-full" onClick={handleQuizStart}>Iniciar Test Rápido</button>
                </div>
              )}

              {quizStep === 'question' && (
                <div className="quiz-step">
                  <div className="quiz-progress-bar-wrapper">
                    <div className="quiz-progress-fill" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                  </div>
                  <div className="quiz-question-counter">Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}</div>
                  <h4 className="quiz-question-text">{quizQuestions[currentQuestionIndex].question}</h4>
                  
                  <div className="quiz-options-list" role="radiogroup" aria-labelledby="quizQuestionText">
                    {quizQuestions[currentQuestionIndex].options.map((opt, i) => (
                      <button 
                        key={i} 
                        className="quiz-option-btn"
                        role="radio"
                        aria-checked="false"
                        onClick={() => handleOptionSelect(opt.type)}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 'result' && quizResult && (
                <div className="quiz-step">
                  <div className="result-badge-anim">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <h4 className="result-title">Perfil Cognitivo Principal:</h4>
                  <div className="result-style-name">{quizResult.name}</div>
                  <div className="result-desc">{quizResult.desc}</div>
                  
                  <div className="result-tips-box">
                    <h5>Estrategias recomendadas de estudio activo:</h5>
                    <ul className="result-tips-list">
                      {quizResult.tips.map((tip, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: tip }}></li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-outline btn-full" onClick={handleQuizReset}>Repetir Evaluación</button>
                </div>
              )}
            </div>
          </div>

          {/* PESTAÑA 4: POMODORO FOCUS TIMER */}
          <div className={`mobile-view bento-item bento-small card glow-card ${activeView === 'view-pomo' ? 'active-view' : ''}`} id="view-pomo">
            <div className="card-header">
              <div className="header-icon-wrapper primary-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="header-text">
                <h3>Pomodoro Focus</h3>
                <p>Optimiza tu estudio diario reduciendo el cansancio con descansos activos.</p>
              </div>
            </div>

            <div className="pomodoro-container">
              <div className="timer-visual-wrapper">
                <svg className="timer-svg" viewBox="0 0 200 200">
                  <circle className="timer-circle-bg" cx="100" cy="100" r="88" strokeWidth="8"></circle>
                  <circle 
                    className="timer-circle-progress" 
                    cx="100" 
                    cy="100" 
                    r="88" 
                    strokeWidth="8" 
                    strokeDasharray="553" 
                    strokeDashoffset={strokeDashoffset} 
                    transform="rotate(-90 100 100)"
                  ></circle>
                </svg>
                <div className="timer-text-display">
                  <span className="timer-label">{timerMode === 'focus' ? 'Enfoque' : 'Descanso'}</span>
                  <span className="timer-time tabular-numbers">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="timer-modes" role="group" aria-label="Modos del temporizador">
                <button 
                  className={`mode-btn ${timerMode === 'focus' ? 'active' : ''}`}
                  onClick={() => handleSetMode('focus')}
                >
                  Estudiar (25m)
                </button>
                <button 
                  className={`mode-btn ${timerMode === 'shortBreak' ? 'active' : ''}`}
                  onClick={() => handleSetMode('shortBreak')}
                >
                  Corto (5m)
                </button>
                <button 
                  className={`mode-btn ${timerMode === 'longBreak' ? 'active' : ''}`}
                  onClick={() => handleSetMode('longBreak')}
                >
                  Largo (15m)
                </button>
              </div>

              <div className="timer-controls">
                <button className="btn btn-primary" onClick={handleStartPause}>
                  {isRunning ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                      Pausar
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Iniciar
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={handleReset} 
                  disabled={timeLeft === totalDuration && !isRunning}
                  aria-label="Reiniciar conteo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                </button>
              </div>

              <div className="audio-control-wrapper">
                <label className="switch-container">
                  <input 
                    type="checkbox" 
                    className="switch-input"
                    checked={ambientSound}
                    onChange={(e) => setAmbientSound(e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                  <span className="switch-label">Sonido ambiental de enfoque</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Barra de Pestañas Móviles Flotante (Emulación de App Móvil) */}
      <nav className="mobile-tab-bar" aria-label="Navegación móvil inferior">
        <button 
          className={`tab-item ${activeView === 'view-home' ? 'active' : ''}`}
          onClick={() => navigateTo('view-home')}
          aria-selected={activeView === 'view-home'}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Inicio</span>
        </button>
        <button 
          className={`tab-item ${activeView === 'view-calc' ? 'active' : ''}`}
          onClick={() => navigateTo('view-calc')}
          aria-selected={activeView === 'view-calc'}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="9" y1="22" x2="9" y2="16"></line>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="22" x2="16" y2="16"></line>
          </svg>
          <span>Promedio</span>
        </button>
        <button 
          className={`tab-item ${activeView === 'view-quiz' ? 'active' : ''}`}
          onClick={() => navigateTo('view-quiz')}
          aria-selected={activeView === 'view-quiz'}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>Test</span>
        </button>
        <button 
          className={`tab-item ${activeView === 'view-pomo' ? 'active' : ''}`}
          onClick={() => navigateTo('view-pomo')}
          aria-selected={activeView === 'view-pomo'}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Focus</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-text">Primi-<span>Preguntas</span></span>
            <p className="footer-desc">Diseñado con amor y código para los beneficiarios de Talento Magdalena. Universidad del Magdalena, 2026.</p>
          </div>
          <div className="footer-links">
            <h4>Soporte & Bienestar</h4>
            <ul>
              <li><a href="https://www.instagram.com/papunimagdalena?utm_medium=copy_link" target="_blank" rel="noopener noreferrer">Acompañamiento Psicológico</a></li>
              <li><a href="https://www.instagram.com/academia_contigoum?igsh=eDU4aGY3bTYzeDJs" target="_blank" rel="noopener noreferrer">Tutorías con Mentores</a></li>
              <li><a href="https://wa.me/573009083555" target="_blank" rel="noopener noreferrer">Soporte Técnico</a></li>
            </ul>
          </div>
          <div className="footer-meta">
            <p>&copy; 2026 Primi-Preguntas. Creado para la excelencia académica de los nuevos talentos.</p>
          </div>
        </div>
      </footer>

      {/* ==========================================================================
         MODAL DE PREGUNTA ENLAZADO A WEBHOOK DISCORD
         ========================================================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} aria-label="Cerrar modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!submitSuccess ? (
              <>
                <h3 className="modal-title" id="modalTitle">¿Tienes alguna otra pregunta?</h3>
                <p className="modal-subtitle">Escribe tu inquietud y la enviaremos al equipo de consejería y desarrollo estudiantil.</p>
                
                <form onSubmit={handleModalSubmit}>
                  <div className="form-group" style={{marginBottom: '16px'}}>
                    <label htmlFor="modalName">Nombre (Opcional)</label>
                    <input 
                      type="text" 
                      id="modalName"
                      className="form-control"
                      placeholder="Ej. Carlos Gamarra…"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      disabled={isSending}
                    />
                  </div>

                  <div className="form-group" style={{marginBottom: '16px'}}>
                    <label htmlFor="modalCode">Código Estudiantil (Opcional)</label>
                    <input 
                      type="text" 
                      id="modalCode"
                      className="form-control"
                      placeholder="Ej. 2026115000…"
                      value={modalCode}
                      onChange={(e) => setModalCode(e.target.value)}
                      disabled={isSending}
                    />
                  </div>

                  <div className="form-group" style={{marginBottom: '16px'}}>
                    <label htmlFor="modalMsg">Tu Pregunta / Mensaje</label>
                    <textarea 
                      id="modalMsg"
                      className="form-control form-textarea"
                      placeholder="Escribe aquí tu duda reglamentaria con lujo de detalle…"
                      required
                      value={modalMessage}
                      onChange={(e) => setModalMessage(e.target.value)}
                      disabled={isSending}
                    ></textarea>
                  </div>

                  {submitError && <div className="modal-error-text" role="alert">{submitError}</div>}

                  <div className="modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={isSending}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSending || !modalMessage.trim()}>
                      {isSending ? 'Enviando…' : 'Enviar Pregunta'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="modal-success-screen">
                <div className="result-badge-anim modal-success-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="modal-title">¡Mensaje Enviado!</h3>
                <p className="modal-subtitle">Tu pregunta ha sido recibida con éxito. Te responderemos muy pronto.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
