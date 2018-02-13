routes.$inject = ['$urlRouterProvider','$stateProvider'];

export default function routes($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('about', {
      url: '/about',
      template: require('../views/about.html'),
      controller: 'AboutController'
    })
    .state('author', {
      url: '/author',
      template: require('../views/author/author.html'),
      controller: 'AuthorController'
    });
}