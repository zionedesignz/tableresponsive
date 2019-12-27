# tableresponsive
Javascript class to convert html tables to responsive

Para utilizar tableresponsive.js:

1.- Instanciar un objeto tableresponsive e indicar en la propiedad id del objeto el identificador de la tabla a la que se le aplicará el responsive,

    import Tableresponsive from './tableresponsive.js';

    new Tableresponsive({
        id:'#IDtable'
    });


Para personalizar los estilos del botón, fondo, titulos de la columna o los datos agregar la propiedad style al objeto y declare los valores para cada elemento:

    new Tableresponsive({
        id:'#IDtable',
        style: {
            button:'border:none;',
            tr:'background-color:white',
            b: 'font-size:16px;',
            p: 'color:#ff0000;';
        }
    });

O bien puede agregar la propiedad class al objeto y declare los estilos que desea aplicar a cada elemento:

    new Tableresponsive({
        id:'#IDtable',
        class: {
            button:'btn btn-sm btn-primary',
            tr:'bg-white',
            b: 'text-uppercase font-weight-bold',
            p: 'text-muted';
        }
    });

Puede ordenar datos por texto (de la A a la Z o de la Z a la A), números (de menor a mayor o de mayor a menor) pulsando en la cabecera de la columna.
Pulsando una vez se aplica un orden ascendente, pulsando una segunda vez se aplica un orden descendente y al volver a pulsar se elimina el filtro. 