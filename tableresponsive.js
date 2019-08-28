export default class Tableresponsive {

    constructor(props = {}) {
        //PROPIEDADES
        this.props = {
            // ID OBLIGATORIO PARA FORZAR EL RESPONSIVE
            id: props.id ? props.id : console.log(`Para utilizar tableresponsive.js es necesario instanciar un objeto y pasar el id como parametro => new Tableresponsive( {id:'#idtable'} );`),
            // TIEMPO DE ESPERA PARA EFECTUAR EL RESPONSIVE
            delay: props.delay ? props.delay : 50,
            // ESTILOS
            style: props.style ? ({  
                button: props.style.button ? props.style.button : '',
                tr: props.style.tr ? props.style.tr : '',
                p: props.style.p ? props.style.p : '',
                b: props.style.b ? props.style.b : ''
            }) : ({ button:'', tr:'', p:'',b:''}),
            // CLASES
            class: props.class ? ({   
                button: props.class.button ? props.class.button : '',
                tr: props.class.tr ? props.class.tr : '',
                p: props.class.p ? props.class.p : '',
                b: props.class.b ? props.class.b : ''
            }) : ({button:'', tr:'', p:'',b:''}),
        };
        // ESTADO    
        this.compressed = false;
        this.descompressed = false;
        this.firstCompressed = true;
        this.state = {};
        // VALORES DOM
        this.table = document.querySelector(this.props.id);
        this.tableInitStyleWidth = this.table.style.width;
        this.tableWidth = document.querySelector(this.props.id).scrollWidth;
        this.tableWidthCompressed = 0;
        this.tableRows = document.querySelector(this.props.id).children[1].children.length;
        this.tableColumns = document.querySelector(this.props.id).children[0].children[0].children.length;
        this.tableColumnsHidden = 0;
        this.tableColumnsVisible = 0;
        this.tableColumnsArray = this.obtainWidthColumns();
        this.marginHorTotal = this.obtainWidthParents();
        this.setTime;
        this.windowWidth = document.body.scrollWidth;
        // AL CARGAR
        window.onload = () => {
            // AÑADIR EVENTO REDIMENSIONAR
            window.addEventListener('resize', this.resize.bind(this));
            // INICIALIZAR
            setTimeout(this.action.bind(this), 400);
        }
    }
    // LLAMAR A ACTION CON RETRASO
    resize() {
        clearTimeout(this.setTime);
        this.setTime = setTimeout(this.action.bind(this), this.props.delay);
    }
    // COMPROBAR ACCION A REALIZAR
    action() {
        //FORZAR ESTILO DE ANCHO DE TABLA PARA REALIZAR LA COMPROBACION
        this.table.style.width = 'auto';
        // ACTUALIZAR DOM DATA
        this.tableColumnsHidden > 0 ? this.firstCompressed = false : this.firstCompressed = true;
        this.windowWidth = document.body.scrollWidth;
        this.tableRows = this.table.children[1].children.length; 
        this.tableWidth = this.table.scrollWidth;
        this.tableColumnsVisible = this.tableColumns-this.tableColumnsHidden;
        /*-------------------------------------------------------------------------VALIDAR COMPRESS-----------------------------------------------------------------------------------------------------*/
        // SI EL NUMERO DE COLUMNAS -1 (DEJAR SIEMPRE UNA VISIBLE) ES SUPERIOR A DE COLUMNAS OCULTAS... COMPROBAR SI SE PUEDE COMPRIMIR
        if (this.tableColumns-1 > this.tableColumnsHidden) {
            // SI EL ANCHO DE LA TABLA ES SUPERIOR AL ANCHO DE LA PANTALLA - LOS MARGENES/PADDING DE LOS ELEMENTOS PADRE --> COMPRESSED ACTIVO
            this.tableWidth >= (this.windowWidth-this.marginHorTotal) ? this.compressed = true : this.compressed = false;
            // SI ESTA COMPRIMIENDO LLAMAR A LA FUNCION PARA COMPRIMIR
            this.compressed ? this.compressing() : '';
        }
        /*-------------------------------------------------------------------------VALIDAR DESCOMPRESS--------------------------------------------------------------------------------------------------*/
        // SI HAY ALGUNA COLUMNA OCULTA & EL NUMERO DE COLUMNAS DE LA TABLA ES DISTINTO AL DE LAS COLUMNAS VISIBLES & NO ESTA COMPRIMIENDO... COMPROBAR SI SE PUEDE DESCOMPRIMIR
        if (this.tableColumnsHidden > 0 && this.tableColumns != this.tableColumnsVisible && this.compressed == false) {
            // SI EL ANCHO DE LA TABLA + EL ANCHO DE LA ULTIMA COLUMNA OCULTA ES INFERIOR AL ANCHO DE LA PANTALLA - LOS MARGENES/PADDING DE LOS ELEMENTOS PADRE --> DESCOMPRESSED ACTIVO
            (this.tableWidth + this.tableColumnsArray[this.tableColumnsVisible]) < (this.windowWidth-this.marginHorTotal) ? this.descompressed = true : this.descompressed = false;
            // SI ESTA DESCOMPRIMIENDO LLAMAR A LA FUNCION PARA DESCOMPRIMIR             
            this.descompressed ? this.descompressing() : '';
        }
        // OCULTAR DURANTE EL PROCESO
        !this.compressed && !this.descompressed || this.firstCompressed ? this.table.style.visibility = 'visible' : this.table.style.visibility = 'hidden';
        // SI LA TABLA ESTA DESPLEGADA AL COMPLETO PONER EL ANCHO INICIAL
        this.firstCompressed && this.tableColumnsHidden == 0 ? this.table.style.width = this.tableInitStyleWidth : this.table.style.width = 'auto';
    }
    // COMPRIMIR TABLA
    async compressing() {
        return await new Promise( (resolve, reject) => {
            setTimeout( () => {
                // RECORRER LAS FILAS
                for (let i = 0; i < this.tableRows; i++) {
                    // OBTENER POSICION DATA Y POSICION INSERTAR NUEVA FILA PARA LOS DATOS COMPRIMIDOS (EN LA PRIMERA LANZADA)
                    let positionData = 0;
                    let positionInsert = 0;
                    if (i == 0) {
                        positionData = i;
                        positionInsert = i+1;
                    } else {
                        positionData = i*2;
                        positionInsert = (i*2)+1
                    }                          
                    // PRIMERA LANZADA
                    if (this.firstCompressed) {
                        // OBTENER FILA ACTUAL
                        let tr = this.table.children[1].children[positionData];
                        // AÑADIR BOTON
                        let button = document.createElement('button');
                            button.innerHTML = '+';
                            button.setAttribute('style','margin-left:5px;'+this.props.style.button);
                            button.setAttribute('class',this.props.class.button);
                            button.addEventListener('click', () => this.alternarVisibilidad() );
                        tr.appendChild(button);
                        // OBTENER POSICION ÚLTIMA COLUMNA VISIBLE
                        let lastColVisible = this.table.children[1].children[positionData].children.length-(2+this.tableColumnsHidden);
                        // OCULTAR TITULO HEADER
                        this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].style.display = 'none';
                        this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].style.width = 0;
                        // OCULTAR COLUMNA
                        tr.children[lastColVisible].style.display = 'none';                  
                        // CREAR '<b>' CON EL NOMBRE COLUMNA
                        let newBColName = document.createElement('b');
                            newBColName.setAttribute('style',this.props.style.b);
                            newBColName.setAttribute('class',this.props.class.b);
                            newBColName.textContent = this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].textContent;
                        // CREAR TEXTNODE CON LA DATA DE LA COLUMNA A OCULTAR
                        let newBText = document.createTextNode(' : '+tr.children[lastColVisible].textContent);
                        //CREAR '<p>' PARA INCLUIR TODO
                        let newPColName = document.createElement('p');
                            newPColName.setAttribute('style','margin:0;'+this.props.style.p);
                            newPColName.setAttribute('class',this.props.class.p);
                            newPColName.appendChild(newBColName);
                            newPColName.appendChild(newBText);
                        // CREAR NUEVA FILA Y NUEVA COLUMNA CON CONTENIDO ÚLTIMA COLUMNA
                        let newTr = document.createElement('td');
                            newTr.setAttribute('colspan', this.tableColumns);
                            newTr.appendChild(newPColName);
                        let TrContainer = document.createElement('tr');
                            TrContainer.setAttribute('style',this.props.style.tr);
                            TrContainer.setAttribute('class',this.props.class.tr);
                            TrContainer.appendChild(newTr);
                            TrContainer.style.visibility = 'collapse';
                        if ((positionData/2) == this.tableRows-1 ) {
                            this.table.children[1].appendChild(TrContainer);
                            return resolve(true);
                        } else {
                            this.table.children[1].insertBefore(TrContainer, tr.parentNode.children[positionInsert]);
                        }   
                    } 
                    // SIGUIENTES LANZADAS
                    else {
                        if (i%2 == 0) {
                            // OBTENER FILA ACTUAL
                            let tr = this.table.children[1].children[i];
                            // OBTENER POSICION ÚLTIMA COLUMNA VISIBLE
                            let lastColVisible = this.table.children[1].children[i].children.length-(2+this.tableColumnsHidden);
                            // OCULTAR TITULO HEADER
                            this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].style.display = 'none';
                            this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].style.width = 0;
                            // OCULTAR COLUMNA
                            tr.children[lastColVisible].style.display = 'none';
                            // CREAR '<b>' CON EL NOMBRE COLUMNA
                            let newBColName = document.createElement('b');
                                newBColName.setAttribute('style',this.props.style.b);
                                newBColName.setAttribute('class',this.props.class.b);
                                newBColName.textContent = this.table.children[0].children[0].children[this.tableColumns-(1+this.tableColumnsHidden)].textContent;
                            // CREAR TEXTNODE CON LA DATA DE LA COLUMNA A OCULTAR
                            let newBText = document.createTextNode(' : '+tr.children[lastColVisible].textContent);
                            //CREAR '<p>' PARA INCLUIR TODO
                            let newPColName = document.createElement('p');
                                newPColName.setAttribute('style','margin:0;'+this.props.style.p);
                                newPColName.setAttribute('class',this.props.class.p);
                                newPColName.appendChild(newBColName);
                                newPColName.appendChild(newBText);
                            if (i == this.tableRows-2 ) {
                                this.table.children[1].children[i+1].children[0].appendChild(newPColName);
                                return resolve(true);
                            } else {
                                this.table.children[1].children[i+1].children[0].appendChild(newPColName);
                            } 
                        }
                    }
                }
            }, 50)
        }).then( resolve => {
            // HACER RECUENTO DE COLUMNAS OCULTAS                    
            this.tableColumnsHidden = 0;
            Array.from(this.table.children[1].children[0].children).map( td => {
                if (window.getComputedStyle(td).getPropertyValue('display') == 'none') {
                    this.tableColumnsHidden++;
                }
            })       
        }).then( () => {
            // VALIDAR POSIBLE BUCLE
            if ( (this.state != {}) && (this.state.compress == false) && (this.state.descompress == true) && (this.state.date == new Date().toLocaleString()) && (this.state.colHidden == this.tableColumnsHidden-1)) {
                // GUARDAR ESTADO, MOSTRAR ESTADO EN CONSOLA Y VOLVER A EVALUAR
                this.state = {
                    date: new Date().toLocaleString(),
                    compress: this.compressed,
                    descompress: this.descompressed,
                    colVisible: this.tableColumns-this.tableColumnsHidden,
                    colHidden: this.tableColumnsHidden,
                    init: this.firstCompressed,
                    bucle: 'on'
                }
                console.log(this.state);
                // VOLVER A VISUALIZAR LA TABLA
                this.table.style.visibility = 'visible';
                // FINALIZAR
                return;
            } else {
                // GUARDAR ESTADO, MOSTRAR ESTADO EN CONSOLA Y VOLVER A EVALUAR
                this.state = {
                    date: new Date().toLocaleString(),
                    compress: this.compressed,
                    descompress: this.descompressed,
                    colVisible: this.tableColumns-this.tableColumnsHidden,
                    colHidden: this.tableColumnsHidden,
                    init: this.firstCompressed,
                    bucle: 'off'
                }
                console.log(this.state);
                // REALIZAR COMPROBACION
                this.resize();
            }    
        }); 
    }
    // DESCOMPRIMIR TABLA
    async descompressing() {
        return await new Promise( (resolve, reject) => {
            setTimeout( () => {
                for (let i = 0; i <= this.tableRows-2; i++) {                 
                    if (i%2 == 0) {
                        // OBTENER FILA ACTUAL
                        let tr = this.table.children[1].children[i];
                        // OBTENER NUMERO DE ELEMENTOS EN EL DESPLEGABLE OCULTO
                        let elements = this.table.children[1].children[i+1].children[0].children.length;
                        // MOSTRAR COLUMNA HEADER
                        this.table.children[0].children[0].children[this.tableColumnsVisible].style.display = 'table-cell';
                        this.table.children[0].children[0].children[this.tableColumnsVisible].style.width = 'auto';
                        // MOSTRAR COLUMNA
                        tr.children[this.tableColumnsVisible].style.display = 'table-cell';
                        // ELIMINAR ÚLTIMO ELEMENTO EN EL DESPLEGABLE OCULTO
                        this.table.children[1].children[i+1].children[0].removeChild(this.table.children[1].children[i+1].children[0].children[elements-1]);
                        // SI ES LA ÚLTIMA COLUMNA OCULTA, ELIMINAR BOTON FINAL
                        if (this.tableColumnsVisible == this.tableColumns-1) {
                            tr.removeChild(tr.children[tr.children.length-1]);
                        }
                        // SI ES LA ÚLTIMA FILA FINALIZAR BUCLE
                        if (i == this.tableRows-2 ) {        
                            return resolve(true);
                        }
                    }
                }
            }, 50)
        }).then( resolve => {
            this.tableColumnsVisible == this.tableColumns-1 ? this.firstCompressed = true : this.firstCompressed = false;
            // SI SE VUELVE A ESTADO INICIAL, ELIMINAR LAS FILAS AÑADIDAS
            if (this.firstCompressed) {
                let i = this.tableRows;
                do {
                    if (i%2 != 0) this.table.children[1].removeChild(this.table.children[1].children[i]);
                    i--;
                } while (i >= 0)
            }
            // HACER RECUENTO DE COLUMNAS OCULTAS
            this.tableColumnsHidden = 0;
            Array.from(this.table.children[1].children[0].children).map( td => {
                if (window.getComputedStyle(td).getPropertyValue('display') == 'none') {
                    this.tableColumnsHidden++;
                } 
            })
        }).then( () => {
            // GUARDAR ESTADO, MOSTRAR ESTADO EN CONSOLA Y VOLVER A EVALUAR
            this.state = {
                date: new Date().toLocaleString(),
                compress: this.compressed,
                descompress: this.descompressed,
                colVisible: this.tableColumns-this.tableColumnsHidden,
                colHidden: this.tableColumnsHidden,
                init: this.firstCompressed,
                bucle: 'off'
            }
            console.log(this.state);
            // REALIZAR COMPROBACIÓN
            this.resize();
        });  
    }
    // OBTIENE ANCHO DE MARGIN Y PADDING DE ELEMENTOS PADRES A LA TABLA
    obtainWidthParents() {
        // INICIALIZAR VARIABLE ELEMENTO Y TOTAL ANCHO
        let element = this.table;
        let totalWidth = 0;
        // RECORRER LOS ELEMENTOS PADRES PARA OBTENER LOS MARGIN Y PADDINGS
        do {
            let ML = window.getComputedStyle(element.parentNode).getPropertyValue('margin-left').slice(0,-2);
            let MR = window.getComputedStyle(element.parentNode).getPropertyValue('margin-right').slice(0,-2);
            let PL = window.getComputedStyle(element.parentNode).getPropertyValue('padding-left').slice(0,-2);
            let PR = window.getComputedStyle(element.parentNode).getPropertyValue('padding-right').slice(0,-2);
            totalWidth += parseInt(ML)+parseInt(MR)+parseInt(PL)+parseInt(PR);
            element = element.parentNode;
        } while (element.tagName != 'HTML');
        // DEVOLVER ANCHO TOTAL
        return totalWidth;
    }
    // OBTIENE ANCHO DE COLUMNAS DE LA TABLA
    obtainWidthColumns() {
        let array = [];
        Array.from(this.table.children[0].children[0].children).map( th => {
            let totalWidth = 0;
            let ML = window.getComputedStyle(th).getPropertyValue('margin-left').slice(0,-2);
            let MR = window.getComputedStyle(th).getPropertyValue('margin-right').slice(0,-2);
            let PL = window.getComputedStyle(th).getPropertyValue('padding-left').slice(0,-2);
            let PR = window.getComputedStyle(th).getPropertyValue('padding-right').slice(0,-2);
            let width = window.getComputedStyle(th).getPropertyValue('width').slice(0,-2);
            totalWidth = parseInt(ML)+parseInt(MR)+parseInt(PL)+parseInt(PR)+parseInt(width);
            array.push(totalWidth);
        })
        return array;
    }
    // MOSTAR/OCULTAR DESPLEGABLE
    alternarVisibilidad(e = window.event) {
        // SI ESTA COLAPSADO HACERLO VISIBLE Y VICEVERSA
        if (e.path[1].nextElementSibling.style.visibility == 'collapse') {
            e.path[1].nextElementSibling.style.visibility = 'visible';
        } else {
            e.path[1].nextElementSibling.style.visibility = 'collapse';
        }
    }
  }