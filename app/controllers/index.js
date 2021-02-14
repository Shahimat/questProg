import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
    @tracked text = '';

    @action
    onChangeChoise(sText) {
        this.text = sText;
        console.log(this.text);
    }

}