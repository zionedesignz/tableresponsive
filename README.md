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

Para modificar el tiempo de espera modificar la propiedad delay (por defecto 50 milisegundos) agregar la propiedad delay al objeto:

    new Tableresponsive({
        id:'#IDtable',
        delay: 500,
    });
