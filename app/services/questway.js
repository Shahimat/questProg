import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const BACKEND_URL = 'http://0.0.0.0:8080/http://localhost:5000';

export default class QuestwayService extends Service {
    @tracked way          = '';
    @tracked question     = '';
    @tracked answer       = null;
    @tracked answerObject = '';

    object_list  = [];
    map_list     = [];
    property     = -1;
    stage        = 'null';

    async setAnswerValue(bAnswer) {
        this.answer = bAnswer;
    }

    async getData(sURI) {
        const response = await fetch(`${BACKEND_URL}${sURI}`);
        return response.json();
    }

    async setWay() {
        this.way   = 'Мебель';
        this.stage = 'null';
        this.setQuestion();
    }

    async getObjectQuestion (id_object) {
        let object = await this.getData(`/object/${id_object}`);
        return object.question;
    }

    async getQuestion (id_property) {
        let property = await this.getData(`/property/${id_property}`);
        return property.question;
    }

    async filterObjectList(id_property, bAnswer, firstDelete = false) {
        let id_object = this.object_list[0];
        if (firstDelete) { // просто удалить первый объект
            this.object_list = this.object_list.splice(1, this.object_list.length - 1);
        } else {
            let map_property = await this.getData(`/map_property/${id_property}`);
            this.object_list = bAnswer? this.object_list.filter(id =>  map_property.includes(id))
                                      : this.object_list.filter(id => !map_property.includes(id));
        }
        if (this.object_list.length === 0) {
            this.stage = 'error';
            console.log('error');
            return undefined;
        }
        if (id_object !== this.object_list[0]) {
            this.map_list = await this.getData(`/map_object/${this.object_list[0]}`);
        }
    }

    async setQuestion () {
        switch (this.stage) {
            case 'null':
                this.object_list  = await this.getData('/objectList');
                this.map_list     = await this.getData(`/map_object/${this.object_list[0]}`);
                this.property     = this.map_list.pop();
                this.question     = await this.getQuestion(this.property);
                this.stage        = 'question';
                break;
            case 'question':
                await this.filterObjectList(this.property, this.answer);
                if (this.stage == 'error') {
                    return;
                }
                if (this.object_list.length === 1) {
                    this.question = await this.getObjectQuestion(this.object_list[0]);
                    this.stage    = 'question_last'
                    break;
                }
                this.property     = this.map_list.pop();
                this.question     = await this.getQuestion(this.property);
                this.stage = this.map_list.length === 0? 'question_0': 'question';
                break;
            case 'question_0':
                switch (this.answer) {
                    case true:
                        this.question = await this.getObjectQuestion(this.object_list[0]);
                        this.stage    = 'question_last'
                        break;
                    case false:
                        await this.filterObjectList(this.property, this.answer);
                        if (this.stage == 'error') {
                            return;
                        }
                        if (this.object_list.length === 1) {
                            this.question = await this.getObjectQuestion(this.object_list[0]);
                            this.stage    = 'question_last'
                            break;
                        }
                        if (this.map_list.length === 0) {
                            this.stage == 'error';
                            break;
                        }
                        this.property     = this.map_list.pop();
                        this.question     = await this.getQuestion(this.property);
                        this.stage = this.map_list.length === 0? 'question_0': 'question';
                        break;
                }
                break;
            case 'question_last':
                switch (this.answer) {
                    case true:
                        this.stage = 'answer';
                        let data = await this.getData(`/object/${this.object_list[0]}`);
                        this.answerObject = data.name;
                        break;
                    case false:
                        await this.filterObjectList(null, null, true);
                        if (this.stage == 'error') {
                            return;
                        }
                        if (this.object_list.length === 1) {
                            this.question = await this.getObjectQuestion(this.object_list[0]);
                            this.stage    = 'question_last'
                            break;
                        }
                        this.property = this.map_list.pop();
                        this.question = await this.getQuestion(this.property);
                        this.stage    = this.map_list.length === 0? 'question_0': 'question';
                        break;
                }
                break;
        }
        this.answer = null;
        // console.log(this.object_list);
        // console.log(this.map_list);
        // console.log(this.property);
    }
}
