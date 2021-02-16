import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AnswerController extends Controller {
    @service questway;

    @action
    async newQuestionnaires() {
        await this.questway.setWay();
        this.transitionToRoute('index');
    }
}
