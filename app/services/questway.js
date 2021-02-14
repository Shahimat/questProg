import Service from '@ember/service';

export default class QuestwayService extends Service {
    way = '';

    setWay(way) {
        this.way = way;
        console.log(way)
    }
}
