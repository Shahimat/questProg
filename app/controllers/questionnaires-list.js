import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class QuestionnairesListController extends Controller {
    @service questway;

    answers = [
        {
            id: 0,
            text: 'да'
        },
        {
            id: 1,
            text: 'нет'
        }
    ];

    @action
    onChangeChoise(sText) {
        let getValue = (sText) => {
            switch(sText) {
                case 'да':  return true;
                case 'нет': return false;
            }
            return null;
        }
        this.questway.setAnswerValue(getValue(sText));
    }

    @action
    async setAnswer() {
        if (this.questway.answer === null) {
            alert('Выберите вариант ответа');
            return;
        }
        // очищаем радио кнопки
        document.querySelectorAll('input').forEach(item => {
            item.checked = false
        });
        await this.questway.setQuestion();
        switch (this.questway.stage) {
            case 'error':
                alert('STAGE ERROR');
                this.questway.answerObject = 'не найден';
                this.transitionToRoute('answer');
                break;
            case 'answer':
                this.transitionToRoute('answer');
                break;
        }
    }
}
