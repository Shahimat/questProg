import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
    @service questway;

    @action
    onChangeChoise(sText) {
        this.questway.setWay(sText);
    }

    @action
    gotoNextRoute() {
        if (!this.questway.way) {
            alert('Выберите опросник');
            return;
        }
        this.questway.newQuestway();
        this.transitionToRoute('questionnaires_list');
    }

}