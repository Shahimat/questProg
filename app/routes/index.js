import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
    model() {
        return [
            {
                id: 0,
                text: 'Мебель'
            },
            // {
            //     id: 1,
            //     text: 'Операционная система'
            // },
            // {
            //     id: 2,
            //     text: 'Большой полосатый мух'
            // }
        ]
    }
}
