const authHelper = {
  authenticated: false,
  authenticate(token) {
    this.authenticated = true;
    localStorage.setItem('token', token);
    return Promise.resolve(this.authenticated)
  },
  isAuthenticated() {
    const user = localStorage.getItem('token');
    if (user) {
      this.authenticated = true;
    }
    return this.authenticated;
  },
  signout(cb) {
    this.authenticated = false;
    localStorage.clear();
    setTimeout(cb, 100);
  },
};

export default authHelper;
