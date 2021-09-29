// import app1 from 'app1/app1';

// console.log(app1);

// app1();

import('app1/app1').then(({ default: app }) => {
    console.log(app);
    app();
});