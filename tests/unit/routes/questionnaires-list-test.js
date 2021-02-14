import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | questionnaires_list', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:questionnaires-list');
    assert.ok(route);
  });
});
