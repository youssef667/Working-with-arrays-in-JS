"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (user) {
  user.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((letter) => letter[0])
      .join("");
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  // Dispaly movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//EVENT HANDLER
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

//const inputTransferTo = document.querySelector('.form__input--to');
//const inputTransferAmount = document.querySelector('.form__input--amount');

btnTransfer.addEventListener("click", function (e) {
  //prevent defult
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value,
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log("lol");
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  }
});

//requesting a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    console.log("yes you are good person");
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});
//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //inputClosePin
  //inputCloseUsername
  const receiverAcc = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (
    inputCloseUsername.value === currentAccount.username &&
    pin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username,
    );
    console.log(index);
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";

  //console.log(receiverAcc , pin);
});
let sort = true;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  if (sort) {
    displayMovements(currentAccount.movements, true);
    sort = false;
  } else {
    displayMovements(currentAccount.movements, false);
    sort = true;
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", "")),
  );
  console.log(movementsUI);
});

// const x = new Array(7);
// console.log(x);

// console.log(x.fill(1, 3, 5));

// console.log(x.fill(1));

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (cur, i) => i + 1);
// console.log(z);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// const groupedMovements = Object.groupBy(movements, (mov) =>
//   mov > 0 ? "deposits" : "withdrawals",
// );
// console.log(groupedMovements);
// console.log(movements.includes(-130));
// //some checks if there is any movements that is greater that 5000
// console.log(movements.some((mov) => mov > 5000));
// //separate call back
// const operator = (mov) => mov > 0;
// console.log(movements.some(operator));
// console.log(movements.every(operator));
// console.log(movements.filter(operator));

// const multiarray = accounts.map((acc) => acc.movements).flat();
// const overallBalance = multiarray.reduce((acc, mov) => acc + mov);
// console.log(overallBalance);

// const balance = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov);
// console.log(balance);
// const firstWithdrawal = movements.find(mov => mov<0);
// console.log(firstWithdrawal);

// const euroToUSD = 1.1;
// const totalDepositsUSD = movements.filter((mov) => mov > 0).map((mov) => (mov*euroToUSD)).reduce(function(acc,mov){acc + mov});
// /////////////////////////////////reduce method///////////////////////////////////////
// // Maixum value
// const max = movements.reduce(function(acc , mov){
//   if (mov < acc){
//     return acc;
//   }
//   else {
//     return mov;
//   }
// }, movements[0]);
// console.log(`the maximum number is ${max}`);

// const balace = movements.reduce(function(acc,cur,i,arr){

//   acc +=cur;
//   console.log(acc);
//   return acc;
// },0);

// const balace = movements.reduce((acc,cur) => acc +=cur,0);

// let balance_2 = 0;
// for(const move of movements){
//   balance_2 += move;
// }
// console.log(balance_2);

// console.log(`this world is fucked ${balace} times`);

/////////////////////////////// filter method ////////////////////////////
// const deposits = movements.filter(function(mov){
//   return mov > 0 ;
// });
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov <0);
// console.log(withdrawals)

/////////////////////////// Map method ///////////////////////////////////
// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function(mov){
//     return mov*eurToUsd;
// });
// console.log(movementsUSD);

// const movementsDescriptions = movements.map( (mov,i,arr) =>

//   `Movement ${i +1}:You${mov > 0 ? 'You deposited' : 'You withdrew'}${Math.abs(mov)}`
// );
// console.log(movementsDescriptions);

/////////////////////////////////////////////////

//challenge 1
//A dog is an adult if it is at least 3 years old,

// const checkDogs = function (dogsJulia ,dogsKate ){

//   const correctJuliaAges = dogsJulia.slice(1 ,dogsJulia.length -2 );
//    const dogs = correctJuliaAges.concat(dogsKate);
//   dogs.forEach(function(Element , i){
//     const age = Element >= 3 ? 'adult' :'puppy' ;
//     if (age === 'adult'){
//        console.log(`Dog number ${i+1} an adult, and is ${Element} years old`);}
//        else {
//         console.log(`Dog number ${i+1} is still a puppy 🐶`)
//        }
//   });
// }

// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages){

//   const average  = ages.map((mov) =>mov<= 2 ? (2*mov) : (16+ (4*mov)))
//                    .filter((mov) => mov>18)
//                    .reduce((acc , mov,i,arr) => acc+ mov /arr.length,0);
//   return average ;
// }
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1,avg2);
