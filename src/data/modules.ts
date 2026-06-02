import m1 from "@/assets/modules/m1.jpg";
import m2 from "@/assets/modules/m2.jpg";
import m3 from "@/assets/modules/m3.jpg";
import m4 from "@/assets/modules/m4.jpg";
import m5 from "@/assets/modules/m5.jpg";
import m6 from "@/assets/modules/m6.jpg";

export type Episode = {
  title: string;
  thumb: string;
  videoUrl: string;
  durationLabel: string;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  cover: string;
  episodes: Episode[];
  text: string;
  books: string[];
  exercises: string[];
  checklist: string[];
};

// YouTube embed URLs (conteúdo curado externo em PT-BR sobre cada tema)
export const MODULES: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Mentalidade do erro",
    description: "O papel do erro no crescimento e como transformar falhas em aprendizado.",
    cover: m1,
    episodes: [
      {
        title: "Por que errar é inevitável",
        thumb: m1,
        videoUrl: "https://www.youtube.com/embed/Hd3WtQGhgsk",
        durationLabel: "18 min",
      },
      {
        title: "Como extrair aprendizado das falhas",
        thumb: m1,
        videoUrl: "https://www.youtube.com/embed/_X0mgOOSpLU",
        durationLabel: "22 min",
      },
    ],
    text: "Erros como ferramenta estratégica de aprendizado e evolução no empreendedorismo.",
    books: ["Mindset — Carol Dweck", "The Lean Startup — Eric Ries"],
    exercises: ["Liste 3 erros recentes", "Descreva os aprendizados", "Identifique padrões"],
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
    cover: m2,
    episodes: [
      {
        title: "Comunicação que não converte",
        thumb: m2,
        videoUrl: "https://www.youtube.com/embed/iIuVwjjnk2U",
        durationLabel: "16 min",
      },
      {
        title: "Campanhas mal direcionadas",
        thumb: m2,
        videoUrl: "https://www.youtube.com/embed/Lh_y8XSCqdo",
        durationLabel: "20 min",
      },
      {
        title: "Analisando erros com IA",
        thumb: m2,
        videoUrl: "https://www.youtube.com/embed/hYip_Vuv8J0",
        durationLabel: "14 min",
      },
    ],
    text: "Erros comuns em proposta de valor, posicionamento e comunicação com o cliente.",
    books: ["This is Marketing — Seth Godin", "Influence — Robert Cialdini"],
    exercises: ["Revisar proposta de valor", "Analisar uma campanha falha", "Refazer a comunicação"],
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
    cover: m3,
    episodes: [
      {
        title: "Falta de controle de caixa",
        thumb: m3,
        videoUrl: "https://www.youtube.com/embed/W8FOM8z8YKw",
        durationLabel: "19 min",
      },
      {
        title: "Precificação errada",
        thumb: m3,
        videoUrl: "https://www.youtube.com/embed/qEJ4hkpQW8E",
        durationLabel: "23 min",
      },
      {
        title: "IA aplicada às finanças",
        thumb: m3,
        videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao",
        durationLabel: "17 min",
      },
    ],
    text: "Problemas como precificação errada, falta de controle de caixa e custos invisíveis.",
    books: ["Profit First — Mike Michalowicz", "The Psychology of Money — Morgan Housel"],
    exercises: ["Revisar fluxo de caixa", "Analisar custos fixos", "Avaliar preços atuais"],
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
    cover: m4,
    episodes: [
      {
        title: "Decidir sem dados",
        thumb: m4,
        videoUrl: "https://www.youtube.com/embed/iG9CE55wbtY",
        durationLabel: "21 min",
      },
      {
        title: "Falta de planejamento",
        thumb: m4,
        videoUrl: "https://www.youtube.com/embed/CDxRRDxBmJ8",
        durationLabel: "18 min",
      },
      {
        title: "IA na análise de mercado",
        thumb: m4,
        videoUrl: "https://www.youtube.com/embed/5p248yoa3oE",
        durationLabel: "16 min",
      },
    ],
    text: "Erros por falta de análise, critérios de decisão e direção clara.",
    books: ["Good Strategy Bad Strategy — Richard Rumelt"],
    exercises: ["Listar decisões recentes", "Avaliar impacto", "Criar critérios de decisão"],
    checklist: ["Definir estratégia", "Analisar dados", "Revisar decisões", "Ajustar direção"],
  },
  {
    id: "m5",
    number: 5,
    title: "Gestão de Pessoas",
    description: "Liderança, comunicação e contratação consciente.",
    cover: m5,
    episodes: [
      {
        title: "Erros em contratação",
        thumb: m5,
        videoUrl: "https://www.youtube.com/embed/RyTQ5-SQYTo",
        durationLabel: "20 min",
      },
      {
        title: "Problemas de comunicação",
        thumb: m5,
        videoUrl: "https://www.youtube.com/embed/u9hauSrihYQ",
        durationLabel: "15 min",
      },
      {
        title: "Uso ético da IA",
        thumb: m5,
        videoUrl: "https://www.youtube.com/embed/aIVryISx_Bo",
        durationLabel: "17 min",
      },
    ],
    text: "Falhas em liderança, feedback e desenvolvimento de equipe.",
    books: ["Leaders Eat Last — Simon Sinek"],
    exercises: ["Avaliar sua comunicação", "Identificar falhas de feedback", "Melhorar reuniões 1:1"],
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
    cover: m6,
    episodes: [
      {
        title: "Como analisar erros com IA",
        thumb: m6,
        videoUrl: "https://www.youtube.com/embed/JTxsNm9IdYU",
        durationLabel: "19 min",
      },
      {
        title: "Criação de prompts",
        thumb: m6,
        videoUrl: "https://www.youtube.com/embed/jC4v5AS4RIM",
        durationLabel: "22 min",
      },
      {
        title: "Plano de melhoria",
        thumb: m6,
        videoUrl: "https://www.youtube.com/embed/5tSTk1083VY",
        durationLabel: "18 min",
      },
    ],
    text: "Como usar IA para diagnosticar problemas, gerar ideias e apoiar decisões.",
    books: ["Prediction Machines — Ajay Agrawal"],
    exercises: ["Criar prompts úteis", "Analisar um problema com IA", "Aplicar a solução"],
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
