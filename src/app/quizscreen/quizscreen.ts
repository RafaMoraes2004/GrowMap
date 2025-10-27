import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  imagePath?: string;
}

@Component({
  selector: 'app-quizscreen',
  imports: [
    NgIf,  // Necessário para usar *ngIf
    NgFor  // Necessário para usar *ngFor
  ],
  templateUrl: './quizscreen.html',
  styleUrl: './quizscreen.css'
})
export class Quizscreen {

// Array com todas as perguntas do quiz
  questions: Question[] = [


    {
    text: 'Qual será a saída exata do código abaixo?',
    imagePath: '/assets/exer1.JPG',
    options: [
      
      'true, true, true, true',
      'true, true, false, false',
      'false, true, false, true',
      'true, true, false, true',
      'false, false, false, true',
    ],
    correctAnswer: 'true, true, false, true'
    },




    {
      text: 'Qual afirmação descreve corretamente a diferença entre JDK, JRE e JVM?',
      options: ['JDK é para executar, JRE é para compilar, JVM é para debugar.', 
                'JRE contém o JDK, que por sua vez contém a JVM.',
                'Para desenvolver aplicações Java, você precisa do JDK (que inclui o JRE e o compilador). Para apenas executar aplicações Java, você só precisa do JRE (que inclui a JVM).',
                'JVM é o kit de desenvolvimento, JRE é o compilador, JDK é a máquina virtual.',
                'JDK, JRE e JVM são nomes diferentes para o mesmo pacote de software.',
                
              ],
      correctAnswer: 'Para desenvolver aplicações Java, você precisa do JDK (que inclui o JRE e o compilador). Para apenas executar aplicações Java, você só precisa do JRE (que inclui a JVM).'
    },


    {
      text: 'Qual desses não é um tipo primitivo em Java?',
      options: ['int', 'String', 'boolean', 'char'],
      correctAnswer: 'String'
    },

    {
      text: 'Como você declara corretamente um array de inteiros ( int ) chamado idades para 10 valores e, em seguida, atribui o valor 50 ao último elemento?',
      options: ['int idades[10]; e idades[10] = 50; (Sintaxe C++ e erro de índice)',
                'int[] idades = new int[10]; e idades[10] = 50; (Erro de índice "Off-by-one")',
                'int[] idades = new int[10]; e idades[9] = 50;', 
                'ArrayList<int> idades = new ArrayList[10]; e idades.set(9, 50); (Sintaxe incorreta)',
                'int[] idades = new int[9]; e idades[9] = 50; (Tamanho errado e erro de índice)'
              
              ],
      correctAnswer: 'int[] idades = new int[10]; e idades[9] = 50;'
    },

     {
      text: 'Quais são considerados os quatro pilares fundamentais da Programação Orientada a Objetos?',
      options: ['JVM, JRE, JDK e Garbage Collector',
                'static, final, public e private',
                'Construtores, Métodos, Interfaces e Pacotes', 
                'Inversão de Controle (IoC), Injeção de Dependência (DI), SOLID e DRY',
                'Encapsulamento, Herança, Polimorfismo e Abstração'
              ],
      correctAnswer: 'Encapsulamento, Herança, Polimorfismo e Abstração'
    },

     {
      text: 'Qual é a diferença fundamental entre uma Classe Abstrata e uma Interface em Java (considerando Java 8+)?',
      options: ['Interfaces não podem ter métodos com implementação (corpo), apenas classes abstratas podem. (Falso desde Java 8)', 
                'Classes abstratas podem ter estado (variáveis de instância não-finais) e construtores; interfaces não podem ter estado de instância nem construtores.', 
                'Uma classe pode implementar múltiplas classes abstratas, mas apenas herdar uma interface.', 
                'Classes abstratas não podem ser instanciadas, mas interfaces podem. (Ambas não podem)',
                'Interfaces são usadas para Herança e classes abstratas para Polimorfismo. (Ambas são usadas para ambos)'
              ],

      correctAnswer: 'Classes abstratas podem ter estado (variáveis de instância não-finais) e construtores; interfaces não podem ter estado de instância nem construtores.(Invertido)'
    },

     {
      text: 'Dentro de um construtor, qual é a função das chamadas this() e super()?',
      options: ['this() chama um método privado da classe; super() chama um método estático da classe pai.',
                'this() refere-se à instância atual do objeto; super() refere-se à instância da classe pai. (Correto sobre as palavras-chave, mas incorreto sobre as chamadas de método this() e super()).', 
                'this() chama um construtor da classe pai; super() chama um construtor na mesma classe. (Invertido).', 
                'this() chama outro construtor sobrecarregado na mesma classe; super() chama um construtor da classe pai (superclasse).',
                'Ambos são usados para inicializar variáveis; this() para variáveis locais e super() para globais.'
              
              ],
      correctAnswer: 'this() chama outro construtor sobrecarregado na mesma classe; super() chama um construtor da classe pai (superclasse).'
    },

   {
      text: 'Considere o código abaixo. Qual será o resultado da execução e qual a situação da linha comentada?',
      imagePath: '/assets/exer8.JPG',

      options: ['Imprime "Au Au". A linha comentada não compilaria, pois o tipo da referência (Animal) não possui o método buscar().', 
                'Imprime "Animal genérico". A linha comentada não compilaria.', 
                'Imprime "Au Au". A linha comentada compilaria e imprimiria "Buscando a bola".', 
                'Lança uma ClassCastException na linha Animal meuAnimal = new Cachorro();.',
                'Imprime "Animal genérico". A linha comentada compilaria e imprimiria "Buscando a bola".'
              ],
      correctAnswer: 'Imprime "Au Au". A linha comentada não compilaria, pois o tipo da referência (Animal) não possui o método buscar().'
    },

    {
      text: 'Qual afirmação descreve corretamente a diferença entre Checked Exceptions e Unchecked Exceptions?',
      options: ['Checked são erros do programador (ex: NullPointerException); Unchecked são erros externos (ex: IOException). (Invertido)', 
                'Checked herdam de Error; Unchecked herdam de RuntimeException.', 
                'Checked só podem ser tratadas com try-catch; Unchecked só com throws. (Ambas podem usar os dois).', 
                'Não há diferença funcional, é apenas uma convenção de nomenclatura.',
                'O compilador obriga o tratamento (com try-catch ou throws) de Checked Exceptions. Unchecked Exceptions (subclasses de RuntimeException) não exigem tratamento obrigatório pelo compilador.'
              ],
      correctAnswer: 'O compilador obriga o tratamento (com try-catch ou throws) de Checked Exceptions. Unchecked Exceptions (subclasses de RuntimeException) não exigem tratamento obrigatório pelo compilador.'
    },

     {
      text: 'Qual alternativa melhor descreve o uso de List, Set e Map?',
      options: ['List: Coleção ordenada que permite elementos duplicados. Set: Coleção que não permite elementos duplicados. Map: Estrutura de pares chave-valor.', 
                'List: Não permite duplicados. Set: Permite duplicados e é ordenado. Map: É uma lista de chaves.', 
                'List: Lenta. Set: Rápida. Map: Muito rápida. (Depende da implementação e uso)', 
                'List: Armazena chave-valor. Set: Armazena só valores. Map: Armazena só chaves.',
                'List e Set são interfaces, Map é uma classe concreta. (Map também é uma interface)'
              ],
      correctAnswer: 'List: Coleção ordenada que permite elementos duplicados. Set: Coleção que não permite elementos duplicados. Map: Estrutura de pares chave-valor.'
    },


  ];






  // Variáveis de estado do jogo
  currentQuestionIndex: number = 0;
  lives: number = 5; // Começa com 5 corações
  isGameOver: boolean = false;
  isGameWon: boolean = false;

  // Método chamado quando o usuário clica em uma resposta
  selectAnswer(selectedOption: string) {
    if (this.isGameOver || this.isGameWon) {
      return; // Não faz nada se o jogo já acabou
    }

    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Verifica se a resposta está errada
    if (selectedOption !== currentQuestion.correctAnswer) {
      this.lives--; // Perde um coração
    }

    // Verifica se o jogo acabou (perdeu todas as vidas)
    if (this.lives <= 0) {
      this.isGameOver = true;
      // A tela "INVASION!" será mostrada
    } else {
      // Se ainda tem vidas, passa para a próxima pergunta
      this.goToNextQuestion();
    }
  }

  // Avança para a próxima pergunta ou termina o quiz (se for a última)
  goToNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // O usuário respondeu tudo e ainda tem vidas!
      this.isGameWon = true;
      // Você pode mostrar uma tela de vitória aqui
    }
  }

  // Usado pelo botão "TRY AGAIN" da tela de game over
  resetQuiz() {
    this.lives = 5;
    this.currentQuestionIndex = 0;
    this.isGameOver = false;
    this.isGameWon = false;
  }
}
