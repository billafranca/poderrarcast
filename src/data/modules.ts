export type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  episodes: string[];
  text: string;
  books: string[];
  exercises: string[];
  quiz: string[];
  checklist: string[];
};

export const MODULES: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Mentalidade do erro",
    description: "O papel do erro no crescimento e como transformar falhas em aprendizado.",
    episodes: ["Por que errar é inevitável", "Como extrair aprendizado das falhas"],
    text: "Erros como ferramenta estratégica de aprendizado e evolução no empreendedorismo.",
    books: ["Mindset — Carol Dweck", "The Lean Startup — Eric Ries"],
    exercises: ["Liste 3 erros recentes", "Descreva os aprendizados", "Identifique padrões"],
    quiz: [
      "Você costuma analisar seus erros ou ignorá-los?",
      "Você aprende com falhas ou repete padrões?",
      "Você registra decisões importantes?",
    ],
    checklist: [
      "Registrar erros semanalmente",
      "Revisar decisões passadas",
      "Documentar aprendizados",
      "Criar hábito de análise",
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Erros em Marketing e Vendas",
    description: "Falhas em proposta de valor, posicionamento e conversão.",
    episodes: ["Comunicação que não converte", "Campanhas mal direcionadas", "Analisando erros com IA"],
    text: "Erros comuns em proposta de valor, posicionamento e comunicação com o cliente.",
    books: ["This is Marketing — Seth Godin", "Influence — Robert Cialdini"],
    exercises: ["Revisar proposta de valor", "Analisar uma campanha falha", "Refazer a comunicação"],
    quiz: [
      "Sua comunicação é clara para o cliente?",
      "Você testa diferentes mensagens?",
      "Você analisa resultados de campanhas?",
    ],
    checklist: [
      "Definir proposta de valor clara",
      "Testar mensagens",
      "Analisar campanhas",
      "Ajustar comunicação",
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Erros Financeiros",
    description: "Precificação, fluxo de caixa e decisões financeiras com dados.",
    episodes: ["Falta de controle de caixa", "Precificação errada", "IA aplicada às finanças"],
    text: "Problemas como precificação errada, falta de controle de caixa e custos invisíveis.",
    books: ["Profit First — Mike Michalowicz", "The Psychology of Money — Morgan Housel"],
    exercises: ["Revisar fluxo de caixa", "Analisar custos fixos", "Avaliar preços atuais"],
    quiz: [
      "Você controla seu fluxo de caixa?",
      "Sua precificação cobre todos os custos?",
      "Você toma decisões com base em dados?",
    ],
    checklist: [
      "Organizar fluxo de caixa",
      "Revisar preços",
      "Controlar custos",
      "Tomar decisões com dados",
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Erros Estratégicos",
    description: "Decisões sem dados, falta de planejamento e direção clara.",
    episodes: ["Decidir sem dados", "Falta de planejamento", "IA na análise de mercado"],
    text: "Erros por falta de análise, critérios de decisão e direção clara.",
    books: ["Good Strategy Bad Strategy — Richard Rumelt"],
    exercises: ["Listar decisões recentes", "Avaliar impacto", "Criar critérios de decisão"],
    quiz: [
      "Você toma decisões com base em dados?",
      "Você tem uma estratégia clara?",
      "Você revisa resultados regularmente?",
    ],
    checklist: ["Definir estratégia", "Analisar dados", "Revisar decisões", "Ajustar direção"],
  },
  {
    id: "m5",
    number: 5,
    title: "Gestão de Pessoas",
    description: "Liderança, comunicação e contratação consciente.",
    episodes: ["Erros em contratação", "Problemas de comunicação", "Uso ético da IA"],
    text: "Falhas em liderança, feedback e desenvolvimento de equipe.",
    books: ["Leaders Eat Last — Simon Sinek"],
    exercises: ["Avaliar sua comunicação", "Identificar falhas de feedback", "Melhorar reuniões 1:1"],
    quiz: [
      "Sua equipe entende os objetivos?",
      "Você dá feedback claro e frequente?",
      "Você acompanha o desempenho?",
    ],
    checklist: [
      "Melhorar comunicação",
      "Dar feedback estruturado",
      "Acompanhar a equipe",
      "Desenvolver liderança",
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Aplicação prática com IA",
    description: "Como usar IA no dia a dia do negócio para decidir melhor.",
    episodes: ["Como analisar erros com IA", "Criação de prompts", "Plano de melhoria"],
    text: "Como usar IA para diagnosticar problemas, gerar ideias e apoiar decisões.",
    books: ["Prediction Machines — Ajay Agrawal"],
    exercises: ["Criar prompts úteis", "Analisar um problema com IA", "Aplicar a solução"],
    quiz: [
      "Você usa IA no dia a dia?",
      "Você sabe criar bons prompts?",
      "Você aplica as respostas na prática?",
    ],
    checklist: [
      "Usar IA diariamente",
      "Criar prompts melhores",
      "Aplicar resultados",
      "Testar melhorias",
    ],
  },
];

export const FEATURED_EPISODES = [
  { title: "Erro de precificação que quebrou um negócio", module: "M3", duration: "32 min" },
  { title: "Campanha de marketing que falhou", module: "M2", duration: "28 min" },
  { title: "Decisão estratégica sem dados", module: "M4", duration: "41 min" },
  { title: "Contratação errada e seus impactos", module: "M5", duration: "35 min" },
  { title: "Como a IA salvou uma decisão", module: "M6", duration: "26 min" },
  { title: "Falta de caixa: o erro silencioso", module: "M3", duration: "30 min" },
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
