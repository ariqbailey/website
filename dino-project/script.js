(function() {
  var questions = [{
    question: "What's your choice of diet?",
    choices: ["Herbivore", "Carnivore"],
  }, {
    question: "How big are you?",
    choices: ["0-5 meters", "6-14 meters", "15+ meters"],
  }, {
    question: "What do you wear?",
    choices: ["Body armor", "Feathers/fuzz", "Plates", "Just my birthday suit!"],
  }, {
    question: "What stance do you have?",
    choices: ["Biped", "Quadruped"],
  }, {
    question: "What type of teeth do you have?",
    choices: ["Phyllodont (leaf shaped)", "Ziphodont (blade shaped)", "Dental battery", "Other"],
  }, {
    question: "How do you deal with predators?",
    choices: ["Fight back", "Stand your ground", "Run", "I AM THE PREDATOR"]
  }];
  
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  
  var dinosaurs = [
    ['Stegosaurus', 1, 1, 2, 1, 0, 0],
    ['Ankylosaurus', 1, 1, 0, 1, 0, 1],
    ['Heterodontosaurus', 1, 0, 1, 0, 3, 2],
    ['Scelidosaurus', 1, 0, 1, 1, 3, 1],
    ['Nanosaurus', 1, 0, 0, 0, 3, 1],
    ['Parksosaurus', 1, 0, 3, 0, 3, 1],
    ['Iguanacolossus', 1, 1, 3, 1, 3, 1],
    ['Hadrosaurus', 1, 1, 3, 0, 2, 2],
    ['Edmontosaurus', 1, 1, 3, 1, 2, 1],
    ['Montanoceratops', 1, 0, 3, 1, 0, 0],
    ['Protoceratops', 1, 0, 3, 1, 0, 0],
    ['Triceratops', 1, 1, 3, 1, 2, 0],
    ['Alamosaurus', 1, 2, 0, 1, 3, 1],
    ['Brachiosaurus', 1, 2, 3, 1, 3, 1],
    ['Pterodactyl', 0, 1, 3, 0, 3, 3],
    ['Allosaurus', 0, 1, 3, 1, 1, 3],
    ['Brontosaurus', 1, 2, 3, 1, 3, 1],
    ['Tyrannosaurus', 0, 1, 3, 0, 1, 3],
    ['Baryonyx', 0, 1, 3, 0, 1, 3],
    ['Tsintaosaurus', 1, 1, 3, 1, 2, 2],
    ['Coelphysis', 0, 0, 1, 0, 1, 2],
    ['Parasaurolophus', 1, 1, 3, 1, 3, 1],
    ['Spinosaurus', 0, 2, 3, 0, 3, 3],
    ['Silvisaurus', 1, 0, 0, 1, 1, 1]
  ]
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $("<p>").append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'question'});
    
    var maxRight = -1;
    var dino = [];
    var correct_lst = [];
    // var dino = "";
    for (var i = 0; i < dinosaurs.length; i++) {
      var correct = 0;
      for (var j = 1; j < dinosaurs[i].length; j++) {
        if (dinosaurs[i][j] === selections[j-1]) {
          correct++;
        } 
      }
      
      correct_lst.push(correct);
      
      if (correct > maxRight) {
        maxRight = correct;
        // dino.push(dinosaurs[i][0]);
        // dino = dinosaurs[i][0];
      }
    }
    
    if (maxRight <= 3) {
      score.append("I'm stumped... Try again with some different choices.");
    } else {
      // var ret = _.sample(dino);
      var ret = [];
      for(var i = 0; i < correct_lst.length; i++) {
        if(correct_lst[i] == maxRight) {
          ret.push(dinosaurs[i][0]);
        }
      }
      score.append("Congratulations! It's a: " + ret[Math.floor(Math.random()*ret.length)]);
    }
    return score;
  }
})();