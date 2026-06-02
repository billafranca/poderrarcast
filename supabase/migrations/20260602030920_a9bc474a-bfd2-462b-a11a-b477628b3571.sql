
-- quiz_questions
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  position int NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, position)
);

GRANT SELECT ON public.quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are publicly readable"
  ON public.quiz_questions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_questions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- quiz_attempts
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id text NOT NULL,
  score int NOT NULL,
  total int NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user_module ON public.quiz_attempts (user_id, module_id, created_at DESC);

GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed: 3 questions per module
INSERT INTO public.quiz_questions (module_id, position, question, options, correct_index, explanation) VALUES
-- M1 Mentalidade do erro
('m1', 1, 'Qual a melhor postura diante de um erro no seu negócio?',
 '["Esconder e seguir em frente","Registrar, analisar a causa e extrair aprendizado","Culpar a equipe para preservar a autoridade"]'::jsonb, 1,
 'Erros viram ativos quando são documentados e analisados. Esconder ou culpar bloqueia o aprendizado.'),
('m1', 2, 'O que caracteriza um "mindset de crescimento" segundo Carol Dweck?',
 '["Acreditar que talento é fixo de nascença","Acreditar que habilidades se desenvolvem com esforço e prática","Evitar desafios para não falhar"]'::jsonb, 1,
 'Mindset de crescimento parte do princípio que habilidades evoluem com prática deliberada.'),
('m1', 3, 'Qual hábito mais acelera aprendizado a partir de falhas?',
 '["Refletir e registrar decisões importantes regularmente","Ler livros de autoajuda no fim de semana","Reagir rapidamente sem analisar"]'::jsonb, 0,
 'Registrar decisões cria um histórico para comparar hipóteses com resultados reais.'),

-- M2 Marketing e Vendas
('m2', 1, 'Qual é o primeiro sinal de que sua comunicação não está convertendo?',
 '["O cliente pede desconto antes de entender o valor","Você recebe muitos elogios estéticos","O site carrega rápido"]'::jsonb, 0,
 'Quando o cliente foca em preço, geralmente é porque ele não enxergou o valor entregue.'),
('m2', 2, 'O que é uma proposta de valor clara?',
 '["Uma lista de funcionalidades do produto","Uma frase que mostra para quem é, o problema resolvido e o ganho","O slogan da marca"]'::jsonb, 1,
 'Proposta de valor responde: pra quem, qual problema, qual o ganho concreto.'),
('m2', 3, 'Antes de escalar uma campanha, você deve:',
 '["Testar variações com orçamento pequeno e medir resultado","Investir tudo no canal mais barato","Copiar o concorrente"]'::jsonb, 0,
 'Validar com pequenos testes reduz risco e identifica o que realmente performa.'),

-- M3 Financeiro
('m3', 1, 'Qual erro financeiro mais quebra pequenos negócios?',
 '["Não separar pessoa física de pessoa jurídica e perder controle de caixa","Cobrar caro demais","Reinvestir o lucro"]'::jsonb, 0,
 'Misturar contas mata a visibilidade do caixa e gera decisões cegas.'),
('m3', 2, 'Uma boa precificação deve cobrir:',
 '["Apenas o custo do produto","Custo direto, custos fixos rateados, impostos e margem","Só o preço do concorrente"]'::jsonb, 1,
 'Preço saudável precisa cobrir todos os custos e ainda gerar margem para reinvestir.'),
('m3', 3, 'O que é "custo invisível"?',
 '["Custo que você paga mas não contabiliza (taxas, retrabalho, tempo)","Custo do contador","Custo de marketing"]'::jsonb, 0,
 'Custos invisíveis corroem a margem sem aparecer no DRE — precisam ser mapeados.'),

-- M4 Estratégia
('m4', 1, 'Qual é a base de uma boa estratégia?',
 '["Fazer mais do que o concorrente","Diagnóstico honesto + política orientadora + ações coerentes","Ter mais funcionários"]'::jsonb, 1,
 'Rumelt define boa estratégia como diagnóstico, política e ações alinhadas.'),
('m4', 2, 'Decidir sem dados normalmente leva a:',
 '["Vantagem por intuição superior","Vieses, desperdício de recursos e decisões repetidas","Inovação acelerada"]'::jsonb, 1,
 'Sem dados você decide com vieses e tende a repetir os mesmos erros.'),
('m4', 3, 'O que um critério de decisão escrito te dá?',
 '["Uma maneira objetiva de comparar opções e revisar depois","Mais burocracia","Garantia de acerto"]'::jsonb, 0,
 'Critérios escritos tornam decisões revisáveis e aprendizado possível.'),

-- M5 Gestão de pessoas
('m5', 1, 'O maior erro em contratação geralmente é:',
 '["Contratar pela urgência sem clareza do papel e fit","Pagar pouco","Demorar demais"]'::jsonb, 0,
 'Contratar com pressa, sem clareza de função, gera retrabalho e turnover.'),
('m5', 2, 'Feedback eficaz é:',
 '["Específico, frequente, com foco em comportamento observável","Anual, formal e genérico","Só quando há problema grave"]'::jsonb, 0,
 'Feedback ganha força quando é específico, próximo do fato e focado em ação.'),
('m5', 3, 'O que uma 1:1 bem feita deve incluir?',
 '["Métricas do líder","Escuta ativa, prioridades, bloqueios e desenvolvimento da pessoa","Apenas cobrança de metas"]'::jsonb, 1,
 '1:1 é espaço da pessoa: escutar, destravar e desenvolver — não cobrar metas.'),

-- M6 IA aplicada
('m6', 1, 'Um bom prompt para diagnóstico de negócio deve:',
 '["Pedir apenas a resposta certa","Trazer contexto, papel, objetivo e formato de saída","Ser bem curto"]'::jsonb, 1,
 'Contexto + papel + objetivo + formato é a estrutura de prompts produtivos.'),
('m6', 2, 'Quando usar IA para apoiar decisões?',
 '["Para validar hipóteses, gerar opções e revisar pontos cegos","Para terceirizar 100% a decisão","Apenas para escrever textos"]'::jsonb, 0,
 'IA é melhor como copiloto: amplia opções e aponta riscos, mas a decisão é sua.'),
('m6', 3, 'O risco principal de usar IA sem critério é:',
 '["Aumentar o custo da máquina","Aceitar respostas plausíveis mas erradas (alucinações)","Reduzir produtividade"]'::jsonb, 1,
 'Sem critério você confia em respostas verossímeis mas incorretas.');
