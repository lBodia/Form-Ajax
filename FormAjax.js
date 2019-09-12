import EventEmitter from 'tiny-emitter';

export default class FormAjax extends EventEmitter {
  constructor (container, options = {}) {
    super();
    this.form = container;
    this.init();
    this.options = {
      disabledClass: 'disabled',
      ...options
    };
  }

  init () {
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  onSubmit (e) {
    e.preventDefault();
    this.submit();
  }

  async submit () {
    this.disableInput();
    try {
      const response = await this.makeRequest();
      this.handleSuccessResponse(response);
    } catch (error) {
      this.handleErrorResponse(error);
    } finally {
      this.enableInput();
    }
  }

  makeRequest () {
    const data = new FormData(this.form);
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
          return;
        }

        reject(xhr);
      };
      xhr.open(this.form.getAttribute('method'), this.form.getAttribute('action'));
      Object.keys(headers).forEach((header) => {
        xhr.setRequestHeader(header, headers[header]);
      });
      xhr.send(data);
    });
  }

  handleSuccessResponse (response) {
    this.emit('success', response);
    this.form.reset();
  }

  handleErrorResponse (response) {
    this.emit('error', response);
  }

  disableInput () {
    this.form.classList.add(this.options.disabledClass);
  }

  enableInput () {
    this.form.classList.remove(this.options.disabledClass);
  }
}
