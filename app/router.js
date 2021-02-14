import EmberRouter from '@ember/routing/router';
import config from 'entity-questions/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('questionnaires_list');
  this.route('questionnaires');
  this.route('answer');
  this.route('not-found', {path: '/*path'});
});
