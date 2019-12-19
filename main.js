import Tableresponsive from './tableresponsive.js';

(function(){
    const table = new Tableresponsive({
        id:'#dataTable',
        class: {
            button:'btn btn-dark btn-sm mt-2',
            tr:'text-center',
        }
    });
    
    /*const table2 = new Tableresponsive({
        id:'#dataTable2',
        class: {
            button:'btn btn-primary btn-sm mt-2',
            tr:'text-center',
        }
    });*/

    console.log(table);
    //console.log(table2);
})();