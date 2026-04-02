import { WHATSAPP_CONTATO_EXIBICAO } from "../lib/whatsapp";

export const REGULAMENTO_COMPETE_ART = {
  TITULO: "Compete Art FESTIVAL DE DANÇA",
  SUBTITULO: "REGULAMENTO OFICIAL",
  DATA_E_HORA: "9 de maio, Das 09h às 21h",
  LOCAL: {
    NOME: "Teatro Mun. José de Castro Mendes",
    ENDERECO: "Rua Conselheiro Gomide, 62 Vila Industrial - Campinas - SP",
  },
  OBJETIVO: {
    PROPOSITO:
      "Valorizar a arte e a cultura, promover a troca de experiências entre escolas, companhias e bailarinos, além de incentivar a formação artística em diferentes estilos e níveis.",
    PRINCIPAIS_OBJETIVOS: [
      "Incentivar bailarinos de todas as idades e níveis a desenvolverem técnica, presença cênica e criatividade.",
      "Estimular a produção artística autoral, reconhecendo novas propostas coreográficas sem deixar de valorizar os clássicos da dança.",
      "Reunir escolas, grupos e companhias em um intercâmbio que fortalece laços, amplia visões e gera oportunidades.",
      "Reconhecer talentos individuais e coletivos, premiando não apenas a excelência técnica, mas também a expressividade, a emoção e a originalidade.",
      "Oferecer experiências pedagógicas e de crescimento, permitindo que cada participante leve aprendizados e inspirações que ultrapassem o palco.",
    ],
    CUMPRIMENTO_REGRAS:
      "Todas as regras estabelecidas neste regulamento devem ser respeitadas por participantes, diretores, professores e público, garantindo que o Compete’Art seja um espaço de respeito, profissionalismo e celebração da dança.",
  },
  HORARIOS: {
    ESTRUTURA: "O festival será realizado em dois blocos competitivos.",
    BLOCO_MANHA: {
      COMPETICAO: "Sem atraso, das 9h00 às 14h00",
      PREMIACAO: "das 14h00 às 14h30",
    },
    BLOCO_TARDE: {
      COMPETICAO: "das 15h00 às 20h00",
      PREMIACAO: "das 20h00 às 21h00",
    },
  },
  MODALIDADES: [
    "Ballet Clássico",
    "Ballet Neoclássico",
    "Jazz",
    "Contemporâneo",
    "Danças Urbanas",
    "Sapateado",
    "Estilo Livre",
  ],
  CATEGORIAS_ETARIAS: {
    Baby: "3 a 5 anos",
    Infantil_I: "6 a 8 anos",
    Infantil_II: "9 a 11 anos",
    Juvenil_I: "12 a 14 anos",
    Juvenil_II: "15 a 17 anos",
    Adulto: "18 a 25 anos",
    Adulto_Iniciante: "a partir de 18 anos",
    Sênior: "26 a 39 anos",
    Master: "40 anos ou mais",
  },
  FORMACOES: {
    Solo: "Solo",
    Duo_Pas_de_Deux: "Categoria referente a idade do bailarino mais velho",
    Trio: "Categoria referente a idade do bailarino mais velho",
    Grupo: "4 ou mais bailarinos - Categoria referente a média das idades dos bailarinos",
  },
  DURACAO_COREOGRAFIA: {
    Solo_Duo_Trio: "até 4 minutos (tolerância de 15 segundos)",
    Grupo: "até 7 minutos (tolerância de 30 segundos)",
    Classico_Repertorio: "deve respeitar o tempo original da obra",
  },
  MUSICA: {
    FORMATO_E_ENVIO:
      "Enviar obrigatoriamente em formato MP3 até o dia 24 de abril no e-mail competeartfestival@gmail.com.",
    RECOMENDACAO: "Recomenda-se levar uma cópia em pen drive.",
    MULTA:
      "Caso a escola não envie a música dentro do prazo estabelecido, será aplicada uma multa de R$ 70,00 por coreografia.",
  },
  CENARIO: {
    PERMITIDO:
      "Permitidos desde que não comprometam a segurança e o tempo de troca entre apresentações.",
    PROIBIDO:
      "Proibido o uso de fogo, água ou outros líquidos, talco, areia, confete, animais e similares.",
    RESPONSABILIDADE:
      "A escola é responsável por eventuais danos causados ao palco ou equipamentos.",
    MEDIDAS_DO_PALCO: "12x9m",
  },
  AVALIACAO: {
    CRITERIOS: ["Técnica", "Expressão cênica e presença", "Criatividade / composição coreográfica", "Musicalidade"],
    JURI: {
      COMPOSICAO:
        "Composto por profissionais convidados, especialistas em diferentes áreas da dança.",
      NOTAS: "Cada jurado dará notas de 0 a 10, e a média final será a nota da coreografia.",
      DECISAO: "A decisão da banca é soberana e inquestionável.",
      FEEDBACK:
        "As escolas receberão notas e comentários construtivos após o término do evento.",
    },
  },
  PREMIACOES: {
    COLOCACOES:
      "Troféus e medalhas para 1º, 2º e 3º lugares em cada categoria e modalidade.",
    PREMIOS_ESPECIAIS: [
      "Melhor Escola",
      "Melhor Coreógrafo(a)",
      "Melhor Coreografia",
      "Melhor Bailarino e Melhor Bailarina",
      "Bailarino(a) Revelação",
      "Prêmio Estímulo",
    ],
    BOLSAS_E_OPORTUNIDADES:
      "A organização poderá anunciar, até a data do evento, bolsas de estudo, cursos, convites e parcerias nacionais ou internacionais, sendo essas oportunidades divulgadas oficialmente durante a cerimônia de premiação no dia do evento.",
  },
  SISTEMA_DE_PONTUACAO: {
    PONTUACAO_MINIMA: "A pontuação mínima para classificação é 7,0.",
    FAIXAS_DE_PREMIACAO: {
      "3_LUGAR": "7,0 a 7,9",
      "2_LUGAR": "8,0 a 8,9",
      "1_LUGAR": "9,0 a 10,0",
    },
    DISTRIBUICAO_COLOCACOES: {
      REGRA:
        "As colocações (1º, 2º e 3º lugar) serão atribuídas exclusivamente às coreografias com as maiores notas da categoria, respeitando a ordem decrescente de pontuação, independentemente de outras coreografias terem atingido a nota mínima.",
      EXEMPLO:
        "Em uma categoria com as notas 9,9/9,3/9,0/8,5/7,8, somente as três maiores notas serão premiadas, sendo: 1º lugar: 9,9; 2º lugar: 9,3; 3º lugar: 9,0. As coreografias com notas 8,5 e 7,8, embora classificadas, não receberão colocação.",
      EMPATES:
        "Haverá empate apenas quando as notas finais forem exatamente iguais, podendo ocorrer mais de uma coreografia na mesma colocação.",
      NAO_CONCESSAO:
        "A banca julgadora e a organização se reservam o direito de não conceder todas as colocações, caso as notas não atinjam o nível técnico esperado para premiação.",
    },
  },
  INSCRICOES: {
    COMO_INSCREVER:
      "As inscrições serão realizadas exclusivamente via site oficial do festival, sendo efetuadas pela escola participante.",
    FLUXO: [
      "Cada escola deverá realizar uma única inscrição institucional, vinculada a um único pagamento, que contemplará todas as coreografias inscritas por ela.",
      "Após a inscrição da escola, cada coreografia deverá ser cadastrada individualmente, em ficha própria, com todas as informações exigidas (modalidade, categoria, tempo de duração, participantes, etc.).",
    ],
    VALIDACAO:
      "A inscrição somente será considerada válida após a confirmação do pagamento, mediante envio do comprovante dentro do prazo estabelecido pela organização.",
    INVALIDACAO:
      "Inscrições sem o devido pagamento ou com informações incompletas não serão validadas.",
  },
  VALORES_E_PRAZOS: {
    VALORES_DE_INSCRICAO: {
      LOTES: [
        {
          LOTE: "1º lote",
          Solo_Variacao: "R$ 160",
          Pas_de_Deux_Duo: "R$ 220",
          Trio: "R$ 320",
          Grupo_por_bailarino: "R$ 80",
        },
        {
          LOTE: "2º lote",
          Solo_Variacao: "R$ 190",
          Pas_de_Deux_Duo: "R$ 240",
          Trio: "R$ 340",
          Grupo_por_bailarino: "R$ 100",
        },
        {
          LOTE: "3º lote",
          Solo_Variacao: "R$ 210",
          Pas_de_Deux_Duo: "R$ 260",
          Trio: "R$ 360",
          Grupo_por_bailarino: "R$ 120",
        },
      ],
    },
    CRONOGRAMA_LOTES: {
      "1_Lote": "de 18 de fevereiro a 10 de abril",
      "2_Lote": "de 11 de abril a 30 de abril",
      "3_Lote": "de 01 de maio a 20 de maio",
    },
    FECHAMENTO_ANTECIPADO:
      "A organização se reserva o direito de encerrar as inscrições antes do prazo final, caso seja atingido o limite máximo de vagas.",
  },
  CRONOGRAMA_E_HORARIOS: {
    DIVULGACAO:
      "O cronograma oficial do festival será divulgado e enviado às escolas participantes com antecedência mínima de 7 (sete) dias em relação à data do evento.",
    CUMPRIMENTO:
      "Os horários estabelecidos deverão ser rigorosamente cumpridos. Haverá tolerância zero para atrasos, não sendo permitidas alterações na ordem do cronograma, independentemente do motivo apresentado.",
    RESPONSABILIDADE:
      "A responsabilidade pelo cumprimento dos horários é exclusiva da escola participante, incluindo chegada, credenciamento, aquecimento e permanência em coxia.",
  },
  PAGAMENTO: {
    FORMA:
      "O pagamento das inscrições deverá ser realizado em conjunto por escola, não sendo permitidos pagamentos individuais por coreografia ou participante.",
    COMPROVANTE_ENVIO:
      `O comprovante de pagamento deverá ser enviado no momento da inscrição, via WhatsApp ${WHATSAPP_CONTATO_EXIBICAO}.`,
    FORMAS_ACEITAS: "PIX ou transferência bancária, conforme os dados fornecidos pela organização.",
    DADOS_PIX: "competeartfestival@gmail.com - Sarah Duarte Camargo Santos",
    DADOS_TRANSFERENCIA: {
      BANCO: "461 - Asaas I.P S.A",
      AGENCIA: "0001",
      CONTA: "6570194-8",
      NOME_COMPLETO: "Sarah Duarte Camargo Santos",
    },
    NAO_DEVOLUCAO:
      "No caso de desistência/não comparecimento ao evento, não haverá devolução dos valores pagos sob nenhuma hipótese ou justificativa.",
    SEM_DESCONTO:
      "Não é fornecido nenhum tipo de desconto para bailarinos (as) que participam de mais de uma coreografia.",
  },
  EQUIPE_TECNICA: {
    PROFISSIONAIS_GRATUITOS: "Cada escola tem direito a 2 profissionais gratuitos.",
    CUSTO_ADICIONAL: "A partir do 3º profissional: R$ 70 por pessoa.",
  },
  INGRESSOS: {
    ACESSO_INGRESSO_ANTECIPADO:
      "Quem adquiriu ingresso antecipado pelo site deverá apresentar QR Code e documento de identificação na entrada.",
    ANTECIPADO: "R$ 50,00 (site)",
    BILHETERIA: "R$ 70,00 (no dia do evento)",
    MEIA_ENTRADA:
      "Disponível somente na bilheteria, conforme a legislação vigente, mediante apresentação de documento comprobatório.",
    ACESSOS_BAILARINOS: "Bailarinos inscritos tem acesso a plateia.",
  },
  ORGANIZACAO: {
    DIVISAO_BLOCOS:
      "O Compete'Art Festival de Dança será dividido em dois blocos de apresentações, organizados conforme as categorias etárias e modalidades. As premiações acontecerão ao final de cada bloco.",
    PRIMEIRO_BLOCO:
      "Baby, Infantil I, Infantil II, Juvenil I e categorias mistas (manhã/tarde).",
    SEGUNDO_BLOCO:
      "Juvenil II, Adulto, Adulto Iniciante, Sênior, Master e categorias mistas (tarde/noite).",
    CRONOGRAMA_ATUALIZACAO:
      "O cronograma, que será atualizado em tempo real, será divulgado pelas redes sociais do festival e em QR Codes disponibilizados no teatro.",
  },
  CREDENCIAMENTO: {
    PROCESSO:
      "No acesso ao festival, as escolas serão recepcionadas pela equipe de produção, momento em que será realizado o credenciamento oficial.",
    EQUIPE_TECNICA:
      "Os profissionais da equipe técnica previamente cadastrados receberão suas identificações individuais.",
    BAILARINOS:
      "Os bailarinos terão a entrada liberada mediante check-in obrigatório, com apresentação de documento de identificação, e receberão um carimbo no punho, válido para circulação durante todo o período do evento.",
    CHEGADA:
      "Recomenda-se que todos cheguem com antecedência mínima de 2 (duas) horas em relação ao horário previsto para a primeira apresentação.",
    ATRASOS:
      "Atrasos não serão tolerados, e não haverá alterações na ordem do cronograma em hipótese alguma, mesmo em casos de imprevistos.",
  },
  ACESSO_AO_TEATRO: {
    DIRETORES_COREOGRAFOS: "com identificação.",
    BAILARINOS: "acesso com carimbo no credenciamento.",
    EQUIPE_TECNICA_ADICIONAL: "acesso mediante taxa.",
    PUBLICO: "acesso restrito à plateia, proibida entrada em palco e camarins.",
  },
  EXPO_ART: {
    O_QUE_E:
      "Espaço localizado no hall do teatro, onde parceiros e expositores apresentarão e comercializarão produtos, serviços e artigos ligados à dança e à arte em geral.",
    OBJETIVO:
      "Oferecer uma experiência complementar ao evento, unindo cultura, networking e oportunidades comerciais em um mesmo ambiente.",
    CONTATO:
      "Interessados em participar da Expo'Art podem enviar um e-mail para competeartfestival@gmail.com.",
  },
  CAMARINS_E_COXIAS: {
    USO_CAMARINS:
      "Não haverá demarcação prévia de camarins, sendo os espaços de uso coletivo.",
    RESPONSABILIDADE_BENS:
      "A organização não se responsabiliza por objetos pessoais, figurinos, acessórios ou quaisquer pertences deixados nas dependências do festival, não realizando serviço de guarda ou achados e perdidos. Recomenda-se que cada escola se responsabilize integralmente pelos seus bens.",
    PERMANENCIA_COXIA:
      "Será permitida a permanência na coxia apenas dos integrantes das 5 (cinco) coreografias subsequentes à que estiver em apresentação, bem como até 3 (três) assistentes por conjunto.",
  },
  INFORMACOES_GERAIS: {
    ALTERACOES: {
      PRAZO: "Músicas, elenco ou títulos só poderão ser alterados até a data limite.",
      FORA_DO_PRAZO:
        "Solicitações feitas fora do prazo poderão não ser aceitas, sem direito à devolução do valor da inscrição. Caso a organização autorize a alteração após o prazo, será aplicada uma taxa de R$ 70,00 (setenta reais) por alteração realizada.",
    },
    CUSTOS: "Transporte, hospedagem e alimentação são de responsabilidade dos participantes.",
    USO_DE_IMAGEM:
      "Ao participar, os inscritos autorizam o uso de fotos e vídeos para fins de divulgação do festival.",
    REGISTRO_DE_IMAGEM_DO_EVENTO:
      "É terminantemente proibido fotografar ou filmar o festival com o uso de equipamentos semiprofissionais ou profissionais. A cobertura oficial será realizada pelo Ballet em Foco Studio Fotográfico, com fotos e vídeos comercializados durante o festival.",
    ACEITE_DO_REGULAMENTO_INSCRICAO:
      "A inscrição implica total concordância com as normas aqui estabelecidas.",
    ELEMENTOS_CENICOS_PROIBIDOS: [
      "É expressamente proibido o uso de água, fogo, líquidos, pós, tintas, glitter, areia ou qualquer elemento que possa molhar, sujar, danificar ou comprometer a segurança do palco e da equipe técnica.",
      "O descumprimento desta norma implicará na desclassificação imediata da escola e/ou da coreografia, sem direito à devolução do valor da inscrição.",
    ],
    CATEGORIAS_INCOMPATIVEIS:
      "A inscrição de bailarinos em categorias incompatíveis com sua faixa etária, conforme estabelecido no regulamento do festival, resultará em desclassificação, independentemente de erro intencional ou não.",
    CONDUTA_E_ETICA: {
      REGRA:
        "Todos os participantes, diretores, professores, coreógrafos, bailarinos, acompanhantes e responsáveis deverão manter conduta ética, respeitosa e profissional durante todo o período do festival. É obrigatório o respeito à banca julgadora, à equipe de produção, aos profissionais técnicos e às demais escolas participantes.",
      PENALIDADES:
        "Atitudes consideradas antidesportivas, ofensivas, desrespeitosas ou que comprometam o bom andamento do evento poderão resultar em advertência, penalização de pontuação ou desclassificação, a critério exclusivo da organização e da banca julgadora. A organização se reserva o direito de retirar do evento qualquer participante que apresente comportamento inadequado.",
    },
    CASOS_OMISSOS:
      "Os casos omissos neste regulamento, bem como situações não previstas ou dúvidas de interpretação, serão analisados e resolvidos exclusivamente pela organização do festival. As decisões da organização e da banca julgadora são finais, soberanas e irrecorríveis, não cabendo qualquer tipo de recurso ou contestação posterior.",
    ACEITE_DO_REGULAMENTO_FINAL:
      "Ao realizar a inscrição no festival, a escola participante declara ter lido, compreendido e estar de pleno acordo com todos os itens deste regulamento, comprometendo-se a cumprir integralmente as normas, prazos e orientações estabelecidas pela organização. O aceite do regulamento é automático e irrevogável, não sendo aceita alegação de desconhecimento de quaisquer cláusulas após a efetivação da inscrição.",
  },
  RESPONSABILIDADE_MEDICA: {
    NAO_RESPONSABILIDADE:
      "A organização do festival não se responsabiliza por acidentes, lesões, mal-estares ou quaisquer ocorrências de natureza médica envolvendo os participantes antes, durante ou após as apresentações.",
    RESPONSABILIDADE_ESCOLA:
      "É de responsabilidade exclusiva de cada escola o acompanhamento e a autorização de seus alunos.",
    ESTRUTURA_APOIO:
      "O evento contará com apoio de bombeiros e estrutura básica de enfermaria para atendimentos emergenciais, não substituindo, em hipótese alguma, acompanhamento médico especializado ou seguro individual dos participantes.",
    DECLARACAO_APTIDAO:
      "Ao efetivar a inscrição, a escola declara que todos os seus bailarinos estão aptos física e clinicamente para participar do evento.",
  },
  CONTATOS: {
    SITE: "competeartfestival.com.br",
    INSTAGRAM: "@competeartfestival",
    EMAIL: "competeartfestival@gmail.com",
    WHATSAPP: WHATSAPP_CONTATO_EXIBICAO,
    TIKTOK: "@competeartfestival",
  },
} as const;
