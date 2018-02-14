export default function bookController($scope, ApiRequestService, toastr){
  $scope.name = 'Book Controller';
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
  $scope.getBooks = (options) => {
    const filterSkipt = options || $scope.initSkipPagination;
    ApiRequestService.getBooks(filterSkipt).then(res => {
      if(res.data){
        $scope.bookList = res.data;
      }
    }).catch(err => {
      console.log('err', err);
    });
  };

  /**
   * createPagination - create the buttons and the options to paginate
   */
  const createPagination = (bookList) => {
    ApiRequestService.getTotalBook().then(total => {
      let totalButtons = Math.ceil(total.data.count / 10);
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
    $scope.getBooks($scope.initSkipPagination);
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
        $scope.getBooks();
        toastr.success('Author saved with success!', 'Save');
        if(callback) callback();
      }
    }).catch(err => {
      toastr.error('Error while try to save author!', 'Error');
      console.log('err', err);
    })
  };

  const getAuthors = (_cb) => {
    ApiRequestService.getAuthor().then(res => {
      $scope.authorList = res.data;
      if(_cb) _cb();
    });
  }

  const addingBook = (options) => {
    console.log('options adding', options);
    ApiRequestService.addBook(options).then(() => {
      // $scope.closeModal(modalAddBook);
      $scope.state.bookTitle = '';
      $scope.getBooks($scope.initSkipPagination);
      createPagination($scope.bookList);
      toastr.success('Book saved with success!', 'Save');
    }).catch(err => {
      toastr.error('Error while try to save a book', 'Error');
      console.log('onAddBook err ===== ', err);
    });
  };

  /**
   * onAddBook - call request to add a book to an author selected
   * @param author
   * @param isAddCall
   */
  $scope.onAddBook = (book, isAddCall, isEdit) => {
    if(!book && !isAddCall){
      getAuthors();
      $scope.authorList = $scope.authorList[1];
      $scope.openModal(modalAddBook);
    }
    else if(book && !isAddCall && !isEdit){ // on creating book
      const options = {title: $scope.state.bookTitle, authorId: $scope.state.author};
      addingBook(options);
      $scope.listBookByAuthor($scope.state.author);
    }
    else if(book && isAddCall && !isEdit){ // open to edit case
      $scope.book = book;
      getAuthors();
      $scope.openModal(modalAddBook);
    }
    else if(book && isAddCall &&  isEdit) { // edit case
      if($scope.state){
        if($scope.state.bookTitle) book.title = $scope.state.bookTitle;
        if($scope.state.author) book.authorId = $scope.state.author;
      }
      const options = {
        id: book.id,
        title: book.title,
        authorId:book.authorId
      };
      addingBook(options);
    }
  };

  /**
   * clearSearch - clear the field on search and re build the list
   */
  $scope.clearSearch = () => {
    $scope.book.title = '';
    $scope.onSearch();
  };

  /**
   * onRemoveABook - delete a book from author book list
   * @param book
   * @param isCallDelete
   */
  $scope.onRemoveAbook = (book, isCallDelete) => {
    if(book && !isCallDelete) {
      $scope.openModal(modalDeleteBook);
      $scope.book = book;
    } else if(book && isCallDelete) {
      ApiRequestService.deleteBook(book.id).then(res => {
        toastr.success('Book removed with success!', 'Delete');
        $scope.getBooks($scope.initSkipPagination);
        createPagination($scope.bookList);
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
    ApiRequestService.getBookByName($scope.book.title).then(res => {
      $scope.bookList = res.data;
      createPagination($scope.bookList);
    }).catch(err => {
      console.log('err === ', err);
    })
  };

  /**
   * listBookByAuthor - list all books from that current author
   * @param author
   */
  $scope.listBookByAuthor = (author) => {
    const filter = {where:{authorId: author}};
    ApiRequestService.getBooks(filter).then(res => {
      $scope.authorBookList = res.data;
    });
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
  $scope.getBooks();
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