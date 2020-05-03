const networkHelper = {
  async fetchHelper(uri, requestBody = {}) {
    const requestParameters = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      ...requestBody
    };
    let result;
    try {
      result = await (await fetch(uri, requestParameters)).json();
    } catch (error) {
      console.log(error);
    }

    if (result.error) {
      console.log(result);
      return Promise.reject(result.message);
    }
    return Promise.resolve(result);
  }
};

export default networkHelper;
