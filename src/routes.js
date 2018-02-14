routes.$inject = ['$urlRouterProvider','$stateProvider'];

export default function routes($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/author');

  $stateProvider
    .state('book', {
      url: '/book',
      template: require('../views/book/book.html'),
      controller: 'BookController'
    })
    .state('author', {
      url: '/author',
      template: require('../views/author/author.html'),
      controller: 'AuthorController'
    });
}