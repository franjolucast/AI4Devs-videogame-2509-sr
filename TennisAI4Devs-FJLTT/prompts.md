# Prompt 1 (Prompt inicial a ser pasado por el metaprompter)

## Rol inicial

Actua como metaprompter.

## Contexto para el metaprompter

Estamos en una práctica del máster AI4Devs de LIDR. El contexto de esta práctica es la creación de un videojuego en una aplicación Web. Quiero que el videojuego sea un juego de tennis, donde se pueda elegir el tipo de rival en función de varios parámetros.

## Tarea del metaprompter

Tu tarea es tomar el siguiente prompt y transformarlo en una versión:

- más clara
- más completa
- más específica
- más accionable
- más eficaz para obtener respuestas de alta calidad
- manteniendo intacta mi intención original

Debes:

1. Reescribir el prompt optimizado.
2. Explicar brevemente qué mejoras aplicaste.
3. No inventar información que yo no haya pedido.
4. Mantener el mismo idioma del prompt original.
5. Entregar la respuesta en un bloque:
   A) PROMPT OPTIMIZADO  

El prompt inicial a adaptar por el metaprompter es el siguiente:

<<<

### Rol

Actua como Desarrollador Senior experto de Videojuegos para Web y Móvil.

### Contexto

Para la práctica del Máster AI4Devs necesito crear un videojuego que pueda ejecutarse en navegadores Web. Mi idea es hacer un videojuego de Tenis, el que que se pueda hacer un pequeño torneo con tres rondas eliminatorias.

### Tarea

Genera la aplicación Web donde se lance la aplicación de tenis.

No tiene que registrar resultados en ningún Backend, por lo que no tendrá Backend.

Los resultados de la sesión se guardarán en local, mientras se esté ejecutando la aplicación en el navegador.

El desarrollo de la aplicación vamos a dirigirlo paso a paso para desarrollar los siguientes requisitos:

1. Inicialemente se diseñará una pantalla home, donde se lanzará el juego, eligiendo en primer lugar el nivel de dificultad.
2. Habrá tres niveles de dificultad:
    - Junior (el más básico)
    - Challenger (el intermedio)
    - ATP (el más difícil)
3. La siguiente opción será definir el partido:

    - Se introducirá el nombre del jugador, para visualizarlo posteriormente en un marcador.
    - Se elegirá una superficie de entre las siguientes:
        - Tierra batida (Color naranja)
        - Hierba (Color verde)
        - Sintética (Color Azul)
    - En la superficie tiene que salir la red.
    - Fijarse en la imagen adjunta, del juego Tennis de Activisión de 1981, donde los jugadores tienen forma humana.
4. La puntuación será la de un partido de tenis, con puntos, juegos y sets. Se elegirá eso sí si el partido se juega a :
    - 1 set
    - 3 set
    - 5 set
5. Las características de los rivales dependerán del nivel de dificultad elegido, pero cada rival se caracterizará por las siguientes características:
    - Velocidad.
    - Drive
    - Revés
    - Potencia
6. Los rivales en función de en qué característica destaquen tendrán un alias generado automáticamente. Por ejemplo, si es muy veloz se llamará "La bala". No puede haber en el torneo jugadores con el mismo alias.

#### Detalles

Vamos a ir paso a paso construyendo cada una de las partes anteriores en la que me preguntarás por detalles más concretos.

Pero aunque vayamos paso a paso no quiero que se nos eternice la conversación, ve claro y al grano, y no dejes funcionalidad sin terminar.

### Resultado esperado

- Tendremos un fichero index.html para lanzar la aplicación.
- Genera tantos ficheros html para separar de una manera escalable las diferentes pantallas.
- El estilo añadelo en ficheros css
- Toda la lógica de ejecución métela en ficheros javascript.
- Genera aquellas imágenes que consideres oportunas y las pones en las carpetas correspondientes.
- Sigue buenos principios básicos de programación Web, sobre todo Frontend, por las características de esta aplicación.
- La jugabilidad tiene que ser parecida al juego de Tennis Activision de 1981 de la Atari (ver imagen adjunta), donde la jugabilidad se aproximaba al tenis real. Nunca tiene que ser igual que el Pong, el clásico juego de Atari.
- Tiene que funcionar en todos los navegadores Web, por lo que ten muy en cuenta esta condición a la hora de utilizar diferentes librerías.
- En el juego se tiene que visualizar el marcador de igual manera que se visualizan en los partidos de tenis.
- No quiero que la aplicación organice ningún torneo, solo partidos individuales y vuelta a la pantalla inicial al acabar el partido.

>>>

# Prompt 2 (El optimizado por el metaprompter)

Aquí tienes el **PROMPT OPTIMIZADO** siguiendo exactamente tus instrucciones.
No añado nada que no esté en tu intención original, solo lo hago **más claro, más completo, más estructurado y más accionable**.

---

# A) **PROMPT OPTIMIZADO**

### **Rol**

Actúa como **Desarrollador Senior experto en Videojuegos Web y Móvil**, con experiencia en creación de juegos deportivos 2D que funcionen en navegadores y prioricen jugabilidad fluida, compatibilidad y arquitectura Frontend modular.

---

### **Contexto**

Para la práctica del Máster AI4Devs necesito crear un **videojuego de tenis ejecutable en navegadores Web**, inspirado en el estilo del clásico *Tennis* de Activision (1981, Atari).
El objetivo es desarrollar una aplicación Web que permita:

* Jugar **partidos individuales de tenis**.
* Seleccionar **dificultad**, **superficie**, **oponente** y **formato de sets**.
* Al finalizar un partido, **volver a la pantalla inicial** (no hay torneos ni progresión entre partidos).
* Guardar resultados solamente en **almacenamiento local temporal** (sin backend).

El desarrollo debe organizarse paso a paso, solicitándome información adicional cuando sea necesario, pero sin eternizar la conversación y manteniendo siempre foco, claridad y completitud en cada fase.

---

### **Tarea**

Tu misión es **generar la aplicación Web completa**, siguiendo estos requisitos:

#### **1. Pantalla Home**

Debe contener:

* Botón para iniciar el juego.
* Selección del **nivel de dificultad**:

  * Junior (básico)
  * Challenger (intermedio)
  * ATP (difícil)

#### **2. Configuración del Partido**

Tras elegir dificultad, la siguiente pantalla permitirá:

* Introducir el **nombre del jugador** (se mostrará en el marcador).
* Elegir una **superficie**:

  * Tierra batida (naranja)
  * Hierba (verde)
  * Sintética (azul)
* Cada superficie debe mostrar **la red en el centro**.
* Estética y jugabilidad inspiradas en *Tennis* de Activision (1981):
  jugadores representados con forma humana, movimientos de tenis real (no tipo Pong).

#### **3. Formato de Sets**

El usuario podrá elegir si el partido se juega a:

* 1 set
* 3 sets
* 5 sets

#### **4. Sistema de Puntuación**

Debe implementarse la puntuación real del tenis:

* Puntos: 0 – 15 – 30 – 40 – Ventaja
* Juegos
* Sets

#### **5. Rival y Dificultad**

El nivel de dificultad determina los atributos del rival.

Cada rival tendrá cuatro características:

* Velocidad
* Drive
* Revés
* Potencia

En función de su atributo dominante se generará un **alias único**, por ejemplo:

* Muy veloz → “La bala”
* Muy potente → “El martillo”
  No puede haber dos rivales con el mismo alias durante una sesión.

#### **6. Flujo del Juego**

* Mostrar ambos jugadores (forma humana).
* Renderizar la pista con el color según superficie.
* Visualizar un **marcador de tenis completo**.
* Terminado el partido → volver a Home.

---

### **Requisitos Técnicos**

#### **Arquitectura Web**

* Un `index.html` como punto de entrada.
* Tantas pantallas HTML como sean necesarias para mantener la escalabilidad.
* Estilos en **CSS**.
* Lógica y jugabilidad en **JavaScript** modular.
* Carpetas separadas para:

  * `/css`
  * `/js`
  * `/img`

#### **Compatibilidad**

* El juego debe funcionar en **todos los navegadores Web modernos**.
* Evitar uso de librerías que puedan limitar compatibilidad.

#### **Gráficos**

* Genera las imágenes necesarias y colócalas en las carpetas correspondientes.
* Respeta el estilo visual retro inspirado en *Tennis* (Activision 1981).

#### **Forma de trabajo**

* Guíame paso a paso.
* Pídeme detalles solo cuando lo necesites para avanzar.
* Cada paso debe quedar **completo y funcional**, sin dejar flecos.

---

### **Resultado Esperado**

Al final debemos obtener:

* Una **aplicación Web funcional** del videojuego de tenis.
* Todos los archivos HTML, CSS y JS necesarios.
* Recursos gráficos generados.
* Jugabilidad fluida y parecida a *Tennis* (Activision 1981), pero nunca como Pong.
* Marcadores correctos, superficies con red, jugadores humanos, rivales con alias únicos.
* Al terminar un partido → volver a Home.

---

# Prompt 3 (primeros fallos con el index.html)

antes de seguir, en la pantalla index no se me queda seleccionado ninguna dificultad y por tanto no se me habilita el botón de continuar

# Prompt 4 (Le pido que continúe con la pantalla de configuración)

sí, continúa con la pantalla de configuración, pero el botón "Continuar" todavía no hace nada

# Prompt 5 (Le digo que los botones de elección de superficie no funcionan)

Los botones de elección de superficie no funcionan

# Prompt 6 (solucionada la configuración le digo de seguir con el game.html)

sí, continuemos con el guardado y game.html

# Prompt 7 (Solucionada la parte de la configuración pasamos el Canvas y el motor del juego)

sí, continuemos con el motor del juego (canvas)

# Prompt 8 (la jugabilidad para empezar a funcionar, pero hay un error con  las dimensiones de la pista)

solo veo un defecto, la pista está en horizontal y debería estar en vertical

# Prompt 9 ( le digo que quiero la pista retro original y que la bola no rebote en los laterales)

sí, y además quiero que la bola pueda salir por los laterales, que el oponente, se mueva por toda su pista también

# Prompt 10 (El rival solo se mueve lateralemente sobre la línea de fondo)

antes de seguir, el rival sigue sin poder moverse por su area, y la red ha desaparecido

# Prompt 11 (Corregido lo del rival le pido a desarrollar el sistema de puntuación real)

sí continuemos con el sistema de puntuación real

# Prompt 12 (Le pido que cada juego saque alternativamente cada jugador)

antes de seguir con esto, quiero que cada juego lo saque uno de los jugadores, es decir, si empieza sacando el jugador en el primer juego, el oponente saca en el siguiente y así sucesivamente

# Prompt 13 (Intentamos mejorar las estadísticas...)

sigamos con 1. Mejorar la IA según estadísticas (velocidad, potencia, revés, drive, errores forzados)

# Prompt 14 (Desacartamos la última iteración por empieza algo a fallar...)

descarta la última iteración y en cuanto a funcionalidad vamos a dejar así la práctica

# Prompt 15 ( Le pido que funcione la aplicación en cualquier navegador sin usar "Open with Live Server" )

ahora solo necesito que se pueda ejecutar en cualquier navegador web sin necesidad de lanzarlo desde el VS Code con "Open with Live Server", solamente ejecutando el index.html

# Prompt 16 (No funciona "Comenzar Partido" y parece ser que es de la exportación e importación)

no me está funcionando al darle al botón "Comenzar partido"

# Prompt 17 ( le damos el error de consola )

me da este error en la consola al "Comenzar partido"

gameConfig.js:5 Uncaught SyntaxError: Unexpected token 'export'
mainMenu.js:82 Uncaught (in promise) TypeError: Failed to resolve module specifier './gameConfig.js'. The base URL is about:blank because import() is called from a CORS-cross-origin script.
mainMenu.js:82 Uncaught (in promise) TypeError: Failed to resolve module specifier './gameConfig.js'. The base URL is about:blank because import() is called from a CORS-cross-origin script.
(anonymous) @ mainMenu.js:82


# Prompt 18 (Al final me ofrece meter todo el javascript en en game.html e index.html y tengo la aplicación funcional para subir)

sí A)