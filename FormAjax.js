export default class FormAjax {
  constructor (container, options = {}) {
    this.events = {};
    this.form = container;
    this.init();
    this.options = {
      disabledClass: 'disabled',
      ...options
    };
  }

  on (name, callback) {
    this.events[name] = {
      fn: callback
    };
  }

  emit (name, payload) {
    return this.events[name] && this.events[name].fn(payload);
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
      const beforeSubmit = this.emit('beforeSubmit', this.form);

      if (beforeSubmit === false) {
        return false;
      }

      const response = await this.makeRequest();
      this.handleSuccessResponse(response);
    } catch (error) {
      this.handleErrorResponse(error);
    } finally {
      this.enableInput();
    }
  }

  makeRequest () {
    const formData = new FormData(this.form);
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
      xhr.send(formData);
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
