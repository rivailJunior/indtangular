import angular from 'angular'
import uirouter from 'angular-ui-router'
import routes from './routes'

import '../scss/app.scss';
import AboutController from './aboutController';
import AuhtorController from './authorController';
import ApiRequestService from './service/ApiRequestService';
const app = angular.module('app', [uirouter, 'toastr'])
  .config(routes);
app.service('ApiRequestService', ApiRequestService);
app.controller('AboutController', AboutController);
app.controller('AuthorController', AuhtorController);