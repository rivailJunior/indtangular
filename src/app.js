import angular from 'angular'
import uirouter from 'angular-ui-router'
import routes from './routes'

import '../scss/app.scss';
import AuhtorController from './authorController';
import BookController from './bookController';
import ApiRequestService from './service/ApiRequestService';
const app = angular.module('app', [uirouter, 'toastr']).config(routes);
app.service('ApiRequestService', ApiRequestService);
app.controller('AuthorController', AuhtorController);
app.controller('BookController', BookController);