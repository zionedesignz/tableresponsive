export default class Tableresponsive {
    constructor(props = {}) {
        // PROPIEDADES
        this.props = {
            // ID OBLIGATORIO PARA FORZAR EL RESPONSIVE
            id: props.id ? props.id : console.log(`Para utilizar tableresponsive.js es necesario instanciar un objeto y pasar el id como parametro => new Tableresponsive( {id:'#idtable'} );`),
            // ESTILOS
            style: props.style ? ({  
                button: props.style.button ? props.style.button : '',
                tr: props.style.tr ? props.style.tr : '',
                td: props.style.td ? props.style.td : '',
                p: props.style.p ? props.style.p : '',
                b: props.style.b ? props.style.b : ''
            }) : ({ button:'',tr:'',td:'',p:'',b:''}),
            // CLASES
            class: props.class ? ({   
                button: props.class.button ? props.class.button : '',
                tr: props.class.tr ? props.class.tr : '',
                td: props.class.td ? props.class.td : '',
                p: props.class.p ? props.class.p : '',
                b: props.class.b ? props.class.b : ''
            }) : ({button:'',tr:'',td:'',p:'',b:''}),
        };
        // ATRIBUTOS CLASE (ESTATICOS)
        this.table = document.querySelector(this.props.id);
        this.tableInitStyleWidth = this.table.style.width;
        this.tableColumns = document.querySelector(this.props.id).children[0].children[0].children.length;
        this.tableColumnsArray = this.obtainWidthColumns();
        this.marginHorTotal = this.obtainWidthParents();
        // ESTADO
        this.state = {
            action: '',
            firstCompressed: true,
            tableColumnsHidden: 0,
            tableColumnsVisible: 0,
            tableWidth: '',
            tableRows: '',
            windowWidth: ''
        };
        // DATA
        this.data = {order:{}};
        // EVENTOS WINDOW
        window.addEventListener('resize', this.main.bind(this));
        window.addEventListener('load', this.main.bind(this));
        // EVENTO ORDENAR POR COLUMNA
        this.table.children[0].style.cursor = 'hand';
        this.table.children[0].addEventListener('click', this.filterData.bind(this));
    }
    // PROCESADOR
    async main() {
        await this.actState().then( async() => {
            await this.action().then( action => {
                switch(action) {
                    case 'compressing':
                        // OCULTAR TABLA & RESTABLECER ACTION Y COMPRIMIR
                        this.table.style.visibility = 'hidden';
                        return this.compressing();
                        break;
                    case 'descompressing':
                        // OCULTAR TABLA & RESTABLECER ACTION Y DESCOMPRIMIR
                        this.table.style.visibility = 'hidden';
                        return this.descompressing();
                        break;
                    default:
                        // OCULTAR TABLA & RESTABLECER ACTION Y DESCOMPRIMIR
                        this.table.style.visibility = 'visible';
                        return;   
                };
            }).then( res => {
                if (res != undefined) {
                    console.table(res);
                    this.state.action = '';
                    this.main();
                } 
            }).catch( err => console.log(err) );
        }).catch( err => console.log(err) ); 
    }
    // ESTADO
    async actState() {
        return await new Promise( (resolve, reject) => {
            try {
                //FORZAR ESTILO DE ANCHO DE TABLA PARA REALIZAR LA COMPROBACION
                this.table.style.width = 'auto';
                // ACTUALIZAR DOM DATA
                this.state.tableColumnsHidden > 0 ? this.state.firstCompressed = false : this.state.firstCompressed = true;
                this.state.windowWidth = window.innerWidth-30; // ANCHO BUTTON
                this.state.tableRows = this.table.children[1].children.length; 
                this.state.tableWidth = this.table.scrollWidth;
                this.state.tableColumnsVisible = this.tableColumns-this.state.tableColumnsHidden;
                resolve(true);
            } catch(err) {
                reject(err);
            }
        });
    }
    // COMPROBAR ACCION A REALIZAR
    async action() {
        return await new Promise( (resolve, reject) => {
            try {
                // SI HAY ALGUNA COLUMNA OCULTA & EL NUMERO DE COLUMNAS DE LA TABLA ES DISTINTO AL DE LAS COLUMNAS VISIBLES, COMPROBAR SI SE PUEDE DESCOMPRIMIR
                if (this.state.tableColumnsHidden > 0 && this.tableColumns != this.state.tableColumnsVisible) {
                    // SI EL ANCHO DE LA TABLA + EL ANCHO DE LA ULTIMA COLUMNA OCULTA ES INFERIOR AL ANCHO DE LA PANTALLA - LOS MARGENES/PADDING DE LOS ELEMENTOS PADRE --> DESCOMPRESSED ACTIVO
                    (this.state.tableWidth + this.tableColumnsArray[this.state.tableColumnsVisible]) < (this.state.windowWidth-this.marginHorTotal) ? this.state.action = 'descompressing' : this.state.action = '';
                }
                // SI EL NUMERO DE COLUMNAS VISIBLES ES SUPERIOR O IGUAL A 2 Y NO ESTA DESCOMPRIMIENDO, COMPROBAR SI SE PUEDE COMPRIMIR
                if (this.state.tableColumnsVisible >= 2 && this.state.action != 'descompressing') {
                    // SI EL ANCHO DE LA TABLA ES SUPERIOR AL ANCHO DE LA PANTALLA - LOS MARGENES/PADDING DE LOS ELEMENTOS PADRE --> COMPRESSED ACTIVO
                    this.state.tableWidth >= (this.state.windowWidth-this.marginHorTotal) ? this.state.action = 'compressing' : this.state.action = '';
                }
                // SI LA TABLA ESTA DESPLEGADA AL COMPLETO PONER EL ESTILO DE ANCHO INICIAL
                this.state.firstCompressed && this.state.tableColumnsHidden == 0 ? this.table.style.width = this.tableInitStyleWidth : this.table.style.width = 'auto';
                // DEVOLVER ACCION A REALIZAR
                resolve(this.state.action);
            } catch(err) {
                reject(err);
            }
        });
    }
    // COMPRIMIR TABLA
    async compressing() {
        return await new Promise( (resolve, reject) => {
            try {
                // RECORRER LAS FILAS
                for (let i = 0; i < this.state.tableRows; i++) {
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
                    if (this.state.firstCompressed) {
                        // OBTENER FILA ACTUAL
                        const tr = this.table.children[1].children[positionData];
                        // AÑADIR BOTON
                        const button = document.createElement('button');
                            button.innerHTML = '+';
                            button.setAttribute('style',this.props.style.button);
                            // SI ESTA MARCADA LA FILA AL COMPRIMIR APLICAR OTRO ESTILO
                            if (tr.classList.contains('bg-primary')) {
                                button.setAttribute('class','btn btn-light btn-sm text-primary mt-2');
                            } else {
                                button.setAttribute('class',this.props.class.button);
                            }
                            button.addEventListener('click',this.alternarVisibilidad.bind(this));
                        tr.appendChild(button);
                        // OBTENER POSICION ÚLTIMA COLUMNA VISIBLE
                        const lastColVisible = this.table.children[1].children[positionData].children.length-(2+this.state.tableColumnsHidden);
                        // OCULTAR TITULO HEADER
                        this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].style.display = 'none';
                        this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].style.width = 0;
                        // OCULTAR COLUMNA
                        tr.children[lastColVisible].style.display = 'none';                  
                        // CREAR '<b>' CON EL NOMBRE COLUMNA
                        const newBColName = document.createElement('b');
                            newBColName.setAttribute('style',this.props.style.b);
                            newBColName.setAttribute('class',this.props.class.b);
                            newBColName.textContent = this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].textContent;
                            newBColName.style.cursor = 'hand';
                            newBColName.addEventListener('click', this.filterData.bind(this));
                        // CREAR TEXTNODE CON LA DATA DE LA COLUMNA A OCULTAR
                        const newBText = document.createTextNode(' : '+tr.children[lastColVisible].textContent);
                        // CREAR '<p>' PARA INCLUIR TODO
                        const newPColName = document.createElement('p');
                            newPColName.setAttribute('style','margin:0;'+this.props.style.p);
                            newPColName.setAttribute('class',this.props.class.p);
                            newPColName.appendChild(newBColName);
                            newPColName.appendChild(newBText);
                        // CREAR NUEVA FILA Y NUEVA COLUMNA CON CONTENIDO ÚLTIMA COLUMNA
                        const newTd = document.createElement('td');
                            newTd.setAttribute('style',this.props.style.td);
                            newTd.setAttribute('class',this.props.class.td);
                            newTd.setAttribute('colspan', this.tableColumns);
                            newTd.appendChild(newPColName);
                        const TrContainer = document.createElement('tr');
                            TrContainer.setAttribute('style',this.props.style.tr);
                            TrContainer.setAttribute('class',this.props.class.tr);
                            TrContainer.appendChild(newTd);
                            TrContainer.style.visibility = 'collapse';
                        if ((positionData/2) == this.state.tableRows-1 ) {
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
                            const tr = this.table.children[1].children[i];
                            // OBTENER POSICION ÚLTIMA COLUMNA VISIBLE
                            const lastColVisible = this.table.children[1].children[i].children.length-(2+this.state.tableColumnsHidden); 
                            // OCULTAR TITULO HEADER
                            this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].style.display = 'none';
                            this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].style.width = 0;
                            // OCULTAR COLUMNA
                            tr.children[lastColVisible].style.display = 'none';
                            // CREAR '<b>' CON EL NOMBRE COLUMNA
                            const newBColName = document.createElement('b');
                                newBColName.setAttribute('style',this.props.style.b);
                                newBColName.setAttribute('class',this.props.class.b);
                                newBColName.textContent = this.table.children[0].children[0].children[this.tableColumns-(1+this.state.tableColumnsHidden)].textContent;
                                newBColName.style.cursor = 'hand';
                                newBColName.addEventListener('click', this.filterData.bind(this));
                            // CREAR TEXTNODE CON LA DATA DE LA COLUMNA A OCULTAR
                            const newBText = document.createTextNode(' : '+tr.children[lastColVisible].textContent);
                            // CREAR '<p>' PARA INCLUIR TODO
                            const newPColName = document.createElement('p');
                                newPColName.setAttribute('style','margin:0;'+this.props.style.p);
                                newPColName.setAttribute('class',this.props.class.p);
                                newPColName.appendChild(newBColName);
                                newPColName.appendChild(newBText);
                            if (i == this.state.tableRows-2 ) {
                                this.table.children[1].children[i+1].children[0].appendChild(newPColName);
                                return resolve(true);
                            } else {
                                this.table.children[1].children[i+1].children[0].appendChild(newPColName);
                            }
                        }
                    }
                }
            } catch(err) {
                reject(err);
            }
        }).then( () => {
            // HACER RECUENTO DE COLUMNAS OCULTAS                    
            this.state.tableColumnsHidden = 0;
            Array.from(this.table.children[1].children[0].children).forEach( td => {
                if (window.getComputedStyle(td).getPropertyValue('display') == 'none') {
                    this.state.tableColumnsHidden++;
                }
            })       
        }).then( () => {
            // DEVOLVER ESTADO
            return this.state;
        }); 
    }
    // DESCOMPRIMIR TABLA
    async descompressing() {
        return await new Promise( (resolve, reject) => {
            try {
                for (let i = 0; i <= this.state.tableRows-2; i++) {                 
                    if (i%2 == 0) {
                        // OBTENER FILA ACTUAL
                        const tr = this.table.children[1].children[i];
                        // OBTENER NUMERO DE ELEMENTOS EN EL DESPLEGABLE OCULTO
                        const elements = this.table.children[1].children[i+1].children[0].children.length;
                        // MOSTRAR COLUMNA HEADER
                        this.table.children[0].children[0].children[this.state.tableColumnsVisible].style.display = 'table-cell';
                        this.table.children[0].children[0].children[this.state.tableColumnsVisible].style.width = 'auto';
                        // MOSTRAR COLUMNA
                        tr.children[this.state.tableColumnsVisible].style.display = 'table-cell';
                        // ELIMINAR ÚLTIMO ELEMENTO EN EL DESPLEGABLE OCULTO
                        this.table.children[1].children[i+1].children[0].removeChild(this.table.children[1].children[i+1].children[0].children[elements-1]);
                        // SI ES LA ÚLTIMA COLUMNA OCULTA, ELIMINAR BOTON FINAL
                        if (this.state.tableColumnsVisible == this.tableColumns-1) {
                            tr.removeChild(tr.children[tr.children.length-1]);
                        }
                        // SI ES LA ÚLTIMA FILA FINALIZAR BUCLE
                        if (i == this.state.tableRows-2 ) {        
                            return resolve(true);
                        }
                    }
                }
            } catch(err) {
                reject(err);
            }
        }).then( () => {
            this.state.tableColumnsVisible == this.tableColumns-1 ? this.state.firstCompressed = true : this.state.firstCompressed = false;
            // SI SE VUELVE A ESTADO INICIAL, ELIMINAR LAS FILAS AÑADIDAS
            if (this.state.firstCompressed) {
                let i = this.state.tableRows;
                do {
                    if (i%2 != 0) this.table.children[1].removeChild(this.table.children[1].children[i]);
                    i--;
                } while (i >= 0)
            }
            // HACER RECUENTO DE COLUMNAS OCULTAS
            this.state.tableColumnsHidden = 0;
            Array.from(this.table.children[1].children[0].children).forEach( td => {
                if (window.getComputedStyle(td).getPropertyValue('display') == 'none') {
                    this.state.tableColumnsHidden++;
                } 
            })
        }).then( () => {
            // DEVOLVER ESTADO
            return this.state;
        });  
    }
    // OBTIENE ANCHO DE MARGIN Y PADDING DE ELEMENTOS PADRES A LA TABLA
    obtainWidthParents() {
        // INICIALIZAR VARIABLE ELEMENTO Y TOTAL ANCHO
        let element = this.table;
        let totalWidth = 0;
        // RECORRER LOS ELEMENTOS PADRES PARA OBTENER LOS MARGIN Y PADDINGS
        do {
            const ML = window.getComputedStyle(element.parentNode).getPropertyValue('margin-left').slice(0,-2);
            const MR = window.getComputedStyle(element.parentNode).getPropertyValue('margin-right').slice(0,-2);
            const PL = window.getComputedStyle(element.parentNode).getPropertyValue('padding-left').slice(0,-2);
            const PR = window.getComputedStyle(element.parentNode).getPropertyValue('padding-right').slice(0,-2);
            totalWidth += parseInt(ML)+parseInt(MR)+parseInt(PL)+parseInt(PR);
            element = element.parentNode;
        } while (element.tagName != 'HTML');
        // DEVOLVER ANCHO TOTAL
        return totalWidth;
    }
    // OBTIENE ANCHO DE COLUMNAS DE LA TABLA
    obtainWidthColumns() {
        const array = [];
        Array.from(this.table.children[0].children[0].children).forEach( th => {
            const ML = window.getComputedStyle(th).getPropertyValue('margin-left').slice(0,-2);
            const MR = window.getComputedStyle(th).getPropertyValue('margin-right').slice(0,-2);
            const PL = window.getComputedStyle(th).getPropertyValue('padding-left').slice(0,-2);
            const PR = window.getComputedStyle(th).getPropertyValue('padding-right').slice(0,-2);
            const width = window.getComputedStyle(th).getPropertyValue('width').slice(0,-2);
            array.push( parseInt(ML)+parseInt(MR)+parseInt(PL)+parseInt(PR)+parseInt(width) );
        })
        return array;
    }
    // MOSTAR/OCULTAR DESPLEGABLE
    alternarVisibilidad(e) {
        // SI ESTA COLAPSADO HACERLO VISIBLE Y VICEVERSA
        if (e.path[1].nextElementSibling.style.visibility == 'collapse') {
            e.path[1].nextElementSibling.style.visibility = 'visible';
        } else {
            e.path[1].nextElementSibling.style.visibility = 'collapse';
        }
    }
    // CREAR DATA
    async objectDataBuilder() {
        return await new Promise( (resolve, reject) => {
            try {
                // DEFINIR PROPIEDAD INIT & TEMP EN THIS.DATA
                if (!this.data.hasOwnProperty('init')) Object.defineProperty(this.data, 'init', {value:[]});
                Object.defineProperty(this.data, 'temp', {value:[], writable:true});
                const initData = this.data.init.length == 0 ? true : false;
                // RECORRER TABLA E INSERTAR OBJETO FILA
                resolve( Array.from(this.table.children).map( tPart => {
                    Array.from(tPart.children).map( (row, rowKey) => {
                        const fila = {};
                        // SI ES EL TBODY GUARDAR DATA
                        if (row.parentNode.nodeName == 'TBODY') {
                            // SI ESTA DESPLEGADA LA TABLA GUARDAR DATA CADA FILA
                            // SINO GUARDAR DATA FILAS PARES(INDICE/2) EXCEPTO POS. BOTON
                            if (this.state.firstCompressed == true) {
                                Array.from(row.children).map( (col, colKey) => {
                                    Object.defineProperty(fila, 'val'+colKey, {value:col.textContent, enumerable:true});
                                });
                                if (initData) Object.defineProperty(this.data.init, rowKey, {value:fila});
                                Object.defineProperty(this.data.temp, rowKey, {value:fila});
                            } else if (rowKey%2==0) {
                                Array.from(row.children).map( (col, colKey) => {
                                    if ((row.children.length-1) != colKey) Object.defineProperty(fila, 'val'+colKey, {value:col.textContent, enumerable:true});
                                });
                                if (initData) Object.defineProperty(this.data.init, rowKey/2, {value:fila});
                                Object.defineProperty(this.data.temp, rowKey/2, {value:fila});
                            }
                        }
                    });
                }));
            } catch(err) {
                reject(err);
            }
        });
    }
    // ORDENAR DATA
    async sortData() {
        return await new Promise( (resolve, reject) => {
            try {    
                const arr = Object.values(this.data.temp[0]);
                const prop = Object.keys(this.data.order);
                const order = Object.values(this.data.order);
                if (prop.length == 0) arr.map( el => prop.push(el.toString()) );
                if (order.length == 0) arr.map( () => order.push('ASC')  );
                const newData = this.data.temp.slice().sort( (a, b) => this.mRepeat(a, b, prop, order, 0));
                resolve( Object.defineProperty(this.data, 'temp', {value:newData}) );
            } catch(err) {
                reject(err);
            }
        });
    }
    // ORDENAR MULTIPLE
    mRepeat(a, b, prop, order, index) {  
        const direction = order[index] == 'ASC' ? 0 : 1;
        const A = a[prop[index]];
        const B = b[prop[index]];
        if(A < B) return direction == 0 ? -1 : 1;
        if(A == B) return prop.length-1 > index ? this.mRepeat(a,b,prop,order,index+1) : 0;
        return direction == 0 ? 1 : -1;
    }
    // INSERTAR DATA
    async insertData() {
        return await new Promise( (resolve, reject) => {
            try {
                resolve( Array.from(this.table.children).map( tPart => {
                    if (tPart.nodeName == 'TBODY') {
                        Array.from(tPart.children).map( (row, rowKey) => {
                            // SI ESTA DESPLEGADA LA TABLA INSERTAR DATA EN CADA FILA
                            // SINO GUARDAR INSERTAR DATA(INDICE/2) EN FILAS PARES Y EN FILAS IMPARES REEMPLAZAR LOS DATOS OCULTOS
                            if (this.state.firstCompressed == true) {
                                Array.from(row.children).map( (col, colKey) => {
                                    // REMPLAZAR DATOS EN LA COLUMNA
                                    col.textContent = this.data.temp[rowKey]['val'+colKey];
                                });
                            } else {
                                if (rowKey%2==0) {
                                    Array.from(row.children).map( (col, colKey) => {
                                        // REMPLAZAR DATOS EN LA COLUMNA, EXCEPTO POS. BOTON
                                        if ((row.children.length-1) != colKey) col.textContent = this.data.temp[rowKey/2]['val'+colKey];
                                    });
                                } else {
                                    // REMPLAZAR DATOS EN LA COLUMNA OCULTA CON LOS DATOS DE LA NO VISIBLES DE LA FILA ANTERIOR
                                    Array.from(row.children[0].children).map( (p, pKey) => {
                                        const colData = p.parentNode.parentNode.parentNode.children[rowKey-1].children.length-(pKey+2);
                                        p.lastChild.textContent = ' : '+p.parentNode.parentNode.parentNode.children[rowKey-1].children[colData].textContent;
                                    });
                                }
                            }
                        });
                    }
                }));
            } catch(err) {
                reject(err);
            }
        });
    }
    // FILTRAR DATA
    filterData(e) {
        // OBTENER INDEX
        const index = e.target.nodeName == 'B' ? (
            (this.tableColumns-1)-Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode)
        ) : e.target.cellIndex;
        // SI '' --> ↑, SI EXISTE ↑ --> ↓, SI EXISTE ↓ --> ''
        if (!e.target.textContent.includes('↑') && !e.target.textContent.includes('↓')) {
            e.target.textContent = e.target.textContent+' ↑';
            Object.defineProperty(this.data.order, `val${index}`, {value:'ASC', writable:true, enumerable: true, configurable: true});
        } else if (e.target.textContent.includes('↑')) {
            e.target.textContent = e.target.textContent.slice(0,-2)+' ↓';
            Object.defineProperty(this.data.order, `val${index}`, {value:'DESC'});
        } else if (e.target.textContent.includes('↓')) {
            e.target.textContent = e.target.textContent.slice(0,-2);
            // ELIMINAR FILTRO EN THIS.DATA.ORDER
            delete this.data.order[`val${index}`];
            // ASIGNAR DATA INICIAL A DATA TEMPORAL
            Object.defineProperty(this.data, 'temp', {value:this.data.init});
            // INSERTAR DATA SI NO EXISTE NINGUN VALOR EN THIS.DATA.ORDER
            if (Object.keys(this.data.order).length == 0) this.insertData();
        }
        // SI EL ELEMENTO ES DE LA FILA OCULTA, APLICAR ESTILO A CABECERA TABLA Y A DEMAS ELEMENTOS OCULTOS
        if (e.target.nodeName == 'B') {
            this.table.children[0].children[0].children[index].textContent = e.target.textContent;
            Array.from(this.table.children[1].children).map( (tr, trKey) => {
                if (trKey%2!=0) {
                    tr.children[0].children[(this.tableColumns-1)-index].children[0].textContent = e.target.textContent;
                }
            });
        }
        // SI EXISTE ALGUN VALOR EN THIS.DATA.ORDER APLICAR FILTRO
        if (Object.keys(this.data.order).length != 0) {
            this.objectDataBuilder()
            .then( data => this.sortData() )
            .then( () => this.insertData() );
        }
    }
  }