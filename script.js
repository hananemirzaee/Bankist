'use strict';

// /////////////////////////////////////////////////
// // BANKIST APP

// /////////////////////////////////////////////////
// // Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Hanane Mirzaee',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.7,
  pin: 2222,
  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Fateme Sm',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Yegane Pz',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//-------------Date-------------
const formatMovementDate = function (date, local) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   // getMonth is zero based because +1
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(local).format(date);
};
//-------------FORMAT CURRENCY-------------
const formatcur = function (value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//-------------ADDING MOVEMENTS TO THE BOX-------------
const displayMovements = function (acc, sort = false) {
  // innerHTML similar with textcontent
  // containerMovements.innerHTML = '';

  //  SORT MOVEMENTS
  const sortMove = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // if sort=true sorted the moves else display movs

  // mov= current elemnt __ i= index
  sortMove.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatcur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

//-------------VALUE OF CURRENT BALANCE-------------
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatcur(
    account.balance,
    account.locale,
    account.currency
  );
};
// calcDisplayBalance(account1.movements);

//-------------CALCUTE SUMMARY-------------
const calcDisplaySummary = function (account) {
  // sum of the green values(deposit)
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatcur(incomes, account.locale, account.currency);

  // sum of the red values(withdrawal)
  const outcomes = account.movements
    .filter(move => move < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcur(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  // bank pay interest(سود)_on each of that deposit they give 1.2%
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    // Only those more than one euro
    .filter((interests, i, arr) => interests >= 1)
    .reduce((acc, interests) => acc + interests, 0);
  labelSumInterest.textContent = formatcur(
    interest,
    account.locale,
    account.currency
  );
};
// calcDisplaySummary(account1.movements);

//-------------CREATE USER TO LOGIN-------------
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner // make method in object accounts: username and fill with owner method then ..toLowerCase().split(' ') and...
      .toLowerCase()
      .split(' ')
      .map(owner => owner[0]) // instead of---> .map(function(owner){ return owner[0]; })
      .join('');
  });
};
creatUserNames(accounts);

//-------------UPDATE UI-------------
const updateUI = function (acc) {
  //------DISPLAY MOVEMENTS
  displayMovements(acc); // Display the movement box when current account === true(user and pass are correct)

  // ------DISPLAY BALANCE
  calcDisplayBalance(acc);

  // ------DISPLAY SUMMARY
  calcDisplaySummary(acc);
};
//-------------TIMER TO LOG OUT-------------
const startLogOutTimer = function () {
  const tick = function () {
    const minuteLogOut = String(Math.trunc(time / 60)).padStart(2, 0);
    const secondLogOut = String(time % 60).padStart(2, 0);

    // In each call print the remaning time to UI
    labelTimer.textContent = `${minuteLogOut}:${secondLogOut}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrese 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 10;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 10000);
  return timer;
};

//-------------CHECK USERS AND PINS FOR LOGIN(EVENT HANDLER)-------------
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  // prevent form from submiting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //------DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // creat current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // // getMonth is zero based because +1
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Experimenting API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minutes: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    // day/month/year
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // lose its focus

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

//-------------TRANSFER MONEY-------------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  console.log(receiverAccount, amount);

  // مبلغ واریزی نباید منفی باشه، بیشتر از  موجودی باشه و به حساب خودش چیزی نتونه واریز کنه
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // UPDATE UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

//-------------REQUEST LOAN-------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amountLoan = Number(inputLoanAmount.value);
  if (
    amountLoan > 0 &&
    //درصورتی وام تعلق میگیره که 10 درصد مقدار درخواستی رو توی حسابش داشته باشه
    currentAccount.movements.some(mov => mov >= amountLoan * 0.1)
  ) {
    // Add movements
    setTimeout(function () {
      currentAccount.movements.push(amountLoan);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //  UPDATE UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  }
  inputLoanAmount.value = '';
});

//-------------CLOSE ACCOUNT-------------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    // give me an index of current account
    const index = accounts.findIndex(
      input => input.username === currentAccount.username
    );
    console.log(accounts);
    // یک تعداد حذف عنصر هست و اگر ارگومان دوم نداشته باشه تا اخر حذف میکنه
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
  }
});

// SUM OF ALL MOVEMENTS OF ACCOUNTS
const accountMovements = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovements);

//-------------SORT BOTTON-------------
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// /////////////////////////////////////////////////

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = '#FFDEAD';
    else row.style.backgroundColor = '#FFE4C4';
  });
});
