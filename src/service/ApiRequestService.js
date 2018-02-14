ApiRequestService.$inject = ['$http'];
export default function ApiRequestService($http) {
  this.DefaultURL = 'https://bibliapp.herokuapp.com/api';
  this.DefaultAuthorURL = `${this.DefaultURL}/authors`;
  this.DefaultBookUrl = `${this.DefaultURL}/books`;

  /**
   * return all authors from api
   */
  this.getAuthor = (options) => {
    if(!options) return $http.get(this.DefaultAuthorURL);
    let newOpt = JSON.stringify(options);
    newOpt = encodeURIComponent(newOpt);
    const urlGet = `${this.DefaultAuthorURL}?filter=${newOpt}`;
    return $http.get(urlGet);
  };

  /**
   * getTotalAuthor - return the number total of authors
   * OBs - used to calculate how many skips will be set up when create a pagination
   */
  this.getTotalAuthor = () => {
    return $http.get(`${this.DefaultAuthorURL}/count`);
  };

  /**
   * getTotalBook - return the number total of authors
   * OBs - used to calculate how many skips will be set up when create a pagination
   */
  this.getTotalBook = () => {
    return $http.get(`${this.DefaultBookUrl}/count`);
  };

  /**
   * getAuthorByName - search authors by using its name or lastname
   * @param firstName
   * @param lastName
   * @return {Promise}
   */
  this.getAuthorByName = (firstName, lastName) => {
    let options = {};
    if(firstName && lastName){
      options = {"where": {"or":[{"firstName": {"like": `${firstName}`}}, {"lastName": {"like": `${lastName}`}}]}};
    }
    else if(firstName && !lastName){
      options = {"where": {"firstName": {"like": `${firstName}`}} };
    } else {
      options = {"where": {"lastName": {"like": `${lastName}`}} };
    }
    options = JSON.stringify(options);
    options = encodeURIComponent(options);
    const filter = `${this.DefaultAuthorURL}?filter=${options}`;
    return $http.get(filter);
  };


  /**
   * getBookByName - search Books by using its title
   * @param firstName
   * @param lastName
   * @return {Promise}
   */
  this.getBookByName = (title) => {
    let options = {};
    if(title){
      console.log('if');
      options = {"where": {"title": {"like": `${title}`}}};
    }
    // else if(firstName && !lastName){
    //   console.log('else if');
    //   options = {"where": {"firstName": {"like": `${firstName}`}} };
    // } else {
    //   console.log('else');
    //   options = {"where": {"lastName": {"like": `${lastName}`}} };
    // }
    options = JSON.stringify(options);
    options = encodeURIComponent(options);
    const filter = `${this.DefaultBookUrl}?filter=${options}`;
    return $http.get(filter);
  };

  /**
   * addAuhtor - will create a new instance of author
   * @param options
   */
  this.addAuthor = (options) => {
    if(options.id) return $http.put(this.DefaultAuthorURL, options);
    return $http.post(this.DefaultAuthorURL, options);
  };

  /**
   * deleteAuthor - delete a author instance by passing its id
   * @param id
   * @return {boolean|*|AxiosPromise}
   */
  this.deleteAuthor = (id) => {
    if(!id) return;
    return $http.delete(`${this.DefaultAuthorURL}/${id}`);
  };

  /**
   * addBook - create a new instance of a book to one author
   * @param options
   */
  this.addBook = (options) => {
    if(!options);
    if(options.id) return $http.put(this.DefaultBookUrl, options);
    return $http.post(this.DefaultBookUrl, options);
  };

  /**
   * getBooks - return a list of books by passing some filters or nothing
   * @param filter
   */
  this.getBooks = (filter) => {
    if(!filter){
      return $http.get($this.DefaultBookUrl);
    }
    let where = JSON.stringify(filter);
    where = `${this.DefaultBookUrl}?filter=${where}`;
    return $http.get(where);
  };

  /**
   * deleteBook - delete a book
   * @param id
   * @return {boolean|*|AxiosPromise}
   */
  this.deleteBook = (id) => {
    if(!id) return;
    return $http.delete(`${this.DefaultBookUrl}/${id}`);
  };

};