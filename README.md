# FormAjax

## Installation
```npm install form-ajax --save```

## Usage
```js
import FormAjax from 'form-ajax';

const formContainer = document.querySelector('form');
const formAjax = new FormAjax(formContainer);

form.on('success', data => { // XMLHttpRequest
    console.log(data.response);
    console.log(data.status);
});

form.on('error', data => { // XMLHttpRequest
    console.log(data.response);
    console.log(data.status);
});
```
