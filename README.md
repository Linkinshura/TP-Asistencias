# TP-Octubre
Repo del TP de Proyecto Informatico/Base de Datos de 4to 3ra

## Consigna:
Se pide realizar una app que sirva a un profesor para tomar lista por materia. Necesitamos que la interfaz de la aplicacion me de unos controles bien comodos para tomar lista con el celular, fail y rapido. Y que tambien me sirva para anotar las llegadas tardes y los retiros anticipados con la hora correspondiente(cuando se toca el boton)

Obviamente que se va a guardar toda esa info en una BD

## Decisiones de ingnieria de software:
La aplicacion va a funcionar con arquitectura tipo cliente/servidor asi que vamos a poner una base de datos en MaraDB y una API tipo REST usando NodeJS.
Todo esto es solicitado por el profesor por lo que nosotros simplemente tenemos que seguir la consigna, obviamente que del lado usuario hacemos algo en HTML, CSS y JS y vamos a usar todo lo visto durante el ciclo lectivo 2025.

Sobre los alumnos a los que estamos tomando asistencia por el momento solo necesitamos guardar DNI, nombre y apellido. Alguna PK tipo ID generada automaticamente estaria bien

No hace falta datos de contacto ni nada mas.


