export default function authorController($scope, ApiRequestService, toastr){
  $scope.name = 'Author controller';
  $scope.authorList = [];
  $scope.breadCrumb = 'List';
  const modalDeleteId = "#modalDelete";
  const modalAddId = "#exampleModal";
  const modalAddBook = "#modalAddBook";
  const modalDeleteBook = "#modalBookDelete";
  $scope.initSkipPagination = {limit: 10, skip: 0};

  /**
   * getAuthors - request a call to get all authors from api
   */
  $scope.getAuthors = (options) => {
    const filterSkipt = options || $scope.initSkipPagination;
    ApiRequestService.getAuthor(filterSkipt).then(res => {
        if(res.data){
          $scope.authorList = res.data;
        }
    }).catch(err => {
      console.log('err', err);
    });
  };

  /**
   * createPagination - create the buttons and the options to paginate
   */
  const createPagination = () => {
    ApiRequestService.getTotalAuthor().then(total => {
      let totalButtons = Math.round(total.data.count / 10);
      const restOf = total.data.count % 10;
      if(restOf > 0) totalButtons += 1;
      const buttons = [];
      for(var i = 0; i < totalButtons; i++){
        buttons.push({
          skip: i * 10,
          number: i + 1
        });
        $scope.buttonToPaginate = buttons;
      }
    });
  };

  /**
   * callPaginationEvent - this is the principal pagination function
   * obs - keep in mind the total limit per page, will skip by passing the total to skip
   * should be called at view
   * @param skip
   */
  $scope.callPaginationEvent = (skip) => {
    $scope.initSkipPagination = {limit: 10, skip};
    $scope.getAuthors($scope.initSkipPagination);
  };


  /**
   * puAuthor - add or update an Author
   * @param options
   * @param callback
   */
  const putAuthor = (options, callback) => {
    ApiRequestService.addAuthor(options).then(res => {
      if(res.status === 200){
        $scope.closeModal(modalAddId);
        $scope.getAuthors();
        toastr.success('Author saved with success!', 'Save');
        if(callback) callback();
      }
    }).catch(err => {
      toastr.error('Error while try to save author!', 'Error');
      console.log('err', err);
    })
  };

  /**
   * onAdd - validate input and call service to add a new author
   */
  $scope.onAddNew = (author, isCallEdit) => {
    if (!author && !isCallEdit) {
      const data = {
        firstName: $scope.state.firstName,
        lastName: $scope.state.lastName
      };
      putAuthor(data);
    } else if (author && !isCallEdit){
      $scope.author = author;
      $scope.openModal(modalAddId);
    } else if(author && isCallEdit) {
      const optUpdate = {
        id: author.id,
        firstName: $scope.state.firstName || author.firstName,
        lastName: $scope.state.lastName || author.lastName
      };
      putAuthor(optUpdate);
    }
  };


  /**
   * onDelete - call a confirmation message or call the delete method if the second parameter is passed
   * @param author - author object
   * @param isDeleteCall - boolean
   */
  $scope.onDelete = (author, isDeleteCall) => {
    if(author && !isDeleteCall) {
      $scope.openModal(modalDeleteId);
      $scope.author = author;
    }
    if(author && isDeleteCall) {
      ApiRequestService.deleteAuthor(author.id).then(res => {
        if(res.data.count === 1){
          $scope.closeModal(modalDeleteId);
          $scope.getAuthors();
          toastr.success('Author removed with success!', 'Delete');
          $scope.author = null;
        }
      }).catch(err => {
        toastr.error('Error while try to remove an Author', 'Error');
        console.log('delete err ==== ', err);
      })
    }
  };

  /**
   * getBooks - return a list of books by passing a filter with author id
   * @param filter
   */
  const getBooks = (filter) => {
    if(!filter) return;
    ApiRequestService.getBooks(filter).then(books => {
      $scope.bookList = books.data;
    }).catch(err => {
      console.log('get books err ===', err);
    });
  };

  /**
   * onAddBook - call request to add a book to an author selected
   * @param author
   * @param isAddCall
   */
  $scope.onAddBook = (author, isAddCall) => {
    const optFilter = {where:{authorId: author.id}};
    if(author && !isAddCall){
      getBooks(optFilter)
      $scope.author = author;
      $scope.openModal(modalAddBook);
    }
    if(author && isAddCall){
      const options = {title: $scope.state.bookTitle, authorId: author.id};
      ApiRequestService.addBook(options).then(() => {
        // $scope.closeModal(modalAddBook);
        $scope.state.bookTitle = '';
        getBooks(optFilter);
        toastr.success('Book saved with success!', 'Save');
      }).catch(err => {
        toastr.error('Error while try to save a book', 'Error');
        console.log('onAddBook err ===== ', err);
      });

    }
  };

  /**
   * onRemoveABook - delete a book from author book list
   * @param book
   * @param isCallDelete
   */
  $scope.onRemoveAbook = (book, isCallDelete) => {
    // console.log('book', book);
    if(book && !isCallDelete) {
      $scope.openModal(modalDeleteBook);
      $scope.book = book;
    } else if(book && isCallDelete) {
      ApiRequestService.deleteBook(book.id).then(res => {
        toastr.success('Book removed with success!', 'Delete');
        const optFilter = {where:{authorId: book.authorId}};
        getBooks(optFilter);
        $scope.closeModal(modalDeleteBook);
      }).catch(err => {
        toastr.error('Error while try to remove a book');
        console.log('Error ==== ', err);
      });
    }
  };

  /**
   * onSearch - do a search using its author names or lastname
   */
  $scope.onSearch = () => {
    ApiRequestService.getAuthorByName($scope.author.firstName, $scope.author.lastName).then(res => {
      $scope.authorList = res.data;
    }).catch(err => {
      console.log('err === ', err);
    })
  };

  /**
   * openModal - call modal
   */
  $scope.openModal = (modalId) => {
    $(modalId).modal('show');
  };

  /**
   * closeModal - close modal
   */
  $scope.closeModal = (modalId) => {
    $(modalId).modal('hide')
  };


  // init function calls
  $scope.getAuthors();
  createPagination();
  $scope.callPaginationEvent(0);

  $(modalDeleteId).on('hidden.bs.modal',  (e) => {
    $scope.author = null;
  });
  $(modalAddBook).on('hidden.bs.modal',  (e) => {
    $scope.book = null;
  });
  $(modalDeleteBook).on('hidden.bs.modal',  (e) => {
    $scope.book = null;
  });
  $(modalAddId).on('hidden.bs.modal',  (e) => {
    $scope.author = null;
  });
};