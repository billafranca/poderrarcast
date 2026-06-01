import epPricing from "@/assets/ep-pricing.jpg";
import epMarketing from "@/assets/ep-marketing.jpg";
import epStrategy from "@/assets/ep-strategy.jpg";
import epHiring from "@/assets/ep-hiring.jpg";
import epAi from "@/assets/ep-ai-finance.jpg";
import epMindset from "@/assets/ep-mindset.jpg";




export type ModuleCode = "M1" | "M2" | "M3" | "M4" | "M5" | "M6";

export type Module = {
  code: ModuleCode;
  title: string;
  tagline: string;
  videoTitle: string;
  videoDescription: string;
  videoUrl: string;
  text: string;
  books: { title: string; author: string }[];
  exercises: string[];
  quiz: {
    intro: string;
    questions: string[];
  };
  checklist: string[];
};

export const MODULES_CONTENT: Record<ModuleCode, Module> = {
  M1: {
    code: "M1",
    title: "Mentalidade do erro",
    tagline: "Transforme falhas em vantagem competitiva.",
    videoTitle: "Introdução ao papel do erro no crescimento",
    videoDescription:
      "Por que errar é parte do processo — e como criar um sistema para extrair aprendizado de cada falha.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "Erros não são o oposto do sucesso — são a matéria-prima dele. A diferença entre quem estagna e quem cresce não é cometer menos erros, é ter um sistema para extrair valor de cada um deles.\n\nNeste módulo você entende por que o cérebro tende a esconder falhas (e como isso sabota decisões), aprende a separar erro de fracasso e constrói um ritual prático de revisão. Você vai criar um registro semanal simples, transformar cada falha em hipótese de melhoria e desenvolver o hábito de analisar antes de repetir.\n\nAo final, você terá uma rotina concreta para converter erros em aprendizado mensurável — a base de tudo que vem nos próximos módulos.",
    books: [
      { title: "Mindset", author: "Carol Dweck" },
      { title: "The Lean Startup", author: "Eric Ries" },
    ],
    exercises: [
      "Liste 3 erros recentes do seu negócio (últimos 90 dias).",
      "Descreva 1 aprendizado concreto extraído de cada um.",
      "Identifique padrões: o que se repete entre eles?",
    ],
    quiz: {
      intro: "Diagnóstico reflexivo de mentalidade — responda com sinceridade.",
      questions: [
        "Você costuma analisar seus erros ou tende a ignorá-los?",
        "Quando algo falha, você aprende ou repete o mesmo padrão?",
        "Você registra suas decisões importantes em algum lugar?",
      ],
    },
    checklist: [
      "Registrar erros semanalmente",
      "Revisar decisões passadas",
      "Documentar aprendizados",
      "Criar hábito de análise",
    ],
  },
  M2: {
    code: "M2",
    title: "Erros em Marketing e Vendas",
    tagline: "Comunicação clara, conversão consistente.",
    videoTitle: "Falhas na comunicação e conversão",
    videoDescription:
      "Os erros mais comuns em proposta de valor, posicionamento e mensagem — e como corrigir cada um.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "Marketing e vendas falham quase sempre pelo mesmo motivo: a mensagem não é clara para quem precisa comprar. Antes de investir mais em tráfego ou contratar vendedores, é preciso garantir que a proposta de valor seja entendida em segundos.\n\nNeste módulo você aprende a diagnosticar onde sua comunicação perde o cliente: posicionamento confuso, promessa genérica ou ausência de prova. Você vai reescrever sua proposta de valor, estruturar testes A/B de mensagem e ler campanhas por métricas reais (CTR, conversão, CAC) em vez de achismo.\n\nO resultado é uma comunicação que converte de forma consistente — e a clareza para saber o que escalar e o que cortar.",
    books: [
      { title: "This is Marketing", author: "Seth Godin" },
      { title: "Influence", author: "Robert Cialdini" },
    ],
    exercises: [
      "Reescreva sua proposta de valor em 1 frase de até 15 palavras.",
      "Analise uma campanha que não converteu — o que faltou de clareza?",
      "Crie 3 variações de mensagem para o mesmo público.",
    ],
    quiz: {
      intro: "Avalie a maturidade da sua comunicação e vendas.",
      questions: [
        "Sua comunicação é clara para o cliente final?",
        "Você testa diferentes mensagens antes de escalar?",
        "Você analisa resultados de campanhas com métricas reais?",
      ],
    },
    checklist: [
      "Definir proposta de valor clara",
      "Testar mensagens (A/B)",
      "Analisar campanhas com dados",
      "Ajustar comunicação por canal",
    ],
  },
  M3: {
    code: "M3",
    title: "Erros Financeiros",
    tagline: "Controle a saúde do negócio antes que ela controle você.",
    videoTitle: "O impacto de decisões financeiras",
    videoDescription:
      "Precificação, controle de caixa e leitura de números: os 3 pilares que separam negócios saudáveis dos que quebram.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "A maioria dos negócios não quebra por falta de cliente — quebra por falta de controle. Faturar muito e sobrar pouco é o sintoma mais comum de quem confunde caixa com lucro.\n\nNeste módulo você organiza seu fluxo de caixa de forma simples e sustentável, separa custos fixos de variáveis e descobre o custo real de entregar seu produto ou serviço. A partir disso, você revisa sua precificação para garantir que ela cubra custos e ainda gere a margem que você precisa.\n\nVocê sai com clareza sobre os números que realmente importam e com critérios para tomar decisões financeiras sem medo — e sem surpresas no fim do mês.",
    books: [
      { title: "Profit First", author: "Mike Michalowicz" },
      { title: "The Psychology of Money", author: "Morgan Housel" },
    ],
    exercises: [
      "Mapeie seu fluxo de caixa dos últimos 30 dias.",
      "Calcule o custo real de entrega do seu principal produto/serviço.",
      "Avalie se sua precificação cobre custos + margem desejada.",
    ],
    quiz: {
      intro: "Diagnóstico financeiro rápido.",
      questions: [
        "Você controla seu fluxo de caixa de forma sistemática?",
        "Sua precificação cobre todos os custos com margem?",
        "Você toma decisões financeiras com base em dados ou sentimento?",
      ],
    },
    checklist: [
      "Organizar fluxo de caixa",
      "Revisar precificação",
      "Controlar custos fixos e variáveis",
      "Tomar decisões com dados",
    ],
  },
  M4: {
    code: "M4",
    title: "Erros Estratégicos",
    tagline: "Decida com clareza, ajuste com velocidade.",
    videoTitle: "Falhas em decisões e planejamento",
    videoDescription:
      "Como evitar decisões impulsivas e construir um processo simples de estratégia que funciona no dia a dia.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "Estratégia ruim é quase sempre ausência de critério: decisões tomadas no impulso, prioridades que mudam toda semana e esforço espalhado em direções demais.\n\nNeste módulo você aprende a focar no que move o negócio. Vai definir prioridades reais, criar critérios objetivos para decidir (em vez de decidir pelo humor do dia) e montar uma estratégia que cabe em uma página. Também vai estabelecer um ritmo de revisão para ajustar a rota com velocidade quando os resultados mostrarem que algo não funciona.\n\nO objetivo não é um plano perfeito de 100 páginas — é clareza suficiente para agir com consistência e corrigir rápido.",
    books: [{ title: "Good Strategy Bad Strategy", author: "Richard Rumelt" }],
    exercises: [
      "Liste 3 decisões importantes tomadas no último trimestre.",
      "Avalie o impacto real de cada uma (resultado vs. expectativa).",
      "Defina 3 critérios objetivos para suas próximas decisões.",
    ],
    quiz: {
      intro: "Avalie sua maturidade estratégica.",
      questions: [
        "Você toma decisões com base em dados ou intuição?",
        "Sua estratégia está clara para você e sua equipe?",
        "Você revisa resultados periodicamente para ajustar a rota?",
      ],
    },
    checklist: [
      "Definir estratégia em 1 página",
      "Analisar dados antes de decidir",
      "Revisar decisões mensalmente",
      "Ajustar direção com agilidade",
    ],
  },
  M5: {
    code: "M5",
    title: "Gestão de Pessoas",
    tagline: "Líder bom é o que faz o time ir longe.",
    videoTitle: "Erros na liderança",
    videoDescription:
      "Comunicação, feedback e acompanhamento — como evitar os 3 erros que mais matam equipes pequenas.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "A maior parte dos problemas em times pequenos não vem de falta de talento — vem de comunicação confusa, expectativas mal definidas e feedback que nunca acontece.\n\nNeste módulo você aprende a alinhar a equipe em torno de poucas prioridades claras, dar feedback direto e útil (sem rodeios e sem virar conflito) e acompanhar desempenho com indicadores simples, em vez de depender só do feeling. Você também vai estruturar um ritual leve de feedback semanal que mantém todos na mesma página.\n\nO resultado é um time mais autônomo e engajado — e um líder que faz o time ir longe sem precisar microgerenciar.",
    books: [{ title: "Leaders Eat Last", author: "Simon Sinek" }],
    exercises: [
      "Avalie se sua equipe sabe quais são as 3 prioridades do mês.",
      "Identifique 1 falha recente de comunicação e o que a causou.",
      "Estruture um modelo simples de feedback semanal.",
    ],
    quiz: {
      intro: "Diagnóstico de liderança e gestão.",
      questions: [
        "Sua equipe entende com clareza os objetivos do negócio?",
        "Você dá feedback de forma direta e frequente?",
        "Você acompanha o desempenho com indicadores ou só pelo feeling?",
      ],
    },
    checklist: [
      "Melhorar comunicação interna",
      "Dar feedback semanal",
      "Acompanhar desempenho com indicadores",
      "Desenvolver liderança contínua",
    ],
  },
  M6: {
    code: "M6",
    title: "Aplicação prática com IA",
    tagline: "IA é alavanca — se você souber pedir.",
    videoTitle: "Uso prático da IA no seu negócio",
    videoDescription:
      "Como transformar a IA em um copiloto que apoia decisões, gera conteúdo e acelera execução.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text:
      "IA não substitui estratégia — amplifica. Usada sem critério, gera textos genéricos; usada com método, vira um copiloto que acelera análise, decisão e execução.\n\nNeste módulo você aprende a estruturar prompts que entregam resultado de verdade: contexto, objetivo, formato e exemplos. Vai usar a IA para mapear causas de problemas reais do negócio, analisar feedback de clientes e gerar conteúdo aplicável — e, principalmente, transformar o output em ação na operação.\n\nVocê sai com fluxos práticos para usar IA no dia a dia e um critério claro para saber quando confiar, quando refinar e quando ignorar a resposta.",
    books: [{ title: "Prediction Machines", author: "Ajay Agrawal" }],
    exercises: [
      "Crie 1 prompt para analisar feedback de clientes.",
      "Use IA para mapear causas de um problema atual do negócio.",
      "Aplique 1 sugestão da IA na operação esta semana.",
    ],
    quiz: {
      intro: "Mede o seu nível de uso de IA na prática.",
      questions: [
        "Você usa IA no dia a dia do negócio?",
        "Você sabe estruturar prompts para obter respostas úteis?",
        "Você aplica as respostas da IA em decisões reais?",
      ],
    },
    checklist: [
      "Usar IA diariamente",
      "Refinar prompts com contexto",
      "Aplicar resultados na operação",
      "Testar e medir melhorias",
    ],
  },
};

export const MODULES_LIST: Module[] = [
  MODULES_CONTENT.M1,
  MODULES_CONTENT.M2,
  MODULES_CONTENT.M3,
  MODULES_CONTENT.M4,
  MODULES_CONTENT.M5,
  MODULES_CONTENT.M6,
];

export const FEATURED_EPISODES = [
  { img: epPricing, title: "Erro de precificação que quebrou um negócio", duration: "32 min", category: "Finanças" },
  { img: epMarketing, title: "Campanha de marketing que falhou", duration: "28 min", category: "Marketing" },
  { img: epStrategy, title: "Decisão estratégica sem dados", duration: "41 min", category: "Estratégia" },
  { img: epHiring, title: "Contratação errada e seus impactos", duration: "36 min", category: "Pessoas" },
  { img: epAi, title: "IA aplicada às finanças", duration: "45 min", category: "IA" },
  { img: epMindset, title: "Por que errar é inevitável", duration: "24 min", category: "Mindset" },
];

export const INSTRUCTORS = [
  { name: "Caio Parrela", bio: "Foco em estratégia e uso de IA para decisões.", initials: "CP" },
  { name: "Pedro Saporito", bio: "Interesse em inovação e tecnologia.", initials: "PS" },
  { name: "Heitor Gomes", bio: "Foco em produtividade e eficiência.", initials: "HG" },
  { name: "Luis Barletti", bio: "Interesse em empreendedorismo prático.", initials: "LB" },
];


export const TESTIMONIALS = [
  { text: "Nunca tinha pensado em usar meus erros assim.", author: "Marina, fundadora SaaS" },
  { text: "A IA me ajudou a entender decisões ruins do passado.", author: "Rafael, dono de loja" },
  { text: "Curso diferente de tudo que já vi no mercado.", author: "Júlia, consultora" },
];
