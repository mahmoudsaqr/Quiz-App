let ClassBulletsSpans = document.querySelector(".bullets .spans");
let ClassQuizInfoCount = document.querySelector(".quiz-info .count span");
let ClassQuizArea = document.querySelector(".quiz-area");
let ClassQuizAreaH2 = document.querySelector(".quiz-area h2");
let ClassAnswersArea = document.querySelector(".answers-area");
let submitbtn = document.querySelector(".btn .submit");
let Final_Results = document.querySelector(".results");
let Reset = document.querySelector(".Reset");
let bullet_clicked = window.localStorage.getItem("bullet-clicked") || 0;
let x = 0;
let y = 0;
// تحديد مدة التايمر (5 دقائق = 300 ثانية)
let timerDuration = 300; // عدد الثواني

let get_data = function () {
  fetch("../json/Questions.json")
    .then((result) => {
      result = result.json();
      return result;
    })
    .then((result) => {
      createBullets(result.length, result);
      createQuestions(bullet_clicked, result);
      QuestionsCount(result.length);
      SubmitbtnClicked(bullet_clicked, result);
      return result;
    });
};

let createBullets = function (MyLength, result) {
  //making array to add spans on it
  let MySpan = [];
  for (let i = 1; i <= MyLength; i++) {
    //push spans to the array
    MySpan.push(document.createElement("span"));
    //append the array on ClassBulletsSpans
    ClassBulletsSpans.appendChild(MySpan[i - 1]);
    MySpan[i - 1].innerHTML = `${i}`;
    //to add on class on span and go to the page of this span
    MySpan[i - 1].onclick = function () {
      MySpan.forEach(function (span) {
        span.classList.remove("on");
      });
      MySpan[i - 1].classList.add("on");
      window.localStorage.setItem("bullet-clicked", i - 1);
      ClassQuizArea.removeChild(ClassQuizArea.firstElementChild);
      GoToPage(i - 1, result);
      // if we clicked on submit button while we are in the page of the span it handles it
      SubmitbtnClicked(i - 1, result);
    };
  }
  //add class on in the bullet clicked by default
  MySpan[bullet_clicked].classList.add("on");
};

let GoToPage = function (pageNumber, questionsArray) {
  createQuestions(pageNumber, questionsArray);
};

let createQuestions = function (pageNumber, questionsArray) {
  let myH2 = document.createElement("h2");
  // delete the content in h2 and answer area to avoid repetition

  myH2.innerHTML = ``;
  ClassAnswersArea.innerHTML = ``;
  //if the text includes < and > replace it with &lt; and &gt;
  if (
    questionsArray[`${pageNumber}`]["title"].includes("<") &&
    questionsArray[`${pageNumber}`]["title"].includes(">")
  ) {
    let x = questionsArray[`${pageNumber}`]["title"];
    //function to replace < and > with &lt; and &gt;
    myH2.innerHTML = `${replace_lt_gt(x)}`;
  } else {
    myH2.innerHTML = `${questionsArray[`${pageNumber}`]["title"]}`;
  }

  //to take the answers related to the question in h2 and show them in the window
  for (let i = 1; i <= 4; i++) {
    //if the text includes < and > replace it with &lt; and &gt;
    if (
      questionsArray[`${pageNumber}`][`answer_${i}`].includes("<") &&
      questionsArray[`${pageNumber}`][`answer_${i}`].includes(">")
    ) {
      let y = questionsArray[`${pageNumber}`][`answer_${i}`];
      // set + to add the old innerHTML to the new innerHTML so it shows them next to each other
      ClassAnswersArea.innerHTML += `<div class="answer">
          <input type="radio" name="questions" id="answer_${i}" value="${i}" onclick="saveSelection(${pageNumber}, ${i})" />
          <label for="answer_${i}">${replace_lt_gt(y)}</label>
        </div>`;
    } else {
      ClassAnswersArea.innerHTML += `<div class="answer">
          <input type="radio" name="questions" id="answer_${i}" value="${i}" onclick="saveSelection(${pageNumber}, ${i})" />
          <label for="answer_${i}">${
        questionsArray[`${pageNumber}`][`answer_${i}`]
      }</label>
        </div>`;
    }
  }

  //add h2 to ClassQuizArea
  ClassQuizArea.appendChild(myH2);

  let ClassAnswersAreaAnswer_Input = document.querySelectorAll(
    ".answers-area .answer input"
  );
  //to save the answer content and index in local storage
  ClassAnswersAreaAnswer_Input.forEach((input) => {
    input.onclick = function () {
      window.localStorage.setItem(
        `answer in bullet ${pageNumber + 1}`,
        input.nextElementSibling.textContent
      );
      window.localStorage.setItem(
        `answer_index in bullet ${pageNumber + 1}`,
        parseInt(input.getAttribute("value"))
      );
    };
  });
};

//function to replace < and > with &lt; and &gt;
let replace_lt_gt = function (x) {
  let NewString = x.replaceAll("<", "&lt;");
  let lastString = NewString.replaceAll(">", "&gt;");
  return lastString;
};

//function to set the QuestionsCount in the window
let QuestionsCount = function (MyLenth) {
  ClassQuizInfoCount.innerHTML = `${MyLenth}`;
  return MyLenth;
};

//Submit Button
let SubmitbtnClicked = function (pageNumber, questionsArray) {
  submitbtn.onclick = function () {
    saveSelection(
      pageNumber,
      window.localStorage.getItem(`answer_index in bullet ${pageNumber + 1}`)
    );
    //to handle the error when we reach the last question then stop
    if (pageNumber <= questionsArray.length - 1) {
      checkAnswer(pageNumber, questionsArray);
      putTheResult(pageNumber, questionsArray);
      //to go to the next page
      pageNumber++;
      if (pageNumber <= questionsArray.length - 1) {
        //to remove h2
        ClassQuizArea.removeChild(ClassQuizArea.firstElementChild);
        GoToPage(pageNumber, questionsArray);
        //loop to the bullets with two differnt solutions
        // Array.from(ClassBulletsSpans.children).forEach((span)=>{
        //   span.classList.remove("on");
        // })
        for (let span of ClassBulletsSpans.children) {
          span.classList.remove("on");
        }
        ClassBulletsSpans.children[pageNumber].classList.add("on");
        window.localStorage.setItem("bullet-clicked", pageNumber);
      }
    }
    loadSelection(pageNumber);
  };
  loadSelection(pageNumber);
};

let checkAnswer = function (pageNumber, questionsArray) {
  let answerSelected = window.localStorage.getItem(
    `answer in bullet ${pageNumber + 1}`
  );
  // to calculate the right answers and the wrong answer
  if (answerSelected === questionsArray[`${pageNumber}`][`right_answer`]) {
    window.localStorage.setItem(`right answer in page ${pageNumber + 1}`, ++x);
    //we make that to avoid setting null in countWrong
    window.localStorage.setItem(`wrong answer in page ${pageNumber + 1}`, y);
  } else {
    //we make that to avoid setting null in countRight in putTheResult Function
    window.localStorage.setItem(`right answer in page ${pageNumber + 1}`, x);
    window.localStorage.setItem(`wrong answer in page ${pageNumber + 1}`, ++y);
  }
};

// دالة لحفظ قيمة الـ Radio المختارة في localStorage
function saveSelection(pageNumber, answerIndex) {
  window.localStorage.setItem(
    `selectedAnswer in bullet ${pageNumber + 1}`,
    answerIndex
  );
}
// دالة لتفعيل الـ Radio المحفوظة عند تحميل الصفحة
function loadSelection(pageNumber) {
  const savedAnswerIndex = window.localStorage.getItem(
    `selectedAnswer in bullet ${pageNumber + 1}`
  );
  if (savedAnswerIndex !== null) {
    const radioToActivate = document.querySelector(
      `#answer_${savedAnswerIndex}`
    );
    if (radioToActivate) {
      radioToActivate.checked = true; // تفعيل الإجابة المحفوظة
    }
  }
}
let putTheResult = function (pageNumber, questionsArray) {
  let countRight = window.localStorage.getItem(
    `right answer in page ${pageNumber + 1}`
  );
  // when we reach the last bullet it shows the result
  if (pageNumber === questionsArray.length - 1) {
    if (countRight > 7) {
      console.log(countRight + ">7");
      Final_Results.innerHTML = `<span class="perfect">Perfect</span> : You Get ${countRight} From ${questionsArray.length}`;
    } else if (countRight > 4) {
      console.log(countRight + ">4");
      Final_Results.innerHTML = `<span class="good">Good</span> : You Get ${countRight} From ${questionsArray.length}`;
    } else {
      console.log(countRight + " اقل من 4");
      Final_Results.innerHTML = `<span class="bad">Bad</span> : You Get ${countRight} From ${questionsArray.length}`;
      if (countRight === null) {
        Final_Results.innerHTML = `<span class="bad">Bad</span> : You Get 0 From ${questionsArray.length}`;
      }
    }
  }
};
Reset.onclick = function () {
  window.localStorage.clear();
  location.reload();
};
window.onload = function () {
  // تحديد العناصر الخاصة بالدقائق والثواني
  let minutesSpan = document.querySelector(".minutes");
  let secondsSpan = document.querySelector(".seconds");

  // تحديث التايمر كل ثانية
  let countdownInterval = setInterval(function () {
    // حساب الدقائق والثواني المتبقية
    let minutes = Math.floor(timerDuration / 60);
    let seconds = timerDuration % 60;

    // إضافة صفر إلى اليسار إذا كانت الثواني أقل من 10
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // عرض الدقائق والثواني في العناصر
    minutesSpan.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsSpan.textContent = seconds;
    
    // تقليل عدد الثواني المتبقية
    timerDuration--;
    
    // إذا وصل التايمر إلى 0، أوقف التايمر
    if (timerDuration < 0) {
      clearInterval(countdownInterval);
      // يمكنك هنا إضافة كود إضافي إذا أردت تنفيذ شيء ما بعد انتهاء التايمر
      alert("الوقت انتهى!");
      window.localStorage.clear();
      location.reload();
    }
  }, 1000);
};
get_data();
