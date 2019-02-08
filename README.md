# Tienda Front


# ChangeLog

## v3.6 (??/04/18)
* **components/splash-page** - Nuevo componente para la SplashPage
* **services/splashPage** - Servicio para componente StepperSplashComponent
* **app.component** - Agregado Azure Application Insights
* **components/config-store-new** - Agregado el guardado de campo Address
* **components/config-store-edit** - Agregado el guardado de campo Address
* **components/report-visitors** - Agregado filtrado por tienda / región y comportamiento multirol
* **components/report-visitors** - Ajustados los tests para adecuarse el nuevo funcionamiento
* **classes/patterns** - Modificado el regex de e-mails para que acepte mayúsculas
* **classes/store** - Agregado campo Address
* **services/store** - Modificacion de variable idInCustomerDB por idinCustomerDB en los archivos store.service.spec, store.service, idinCustomerDB, config-store-edit.component, config-store-new.component
* **package.json** - Actualizado @angular/cli a 1.7.3, webpack a 4.0.0
* **tests/components/splashPage** - Agregado el test de la splash page.
* **assets/.json** - Modificado la palabra región por red en los archivos .json
## v3.5 (22/03/18)

### **Home**

* Creado el componente home para todos los roles, tests y agregado al side-nav


### **Configuraciones Generales**

* Agregada la opción de ratio de corrección de desvío
* Modificado HTML para contemplar descripciones largas

### **Zona horaria**

* Incorporado en alta/edición de tiendas el seteo automático de zona horaria

### **Reporte de Visitantes**

* Refactorizado para adaptarse al nuevo endpoint de reporte
* Ajustadas las pruebas y mejoras en estilo

### **Pantalla de Status**

* Agregado de componente ConfigStatusComponent (unit test ), agregado servicio ProcessinStatusService (unit test )

### **Otros**

* Puerto de API oculto en environments
* El componente **side-nav** fue optimizado
* Se agrego un errorHandling para capturar los errores que pueden darse.
* Mejorada la directiva **grid-list** para que reciba por parámetro cuántas columnas quiere tener en cada tamaño de pantalla
* Fix menor a **config-stores-new** (generaba la tienda 2 veces)
* Agregado paginación y sorting de **config-store-list**
* Agregado de constantes con errores internos (600-604) para que use el handler.
* Fix menor a **header** (no traía datos onInit si no estabas loggeado)
* Fix menor a edición de usuario, que no cargaba el e-mail y los campos especiales del vendedor


## v3.4 (07/03/18)

### **Unit testing**

* Se agregan unit testing de los **componentes** header, config-floors-edit, store-operations, report-regions, config-usuarios
* Se agrega unit testing del **guard** auth-login
* Se completan los unit testing de los **servicios** regions, stores, auth, maps, user, reportes, cliente 360

### **AuthGuard**

* Ahora si estás loggeado y no tenés permisos para ver una pantalla te redirige al flamante componente 'forbidden'

### **Otros**

* Actualización de @angular/cli a 1.7.1
* Agregamos tipo de dato Accounts, completamos User y eliminamos UserLogged que no se usaba :wink:
* Fix menor: cambio de método updateViews en settingsService (post pasa a ser patch)
* Fix en decimales mostrados en Chain Operations
* Fix Scroll del ranking Chain Operations (chrome).


## v3.3 (26/02/18)

### **Unit testing**

* Se agrega unit testing de los componentes reports, salesforce, settings, config-store-list, store-chain-operations, config-store-new, config-store-edit, side-nav, verificado, app.component, recover-password.
* Se agrega stubs parciales de reportes.service, stores.service, floors.service, maps.service, kpis.service, languages.service, companies.service

### **Cliente 360**

* Se arregla un issue para una sola región en el rol admin
* Se acomoda el estilo en el mensaje de error.
* Se unifican mensajes para cuando no hay región y/o tienda de acuerdo a los mostrados en salesforce
* Se agrega el test del componente.

### **Cockpit Chain Operations**

* Pantalla Chain Operations para Gte Red y Admin.
* Test correspondiente al servicio usado en el componente.

### **Otros**

* Fixes visuales y de textos en ABM de Regiones
* Fix visual en componente Verificado
* Mejoras al tipo de dato Store
* Se elimina la clase errorWrapper en store-operations y se incluye NoDataError en el componente
* Corrección de traducciones en el archivo en.json


## v3.2 (19/02/18)

### **Configuraciones Globales**

* Se pueden guardar configuraciones globales que afectan los stored procedures del backend
* Creado componente config-general, servicio settings, traducciones relevantes

### **Cliente 360**

* Se agrega mensaje de error en caso que la tienda no tenga pisos
* Se agrega mensaje de error en caso que la tienda no tenga pisos con mapas
* Se corrige para muestre los datos correctos para cada rol

### **Login**

* Se corrige para que no explote cuando se loguea un vendedor

### **Unit testing**

* Se agrega unit testing de los componentes login, forgot-password, config-regions, config-apis
* Se agrega stubs incompletos de auth.service, user.service, regions.service, tokens.service, apiTypes.service

### **Otros**

* Se agrega interceptor que agrega token a las llamadas de servicios. Se elimina el token de todos los servicios.
* Se agrega módulo que gestiona los servicios.



## v3.1

### **Recuperar Contraseña**

* Agregado mensaje de éxito al cambiar contraseña



## **v3.0**

### **Multi-cosas**

* Fixes a múltiples pantallas para considerar la posibilidad de que no hayan datos de algún tipo puntual (regiones, tiendas, pisos, mapas, etc)
* Fix a multilanguage para que contemple el idioma de la compañía cuando el usuario no define nada

### **ABM Mapas**

* Funciona!
* Incluye borrado de mapas futuros

### **Cockpit Cliente 360**

* Pantalla de Cliente 360 responsive.

### **Cockpit Fuerza de Ventas**

### **Sales Operations (ex-Home)**

* Ahora contempla multirol
* Cambio de nombre y url
* Ajustes estéticos
* Simplificación de código

### **Recuperar Contraseña**

* Quedó re cheto (fix visual)
* Aislado todos los estilos de login, recuperar contraseña, etc. en **center-column.style** para mejor reutilización
* Refactor de nombres de componentes, archivos y rutas

### **Reportes**

* Analizado y comentado apropiadamente (?) el código

### **ABM Usuarios**

* Eliminada la funcionalidad de reestablecer contraseña

### **Otros**

* Agregados tests unitarios de ApiTypesService, CategoriesService, CompaniesService, LanguagesService, RolesService y TokensService
* Agregadas clases para los tipos de datos particulares ApiType, Category, Company, Language, Role y Token; y modificado Map para que se llame Blueprint (coincidía el nombre con la función Map de Angular y bardeaba)
* Actualizado @angular/cli a 1.6.6
* Actualizado @angular/angular a 5.1.1
* Actualizado @angular/material a 5.1.1
