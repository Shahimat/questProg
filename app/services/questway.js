import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const BACKEND_URL = 'http://0.0.0.0:8080/http://localhost:5000';

export default class QuestwayService extends Service {
    @tracked data = {};
    way = '';
    characteristic_list = [];
    object_list = [];
    characteristics = {};

    async getData(sURL) {
        const response = await fetch(sURL);
        return response.json();
    }

    async setWay(way) {
        this.way = way;
        this.characteristics     = await this.getData(`${BACKEND_URL}/characteristics`);
        this.characteristic_list = await this.getData(`${BACKEND_URL}/characteristic_list`);
        this.object_list         = await this.getData(`${BACKEND_URL}/object_list`);
    }

    newQuestway() {
        this.data = {
            subtitle: this.way,
            question: ''
        }
    }
}
