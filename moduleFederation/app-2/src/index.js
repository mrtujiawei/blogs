import('app1/app1').then(({ default: app }) => {
    console.log(app);
    app();
});
